import { useState, useEffect } from "react"
import axios from "axios"
import Modal from "./Modal"

type SeedModalProps = {
  isOpen: boolean
  onClose: () => void
  encryptedSeed: string
  iv: string
  authTag: string
  salt: string
}

type Step = "password" | "view" | "confirm" | "done"

// ── crypto helpers (same logic as seedEncryption.ts) ──────────────────────────

async function deriveKey(password: string, salt: Uint8Array): Promise<Uint8Array> {
  const passwordWordArray = new TextEncoder().encode(password)
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    passwordWordArray,
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  )
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt:salt.buffer as ArrayBuffer, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    256
  )
  return new Uint8Array(bits)
}

async function decryptAES256GCM(
  cipherText: Uint8Array,
  iv: Uint8Array,
  authTag: Uint8Array,
  key: Uint8Array
): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key.buffer as ArrayBuffer,
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  )
  // Web Crypto expects ciphertext + authTag concatenated
  const combined = new Uint8Array(cipherText.length + authTag.length)
  combined.set(cipherText)
  combined.set(authTag, cipherText.length)

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv.buffer as ArrayBuffer, tagLength: 128 },
    cryptoKey,
    combined
  )
  return new TextDecoder().decode(decrypted)
}

function base64ToUint8Array(b64: string): Uint8Array {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
}

// ── pick 3 random word indices for confirmation ───────────────────────────────

function pickThreeIndices(total: number): number[] {
  const indices = new Set<number>()
  while (indices.size < 3) {
    indices.add(Math.floor(Math.random() * total))
  }
  return Array.from(indices).sort((a, b) => a - b)
}

// ── component ─────────────────────────────────────────────────────────────────

export default function SeedModal({
  isOpen,
  onClose,
  encryptedSeed,
  iv,
  authTag,
  salt,
}: SeedModalProps) {
  const [step, setStep] = useState<Step>("password")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [words, setWords] = useState<string[]>([])
  const [confirmIndices, setConfirmIndices] = useState<number[]>([])
  const [confirmInputs, setConfirmInputs] = useState<Record<number, string>>({})
  const [copied, setCopied] = useState(false)

  // reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep("password")
      setPassword("")
      setError("")
      setWords([])
      setConfirmInputs({})
      setCopied(false)
    }
  }, [isOpen])

  // ── step 1: decrypt seed with password ──────────────────────────────────────

  async function handleDecrypt() {
    if (!password) return setError("Enter your seed password")
    setLoading(true)
    setError("")
    try {
      const saltBytes = base64ToUint8Array(salt)
      const ivBytes = base64ToUint8Array(iv)
      const authTagBytes = base64ToUint8Array(authTag)
      const cipherBytes = base64ToUint8Array(encryptedSeed)

      const key = await deriveKey(password, saltBytes)
      const mnemonic = await decryptAES256GCM(cipherBytes, ivBytes, authTagBytes, key)

      const wordList = mnemonic.trim().split(" ")
      if (wordList.length < 12) throw new Error("Invalid seed phrase")

      setWords(wordList)
      setConfirmIndices(pickThreeIndices(wordList.length))
      setStep("view")
    } catch {
      setError("Wrong password or corrupted seed")
    } finally {
      setLoading(false)
    }
  }

  // ── step 2 → 3: move to confirm after user reads seed ───────────────────────

  function handleProceedToConfirm() {
    setStep("confirm")
  }

  // ── step 3: verify the 3 words ───────────────────────────────────────────────

  async function handleConfirm() {
    const allCorrect = confirmIndices.every(
      (idx) =>
        (confirmInputs[idx] ?? "").trim().toLowerCase() === words[idx].toLowerCase()
    )
    if (!allCorrect) {
      setError("One or more words are incorrect. Check your backup and try again.")
      return
    }
    setError("")
    setLoading(true)
    try {
      const token = sessionStorage.getItem("accessTokken")
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/seed/view`,
        {},
        { headers: { Authorization: token } }
      )
      setStep("done")
    } catch {
      setError("Failed to confirm with server. Try again.")
    } finally {
      setLoading(false)
    }
  }

  // ── copy to clipboard ────────────────────────────────────────────────────────

  function handleCopy() {
    navigator.clipboard.writeText(words.join(" "))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ── close and wipe state ─────────────────────────────────────────────────────

  function handleClose() {
    setWords([])
    setPassword("")
    setConfirmInputs({})
    onClose()
  }

  // ── render content per step ──────────────────────────────────────────────────

  function renderContent() {
    if (step === "password") {
      return (
        <div className="text-left">
          <p className="text-white/60 text-sm mb-6 text-center">
            Enter the password you used when setting up your seed backup.
            This decrypts your phrase locally — it never leaves your device.
          </p>
          <input
            type="password"
            placeholder="Seed backup password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError("")
            }}
            onKeyDown={(e) => e.key === "Enter" && handleDecrypt()}
            className="w-full px-4 py-2.5 rounded-lg bg-[#1e2040] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-purple-500 mb-4"
          />
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <button
            onClick={handleDecrypt}
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition disabled:opacity-50"
          >
            {loading ? "Decrypting..." : "Reveal seed phrase"}
          </button>
        </div>
      )
    }

    if (step === "view") {
      return (
        <div>
          <p className="text-yellow-400 text-sm mb-4 text-center">
            Write these words down in order. Do not screenshot or paste into any app.
          </p>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {words.map((word, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-[#1e2040] rounded-lg px-3 py-2"
              >
                <span className="text-white/30 text-xs w-5 shrink-0">{i + 1}.</span>
                <span className="text-white text-sm font-mono">{word}</span>
              </div>
            ))}
          </div>
          <button
            onClick={handleCopy}
            className="w-full py-2 mb-3 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30 text-sm transition"
          >
            {copied ? "Copied!" : "Copy to clipboard"}
          </button>
          <button
            onClick={handleProceedToConfirm}
            className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition"
          >
            I've written it down →
          </button>
        </div>
      )
    }

    if (step === "confirm") {
      return (
        <div className="text-left">
          <p className="text-white/60 text-sm mb-6 text-center">
            Confirm your backup by entering the words at the positions below.
          </p>
          <div className="flex flex-col gap-4 mb-6">
            {confirmIndices.map((idx) => (
              <div key={idx}>
                <label className="text-white/50 text-xs mb-1 block">
                  Word #{idx + 1}
                </label>
                <input
                  type="text"
                  placeholder={`Word ${idx + 1}`}
                  value={confirmInputs[idx] ?? ""}
                  onChange={(e) => {
                    setConfirmInputs((prev) => ({ ...prev, [idx]: e.target.value }))
                    setError("")
                  }}
                  className="w-full px-4 py-2 rounded-lg bg-[#1e2040] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>
            ))}
          </div>
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Confirm backup"}
          </button>
        </div>
      )
    }

    if (step === "done") {
      return (
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-white font-semibold text-lg mb-2">Backup confirmed</p>
          <p className="text-white/50 text-sm">
            Your seed phrase has been recorded. Store your written backup somewhere safe.
            This modal will not appear again.
          </p>
        </div>
      )
    }
  }

  const titles: Record<Step, string> = {
    password: "Back up your seed phrase",
    view: "Your seed phrase",
    confirm: "Confirm your backup",
    done: "You're all set",
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={titles[step]}>
      {renderContent()}
    </Modal>
  )
}
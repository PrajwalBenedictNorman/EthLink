type ModalProps={
   isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}


export default function Modal({ isOpen, onClose, title, children }:ModalProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        ></div>
      )}

      {/* Modal Content */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
          isOpen ? "scale-100 opacity-100" : "scale-90 opacity-0 pointer-events-none"
        }`}
      >
        <div className="w-full max-w-md rounded-2xl bg-blue-900 p-6 text-white shadow-2xl">
          {title && <h2 className="mb-4 text-2xl font-semibold">{title}</h2>}
          <div className="mb-6 text-gray-300">{children}</div>
          <button
            onClick={onClose}
            className="rounded-lg bg-white px-4 py-2 text-blue-900 hover:bg-gray-200 transition"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}

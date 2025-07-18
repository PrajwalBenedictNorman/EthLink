import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { useRef } from "react";

export default function TiltCard() {
  const cardRef = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 100, damping: 10 });
  const ySpring = useSpring(y, { stiffness: 100, damping: 10 });
  const transform = useMotionTemplate`rotateX(${ySpring}deg) rotateY(${xSpring}deg)`;

  const ROTATION_RANGE = 30;
  const HALF = ROTATION_RANGE / 2;

//@ts-ignore
  const handleMouseMove = (e) => {
    //@ts-ignore
    const rect = cardRef.current.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    const xVal = (relX / rect.width) * ROTATION_RANGE - HALF;
    const yVal = (relY / rect.height) * ROTATION_RANGE - HALF;

    x.set(xVal);
    y.set(-yVal);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 1000 }} className="flex justify-center items-center h-screen">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform,
          transformStyle: "preserve-3d",
        }}
        className="w-80 h-60 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-3xl p-6 shadow-2xl transition-transform cursor-pointer will-change-transform"
      >
        <h1 className="text-2xl font-bold">Ethereum Wallet</h1>
        <p className="mt-4 text-sm">Hover me to tilt 🔮</p>
      </motion.div>
    </div>
  );
}

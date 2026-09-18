import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useBootStore from "#store/boot";
import { preloadApp } from "#lib/preload";
import { bootCopy } from "#constants/ui";

const BootScreen = () => {
  const finishBoot = useBootStore((s) => s.finishBoot);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Warm window chunks, the 3D scene deps, and stats while booting.
    preloadApp();

    let value = 0;
    let timer;
    const tick = () => {
      value = Math.min(value + Math.random() * 22 + 8, 100);
      setProgress(value);
      if (value < 100) timer = setTimeout(tick, 60 + Math.random() * 110);
      else timer = setTimeout(finishBoot, 250);
    };
    tick();
    // Clean up the pending timer so StrictMode's double-effect doesn't
    // leave orphan timers (and double-finishBoot).
    return () => clearTimeout(timer);
  }, [finishBoot]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
      exit={{ opacity: 0, scale: 1.06 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.svg
        viewBox="0 0 24 24"
        className="h-20 w-20 text-white"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        fill="currentColor"
      >
        <path d="M17.05 12.54c-.03-2.02 1.65-2.99 1.72-3.04-.94-1.37-2.4-1.56-2.92-1.58-1.24-.13-2.42.73-3.05.73-.63 0-1.6-.71-2.63-.69-1.35.02-2.6.78-3.29 1.99-1.4 2.43-.36 6.03 1 8 .67.97 1.46 2.05 2.5 2.01 1-.04 1.38-.65 2.59-.65 1.21 0 1.55.65 2.6.63 1.08-.02 1.76-.98 2.42-1.96.76-1.12 1.07-2.2 1.09-2.25-.02-.01-2.09-.8-2.03-3.19zM14.74 4.93c.56-.67.93-1.61.83-2.54-.8.03-1.77.53-2.34 1.2-.51.59-.96 1.54-.84 2.45.89.07 1.8-.45 2.35-1.11z" />
      </motion.svg>

      <div className="mt-14 h-1 w-56 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-white"
          style={{ width: `${progress}%` }}
          transition={{ ease: "linear" }}
        />
      </div>

      <p className="mt-4 font-mono text-xs text-white/40">
        {bootCopy.booting}
        {progress >= 100 ? bootCopy.ready : bootCopy.waiting}
      </p>
    </motion.div>
  );
};

export default BootScreen;

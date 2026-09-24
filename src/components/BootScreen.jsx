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
<motion.img
  src="/icon.png"
  alt="Logo"
  className="h-20 w-20"
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.6 }}
/>

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

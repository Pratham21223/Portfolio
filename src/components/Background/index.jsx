import { lazy, Suspense, useEffect, useState } from "react";
import Aurora from "./Aurora";
import Particles from "./Particles";

const Scene = lazy(() => import("./Scene"));

const Background = () => {
  const [show3D, setShow3D] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = window.innerWidth >= 1024;

    if (reduce || !isDesktop) return;

    // Kick off the three.js chunk early — Background mounts during the boot
    // screen, so the globe is ready by the time boot finishes.
    const t = setTimeout(() => setShow3D(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div aria-hidden className="absolute inset-0 -z-10">
      <div className="aurora-base" />
      <Aurora />
      <Particles />
      {show3D && (
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      )}
    </div>
  );
};

export default Background;

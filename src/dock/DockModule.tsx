import { useEffect, useState, type ReactNode } from "react";

type Phase = "active" | "parked" | "unplugging";

interface DockModuleProps {
  phase: Phase;
  onActivate: () => void;
  onUnplugged: () => void;
  children: ReactNode;
}

/**
 * Enveloppe générique pour un module branché : gère l'animation d'entrée
 * (montage hors-écran -> insertion, puisqu'un élément qui vient d'apparaître
 * dans le DOM ne peut pas transitionner depuis un état "avant" implicite) et
 * l'animation de sortie lors d'un remplacement d'occupant de port.
 */
export default function DockModule({ phase, onActivate, onUnplugged, children }: DockModuleProps) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []); // une fois par montage : la clé (serviceId) change à chaque swap de port

  const visualPhase = phase === "unplugging" ? "hidden" : entered ? phase : "hidden";

  return (
    <div
      className={`dockModule dockModule-${visualPhase}`}
      onClick={visualPhase === "parked" ? onActivate : undefined}
      onTransitionEnd={(e) => {
        if (e.target !== e.currentTarget) return;
        if (phase === "unplugging") onUnplugged();
      }}
    >
      {children}
    </div>
  );
}

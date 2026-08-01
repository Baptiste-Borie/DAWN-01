import { createContext } from "react";
import type { PortId, Swapping } from "./types";

export interface DockApi {
  plugged: Partial<Record<PortId, string>>;
  activeView: "home" | string;
  swapping: Swapping | null;
  /** Branche un service sur un port. Si le port est déjà occupé par un autre
   *  service, débranche l'ancien d'abord (voir dockReducer). */
  plug: (port: PortId, serviceId: string) => void;
  /** Fait revenir un module déjà branché en vue principale, sans le rebrancher. */
  activate: (serviceId: string) => void;
  goHome: () => void;
  swapComplete: () => void;
}

export const DockContext = createContext<DockApi | null>(null);

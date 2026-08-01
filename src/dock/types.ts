export type PortId = "right" | "top";

export interface Swapping {
  port: PortId;
  outgoing: string;
  incoming: string;
}

export interface DockState {
  /** Ce qui est physiquement branché sur chaque prise, persiste hors-écran. */
  plugged: Partial<Record<PortId, string>>;
  /** La vue principale actuelle : la home, ou le service en focus. */
  activeView: "home" | string;
  /** Séquence de remplacement en cours sur un port (débranchement avant rebranchement). */
  swapping: Swapping | null;
}

export type DockAction =
  | { type: "PLUG"; port: PortId; serviceId: string }
  | { type: "ACTIVATE"; serviceId: string }
  | { type: "GO_HOME" }
  | { type: "SWAP_COMPLETE" };

import type { DockAction, DockState } from "./types";

export const initialDockState: DockState = {
  plugged: {},
  activeView: "home",
  swapping: null,
};

export function dockReducer(state: DockState, action: DockAction): DockState {
  switch (action.type) {
    case "PLUG": {
      const { port, serviceId } = action;
      const current = state.plugged[port];

      if (current === serviceId) {
        // déjà branché ici : un reclic ramène juste ce module en vue principale.
        return { ...state, activeView: serviceId };
      }

      if (current) {
        // le port est occupé par un autre service : on débranche d'abord,
        // le nouveau service sera branché quand SWAP_COMPLETE arrivera
        // (déclenché par la fin de l'animation de sortie de l'ancien module).
        return { ...state, swapping: { port, outgoing: current, incoming: serviceId } };
      }

      return {
        ...state,
        plugged: { ...state.plugged, [port]: serviceId },
        activeView: serviceId,
      };
    }

    case "ACTIVATE":
      return { ...state, activeView: action.serviceId };

    case "GO_HOME":
      return { ...state, activeView: "home" };

    case "SWAP_COMPLETE": {
      const { swapping } = state;
      if (!swapping) return state;
      return {
        ...state,
        plugged: { ...state.plugged, [swapping.port]: swapping.incoming },
        activeView: swapping.incoming,
        swapping: null,
      };
    }

    default:
      return state;
  }
}

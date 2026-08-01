import type { ReactNode } from "react";
import YtdlService from "@/components/dawn/services/YtdlService";
import type { PortId } from "./types";

interface DockModuleDef {
  port: PortId;
  jack: string;
  render: () => ReactNode;
}

/** Un seul point de vérité : serviceId -> quel port il occupe et quoi rendre. */
export const DOCK_MODULES: Record<string, DockModuleDef> = {
  ytdl: { port: "right", jack: "J1", render: () => <YtdlService /> },
};

import ConnectorPlug from "@/components/dawn/connector/ConnectorPlug";
import { useDock } from "./useDock";
import DockModule from "./DockModule";
import { DOCK_MODULES } from "./moduleRegistry";
import type { PortId } from "./types";

export default function DockPort({ port }: { port: PortId }) {
  const dock = useDock();
  const serviceId = dock.plugged[port];

  if (!serviceId) return null;

  const moduleDef = DOCK_MODULES[serviceId];
  const isSwapping = dock.swapping?.port === port;
  const phase = isSwapping ? "unplugging" : dock.activeView === serviceId ? "active" : "parked";

  return (
    <DockModule
      key={serviceId}
      phase={phase}
      onActivate={() => dock.activate(serviceId)}
      onUnplugged={() => dock.swapComplete()}
    >
      <ConnectorPlug jack={moduleDef.jack}>{moduleDef.render()}</ConnectorPlug>
    </DockModule>
  );
}

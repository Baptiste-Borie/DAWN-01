import HomeNavbar from "@/layout/HomeNavbar";
import TerminalShell from "@/components/dawn/terminal/TerminalShell";
import PostIt from "@/components/dawn/PostIt";
import ServiceGrid from "@/components/dawn/ServiceGrid";
import HomeBottomBar from "@/components/dawn/HomeBottomBar";
import ConnectorSocket from "@/components/dawn/connector/ConnectorSocket";
import DockPort from "@/dock/DockPort";
import { useDock } from "@/dock/useDock";
import { DOCK_MODULES } from "@/dock/moduleRegistry";

export default function HomeChassis() {
  const dock = useDock();

  const pushed = dock.activeView !== "home";
  const hasPluggedModule = Object.keys(dock.plugged).length > 0;
  const rightServiceId = dock.plugged.right;
  const rightActive = !!rightServiceId && dock.activeView === rightServiceId;

  const handlePlugRequest = (serviceId: string) => {
    const moduleDef = DOCK_MODULES[serviceId];
    if (!moduleDef) return;
    dock.plug(moduleDef.port, serviceId);
  };

  return (
    <div className="dockChassis flex min-h-screen items-center justify-center bg-[var(--color-room)] p-6">
      <div
        className="dockChassis-home"
        data-pushed={pushed}
        data-has-plugged={hasPluggedModule}
      >
        <div className="panel home-panel">
          <div className="panel-vignette" />
          <div className="panel-bevel" />

          <HomeNavbar />

          <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[1.42fr_1fr]">
            <TerminalShell />
            <ServiceGrid
              onNavigate={handlePlugRequest}
              pluggedServiceId={rightServiceId}
            />
          </div>

          <HomeBottomBar />

          <PostIt />

        </div>

        <ConnectorSocket
          className="dockChassis-socket dockChassis-socket-right"
          active={rightActive}
          mark="DIMM_A1"
        />

        {pushed && (
          <button
            type="button"
            className="dockChassis-recall"
            aria-label="Revenir à la home"
            onClick={dock.goHome}
          />
        )}
      </div>

      <DockPort port="right" />
    </div>
  );
}

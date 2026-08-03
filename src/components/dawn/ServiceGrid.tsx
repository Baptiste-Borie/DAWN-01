import { useState, type ComponentType } from "react";

type ServiceStatus = "online" | "offline" | "unknown";

interface Service {
  id: string;
  mod: string;
  name: string;
  status: ServiceStatus;
  icon?: ComponentType<{ className?: string }>;
  route?: string;
}

const SERVICES: Service[] = [
  { id: "monitoring", mod: "MOD · 01", name: "Monitoring", status: "offline" },
  {
    id: "ytdl",
    mod: "MOD · 02",
    name: "YT Extractor",
    status: "online",
    route: "ytdl",
  },
  { id: "slot3", mod: "MOD · 03", name: "Slot libre", status: "unknown" },
  { id: "slot4", mod: "MOD · 04", name: "Slot libre", status: "unknown" },
  { id: "slot5", mod: "MOD · 05", name: "Slot libre", status: "unknown" },
  { id: "slot6", mod: "MOD · 06", name: "Slot libre", status: "unknown" },
];

interface ServiceGridProps {
  /** Appelé quand un service pluggable (ex: ytdl) est cliqué, avec son id de module.
   *  Branche ça sur dock.plug(port, serviceId). */
  onNavigate?: (serviceId: string) => void;
  pluggedServiceId?: string;
}

export default function ServiceGrid({ onNavigate, pluggedServiceId }: ServiceGridProps) {
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const activeService = SERVICES.find((s) => s.id === activeSlot) ?? null;

  const toggleSlot = (service: Service) => {
    if (service.status === "unknown") return;
    if (service.id === "monitoring") return;
    if (service.route) {
      onNavigate?.(service.route);
      return;
    }
    setActiveSlot((prev) => (prev === service.id ? null : service.id));
  };

  const getDisplayStatus = (service: Service): ServiceStatus => {
    if (service.id === "ytdl" && pluggedServiceId !== "ytdl") return "offline";
    return service.status;
  };

  const onlineCount = SERVICES.filter((service) => getDisplayStatus(service) === "online").length;

  return (
    <div className="serviceGrid-wrapper">
      <div className="serviceGrid-head">
        <span className="silk-label">Modules</span>
        <span className="silk-small">
          {SERVICES.length} units · {onlineCount} active
        </span>
      </div>

      <div className="serviceGrid-services">
        {SERVICES.map((service) => {
          const displayStatus = getDisplayStatus(service);

          return (
            <div key={service.id} className="serviceGrid-padCol">
              <button
                className={`above-grain serviceGrid-pad serviceGrid-${displayStatus} ${
                  activeSlot === service.id ? "serviceGrid-active" : ""
                }`}
                onClick={() => toggleSlot(service)}
              >
                <span className="serviceGrid-padRidge">
                  <span className="serviceGrid-padFace">{service.name}</span>
                </span>
              </button>
              <span className="above-grain serviceGrid-chan">
                {service.mod.replace("MOD · ", "")} · {displayStatus.toUpperCase()}
              </span>
            </div>
          );
        })}
      </div>

      {activeService && (
        <div className="serviceGrid-panel">
          {/* future inline service panels */}
        </div>
      )}
    </div>
  );
}

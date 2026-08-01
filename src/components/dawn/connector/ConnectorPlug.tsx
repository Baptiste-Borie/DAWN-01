import type { ReactNode } from "react";

interface ConnectorPlugProps {
  className?: string;
  jack?: string;
  children?: ReactNode;
}

export default function ConnectorPlug({ className, jack = "J1", children }: ConnectorPlugProps) {
  return (
    <div className={`connectorPlug ${className ?? ""}`}>
      <div className="connectorPlug-edge" data-jack={jack} aria-hidden="true">
        <div className="connectorPlug-inner" />
        <div className="connectorPlug-traces" />
        <div className="connectorPlug-circleHole" />
        <div className="connectorPlug-pinHole" />
        <div className="connectorPlug-via connectorPlug-via-a" />
        <div className="connectorPlug-via connectorPlug-via-b" />
      </div>
      <div className="connectorPlug-body">{children}</div>
    </div>
  );
}

import "./ConnectorSocket.css";

interface ConnectorSocketProps {
  className?: string;
  layer?: "complete" | "back" | "front";
  pushed?: boolean;
  hasPlugged?: boolean;
  /** Clip fermé + LED verte. Purement visuel ici — le dock pilotera cette prop plus tard. */
  active?: boolean;
  code?: string;
  revision?: string;
  mark?: string;
}

export default function ConnectorSocket({
  className,
  layer = "complete",
  pushed = false,
  hasPlugged = false,
  active = false,
  code = "CN-01",
  revision = "REV.B",
  mark,
}: ConnectorSocketProps) {
  return (
    <div
      className={`connectorSocket ${active ? "connectorSocket-active" : ""} ${className ?? ""}`}
      data-pushed={pushed}
      data-has-plugged={hasPlugged}
      aria-hidden="true"
    >
      {layer !== "front" && (
        <div className="connectorSocket-back">
          <div className="connectorSocket-contacts" />
        </div>
      )}
      {layer !== "back" && (
        <>
          <div className="connectorSocket-front">
            <span className="connectorSocket-code">{code}</span>
            <span className="connectorSocket-revision">{revision}</span>
            {mark && <span className="connectorSocket-mark">{mark}</span>}
            <i className="connectorSocket-rivet connectorSocket-rivet-top" />
            <i className="connectorSocket-rivet connectorSocket-rivet-bottom" />
          </div>
          <div className="connectorSocket-clip">
            <span />
          </div>
        </>
      )}
    </div>
  );
}

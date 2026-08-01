interface ConnectorSocketProps {
  className?: string;
  /** Clip fermé + LED verte. Purement visuel ici — le dock pilotera cette prop plus tard. */
  active?: boolean;
  code?: string;
  revision?: string;
  mark?: string;
}

export default function ConnectorSocket({
  className,
  active = false,
  code = "CN-01",
  revision = "REV.B",
  mark,
}: ConnectorSocketProps) {
  return (
    <div
      className={`connectorSocket ${active ? "connectorSocket-active" : ""} ${className ?? ""}`}
      aria-hidden="true"
    >
      <div className="connectorSocket-back">
        <div className="connectorSocket-contacts" />
      </div>
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
    </div>
  );
}

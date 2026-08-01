import { useEffect, useRef, useState } from "react";
import PowerSwitch from "./PowerSwitch";

interface Bar {
  height: number;
  color: string;
  active: boolean;
}

const COLORS = [
  "#39ff14",
  "#39ff14",
  "#39ff14",
  "#39ff14",
  "#39ff14",
  "#39ff14",
  "#39ff14",
  "#39ff14",
  "#e8a020",
  "#e8a020",
  "#cc1a1a",
  "#cc1a1a",
];
const MAX_H = [8, 10, 12, 14, 16, 18, 18, 18, 18, 18, 18, 18];
const INACTIVE = "#d8ccba";

const IDLE_BARS: Bar[] = Array.from({ length: 12 }, () => ({
  height: 3,
  color: INACTIVE,
  active: false,
}));

interface TerminalControlsProps {
  isOn: boolean;
  onToggle: () => void;
}

export default function TerminalControls({
  isOn,
  onToggle,
}: TerminalControlsProps) {
  const [bars, setBars] = useState<Bar[]>(IDLE_BARS);
  const target = useRef(7);
  const current = useRef(7);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!isOn) {
      clearTimeout(timer.current);
      return;
    }

    const animate = () => {
      target.current += (Math.random() - 0.48) * 3;
      target.current = Math.max(0, Math.min(12, target.current));
      current.current += (target.current - current.current) * 0.4;

      const active = Math.round(current.current);
      setBars(
        Array.from({ length: 12 }, (_, i) => ({
          height: i < active ? MAX_H[i] : 3,
          color: i < active ? COLORS[i] : INACTIVE,
          active: i < active,
        })),
      );

      timer.current = setTimeout(animate, 80 + Math.random() * 60);
    };

    animate();
    return () => clearTimeout(timer.current);
  }, [isOn]);

  const displayedBars = isOn ? bars : IDLE_BARS;

  return (
    <div className="terminalControls-controls">
      <PowerSwitch isOn={isOn} onToggle={onToggle} />

      <div className="terminalControls-divider" />

      <div className="gauge">
        <span>SYS</span>
        <div className="lcd-dark">{isOn ? "ONLINE" : "OFFLINE"}</div>
      </div>

      <div className="gauge">
        <span>VERSION</span>
        <div className="lcd-dark truncate">a0.21</div>
      </div>

      <div className="gauge">
        <span>LOAD</span>
        <div className="lcd-dark">0.42</div>
      </div>

      <div className="terminalControls-divider" />

      <div className="terminalControls-group">
        <span className="terminalControls-label">SIGNAL</span>
        <div className="terminalControls-vu">
          <div className="terminalControls-vuBars">
            {displayedBars.map((bar, i) => (
              <div
                key={i}
                className="terminalControls-vuBar"
                style={{
                  height: bar.height,
                  background: bar.color,
                  opacity: bar.active ? 1 : 0.5,
                }}
              />
            ))}
          </div>
          <div className="terminalControls-vuLabels">
            <span>-∞</span>
            <span>-12</span>
            <span>-6</span>
            <span>0</span>
          </div>
        </div>
      </div>

      <div className="terminalControls-divider" />

      <div className="pot">
        <span className="cap">BRIGHT</span>
        <div className="knob" style={{ transform: "rotate(28deg)" }} />
      </div>

      <div className="terminalControls-spacer">
        S/N CRT-800-A1
        <br />© 1994 CORP SYSTEMS
      </div>
    </div>
  );
}

import { useState } from "react";

const RANGES = ["1H", "6H", "24H", "7D"] as const;

export default function HomeBottomBar() {
  const [range, setRange] = useState<(typeof RANGES)[number]>("6H");

  return (
    <footer className="homeBottomBar-bottom">
      <div className="homeBottomBar-zone">
        <span className="zone-label">Deploy</span>
        <div className="above-grain homeBottomBar-card">
          <button className="dark-key">PUSH</button>
          <div className="gauge">
            <span>LAST</span>
            <div className="lcd">2h 14m</div>
          </div>
        </div>
      </div>

      <div className="homeBottomBar-zone">
        <span className="zone-label">Network</span>
        <div className="above-grain homeBottomBar-card">
          <button className="pill">
            <span>◀</span>
            <span>TAILNET</span>
            <span>▶</span>
          </button>
          <div className="gauge">
            <span>ADDR</span>
            <div className="lcd">100.83.186.22</div>
          </div>
        </div>
      </div>

      <div className="homeBottomBar-zone">
        <span className="zone-label">Storage</span>
        <div className="above-grain homeBottomBar-card">
          <div className="gauge">
            <span>ROOT</span>
            <div className="lcd-dark">42/120 GB</div>
          </div>
          <div className="gauge">
            <span>MEDIA</span>
            <div className="lcd-dark">1.8/4 TB</div>
          </div>
        </div>
      </div>

      <div className="homeBottomBar-zone homeBottomBar-grow">
        <span className="zone-label">Range</span>
        <div className="above-grain homeBottomBar-card">
          <div className="homeBottomBar-keypad">
            {RANGES.map((r) => (
              <button
                key={r}
                className={`key ${range === r ? "on" : ""}`}
                onClick={() => setRange(r)}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="pot" style={{ marginLeft: 6 }}>
            <span className="cap">REFRESH</span>
            <div className="knob big" style={{ transform: "rotate(-38deg)" }} />
          </div>

          <div className="led-tri" style={{ alignSelf: "flex-end", paddingBottom: 4 }}>
            <div className="led-mini">
              <span className="led led-on" />
              <span>AUTO</span>
            </div>
            <div className="led-mini">
              <span className="led led-on" />
              <span>PING</span>
            </div>
            <div className="led-mini">
              <span className="led led-off" />
              <span>ALERT</span>
            </div>
          </div>

          <div className="pot" style={{ marginLeft: "auto" }}>
            <button className="dark-key" style={{ padding: "11px 22px" }}>
              DIM
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

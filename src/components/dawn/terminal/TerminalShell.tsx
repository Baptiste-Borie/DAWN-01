import { useEffect, useRef, useState } from "react";
import TerminalControls from "./TerminalControls";

const COMMANDS = [
  "systemctl restart plex.service",
  "htop",
  "journalctl -u plex",
  "tail -f /var/log/dawn.log",
  'docker ps --format "{{.Names}}"',
  "df -h /mnt/media",
  "ping -c 4 dawn-01.local",
];

interface TerminalShellProps {
  username?: string;
}

export default function TerminalShell({
  username = "operator",
}: TerminalShellProps) {
  const [typedCommand, setTypedCommand] = useState("");
  const [isOn, setIsOn] = useState(false);
  const [wasOn, setWasOn] = useState(false);
  const [toggleKey, setToggleKey] = useState(0);

  const running = useRef(false);
  const cmdIndex = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const typeLoop = () => {
    const cmd = COMMANDS[cmdIndex.current];
    let text = "";
    setTypedCommand("");

    const erase = () => {
      if (!running.current) return;
      if (text.length > 0) {
        text = text.slice(0, -1);
        setTypedCommand(text);
        timer.current = setTimeout(erase, 30);
      } else {
        cmdIndex.current = (cmdIndex.current + 1) % COMMANDS.length;
        timer.current = setTimeout(typeLoop, 250);
      }
    };

    const tick = () => {
      if (!running.current) return;
      if (text.length < cmd.length) {
        text = cmd.slice(0, text.length + 1);
        setTypedCommand(text);
        timer.current = setTimeout(tick, 75);
      } else {
        timer.current = setTimeout(erase, 1200);
      }
    };

    tick();
  };

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setIsOn(true);
      setWasOn(true);
      running.current = true;
      cmdIndex.current = 0;
      typeLoop();
    });
    return () => {
      cancelAnimationFrame(raf);
      running.current = false;
      clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = () => {
    if (isOn) {
      setIsOn(false);
      running.current = false;
      clearTimeout(timer.current);
      setTypedCommand("");
    } else {
      setWasOn(false);
      setToggleKey((k) => k + 1);
      requestAnimationFrame(() => {
        setIsOn(true);
        setWasOn(true);
        running.current = true;
        cmdIndex.current = 0;
        typeLoop();
      });
    }
  };

  return (
    <div className="terminalShell-screenWrapper">
      <div className="terminalShell-terminalWrapper">
        <div className="terminalShell-screw terminalShell-tl" />
        <div className="terminalShell-screw terminalShell-tr" />
        <div className="terminalShell-screw terminalShell-bl" />
        <div className="terminalShell-screw terminalShell-br" />

        <div className="terminalShell-glass">
          <div
            key={toggleKey}
            className={`terminalShell-terminal ${isOn ? "terminalShell-isOn" : ""} ${!isOn && wasOn ? "terminalShell-isOff" : ""}`}
          >
            <div className="terminalShell-header">
              <div>MISSION BRIEF</div>
            </div>
            <div className="terminalShell-body">
              <span className="terminalShell-comment">
                // DAWN-01 · shell placeholder — xterm.js + Laravel WebSocket
              </span>
              <span className="terminalShell-comment">
                // connect: wss://dawn-01.local/ws/shell
              </span>

              <span className="terminalShell-orange">
                @{username} <span className="terminalShell-comment">~$</span>
                <span className="terminalShell-ivory"> whoami </span>
              </span>
              <span className="terminalShell-green"> operator </span>

              <span className="terminalShell-orange">
                @{username}
                <span className="terminalShell-comment">~$</span>
                <span className="terminalShell-ivory">
                  {" "}
                  systemctl status dawn.target
                </span>
              </span>
              <span className="terminalShell-comment">
                <span className="terminalShell-statusDot terminalShell-online" /> -
                local infrastructure
                <br />
                loaded . active . running since 2024-06-01 12:00:00
                <br />
                12 units up . 1 <span className="terminalShell-green">online</span>{" "}
                (plex.service)
              </span>

              <span className="terminalShell-orange">
                @{username}
                <span className="terminalShell-comment">~$</span>
                <span className="terminalShell-ivory">&nbsp;{typedCommand}</span>
                <span className="terminalShell-cursor">▋</span>
              </span>
            </div>
            <div className="terminalShell-footer">
              <span>MODEL CRT-800 AV INPUT</span>
            </div>
          </div>
          <span className="terminalShell-sheen" />
        </div>
      </div>

      <TerminalControls isOn={isOn} onToggle={toggle} />
    </div>
  );
}

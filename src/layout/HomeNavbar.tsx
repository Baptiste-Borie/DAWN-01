import { useEffect, useState } from "react";
import dayjs from "dayjs";

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function HomeNavbar() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => {
      const now = dayjs();
      setTime(now.format("HH:mm:ss"));
      setDate(now.toDate());
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = date
    ? `${DAYS[date.getDay()]} · ${dayjs(date).format("DD MMM YYYY")}`.toUpperCase()
    : "";

  return (
    <header className="above-grain homeNavbar-navbar">
      <div className="homeNavbar-brand">
        <h1>DAWN-01</h1>
        <p>// local infrastructure · node 01 · mission active</p>
      </div>

      <div className="homeNavbar-stats">
        <div className="homeNavbar-field">
          <span>HOSTNAME</span>
          <em>dawn.local</em>
        </div>
        <div className="homeNavbar-field">
          <span>UPTIME</span>
          <div className="lcd homeNavbar-lcd">14d 06h</div>
        </div>
        <div className="homeNavbar-field">
          <span>SERVICES</span>
          <div className="lcd homeNavbar-lcd">4 UP · 2 DN</div>
        </div>
      </div>

      <div className="homeNavbar-end">
        <div className="lcd lcd-clock">{time}</div>
        <div className="homeNavbar-date">{formattedDate}</div>
      </div>
    </header>
  );
}

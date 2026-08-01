interface PowerSwitchProps {
  isOn: boolean;
  onToggle: () => void;
}

export default function PowerSwitch({ isOn, onToggle }: PowerSwitchProps) {
  return (
    <label className="powerSwitch-switch">
      <input type="checkbox" checked={isOn} onChange={onToggle} />
      <div className="powerSwitch-button">
        <div className="powerSwitch-light" />
        <div className="powerSwitch-dots" />
        <div className="powerSwitch-characters" />
        <div className="powerSwitch-shine" />
        <div className="powerSwitch-shadow" />
      </div>
    </label>
  );
}

import { useEffect, useState } from "react";

export const DiscreetModeToggle = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(["discreet_mode"]).then((res) => {
      setEnabled(res.discreet_mode === true);
    });
  }, []);

  const handleToggle = () => {
    const next = !enabled;
    setEnabled(next);
    chrome.storage.local.set({ discreet_mode: next });
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      className={`discreet-toggle${enabled ? " enabled" : ""}`}
      onClick={handleToggle}
    >
      <span className="discreet-toggle-text">
        <span className="discreet-toggle-name">Discreet mode</span>
        <span className="discreet-toggle-hint">
          Nothing on screen shows what you skip.
        </span>
      </span>
      <span className="discreet-toggle-switch" aria-hidden="true">
        <span className="discreet-toggle-knob" />
      </span>
    </button>
  );
};

import { useEffect, useState } from "react";
import { SkipitLogo } from "./SkipitLogo";

const FAB_STYLES = ["classic", "netflix"] as const;
type FabStyle = (typeof FAB_STYLES)[number];

const LABELS: Record<FabStyle, string> = {
  classic: "Classic",
  netflix: "Netflix",
};

export const FabStyleSelector = () => {
  const [style, setStyle] = useState<FabStyle>("classic");

  useEffect(() => {
    chrome.storage.local.get(["fab_style"]).then((res) => {
      if (res.fab_style === "netflix") setStyle("netflix");
    });
  }, []);

  const handleChange = (next: FabStyle) => {
    setStyle(next);
    chrome.storage.local.set({ fab_style: next });
  };

  return (
    <div className="fab-style-selector">
      <div className="fab-style-cards" role="radiogroup">
        {FAB_STYLES.map((s) => (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={style === s}
            aria-label={`${LABELS[s]} button style`}
            className={`fab-style-card${style === s ? " selected" : ""}`}
            onClick={() => handleChange(s)}
          >
            <span className={`fab-preview fab-preview--${s}`}>
              <SkipitLogo className="fab-preview-logo" />
              <span className="fab-preview-types">Skip scenes</span>
            </span>
            <span className={`fab-preview fab-preview--${s} fab-preview--active`}>
              <SkipitLogo className="fab-preview-logo" />
              <span className="fab-preview-types">Skipping</span>
            </span>
            <span className="fab-style-card-name">{LABELS[s]}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

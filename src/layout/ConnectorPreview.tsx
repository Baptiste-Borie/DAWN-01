import { useState } from "react";
import ConnectorSocket from "@/components/dawn/connector/ConnectorSocket";
import ConnectorPlug from "@/components/dawn/connector/ConnectorPlug";

/**
 * Page de vérification visuelle temporaire pour ConnectorSocket/ConnectorPlug,
 * le temps de valider l'extraction du mockup (étape 1 du dock). A retirer une
 * fois le rendu validé.
 */
export default function ConnectorPreview() {
  const [active, setActive] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 bg-[var(--color-room)] p-10">
      <button
        className="rounded-md bg-[var(--stop-key-0)] px-4 py-2 text-xs font-bold tracking-wide"
        onClick={() => setActive((v) => !v)}
      >
        TOGGLE ACTIVE
      </button>

      <div className="flex items-center" style={{ height: 320 }}>
        <ConnectorSocket active={active} mark="DIMM_A1" />
        <ConnectorPlug jack="J1">
          <div
            className="flex h-full flex-col justify-center rounded-md p-4"
            style={{ background: "var(--stop-casing-1)" }}
          >
            <b>YT EXTRACTOR</b>
          </div>
        </ConnectorPlug>
      </div>
    </div>
  );
}

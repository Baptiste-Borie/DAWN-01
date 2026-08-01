import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import MockupPage from "@/layout/MockupPage";
import ConnectorPreview from "@/layout/ConnectorPreview";
import HomeChassis from "@/layout/HomeChassis";
import { DockProvider } from "@/dock/DockProvider";
import { useDock } from "@/dock/useDock";

/**
 * Deep-link seulement : branche le module puis redirige vers "/" tout de
 * suite. La home et les modules déjà branchés vivent uniquement sous "/" et
 * ne doivent jamais être démontés par un changement de route.
 */
function YtdlDeepLink() {
  const dock = useDock();
  const navigate = useNavigate();

  useEffect(() => {
    dock.plug("right", "ytdl");
    navigate("/", { replace: true });
  }, [dock, navigate]);

  return null;
}

function App() {
  return (
    <DockProvider>
      <Routes>
        <Route path="/" element={<HomeChassis />} />
        <Route path="/ytdl" element={<YtdlDeepLink />} />
        <Route path="/poc/:name" element={<MockupPage />} />
        <Route path="/poc-connector" element={<ConnectorPreview />} />
      </Routes>
    </DockProvider>
  );
}

export default App;

// src/components/InstallPWAButton.tsx
import React from "react";
import usePWAInstallPrompt from "../../hooks/usePWAInstallPrompt";

const InstallPWAButton: React.FC = () => {
  const { isInstallable, promptInstall } = usePWAInstallPrompt();

  if (!isInstallable) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={promptInstall}
        className="bg-blue-600 text-white px-4 py-2 rounded shadow-lg hover:bg-blue-700 transition"
      >
        Install App
      </button>
    </div>
  );
};

export default InstallPWAButton;

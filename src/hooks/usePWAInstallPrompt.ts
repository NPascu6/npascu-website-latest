// src/hooks/usePWAInstallPrompt.ts
import { useState, useEffect } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const usePWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);

  useEffect(() => {
    const beforeInstallHandler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Cast the event to our custom type
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', beforeInstallHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallHandler);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();

    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferred prompt so it can be used only once
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return { isInstallable, promptInstall };
};

export default usePWAInstallPrompt;

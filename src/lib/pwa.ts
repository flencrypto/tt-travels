const registerServiceWorker = async (): Promise<void> => {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  const baseUrl = import.meta.env.BASE_URL;

  try {
    const registration = await navigator.serviceWorker.register(`${baseUrl}service-worker.js`, {
      scope: baseUrl,
    });

    registration.addEventListener('updatefound', () => {
      const installingWorker = registration.installing;
      if (!installingWorker) {
        return;
      }

      installingWorker.addEventListener('statechange', () => {
        if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
          console.info('[PWA] New version installed. It will be used on the next refresh.');
        }
      });
    });
  } catch (error) {
    console.warn('[PWA] Service worker registration failed.', error);
  }
};

export const setupPwa = (): void => {
  window.addEventListener('load', () => {
    void registerServiceWorker();
  });
};

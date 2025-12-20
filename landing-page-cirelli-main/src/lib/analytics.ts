// Função para rastrear eventos do Google Analytics
export const trackEvent = (action: string, category: string, label: string) => {
  try {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', action, {
        event_category: category,
        event_label: label,
      });
    }
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

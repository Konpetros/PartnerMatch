declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const trackPageView = (page: string): void => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', 'G-PFV1XJHKYE', {
      page_path: `/${page}`,
      page_title: page,
    });
  }
};

export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
): void => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

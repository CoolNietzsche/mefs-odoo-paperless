export const urlUtils = {
  isValidOdooUrl: (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  },

  getOdooPath: (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.pathname + parsed.search + parsed.hash;
    } catch {
      return '/';
    }
  },

  isExternalUrl: (url: string, odooBaseUrl: string) => {
    if (!url.startsWith('http')) return true;
    return !url.includes(new URL(odooBaseUrl).hostname);
  }
};

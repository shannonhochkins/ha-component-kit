const LOCAL_TRANSLATIONS: Record<string, string> = {};

export function updateLocalTranslations(translations: Record<string, string>): void {
  Object.assign(LOCAL_TRANSLATIONS, translations);
}

export function localize(
  key: string,
  {
    search,
    replace,
    fallback,
  }: {
    search?: string;
    replace?: string;
    fallback?: string;
  } = {},
): string {
  if (!LOCAL_TRANSLATIONS[key]) {
    if (fallback) {
      return fallback;
    }
    throw new Error(`Key ${key} not found in translations, have you added the expected category "options" prop on HassConnect?`);
  }
  if (search && replace) {
    if (search && replace) {
      return LOCAL_TRANSLATIONS[key].replace(`{${search}}`, replace);
    }
  }
  return LOCAL_TRANSLATIONS[key];
}

export function useTranslations(): Record<string, string> {
  return LOCAL_TRANSLATIONS;
}

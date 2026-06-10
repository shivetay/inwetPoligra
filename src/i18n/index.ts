import { translations, type TranslationKey } from "./pl";

export type { TranslationKey };

export function t(
  key: TranslationKey,
  params?: Record<string, string | number>,
): string {
  let text: string = translations[key];

  if (params) {
    for (const [paramKey, value] of Object.entries(params)) {
      text = text.replace(`{${paramKey}}`, String(value));
    }
  }

  return text;
}

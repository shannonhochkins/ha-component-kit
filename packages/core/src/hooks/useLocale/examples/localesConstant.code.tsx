import { locales } from "@hakit/core";

async function fetchLocale(languageCode: string) {
  const locale = locales.find(({ code }) => code === languageCode);
  if (!locale) {
    throw new Error(`Locale not found for ${languageCode}`);
  }
  const data = await locale.fetch();
  console.log(data);
  return data;
}

fetchLocale("en").then((locale) => {
  console.log(locale);
});

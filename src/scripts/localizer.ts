import i18next from "i18next";
import Backend from "i18next-fs-backend";
import * as LogChamp from "./logchamp";

export async function initializeLocalizer(): Promise<void> {
    const i18nInst = i18next.use(Backend)
    await i18nInst.init({
        lng: "en",
        fallbackLng: "en",
        preload: ["en"],
        ns: ["translation"],
        returnObjects: true,
        interpolation: {
            escapeValue: false
        },
        backend: {
            loadPath: "./locales/{{lng}}/{{ns}}.json"
        }
    }, (err, t) => {
        if(err) {
            LogChamp.error("Error when initializing localizer!", err);
            return;
        }
    });
    LogChamp.info("Localizer set up successfully", {init: i18nInst.isInitialized, lngs: i18nInst.languages});
}

export function translate(key: string | string[], options?: object): string {
    LogChamp.info("Translation requested", {key: key});
    return i18next.t(key, options);
}

export function translateArray(key: string | string[], options?: object): string[] {
    LogChamp.info("Array translation requested", {key: key});
    return i18next.t(key, options);
}

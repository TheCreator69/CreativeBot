import i18next from "i18next";
import Backend from "i18next-fs-backend";
import * as LogChamp from "./logchamp";

export async function initializeLocalizer(): Promise<void> {
    await i18next.use(Backend).init({
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
            LogChamp.error(err);
            return;
        }
    });
}

export function translate(key: string | string[], options?: object): string {
    return i18next.t(key, options);
}

export function translateArray(key: string | string[], options?: object): object {
    return i18next.t(key, options);
}

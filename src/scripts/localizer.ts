import i18next from "i18next";
import Backend from "i18next-fs-backend";
import * as LogChamp from "./logchamp";

export async function initializeLocalizer(): Promise<void> {
    await i18next.use(Backend).init({
        lng: "en",
        fallbackLng: "en",
        preload: ["en"],
        ns: ["translation"],
        backend: {
            loadPath: "./src/locales/{{lng}}/{{ns}}.json"
        }
    }, (err, t) => {
        if(err) {
            LogChamp.error(err);
            return;
        }
    });
}

export function translate(key: string, ...args: string[]): string {
    return i18next.t(key);
}

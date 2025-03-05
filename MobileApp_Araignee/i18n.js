import i18next from "i18next";
import { initReactI18next } from "react-i18next";

// Importation des fichiers de traduction
import fr from "./i18n/fr.json";
import en from "./i18n/en.json";

import * as Localization from "expo-localization";

const locales = Localization.getLocales(); // Détection automatique de la langue du système
const defaultLanguage = locales[0]?.languageCode || "fr"; // Langue par défaut

// Initialisation d’i18next
i18next
  .use(initReactI18next) // Initialisation de i18next pour React
  .init({
    compatibilityJSON: "v3", // Pour éviter les erreurs de dépréciation
    resources: { en: { translation: en }, fr: { translation: fr } }, // Fichiers de traduction
    lng: defaultLanguage, // Langue par défaut
    fallbackLng: "fr", // Langue de secours
    interpolation: { escapeValue: false } // Pour éviter les injections de code malveillant
  });
  
export default i18next;

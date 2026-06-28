import React, { createContext, useContext, useState, useEffect } from "react";
import { fa } from "../translations/fa";
import { en } from "../translations/en";

const LanguageContext = createContext();

function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem("language");
    return savedLanguage || "fa";
  });
  const translations = language === "fa" ? fa : en;

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "fa" ? "rtl" : "ltr";
    document.documentElement.style.fontFamily =
      language === "fa" ? "Vazirmatn" : "system-ui";
  }, [language]);

  function toggleLanguage() {
    setLanguage((lang) => (lang === "fa" ? "en" : "fa"));
  }

  return (
    <LanguageContext.Provider
      value={{ language, translations, toggleLanguage, setLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined)
    throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
}

export { LanguageProvider, useLanguage };

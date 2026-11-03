import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { translate } from './translations';
const LanguageContext = createContext(null);
const STORAGE_KEY = 'akarabo-locale';
function storedLocale() {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved === 'rw' || saved === 'fr' ? saved : 'en';
}
export function LanguageProvider({ children }) {
    const [locale, updateLocale] = useState(storedLocale);
    useEffect(() => {
        document.documentElement.lang = locale;
    }, [locale]);
    const value = useMemo(() => ({
        locale,
        setLocale: (next) => {
            window.localStorage.setItem(STORAGE_KEY, next);
            updateLocale(next);
        },
        t: (key) => translate(locale, key),
    }), [locale]);
    return _jsx(LanguageContext.Provider, { value: value, children: children });
}
export function useLanguage() {
    const value = useContext(LanguageContext);
    if (!value)
        throw new Error('useLanguage must be used within LanguageProvider');
    return value;
}

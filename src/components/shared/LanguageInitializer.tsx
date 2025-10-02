"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { 
  initializeLanguage, 
  selectIsLanguageInitialized,
  selectCurrentLanguage 
} from "@/redux/slices/languageSlice";

const LanguageInitializer = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const isInitialized = useSelector(selectIsLanguageInitialized);
  const currentLanguage = useSelector(selectCurrentLanguage);

  useEffect(() => {
    if (!isInitialized) {
      // Extraire la locale de l'URL
      const locale = pathname.split('/')[1] || 'fr';
      
      // Déterminer la langue basée sur la locale
      const languageMap: { [key: string]: any } = {
        'fr': { iso2: "FR", code: "FR", name: "Français" },
        'en': { iso2: "GB", code: "EN", name: "English" },
      };
      
      const language = languageMap[locale] || languageMap['fr'];
      
      // Initialiser la langue dans le store
      dispatch(initializeLanguage(language));
    }
  }, [dispatch, isInitialized, pathname]);

  // Synchroniser la langue du store avec l'URL si nécessaire
  useEffect(() => {
    if (isInitialized) {
      const locale = pathname.split('/')[1] || 'fr';
      const expectedCode = locale === 'fr' ? 'FR' : 'EN';
      
      if (currentLanguage.code !== expectedCode) {
        const languageMap: { [key: string]: any } = {
          'fr': { iso2: "FR", code: "FR", name: "Français" },
          'en': { iso2: "GB", code: "EN", name: "English" },
        };
        
        const language = languageMap[locale] || languageMap['fr'];
        dispatch(initializeLanguage(language));
      }
    }
  }, [dispatch, isInitialized, pathname, currentLanguage.code]);

  return null; // Ce composant ne rend rien
};

export default LanguageInitializer;













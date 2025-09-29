"use client";

import { usePathname } from "next/navigation";
import enTranslations from "@/locales/en";
import frTranslations from "@/locales/fr";

/**
 * Hook personnalisé pour gérer les traductions
 * @returns {Object} Objet contenant les traductions et la locale actuelle
 */
export const useTranslation = () => {
	const pathname = usePathname();
	
	// Extraire la locale du pathname
	const locale = pathname.split('/')[1] || 'fr';
	
	// Sélectionner les traductions selon la locale
	const translations = locale === 'en' ? enTranslations : frTranslations;
	
	return {
		t: translations,
		locale,
	};
};




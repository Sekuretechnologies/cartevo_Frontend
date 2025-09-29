"use client";

import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setLanguageByCode, selectCurrentLanguageCode } from "@/redux/slices/languageSlice";

/**
 * Hook personnalisé pour gérer la navigation avec locale
 * @returns {Object} Objet contenant les fonctions de navigation localisée
 */
export const useLocalizedNavigation = () => {
	const pathname = usePathname();
	const router = useRouter();
	const dispatch = useDispatch();
	
	// Extraire la locale du pathname
	const locale = pathname.split('/')[1] || 'fr';
	const currentLanguageCode = useSelector(selectCurrentLanguageCode);
	
	/**
	 * Crée un lien avec la locale actuelle
	 * @param {string} path - Le chemin sans locale (ex: "/signup")
	 * @returns {string} Le chemin avec locale (ex: "/fr/signup")
	 */
	const createLocalizedLink = (path: string): string => {
		// S'assurer que le chemin commence par /
		const normalizedPath = path.startsWith('/') ? path : `/${path}`;
		return `/${locale}${normalizedPath}`;
	};
	
	/**
	 * Navigue vers une page avec la locale actuelle
	 * @param {string} path - Le chemin sans locale
	 */
	const navigateTo = (path: string): void => {
		router.push(createLocalizedLink(path));
	};
	
	/**
	 * Change de locale en gardant la même page
	 * @param {string} newLocale - La nouvelle locale (ex: "en", "fr")
	 */
	const changeLocale = (newLocale: string): void => {
		// Mettre à jour le store Redux
		dispatch(setLanguageByCode(newLocale));
		
		// Naviguer vers la nouvelle locale
		const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
		router.push(newPath);
	};
	
	/**
	 * Remplace l'URL actuelle avec une nouvelle locale
	 * @param {string} newLocale - La nouvelle locale
	 */
	const replaceLocale = (newLocale: string): void => {
		const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
		router.replace(newPath);
	};
	
	return {
		locale,
		currentLanguageCode,
		createLocalizedLink,
		navigateTo,
		changeLocale,
		replaceLocale,
	};
};


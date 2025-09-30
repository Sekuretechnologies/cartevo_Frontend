import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Language {
  iso2: string;
  code: string;
  name: string;
}

export interface LanguageState {
  currentLanguage: Language;
  availableLanguages: Language[];
  isInitialized: boolean;
}

const defaultLanguages: Language[] = [
  { iso2: "FR", code: "FR", name: "Français" },
  { iso2: "GB", code: "EN", name: "English" },
];

const initialState: LanguageState = {
  currentLanguage: defaultLanguages[0], // Français par défaut
  availableLanguages: defaultLanguages,
  isInitialized: false,
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.currentLanguage = action.payload;
      state.isInitialized = true;
    },
    setLanguageByCode: (state, action: PayloadAction<string>) => {
      const language = state.availableLanguages.find(
        lang => lang.code.toLowerCase() === action.payload.toLowerCase()
      );
      if (language) {
        state.currentLanguage = language;
        state.isInitialized = true;
      }
    },
    initializeLanguage: (state, action: PayloadAction<Language>) => {
      state.currentLanguage = action.payload;
      state.isInitialized = true;
    },
    resetLanguage: (state) => {
      state.currentLanguage = defaultLanguages[0];
      state.isInitialized = true;
    },
  },
});

export const {
  setLanguage,
  setLanguageByCode,
  initializeLanguage,
  resetLanguage,
} = languageSlice.actions;

// Selectors
export const selectCurrentLanguage = (state: { language: LanguageState }) => 
  state.language.currentLanguage;

export const selectAvailableLanguages = (state: { language: LanguageState }) => 
  state.language.availableLanguages;

export const selectIsLanguageInitialized = (state: { language: LanguageState }) => 
  state.language.isInitialized;

export const selectCurrentLanguageCode = (state: { language: LanguageState }) => 
  state.language.currentLanguage.code.toLowerCase();

export default languageSlice.reducer;








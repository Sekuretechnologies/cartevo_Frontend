import { createSlice, current } from "@reduxjs/toolkit";

const cardSlice = createSlice({
  name: 'card',
  initialState: {
    cardSearchTerm:'',
    cardList: [],
    cardTransactions: [],
    cardPurchases: [],
    cardPayments: [],
    currentCard: null,
  },
  reducers: {
      setCardSearchTerm: (state, action) => {
          state.cardSearchTerm = action.payload;
      },
      setCardList: (state, action) => {
          state.cardList = action.payload;
      },
      setCardTransactions: (state, action) => {
        state.cardTransactions = action.payload;
      },
      setCardPurchases: (state, action) => {
        state.cardPurchases = action.payload;
      },
      setCardPayments: (state, action) => {
        state.cardPayments = action.payload;
      },
      setCurrentCard: (state, action) => {
        state.currentCard = action.payload;
    },
  },
})

export const { 
  setCardSearchTerm,
  setCardList, 
  setCardTransactions,
  setCardPurchases,
  setCardPayments,
  setCurrentCard } = cardSlice.actions

export default cardSlice.reducer

export const selectCardSearchTerm = (state:any) => state.card.cardSearchTerm;
export const selectCardList = (state:any) => state.card.cardList;
export const selectCardTransactions = (state:any) => state.card.cardTransactions;
export const selectCardPurchases = (state:any) => state.card.cardPurchases;
export const selectCardPayments = (state:any) => state.card.cardPayments;
export const selectCurrentCard = (state:any) => state.card.currentCard;


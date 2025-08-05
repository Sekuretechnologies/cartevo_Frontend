import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: 'search',
  initialState: {        
      searchTerm: '',
      searchConcern:''
  },
  reducers: {
      setSearchTerm: (state, action) => {
          state.searchTerm = action.payload;
      },
      setSearchConcern: (state, action) => {
        state.searchConcern = action.payload;
    },
  },
})

export const { setSearchTerm, setSearchConcern } = searchSlice.actions

export default searchSlice.reducer;

export const selectSearchTerm = (state:any) => state.search.searchTerm;
export const selectSearchConcern = (state:any) => state.search.searchConcern;


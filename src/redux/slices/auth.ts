import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: 'auth',
  initialState: {        
      token: null,
      getSekureApiToken: null,
      user: null,
  },
  reducers: {
      setCredentials: (state, action) => {
          const { token, getSekureApiToken, user } = action.payload
          state.token = token;
          state.getSekureApiToken = getSekureApiToken;
          state.user = user;
      },
      logOut: (state) => {
          state.token = null
          localStorage.removeItem('sktoken');
          window.sessionStorage.removeItem('previousUrl');
      },
  },
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = (state:any) => state.auth.user
export const selectCurrentToken = (state:any) => state.auth.token
export const selectCurrentGetSekureApiToken = (state:any) => state.auth.getSekureApiToken;


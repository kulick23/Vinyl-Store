import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
}

const initialState: AuthState = {
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken')
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      { payload }: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.accessToken = payload.accessToken
      state.refreshToken = payload.refreshToken
      localStorage.setItem('accessToken', payload.accessToken)
      localStorage.setItem('refreshToken', payload.refreshToken)
    },
    clearCredentials: state => {
      state.accessToken = null
      state.refreshToken = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
  }
})

export const { setCredentials, clearCredentials } = authSlice.actions
export default authSlice.reducer
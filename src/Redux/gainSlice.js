import { createSlice } from '@reduxjs/toolkit'
import { getGainData } from '../database/Database'

export const fetchGainData = () => {
  return async (dispatch) => {
    try {
      const gainDataSnap = await getGainData()
      dispatch(setGainData(gainDataSnap))
    } catch (error) {
      console.error(error)
    }
  }
}

export const gainSlice = createSlice({
  name: 'gain',
  initialState: {
    gainData: null,
  },
  reducers: {
    setGainData: (state, action) => {
      state.gainData = action.payload
    },
  },
})

export const { setGainData } = gainSlice.actions
export const selectGainData = (state) => state.gain.gainData
export default gainSlice.reducer

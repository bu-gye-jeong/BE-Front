import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ISaveState {
  unlockedElements: number[];
}

export const initialState = {
  unlockedElements: [1, 2, 3, 4],
} as ISaveState;

const saveSlice = createSlice({
  name: "save",
  initialState,
  reducers: {
    unlockElement(state, action: PayloadAction<number>) {
      if (!state.unlockedElements.includes(action.payload))
        state.unlockedElements.push(action.payload);
    },
  },
});

export const { unlockElement } = saveSlice.actions;

export default saveSlice.reducer;

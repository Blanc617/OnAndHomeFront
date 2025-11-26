import { createSlice } from "@reduxjs/toolkit";

const compareSlice = createSlice({
  name: "compare",
  initialState: {
    items: [],
  },
  reducers: {
    addToCompare: (state, action) => {
      if (state.items.length < 4) {
        const exists = state.items.find(
          (item) => item.id === action.payload.id
        );
        if (!exists) {
          state.items.push(action.payload);
        }
      }
    },
    removeFromCompare: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCompare: (state) => {
      state.items = [];
    },
  },
});

export const { addToCompare, removeFromCompare, clearCompare } =
  compareSlice.actions;
export default compareSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const initialState = {
  open: false,
  realize: false,
};

export const saveDocumentDialogSlice = createSlice({
  name: 'saveDocumentDialog',
  initialState,
  reducers: {
    setDialogIsOpen: (state, action) => {
      state.open = action.payload;
    },
    
    setDialogIsRealize: (state, action) => {
      state.realize = action.payload;
    },

    resetSaveDocumentDialog: (state) => {
      state = initialState;
    },
    
    // Special reducer for hydrating the state
    extraReducers: {
      [HYDRATE]: (state, action) => {
        return {
          ...state,
          ...action.payload.view,
        };
      },
    },
  },
});

export const {
  setDialogIsOpen,
  setDialogIsRealize,
  resetSaveDocumentDialog,
} = saveDocumentDialogSlice.actions;

export const getSaveDocumentDialogIsOpenState = (state) => state.saveDocumentDialog.open;
export const getSaveDocumentDialogIsRealizeState = (state) => state.saveDocumentDialog.realize;

export default saveDocumentDialogSlice.reducer;
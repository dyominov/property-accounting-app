import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import documentValidation from '../../form-validation-rules/document';

const defaultDocument = {
  type: null,
  number: '',
  date: new Date().toISOString(),
};

export const initialState = {
  header: defaultDocument,
};

export const documentHeaderSlice = createSlice({
  name: 'documentHeader',
  initialState,
  reducers: {
    updateDocument: (state, action) => {
      const { name, value } = action.payload;

      if (documentValidation[name] && value) {
        if (documentValidation[name].length) {
          if ((name.localeCompare('type') === 0) && (value.id === 0)) {
            if (value.title.length > documentValidation[name].length) return;
          }
          
          if (value.length > documentValidation[name].length) return;
        }
      }
      state.header[name] = value;
    },

    resetDocumentHeader:(state) => {
      state.header =  {...initialState.header};
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

export const { resetDocumentHeader, updateDocument, } = documentHeaderSlice.actions;
export const getDocumentHeaderState = (state) => state.documentHeader.header;

export default documentHeaderSlice.reducer;
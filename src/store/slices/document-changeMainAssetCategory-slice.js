import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

export const initialState = {
  category: 1,
  mainAssets: [],
};

export const documentChangeMainAssetCategorySlice = createSlice({
  name: 'documentChangeMainAssetCategory',
  initialState,
  reducers: {
    decrement: (state, action) => {
      const {id} = action.payload;

      const idx = state.mainAssets.findIndex((ma => ma.id === id));
      const list = [...state.mainAssets];
      list.splice(idx, 1);
      state.mainAssets = list;
    },
    addMainAssets: (state, action) => {
      const ids = action.payload;
      state.mainAssets = [...ids];
    },
    removeMainAssets: (state, action) => {
      const idx = action.payload;
      const list = [...state.mainAssets];
      list.splice(idx, 1);
      state.mainAssets = list;
    },
    updateCategory: (state, action) => {
      const { value } = action.payload;
      state.category = value;
    },

    resetChangedCategory:(state) => {
      state.category =  initialState.category;
      state.mainAssets =  [...initialState.mainAssets];
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
  addMainAssets, 
  removeMainAssets,  
  updateCategory, 
  resetChangedCategory,
  decrement,
} = documentChangeMainAssetCategorySlice.actions;

export const getChangedCategoryMainAssetsState = (state) => state.documentChangeMainAssetCategory.mainAssets;
export const getChangedCategoryState = (state) => state.documentChangeMainAssetCategory.category;
export const getChangedCategoryFullState = (state) => ({
  category: state.documentChangeMainAssetCategory.category,
  mainAssets: state.documentChangeMainAssetCategory.mainAssets,
});

export default documentChangeMainAssetCategorySlice.reducer;
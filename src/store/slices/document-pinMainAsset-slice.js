import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const defaultHolder = {
  name: '',
  notSystemUnit: '',
  phone: '',
  location: '',
  extraInfo: '',
};

export const initialState = {
  holder: defaultHolder,
  mainAssets: [],
};

export const documentPinMainAssetSlice = createSlice({
  name: 'documentPinMainAsset',
  initialState,
  reducers: {
    addMainAssets: (state, action) => {
      const ids = action.payload;
      state.mainAssets = [...ids];
    },
    removeMainAsset: (state, action) => {
      const idx = action.payload;
      const list = [...state.mainAssets];
      list.splice(idx, 1);
      state.mainAssets = list;
    },
    updateHolder: (state, action) => {
      const {name, value} = action.payload;
      state.holder[name] = value;
    },

    resetPinnedMainAssets:(state) => {
      state.holder =  {...initialState.holder};
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

export const { addMainAssets, removeMainAsset, updateHolder, resetPinnedMainAssets } = documentPinMainAssetSlice.actions;
export const getPinnedMainAssetsState = (state) => state.documentPinMainAsset.mainAssets;
export const getHolderState = (state) => state.documentPinMainAsset.holder;
export const getFullState = (state) => ({
  holder: state.documentPinMainAsset.holder,
  mainAssets: state.documentPinMainAsset.mainAssets,
});

export default documentPinMainAssetSlice.reducer;
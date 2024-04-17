import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const initialState = {
  mainAssets: [],
  pinnedMainAssets: [],
  transferredSupply:[],
  changeCategory:[],
  stockpile: [],
  documents: [],
  operations: [],
};

export const selectedDataSlice = createSlice({
  name: 'selectedData',
  initialState,
  reducers: {
    setSelectedMainAssets: (state, action) => {
      state.mainAssets = [
        ...action.payload
      ];
    },
    setSelectedPinnedMainAssets: (state, action) => {
      state.pinnedMainAssets = [
        ...action.payload
      ];
    },
    setSelectedTransferredSupply: (state, action) => {
      state.transferredSupply = [
        ...action.payload
      ];
    },
    setSelectedChangeCategory: (state, action) => {
      state.changeCategory = [
        ...action.payload
      ];
    },
    setSelectedStockpile: (state, action) => {
      state.stockpile = [
        ...action.payload
      ];
    },
    setSelectedDocuments: (state, action) => {
      state.documents = [
        ...action.payload
      ];
    },
    setSelectedOperations: (state, action) => {
      state.operations = [
        ...action.payload
      ];
    },
    resetSelect: (state) => {
      state.documents = initialState.documents;
      state.mainAssets = initialState.mainAssets;
      state.operations = initialState.operations;
      state.pinnedMainAssets = initialState.pinnedMainAssets;
      state.stockpile = initialState.stockpile;
      state.transferredSupply = initialState.transferredSupply;
      state.changeCategory = initialState.changeCategory;
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
  setSelectedMainAssets, 
  setSelectedPinnedMainAssets, 
  setSelectedTransferredSupply, 
  setSelectedChangeCategory,
  setSelectedStockpile, 
  setSelectedDocuments, 
  setSelectedOperations,
  resetSelect,
} = selectedDataSlice.actions;

export const getMainAssetsSelectedDataState = (state) => state.selectedData.mainAssets;
export const getPinnedMainAssetsSelectedDataState = (state) => state.selectedData.pinnedMainAssets;
export const getTransferredSupplySelectedDataState = (state) => state.selectedData.transferredSupply;
export const getChangeCategorySelectedDataState = (state) => state.selectedData.changeCategory;
export const getStockpileSelectedDataState = (state) => state.selectedData.stockpile;
export const getDocumentsSelectedDataState = (state) => state.selectedData.documents;
export const getOperationsSelectedDataState = (state) => state.selectedData.operations;
export const getAppMenuSelectedDataState = (state) => ({
  '/main-assets': state.selectedData.mainAssets,
  '/stockpile': state.selectedData.stockpile,
});

export default selectedDataSlice.reducer;
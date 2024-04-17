import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const defaultHolder = {
  name: '',
};

export const initialState = {
  holder: defaultHolder,
  mainAssets: [],
  stockpile: {},
};

export const documentTransferSupplySlice = createSlice({
  name: 'documentTransferSupply',
  initialState,
  reducers: {
    decrement: (state, action) => {
      const {id, type} = action.payload;

      switch (type) {
        case 'ma': {
          const idx = state.mainAssets.findIndex((ma => ma.id === id));
          const list = [...state.mainAssets];
          list.splice(idx, 1);
          state.mainAssets = list;
        }
          break;
        case 's': {
          const list = state.stockpile;
          delete list[id];
          state.stockpile = list;
        }
          break;
        default:
          break;
      }
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
    addStockpile: (state, action) => {
      const values = action.payload;

      state.stockpile = {...values};
    },
    updateHolder: (state, action) => {
      const {name, value} = action.payload;
      state.holder[name] = value;
    },

    resetTransferedSupply:(state) => {
      state.holder =  {...initialState.holder};
      state.mainAssets =  [...initialState.mainAssets];
      state.stockpile =  {...initialState.stockpile};
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
  addStockpile, 
  updateHolder, 
  resetTransferedSupply,
  decrement,
} = documentTransferSupplySlice.actions;
export const getTransferredMainAssetsState = (state) => state.documentTransferSupply.mainAssets;
export const getTransferredStockpileState = (state) => state.documentTransferSupply.stockpile;
export const getTransferHolderState = (state) => state.documentTransferSupply.holder;
export const getFullState = (state) => ({
  holder: state.documentTransferSupply.holder,
  mainAssets: state.documentTransferSupply.mainAssets,
  stockpile: state.documentTransferSupply.stockpile,
});

export default documentTransferSupplySlice.reducer;
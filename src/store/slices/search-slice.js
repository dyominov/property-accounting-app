import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const initialState = {
  mainAssets: {
    expr: '',
    options: {
      searchByColumns: {
        title: true,
        group: true,
        dateOfManufacture: true,
        dateOfStartOperation: true,
        inventoryNumber: true,
        serialNumber: true,
        category: true,
        integer: true,
        cost: true,
        aowat: true,
      },
      matchCase: false,
    }
  },
  stockpile: {
    expr: '',
    options: {
      searchByColumns: {
        title: true,
        group: true,
        dateOfManufacture: true,
        serialNumber: true,
        integer: true,
        cost: true,
        actualAmount: true,
        balanceAmount: true,
      },
      matchCase: false,
    }
  },
  document: {
    expr: '',
    options: {
      searchByColumns: {
        type: true,
        number: true,
        date: true,
        realizedAt: true,
        user: true,
      },
      matchCase: false,
    }
  },
  operations: {
    expr: '',
    options: {
      searchByColumns: {
        title: true,
        type: true,
        rowType: true,
        document: true,
        date: true,
        inventoryNumber: true,
        serialNumber: true,
        cost: true,
        user: true,
      },
      matchCase: false,
    }
  },
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setMainAssetsOptions: (state, action) => {
      state.mainAssets.options = {
        ...state.mainAssets.options,
        ...action.payload
      };
    },
    setMainAssetsExpr: (state, action) => {
      state.mainAssets.expr = action.payload;
    },
    setStockpileOptions: (state, action) => {
      state.stockpile.options = {
        ...state.stockpile.options,
        ...action.payload
      };
    },
    setStockpileExpr: (state, action) => {
      state.stockpile.expr = action.payload;
    },
    setDocumentsOptions: (state, action) => {
      state.document.options = {
        ...state.document.options,
        ...action.payload
      };
    },
    setDocumentsExpr: (state, action) => {
      state.document.expr = action.payload;
    },
    setOperationsOptions: (state, action) => {
      state.operations.options = {
        ...state.operations.options,
        ...action.payload
      };
    },
    setOperationsExpr: (state, action) => {
      state.operations.expr = action.payload;
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
  setMainAssetsOptions,
  setMainAssetsExpr,
  setStockpileOptions,
  setStockpileExpr,
  setDocumentsOptions,
  setDocumentsExpr,
  setOperationsOptions,
  setOperationsExpr,
} = searchSlice.actions;

export const getMainAssetsExprState = (state) => state.search.mainAssets.expr;
export const getMainAssetsOptionsState = (state) => state.search.mainAssets.options;
export const getMainAssetsSearchState = (state) => state.search.mainAssets;

export const getStockpileExprState = (state) => state.search.stockpile.expr;
export const getStockpileOptionsState = (state) => state.search.stockpile.options;
export const getStockpileSearchState = (state) => state.search.stockpile;

export const getDocumentsExprState = (state) => state.search.document.expr;
export const getDocumentsOptionsState = (state) => state.search.document.options;
export const getDocumentsSearchState = (state) => state.search.document;

export const getOperationsExprState = (state) => state.search.operations.expr;
export const getOperationsOptionsState = (state) => state.search.operations.options;
export const getOperationsSearchState = (state) => state.search.operations;

export default searchSlice.reducer;
import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { searchSlice } from "./slices/search-slice";
import { selectedDataSlice } from "./slices/selected-data-slice";
import { saveDocumentDialogSlice } from "./slices/save-document-dialog-slice";
import { documentHeaderSlice } from "./slices/document-header-slice";
import { documentAddSupplySlice } from "./slices/document-addSupply-slice";
import { documentPinMainAssetSlice } from "./slices/document-pinMainAsset-slice";
import { documentTransferSupplySlice } from "./slices/document-transferSupply-slice";
import { documentChangeMainAssetCategorySlice } from "./slices/document-changeMainAssetCategory-slice";

import { create } from 'zustand';

const makeStore = () =>
  configureStore({
    reducer: {
      [searchSlice.name]: searchSlice.reducer,
      [selectedDataSlice.name]: selectedDataSlice.reducer,
      [saveDocumentDialogSlice.name]: saveDocumentDialogSlice.reducer,
      [documentHeaderSlice.name]: documentHeaderSlice.reducer,
      [documentAddSupplySlice.name]: documentAddSupplySlice.reducer,
      [documentPinMainAssetSlice.name]: documentPinMainAssetSlice.reducer,
      [documentTransferSupplySlice.name]: documentTransferSupplySlice.reducer,
      [documentChangeMainAssetCategorySlice.name]: documentChangeMainAssetCategorySlice.reducer,
    },
    devTools: true,
  });

export const wrapper = createWrapper(makeStore);

export const useScanStore = create((set) => ({
  scans: [],
  setScans: (scans) => set((state) => ({ scans: [...scans] })),
}));

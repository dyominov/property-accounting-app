import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import groupValidation from '../../form-validation-rules/group';
import mainAssetValidation from '../../form-validation-rules/main-asset';
import stockpileValidation from '../../form-validation-rules/stockpile';
import MainAsset from '../../classes/main-asset';
import Stockpile from '../../classes/stockpile';

const updateMainAssetFn = (objects, updateInfo) => {
  const { idx, name, value } = updateInfo;
  const updateObj = MainAsset.fromString(objects[idx]);

  switch (name) {
    case 'title':
      if (value.length > mainAssetValidation.title.length) {
        break;
      }
      updateObj.title = value;
      break;
    case 'group':
      if (value && value.id === 0 && value.title.length > groupValidation.length) {
        break;
      }

      updateObj.group = value;
      break;
    case 'inventoryNumber':
      if (value.length > mainAssetValidation.inventoryNumber.length) {
        break;
      }

      updateObj.inventoryNumber = value;
      break;
    case 'serialNumber':
      if (value.length > mainAssetValidation.serialNumber.length) {
        break;
      }

      updateObj.serialNumber = value;
      break;
    case 'category':
      updateObj.category = value;
      break;
    case 'integer':
      updateObj.integer = value;
      break;
    case 'cost':
      updateObj.cost = value;
      break;
    case 'dateOfManufacture':
      updateObj.dateOfManufacture = value;
      break;
    case 'dateOfStartOperation':
      updateObj.dateOfStartOperation = value;
      break;
    default:
      break;
  }

  objects[idx] = updateObj.toString();
  // console.log(objects[idx], 'TTTEST')
  return objects;
};

const updateStockpileFn = (objects, updateInfo) => {
  const { idx, name, value } = updateInfo;
  const updateObj = Stockpile.fromString(objects[idx]);

  switch (name) {
    case 'title':
      if (value.length > stockpileValidation.title.length) {
        break;
      }

      updateObj.title = value;
      break;
    case 'group':
      if (value && value.id === 0 && value.title.length > groupValidation.length) {
        break;
      }

      updateObj.group = value;
      break;
    case 'serialNumber':
      if (value.length > mainAssetValidation.serialNumber.length) {
        break;
      }

      updateObj.serialNumber = value;
      break;
    case 'balanceAmount':
      updateObj.balanceAmount = value;
      break;
    case 'actualAmount':
      updateObj.actualAmount = value;
      break;
    case 'integer':
      updateObj.integer = value;
      break;
    case 'cost':
      updateObj.cost = value;
      break;
    case 'dateOfManufacture':
      updateObj.dateOfManufacture = value;
      break;
    default:
      break;
  }

  objects[idx] = updateObj.toString();
  return objects;
};

export const initialState = {
  objects: [(new MainAsset()).toString()],
};

export const documentAddSupplySlice = createSlice({
  name: 'documentAddSupply',
  initialState,
  reducers: {
    increment: (state) => {
      state.objects = [...state.objects, (new MainAsset()).toString()];
    },
    decrement: (state, action) => {
      const idx = action.payload;
      const list = [...state.objects];
      list.splice(idx, 1);
      state.objects = list;
    },
    updateMainAsset: (state, action) => {
      const updateInfo = action.payload;
      state.objects = updateMainAssetFn([...state.objects], updateInfo);
    },
    updateStockpile: (state, action) => {
      const updateInfo = action.payload;
      state.objects = updateStockpileFn([...state.objects], updateInfo);
    },
    updateObjectType: (state, action) => {
      const { idx, type } = action.payload;
      const list = [...state.objects];

      switch (type) {
        case 'mainAsset':
          list[idx] = (new MainAsset()).toString();
          break;
        case 'stockpile':
          list[idx] = (new Stockpile()).toString();
          break;
        default:
          break;
      }

      state.objects = list;
    },

    resetAddedSupply: (state) => {
      state.objects = [...initialState.objects];
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

export const { increment, decrement, resetAddedSupply, updateMainAsset, updateStockpile, updateObjectType, updateDocumentFull } = documentAddSupplySlice.actions;
export const getObjectsState = (state) => state.documentAddSupply.objects;

export default documentAddSupplySlice.reducer;
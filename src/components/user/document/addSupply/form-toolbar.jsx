import NextLink from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Toolbar as MuiToolbar,
} from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import CloseIcon from '@mui/icons-material/Close';
import moment from 'moment';
import UserMenu from '../../../user-menu';
import { getDocumentHeaderState } from '@/store/slices/document-header-slice';
import { getObjectsState } from '@/store/slices/document-addSupply-slice';
import { fetchGet } from '@/utils/fetchFns';
import { errorMessage } from '@/utils/message';
import { useState } from 'react';
import ConfirmDialog from '../../../global/confirm-dialog';
import { setDialogIsRealize, setDialogIsOpen } from '../../../../store/slices/save-document-dialog-slice';
import MainAsset from '../../../../classes/main-asset';
import Stockpile from '../../../../classes/stockpile';

const DATE_FORMAT = process.env.DATE_FORMAT;

const formValidator = async (form) => {
  const { header: document, objects } = form;

  const isDocumetTypeEmpty = !document.type || document.type === '';
  const isDocumentNumberEmpty = document.number === '';

  if (isDocumetTypeEmpty) {
    errorMessage('Тип документу не задано');
    return false;
  }
  if (isDocumentNumberEmpty) {
    errorMessage('Номер документу не задано');
  }

  const { data, isError } = await fetchGet(`/api/GET/document/add-supply?type=${document.type}&number=${document.number}&date=${document.date}`);
  if (data) {
    errorMessage(`${data.type.title} №${data.number} від ${moment(data.date).format(DATE_FORMAT)} уже існує`);
    return false;
  }
  if (isError) {
    errorMessage(isError.message);
    return false;
  }

  if (isDocumentNumberEmpty || isDocumetTypeEmpty) return false;

  const objectsValidation = objects.map((item, idx) => {
    if (MainAsset.isMainAsset(item)) {
      const mainAsset = MainAsset.fromString(item);

      const isTitleEmpty = mainAsset.title === '';
      const isCategoryEmpty = !mainAsset.category || mainAsset.category === '';
      const isIntegerEmpty = !mainAsset.integer || mainAsset.integer === '';
      const isCostEmpty = mainAsset.cost === '';
      const isDateOfManufactureEmpty = !mainAsset.dateOfManufacture;

      if (isTitleEmpty) {
        errorMessage(`Найменування ОЗ №${idx + 1} не задано`);
      }
      if (isCategoryEmpty) {
        errorMessage(`Категорію ОЗ №${idx + 1} не задано`);
      }
      if (isIntegerEmpty) {
        errorMessage(`Одиницю вимірювання ОЗ №${idx + 1} не задано`);
      }
      if (isCostEmpty) {
        errorMessage(`Вартість ОЗ №${idx + 1} не задано`);
      }
      if (isDateOfManufactureEmpty) {
        errorMessage(`Дату виготовлення ОЗ №${idx + 1} не задано`);
      }

      if (isTitleEmpty || isCategoryEmpty || isIntegerEmpty || isCostEmpty || isDateOfManufactureEmpty) return false;
      else return true;

    } else {
      const stockpile = Stockpile.fromString(item);

      const isTitleEmpty = stockpile.title === '';
      const isIntegerEmpty = !stockpile.integer || stockpile.integer === '';
      const isBalanceAmountEmpty = stockpile.balanceAmount === 0;
      const isActualAmountEmpty = stockpile.actualAmount === 0;
      const isCostEmpty = stockpile.cost === '';
      const isDateOfManufactureEmpty = !stockpile.dateOfManufacture;

      if (isTitleEmpty) {
        errorMessage(`Найменування Запасів №${idx + 1} не задано`);
      }
      if (isBalanceAmountEmpty) {
        errorMessage(`Балансову кількість Запасів №${idx + 1} не задано`);
      }
      if (isActualAmountEmpty) {
        errorMessage(`Фактичну кількість Запасів №${idx + 1} не задано`);
      }
      if (isIntegerEmpty) {
        errorMessage(`Одиницю вимірювання Запасів №${idx + 1} не задано`);
      }
      if (isCostEmpty) {
        errorMessage(`Вартість Запасів №${idx + 1} не задано`);
      }
      if (isDateOfManufactureEmpty) {
        errorMessage(`Дату виготовлення Запасів №${idx + 1} не задано`);
      }

      if (isTitleEmpty || isIntegerEmpty || isCostEmpty || isDateOfManufactureEmpty || isBalanceAmountEmpty || isActualAmountEmpty) return false;
      else return true;
    }
  });

  if (objectsValidation.some(obj => !obj)) return false;

  return true;
};

function FormToolbar() {
  const dispatch = useDispatch();
  const header = useSelector(getDocumentHeaderState);
  const objects = useSelector(getObjectsState);

  const document = { header, objects };
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const handleSaveClick = () => {
    formValidator(document)
      .then(isFormValid => {
        if (isFormValid) {
          dispatch(setDialogIsOpen(true));
          dispatch(setDialogIsRealize(false));
        }
      });
  };
  const handleSaveAndRealizeClick = () => {
    formValidator(document)
      .then(isFormValid => {
        if (isFormValid) {
          setOpenConfirmDialog(true);
        }

      });
  };

  const handleCloseConfirmDialog = (newConfirmStatus) => {
    setOpenConfirmDialog(false);

    if (newConfirmStatus) {
      dispatch(setDialogIsOpen(true));
      dispatch(setDialogIsRealize(true));
    }
  };

  return (
    <AppBar position="fixed" color="secondary" enableColorOnDark>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <MuiToolbar disableGutters >
            <NextLink
              href='/'
              passHref
            >
              <IconButton title="Скасувати" color="toolbarIcons">
                <CloseIcon sx={{ fontSize: 28 }} />
              </IconButton>
            </NextLink>
            <IconButton title="Зберегти" color="toolbarIcons" onClick={handleSaveClick}>
              <BookmarkIcon sx={{ fontSize: 28 }} />
            </IconButton>
            <IconButton title="Зберегти і провести" color="toolbarIcons" onClick={handleSaveAndRealizeClick}>
              <BookmarkAddedIcon sx={{ fontSize: 28 }} />
            </IconButton>
          </MuiToolbar>
          <UserMenu />
        </Box>
        <ConfirmDialog
          keepMounted
          open={openConfirmDialog}
          onClose={handleCloseConfirmDialog}
        />
      </Container>
    </AppBar>
  );
}
export default FormToolbar;
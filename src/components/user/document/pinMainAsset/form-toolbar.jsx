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
import { fetchGet } from '@/utils/fetchFns';
import { errorMessage } from '@/utils/message';
import { getHolderState, getPinnedMainAssetsState } from '../../../../store/slices/document-pinMainAsset-slice';
import ConfirmDialog from '../../../global/confirm-dialog';
import { useState } from 'react';
import { setDialogIsRealize, setDialogIsOpen } from '../../../../store/slices/save-document-dialog-slice';

const DATE_FORMAT = process.env.DATE_FORMAT;

const formValidator = async (form) => {
  const { header: document, holder, pinnedMainAssets } = form;

  const isDocumetTypeEmpty = !document.type || document.type === '';
  const isDocumentNumberEmpty = document.number === '';

  if (isDocumetTypeEmpty) {
    errorMessage('Тип документу не задано');
    return false;
  }
  if (isDocumentNumberEmpty) {
    errorMessage('Номер документу не задано');
  }

  const { data, isError } = await fetchGet(`/api/GET/document/pin-ma?type=${document.type}&number=${document.number}&date=${document.date}`);
  if (data) {
    errorMessage(`${data.type.title} №${data.number} від ${moment(data.date).format(DATE_FORMAT)} уже існує`);
    return false;
  }
  if (isError) {
    errorMessage(isError.message);
    return false;
  }

  let isHolderNameEmpty = !holder.name || holder.name === '';
  let isHolderLocationEmpty = !holder.location || holder.location === '';

  if (isHolderNameEmpty) {
    errorMessage('Прізвище, ім`я, по-батькові одержувача не задано');
  }
  if (isHolderLocationEmpty) {
    errorMessage('Місце знаходження одержувача не задано');
  }

  const isMainAssetListEmpty = !pinnedMainAssets || pinnedMainAssets.length === 0;
  if (isMainAssetListEmpty) {
    errorMessage('Виберіть хоча б один ОЗ');
  }

  if (isDocumentNumberEmpty || isDocumetTypeEmpty || isHolderNameEmpty || isHolderLocationEmpty || isMainAssetListEmpty) return false;

  return true;
};

function FormToolbar() {
  const dispatch = useDispatch();
  const header = useSelector(getDocumentHeaderState);
  const holder = useSelector(getHolderState);
  const pinnedMainAssets = useSelector(getPinnedMainAssetsState);
  const document = { header, holder, pinnedMainAssets };

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
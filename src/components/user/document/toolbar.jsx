import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
  AppBar,
  Box,
  Container,
  Divider,
  IconButton,
  TextField,
  Toolbar as MuiToolbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import PushPinIcon from '@mui/icons-material/PushPin';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import RemoveIcon from '@mui/icons-material/Remove';
import SearchIcon from '@mui/icons-material/Search';
import SearchOptionsDialog from './search-options-dialog';
import SettingsIcon from '@mui/icons-material/Settings';
import { setDocumentsExpr, getDocumentsExprState } from '@/store/slices/search-slice';
import { getDocumentsSelectedDataState } from '@/store/slices/selected-data-slice';
import { errorMessage } from '@/utils/message';
import { fetchGet, fetchPatch } from '@/utils/fetchFns';
import ConfirmDialog from '../../global/confirm-dialog';
import ExcelIcon from '../../../svg/excel';
import DbIcon from '../../../svg/db';

const countByRealized = async (selected) => {
  const response = await fetchGet('/api/GET/documents/is-realized', selected);

  if (!response.isError) return response.data;
  else return null;
};

function Toolbar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const selected = useSelector(getDocumentsSelectedDataState);
  const [disableRealizeBtn, setDisableRealizedBtn] = useState(true);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  useEffect(() => {
    countByRealized(selected)
      .then((response) => {
        if (response) {
          const { isRealized } = response;
          setDisableRealizedBtn(isRealized);
        } else {
          setDisableRealizedBtn(true);
        }
      });
  }, [selected]);

  const [openSearchOptionsDialog, setOpenSearchOptionsDialog] = useState(false);
  const searchExpr = useSelector(getDocumentsExprState);

  const handleClickSearchOptionsDialogkOpen = () => {
    setOpenSearchOptionsDialog(true);
  };

  const handleSearchExprChange = (event) => {
    const { value } = event.target;
    dispatch(setDocumentsExpr(value));
  };
  const handleSearchOptionsDialogClose = () => {
    setOpenSearchOptionsDialog(false);
  };


  const handleClickRealize = () => {
    setOpenConfirmDialog(true);

  };

  const handleCloseConfirmDialog = (newConfirmStatus) => {
    setOpenConfirmDialog(false);

    if (newConfirmStatus) {
      fetchPatch(`/api/PATCH/documents/realize`, selected)
        .then(response => {
          if (response.isError) {
            errorMessage(response.isError.message);
            return;
          }
        });

      router.reload(window.location.pathname);
    }
  };

  return (
    <AppBar position="static" color="secondary" enableColorOnDark>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <MuiToolbar disableGutters >
            <NextLink
              href='/document/add-supply'
              passHref
            >
              <IconButton title="Додати" color="toolbarIcons">
                <AddIcon sx={{ fontSize: 28 }} />
              </IconButton>
            </NextLink>
            <IconButton title="Провести" color="toolbarIcons" disabled={disableRealizeBtn} onClick={handleClickRealize}>
              <CheckIcon sx={{ fontSize: 28 }} />
            </IconButton>
            {/* <Divider orientation="vertical" flexItem sx={{ bgcolor: (theme) => theme.palette.secondary }} /> */}
            <NextLink
              href='/document/change-ma-category'
              passHref
            >
              <IconButton title="Зміна стану обладнання" color="toolbarIcons">
                <ImportExportIcon sx={{ fontSize: 28 }} />
              </IconButton>
            </NextLink>
            {/* <Divider orientation="vertical" flexItem sx={{ bgcolor: (theme) => theme.palette.secondary }} /> */}
            <NextLink
              href='/document/pin-ma'
              passHref
            >
              <IconButton title="Закріпити обладнання" color="toolbarIcons">
                <PushPinIcon sx={{ fontSize: 28 }} />
              </IconButton>
            </NextLink>

            <IconButton title="Вилучити елемент обладнання" color="toolbarIcons">
              <RemoveIcon sx={{ fontSize: 28 }} />
            </IconButton>
            <NextLink
              href='/document/transfer-supply'
              passHref
            >
              <IconButton title="Передати обладнання" color="toolbarIcons">
                <TransferWithinAStationIcon sx={{ fontSize: 28 }} />
              </IconButton>
            </NextLink>
            <IconButton title="Імпорт з Excel" color="toolbarIcons">
              <ExcelIcon />
            </IconButton>
            <IconButton title="Експорт даних" color="toolbarIcons">
              <DbIcon />
            </IconButton>
          </MuiToolbar>
          <Box sx={{
            display: 'flex', alignItems: 'flex-end', '*': {
              color: '#ffffff',
            },
          }}>
            <SearchIcon sx={{ color: 'action.active', mr: 1, my: 1 }} />
            <TextField
              id="input-with-sx"
              label="Пошук..."
              variant="standard"
              color="text"
              value={searchExpr}
              onChange={handleSearchExprChange}
              sx={{
                mb: 1,
                '*': {
                  color: 'rgba(255, 255, 255, 0.74)',
                },
                '&.MuiTextField-root': {
                  '& :before': {
                    borderBottom: '1px solid rgba(255, 253, 0, 0.62)',

                  },
                },
                '&.MuiTextField-root:hover': {
                  '& :before': {
                    borderBottom: '2px solid rgba(255, 253, 0, 0.62) !important',
                  }
                },
              }}
            />
            <IconButton onClick={handleClickSearchOptionsDialogkOpen} aria-label="search-settings">
              <SettingsIcon />
            </IconButton>
            <SearchOptionsDialog
              open={openSearchOptionsDialog}
              onClose={handleSearchOptionsDialogClose}
            />
            <ConfirmDialog
              keepMounted
              open={openConfirmDialog}
              onClose={handleCloseConfirmDialog}
            />
          </Box>
        </Box>
      </Container>
    </AppBar>
  );
}
export default Toolbar;
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NextLink from 'next/link';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  TextField,
  Toolbar as MuiToolbar,
} from '@mui/material';
import PushPinIcon from '@mui/icons-material/PushPin';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import RemoveIcon from '@mui/icons-material/Remove';
import SearchIcon from '@mui/icons-material/Search';
import SearchOptionsDialog from './search-options-dialog';
import SettingsIcon from '@mui/icons-material/Settings';
import { fetchGet, fetchPatch } from '@/utils/fetchFns';
import { getMainAssetsExprState, setMainAssetsExpr } from '@/store/slices/search-slice';
import { getMainAssetsSelectedDataState } from '@/store/slices/selected-data-slice';

const isPinnedSelected = async (selected) => {
  const response = await fetchGet('/api/GET/main-assets/is-pinned', selected);

  if (response.isError) return true;

  return response.data.isPinned;
};

function Toolbar() {
  const dispatch = useDispatch();
  const selected = useSelector(getMainAssetsSelectedDataState);
  const [disablePinBtn, setDisablePinBtn] = useState(true);
  const isNoSelected = !(selected && selected.length > 0);

  const [openSearchOptionsDialog, setOpenSearchOptionsDialog] = useState(false);
  const searchExpr = useSelector(getMainAssetsExprState);

  useEffect(() => {
    isPinnedSelected(selected)
      .then((isPinned) => {
        setDisablePinBtn(isPinned);
      });
  }, [selected]);

  const handleClickSearchOptionsDialogkOpen = () => {
    setOpenSearchOptionsDialog(true);
  };

  const handleSearchExprChange = (event) => {
    const { value } = event.target;
    dispatch(setMainAssetsExpr(value));
  };
  const handleSearchOptionsDialogClose = (value) => {
    setOpenSearchOptionsDialog(false);
  };

  return (
    <AppBar position="static" color="secondary" enableColorOnDark>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <MuiToolbar disableGutters >
            <Button>Провести документ</Button>
            <IconButton title="Підвищити категорію" color="toolbarIcons" disabled={isNoSelected}>
              <KeyboardArrowUpIcon sx={{ fontSize: 28 }} />
            </IconButton>
            <IconButton title="Понизити категорію" color="toolbarIcons" disabled={isNoSelected}>
              <KeyboardArrowDownIcon sx={{ fontSize: 28 }} />
            </IconButton>
            <NextLink
              href='/document/pin-ma'
              passHref
            >
              <IconButton title="Закріпити обладнання" color="toolbarIcons" disabled={disablePinBtn}>
                <PushPinIcon sx={{ fontSize: 28 }} />
              </IconButton>
            </NextLink>

            <IconButton title="Вилучити елемент обладнання" color="toolbarIcons" disabled={isNoSelected}>
              <RemoveIcon sx={{ fontSize: 28 }} />
            </IconButton>
            <NextLink
              href='/document/transfer-supply'
              passHref
            >
              <IconButton title="Передати обладнання" color="toolbarIcons" disabled={isNoSelected}>
                <TransferWithinAStationIcon sx={{ fontSize: 28 }} />
              </IconButton>
            </NextLink>
            
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
          </Box>
        </Box>
      </Container>
    </AppBar>
  );
}
export default Toolbar;
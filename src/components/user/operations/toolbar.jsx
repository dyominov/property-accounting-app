import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Box,
  Container,
  IconButton,
  TextField,
  Toolbar as MuiToolbar,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import SearchOptionsDialog from './search-options-dialog';
import SettingsIcon from '@mui/icons-material/Settings';
import { getOperationsExprState, setOperationsExpr } from '@/store/slices/search-slice';

function Toolbar() {
  const dispatch = useDispatch();

  const [openSearchOptionsDialog, setOpenSearchOptionsDialog] = useState(false);
  const searchExpr = useSelector(getOperationsExprState);

  const handleClickSearchOptionsDialogkOpen = () => {
    setOpenSearchOptionsDialog(true);
  };

  const handleSearchExprChange = (event) => {
    const { value } = event.target;
    dispatch(setOperationsExpr(value));
  };
  const handleSearchOptionsDialogClose = (value) => {
    setOpenSearchOptionsDialog(false);
  };

  return (
    <AppBar position="static" color="secondary" enableColorOnDark>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <MuiToolbar disableGutters >

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
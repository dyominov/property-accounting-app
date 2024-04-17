import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Toolbar as MuiToolbar,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { errorMessage } from '@/utils/message';
import { fetchGet, fetchPatch } from '@/utils/fetchFns';
import { Operation } from '@prisma/client';
import ConfirmDialog from '../../../../global/confirm-dialog';

const countByRealized = async (selected) => {
  const response = await fetchGet('/api/GET/documents/is-realized', selected);

  if (!response.isError) return response.data;
  else return null;
};

function Toolbar() {
  const router = useRouter();
  const [disableRealizeBtn, setDisableRealizedBtn] = useState(true);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const { id } = router.query;

  useEffect(() => {
    countByRealized([{id, operation: Operation.CHANGE_CATEGORY }])
    .then((response)=> {
      if (response) {
        const { isRealized } = response;

        setDisableRealizedBtn(isRealized);
      } else {
        setDisableRealizedBtn(true);
      }
    });
  }, [id]);

  const handleClickRealize = () => {
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = (newConfirmStatus) => {
    setOpenConfirmDialog(false);

    if (newConfirmStatus) {
      fetchPatch(`/api/PATCH/document/change-ma-category/realize/${id}`)
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
            <IconButton title="Провести" color="toolbarIcons" disabled={disableRealizeBtn} onClick={handleClickRealize}>
              <CheckIcon sx={{ fontSize: 28 }} />
            </IconButton>
          </MuiToolbar>
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
export default Toolbar;
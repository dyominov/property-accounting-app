'use client';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';
import { Box, Container, Divider, IconButton, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { FormLayout } from '@/components/form-layout';
import useFetchGet from '@/hooks/useFetch';
import NewDocument from '@/components/user/document/newDocument';
import { useEffect, useState } from 'react';
import FormToolbar from '../../components/user/document/changeMainAssetCategory/form-toolbar';
import DataTable from '../../components/user/document/changeMainAssetCategory/data-table';
import { addMainAssets, resetChangedCategory } from '../../store/slices/document-changeMainAssetCategory-slice';
import { getDocumentHeaderState, resetDocumentHeader } from '../../store/slices/document-header-slice';
import AddDialog from '../../components/user/document/changeMainAssetCategory/add-dialog';
import { getMainAssetsSelectedDataState } from '../../store/slices/selected-data-slice';
import { resetSaveDocumentDialog } from '../../store/slices/save-document-dialog-slice';
import SelectCategory from '../../components/user/document/changeMainAssetCategory/select-category';

const Page = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetDocumentHeader());
    dispatch(resetChangedCategory());
    dispatch(resetSaveDocumentDialog());
  }, [dispatch]);

  const selectedMainAssets = useSelector(getMainAssetsSelectedDataState);

  useEffect(() => {
    dispatch(addMainAssets(selectedMainAssets));
  }, [dispatch, selectedMainAssets]);

  const header = useSelector(getDocumentHeaderState);

  const allowedTypeOptions = useFetchGet('/api/GET/document/change-ma-category/types');
  const notSystemUnitOptions = useFetchGet('/api/GET/not-system-units');

  const [openAddDialog, setOpenAddDialog] = useState(false);

  const isOptionsLoading = allowedTypeOptions.isLoading ||
    notSystemUnitOptions.isLoading;

  if (isOptionsLoading) {
    return <Typography>Loading...</Typography>;
  }

  const handleObjectAdd = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  return (
    <>
      <Head>
        <title>
          Документ
        </title>
      </Head>
      <FormToolbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Container maxWidth='false' sx={{mt: '64px'}}>
          <Box sx={{ my: 3 }}>
            <Typography variant="h3" sx={{ textAlign: 'center' }}>
              Зміна стану обладнання
            </Typography>
            <Typography variant="h4" sx={{ textAlign: 'left' }}>
              Документ
            </Typography>
            <NewDocument allowedTypes={allowedTypeOptions.data} document={header} />
            <Divider />
            <SelectCategory />
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
              <IconButton aria-label="add" color="success" onClick={handleObjectAdd}>
                <AddCircleOutlineIcon />
              </IconButton>
            </Box>
            <DataTable />
          </Box>
        </Container>
        <AddDialog
          id="add-dialog"
          keepMounted
          open={openAddDialog}
          onClose={handleCloseAddDialog}
          selected={[]}
        />
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <FormLayout returnLink='/'>
    {page}
  </FormLayout>
);

export default Page;

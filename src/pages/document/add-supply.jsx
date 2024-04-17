'use client';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';
import { Box, Container, Divider, IconButton, Snackbar, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { FormLayout } from '@/components/form-layout';
import useFetchGet from '@/hooks/useFetch';
import NewMainAsset from '@/components/user/document/addSupply/newMainAsset';
import NewStockpile from '@/components/user/document/addSupply/newStockpile';
import NewDocument from '@/components/user/document/newDocument';
import { useEffect } from 'react';
import FormToolbar from '../../components/user/document/addSupply/form-toolbar';
import { getDocumentHeaderState, resetDocumentHeader } from '../../store/slices/document-header-slice';
import { getObjectsState, increment, resetAddedSupply } from '../../store/slices/document-addSupply-slice';
import { resetSaveDocumentDialog } from '../../store/slices/save-document-dialog-slice';
import MainAsset from '../../classes/main-asset';

const Page = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetDocumentHeader());
    dispatch(resetAddedSupply());
    dispatch(resetSaveDocumentDialog());
    
  }, [dispatch]);  

  const header = useSelector(getDocumentHeaderState);
  const objectList = useSelector(getObjectsState);
  
  const allowedTypeOptions = useFetchGet('/api/GET/document/add-supply/types');
  const groupOptions = useFetchGet('/api/GET/groups');
  const categoryOptions = useFetchGet('/api/GET/categories');
  const integerOptions = useFetchGet('/api/GET/integers');

  const isOptionsLoading = allowedTypeOptions.isLoading ||
    groupOptions.isLoading ||
    categoryOptions.isLoading ||
    integerOptions.isLoading;

  if (isOptionsLoading) {
    return <Typography>Loading...</Typography>;
  }

  const handleObjectAdd = () => {
    dispatch(increment());
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
        <Container maxWidth='false' sx={{ mt: '64px' }}>
          <Box sx={{ my: 3 }}>
            <Typography variant="h3" sx={{ textAlign: 'center' }}>
              Створити
            </Typography>
            <Typography variant="h4" sx={{ textAlign: 'left' }}>
              Документ
            </Typography>
            <NewDocument allowedTypes={allowedTypeOptions.data} document={header}/>
            <Divider />
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
              <Typography variant="h4" sx={{ textAlign: 'left', mr: 2 }}>
                Об&#39;єкти
              </Typography>
              <IconButton aria-label="add" color="success" onClick={handleObjectAdd}>
                <AddCircleOutlineIcon />
              </IconButton>
            </Box>
            {objectList
              .map(singleObject => JSON.parse(singleObject))
              .map(singleObject => {
                return {
                  ...singleObject,
                  thingType: MainAsset.isMainAsset(singleObject) ? 'mainAsset' : 'stockpile',
                };
              })
              .map((singleObject, idx) => {
                if (MainAsset.isMainAsset(singleObject)) {
                  return (
                    <Box key={idx}>
                      <NewMainAsset
                        idx={idx}
                        listLength={objectList.length}
                        groups={groupOptions.data}
                        categories={categoryOptions.data}
                        integers={integerOptions.data}
                        mainAsset={singleObject}
                      />
                      <Divider />
                    </Box>
                  );
                } else {
                  return (
                    <Box key={idx}>
                      <NewStockpile
                        idx={idx}
                        listLength={objectList.length}
                        groups={groupOptions.data}
                        integers={integerOptions.data}
                        stockpile={singleObject}
                      />
                      <Divider />
                    </Box>
                  );
                }
              })
            }
          </Box>
        </Container>
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

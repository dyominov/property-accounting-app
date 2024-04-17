'use client';
import Head from 'next/head';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import { Box, Container, ImageList, ImageListItem, Typography } from '@mui/material';
import { DashboardLayout } from '@/components/dashboard-layout';
import Toolbar from '@/components/user/document/addSupply/view/toolbar';
import { Stack } from '@mui/system';
import DataTableMainAssets from '@/components/user/document/addSupply/view/data-table-main-assets';
import DataTableStockpile from '@/components/user/document/addSupply/view/data-table-stockpile';
import { fetchGet } from '@/utils/fetchFns';
import { DocumentStatus, Operation } from '@prisma/client';

const DATE_FORMAT = process.env.DATE_FORMAT;
const BASE_URL = process.env.BASE_URL;

const Page = () => {
  const session = useSession();
  const router = useRouter();
  const { id } = router.query;

  const [data, setData] = useState(null);
  const [scanData, setScanData] = useState([]);

  useEffect(() => {
    fetchGet(`/api/GET/document/add-supply/${id}`)
      .then(({ data }) => {
        setData(data);

        fetchGet(`/api/GET/document/add-supply/${id}/scans`)
          .then(({ data }) => {
            setScanData(data);
          });
      });

  }, [id]);

  
  useEffect(() => {
    if (session.status === 'unauthenticated') {
      Router.replace('/login');
    }
  }, [session.status]);

  if (session.status === 'authenticated' && data) return (
    <>
      <Head>
        <title>
          Документ
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Toolbar />
        <Container maxWidth='false' sx={{ height: '90%' }}>
          <Box sx={{ my: 3, height: '98%' }}>
            <Typography variant="h3" sx={{ textAlign: 'center' }}>
              {`${data.type.docType.title} №${data.number} від ${moment(data.date).format(DATE_FORMAT)}`}
            </Typography>
            <Typography variant="h5" sx={{ textAlign: 'center' }}>
              Додавання матеріальних цінностей
            </Typography>
            <Stack>
              <Typography variant="body1" sx={{ textAlign: 'left' }}>
                Створив {data.creator.name} {moment(data.createdAt).format(DATE_FORMAT)}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'left' }}>
                Статус: {data.status === DocumentStatus.REALIZED ? 'Реалізовано' : 'Не реалізовано'}
              </Typography>
              {data.realizator && (
                <Typography variant="body1" sx={{ textAlign: 'left' }}>
                  Провів {data.realizator.name} {moment(data.realizedAt).format(DATE_FORMAT)}
                </Typography>
              )}
            </Stack>
            {scanData.length > 0 && (
              <Box>
                <Typography variant="h6" sx={{ textAlign: 'center' }}>
                  Скан-копії
                </Typography>
                <ImageList variant="masonry" cols={6} gap={4}>
                  {scanData.map((scan) => (
                    <ImageListItem key={scan} >
                      <img
                        src={`${BASE_URL}/api/GET/document/add-supply/${id}/scan/${scan}`}
                        srcSet={`${BASE_URL}/api/GET/document/add-supply/${id}/scan/${scan}`}
                        width={'150px'}
                        alt={`Scan ${scan}`}
                        loading='lazy'
                        decoding="async"
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Box>
            )}
            <Stack spacing={5}>
              {data.mainAssets && data.mainAssets.length > 0 && (
                <DataTableMainAssets rows={data.mainAssets} />
              )}

              {data.stockpile && data.stockpile.length > 0 && (
                <DataTableStockpile rows={data.stockpile} />
              )}
            </Stack>
          </Box>
        </Container>
      </Box>
    </>
  );

  return <Box>Loading...</Box>;
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;

'use client';
import Head from 'next/head';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import { Box, Container, ImageList, ImageListItem, Stack, Typography } from '@mui/material';
import { DashboardLayout } from '@/components/dashboard-layout';
import Toolbar from '@/components/user/document/transferSupply/view/toolbar';
import { fetchGet } from '@/utils/fetchFns';
import DataTableTransferredSupply from '@/components/user/document/transferSupply/view/data-table';
import { DocumentStatus } from '@prisma/client';

const DATE_FORMAT = process.env.DATE_FORMAT;
const BASE_URL = process.env.BASE_URL;

const Page = () => {
  const session = useSession();
  const router = useRouter();
  const { id } = router.query;

  const [data, setData] = useState(null);
  const [scanData, setScanData] = useState([]);

  useEffect(() => {
    fetchGet(`/api/GET/document/transfer-supply/${id}`)
      .then(({ data }) => {
        setData(data);

        fetchGet(`/api/GET/document/transfer-supply/${id}/scans`)
          .then(({ data }) => {
            setScanData(data);
          });
      });

  }, [id]);

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      Router.push('/401');
    }
  }, [session.status]);

  let rows = [];

  if (data) {
    const rowsMainAsset = data.mainAssets;
    const rowsStockpile = data.stockpile.map(spl => {
      return {
        ...spl.parent,
        amount: spl.amount,
      };
    });

    rows = rowsMainAsset.map(rMA => ({ ...rMA, amount: 1, type: 'ma' }))
      .concat(rowsStockpile.map(rSpl => ({ ...rSpl, type: 's' })));
  }
  
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
              Передача обладнання
            </Typography>
            <Stack>
              <Box>
                <Typography variant="body1" sx={{ textAlign: 'left' }}>
                  Створив {data.creator.name} {moment(data.createdAt).format(DATE_FORMAT)}
                </Typography>
                <Typography variant="body1" sx={{ textAlign: 'left' }}>
                  Статус: {data.status === DocumentStatus.REALIZED ? 'Реалізовано': 'Не реалізовано'}
                </Typography>
                {data.realizator && (
                  <Typography variant="body1" sx={{ textAlign: 'left' }}>
                    Провів {data.realizator.name} {moment(data.realizedAt).format(DATE_FORMAT)}
                  </Typography>
                )}
              </Box>
            </Stack>
            <Stack>
              <Typography variant="h6" sx={{ textAlign: 'center' }}>
                Дані отримувача
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'left' }}>
                Прізвище, ім&apos;я, по-батькові: {data.holder.name}
              </Typography>
              {data.holder.notSystemUnit && (
                <Typography variant="body1" sx={{ textAlign: 'left' }}>
                  Підрозділ: {data.holder.notSystemUnit.title}
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
                        src={`${BASE_URL}/api/GET/document/transfer-supply/${id}/scan/${scan}`}
                        srcSet={`${BASE_URL}/api/GET/document/transfer-supply/${id}/scan/${scan}`}
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
              <DataTableTransferredSupply rows={rows} />
            </Stack>
          </Box>
        </Container>
      </Box>
    </>
  );
  
  return <Box>Authenticate...</Box>;
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;

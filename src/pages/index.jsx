'use client';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import Router from 'next/router';
import { Box, Container } from '@mui/material';
import { DashboardLayout } from '@/components/dashboard-layout';
import Toolbar from '@/components/user/document/toolbar';

const DataTable = dynamic(
  () => import ('@/components/user/document/data-table'),
  {ssr: false}
);

const Page = () => {
  const session = useSession();

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      Router.replace('login');
    }
  }, [session.status]);

  if (session.status === 'authenticated') return (
    <>
      <Head>
        <title>
          Документи
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
            <DataTable />
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

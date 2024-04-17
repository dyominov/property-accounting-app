'use client';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { Box, Container } from '@mui/material';
import { DashboardLayout } from '@/components/dashboard-layout';
import Toolbar from '@/components/user/main-asssets/toolbar';

const DataTable = dynamic(
  () => import('@/components/user/main-asssets/data-table'),
  { ssr: false }
);

const Page = () => (
  <>
    <Head>
      <title>
        Основні засоби
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

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;

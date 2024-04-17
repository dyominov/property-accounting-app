'use client';
import Head from 'next/head';
import { Box, Container } from '@mui/material';
import { DashboardLayout } from '@/components/dashboard-layout';
import Toolbar from '@/components/user/used-supply/toolbar';

const Page = () => (
  <>
    <Head>
      <title>
        Фактично використані запаси
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
      }}
    >
      <Toolbar />
      <Container maxWidth='false'>
        <Box sx={{ my: 3 }}>
          Фактично використані запаси
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

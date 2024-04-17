'use client';
import Head from 'next/head';
import { Box, Container } from '@mui/material';
import { DashboardLayout } from '@/components/dashboard-layout';
import Toolbar from '@/components/user/fixed-main-assets/toolbar';

const Page = () => (
  <>
    <Head>
      <title>
        Закріплене обладнання
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
          Закріплене обладнання
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

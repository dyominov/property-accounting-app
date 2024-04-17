'use client';
import Head from 'next/head';
import { Box, Container } from '@mui/material';
import { DashboardLayout } from '@/components/dashboard-layout';
import Toolbar from '@/components/user/operations/toolbar';
import DataTable from '@/components/user/operations/data-table';

const Page = () => (
  <>
    <Head>
      <title>
        Операції
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

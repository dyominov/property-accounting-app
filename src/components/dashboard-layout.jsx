'use client';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AppMenu from './app-menu/app-menu';

const DashboardLayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  // flex: '1 1 auto',
  maxWidth: '100%',
}));

export const DashboardLayout = (props) => {
  const { children, session } = props;
  const { status } = useSession();
  const { push } = useRouter();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    push('/401');
  }

  return (
    <DashboardLayoutRoot>
      <Box
        sx={{
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          width: '100%'
        }}
      >
        <AppMenu />
        {children}
      </Box>
    </DashboardLayoutRoot>
  );
};

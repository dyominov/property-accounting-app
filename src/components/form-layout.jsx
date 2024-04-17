import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { resetDocumentHeader } from '../store/slices/document-header-slice';

const FormLayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  // flex: '1 1 auto',
  maxWidth: '100%',
}));

export const FormLayout = (props) => {
  const { returnLink, children } = props;
  const { status } = useSession();
  const { push } = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetDocumentHeader());
  });

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    push('/401');
  }

  return (
    <FormLayoutRoot>
      <Box
        sx={{
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          width: '100%'
        }}
      >
        
        {children}
      </Box>
    </FormLayoutRoot>
  );
};

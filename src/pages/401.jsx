'use client';
import Head from 'next/head';
import NextLink from 'next/link';
import { Box, Button, Container, Typography } from '@mui/material';

const Page = () => (
  <>
    <Head>
      <title>
        Відмовлено в доступі | Material Kit
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexGrow: 1,
        minHeight: '100%'
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography
            align="center"
            color="textPrimary"
            variant="h1"
          >
            401: Авторизуйтесь, для подальшої роботи
          </Typography>
          <Typography
            align="center"
            color="textPrimary"
            variant="subtitle2"
          >
            Час сесії минув, або ви не маєте права входу
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <img
              alt="Unauthorized"
              src="/static/images/401-error-image.jpg"
              style={{
                marginTop: 50,
                display: 'inline-block',
                maxWidth: '100%',
                width: 560
              }}
            />
          </Box>
          <NextLink
            href="/login"
            passHref
          >
            <Button
              sx={{ mt: 3 }}
              variant="contained"
            >
              Авторизуватись
            </Button>
          </NextLink>
        </Box>
      </Container>
    </Box>
  </>
);

export default Page;

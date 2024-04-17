import Head from 'next/head';
import NextLink from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { signIn} from 'next-auth/react';
import Router from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Container, Grid, Link, TextField, Typography } from '@mui/material';
import { errorMessage } from '../utils/message';

const Login = () => {
  const session = useSession();

  useEffect(() => {
    if (session.status === 'authenticated') {
      Router.replace('/');
    }
  }, [session.status]);

  const formik = useFormik({
    initialValues: {
      name: '',
      password: ''
    },
    validationSchema: Yup.object({
      name: Yup
        .string()
        .min(4)
        .max(255)
        .required("Ім'я обов'язкове до заповнення"),
      password: Yup
        .string()
        .max(255)
        .required("Пароль обов'язковий до заповнення")
    }),
    onSubmit: (data) => {
      signIn('credentials', { ...data, redirect: false })
      .then((response) => {
        if (response && response.error) {
          if (response.error.localeCompare('Invalid credentials') === 0) {
            errorMessage('Такого користувача не існує');
          }
          // show notification for user
        } 
      });
    }
  });

  if (session.status === 'unauthenticated') return (
    <>
      <Head>
        <title>Вхід</title>
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
        <Container maxWidth="sm">
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ my: 3 }}>
              <Typography
                color="textPrimary"
                variant="h4"
              >
                Ввійти
              </Typography>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="body2"
              >
                в систему
              </Typography>
            </Box>
            <TextField
              error={Boolean(formik.touched.name && formik.errors.name)}
              fullWidth
              shrink='true'
              helperText={formik.touched.name && formik.errors.name}
              label="Ім&#39;я"
              margin="normal"
              name="name"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.name}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.password && formik.errors.password)}
              fullWidth
              shrink='true'
              helperText={formik.touched.password && formik.errors.password}
              label="Пароль"
              margin="normal"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password}
              variant="outlined"
            />
            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Підтвердити
              </Button>
            </Box>
            <Typography
              color="textSecondary"
              variant="body2"
            >
              Не має аккаунта?
              {' '}
              <NextLink
                href="/register"
              >
                Подати заявку на реєстрацію
              </NextLink>
            </Typography>
          </form>
        </Container>
      </Box>
    </>
  );

  return <Box>Checking...</Box>;
};

export default Login;

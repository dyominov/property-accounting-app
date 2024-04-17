import { enqueueSnackbar } from 'notistack';

const errorMessage = (msg) => {
  let message = msg;

  try {
    if (msg) {
      switch (typeof msg) {
        case 'object':
          message = JSON.stringify(msg);
          break;
        default:
          message = String(msg);
          break;
      }
      if (typeof msg !== 'string') {
        message = String(msg);
      }
      enqueueSnackbar(message, { variant: 'error' });
    } else {
      enqueueSnackbar(`Не валідні дані для errorMessage: ${JSON.stringify(message)}`, { variant: 'error' });
    }
  } catch (error) {
    throw new Error('Помилка в створенні інформаційного повідомлення');
  }
};

const infoMessage = (msg) => {
  let message = msg;

  try {
    if (msg) {
      switch (typeof msg) {
        case 'object':
          message = JSON.stringify(msg);
          break;
        default:
          message = String(msg);
          break;
      }
      if (typeof msg !== 'string') {
        message = String(msg);
      }
      enqueueSnackbar(message, { variant: 'info', autoHideDuration: null });
    } else {
      enqueueSnackbar(`Не валідні дані для errorMessage: ${JSON.stringify(message)}`, { variant: 'info', persist: true });
    }
  } catch (error) {
    throw new Error('Помилка в своренні інформаційного повідомлення');
  }
};

export {
  errorMessage,
  infoMessage,
};

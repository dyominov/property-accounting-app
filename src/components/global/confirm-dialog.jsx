import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import { useRef } from 'react';
import { Typography } from '@mui/material';

export default function ConfirmDialog(props) {
  const { onClose, open, ...other } = props;

  const dialogRef = useRef(null);

  const handleEntering = () => {
    if (dialogRef.current != null) {
      dialogRef.current.focus();
    }
  };

  const handleCancel = () => {
    onClose(false);
  };

  const handleOk = () => {
    onClose(true);
  };

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '40%', maxHeight: 235 } }} 
      TransitionProps={{ onEntering: handleEntering }}
      open={open}
      {...other}
    >
      <DialogTitle>Підтвердження</DialogTitle>
      <DialogContent dividers>
        <Typography ref={dialogRef} variant="body1" sx={{ textAlign: 'left' }}>
          Ви підтверджуєте виконання операції?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Ні
        </Button>
        <Button onClick={handleOk}>Так</Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  addStockpile, 
  addMainAssets, 
} from '../../../../store/slices/document-transferSupply-slice';
import AddDialogMainAssets from './add-dialog-mainAssets';
import AddDialogStockpile from './add-dialog-stockpile';

export default function AddDialog(props) {
  const { onClose, open, ...other } = props;
  const [supplyType, setSupplyType] = useState('');
  const tableRef = useRef(null);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (!open) {
  //     setSelectedMainAssets(selectedMainAssetsProp);
  //     setSelectedStockpile(selectedStockpileProp);
  //   }
  // }, [selectedMainAssetsProp, selectedStockpileProp, open]);

  const handleEntering = () => {
    if (tableRef.current != null) {
      tableRef.current.focus();
    }
  };

  const handleCancel = () => {
    setSupplyType(''); // reset
    onClose();
  };

  const handleNextMainAsset = () => {
    setSupplyType('mainAsset');
  };

  const handleNextStockpile = () => {
    setSupplyType('stockpile');
  };

  const handleOkMainAsset = (selectedMainAssets) => {
    onClose();
    dispatch(addMainAssets(selectedMainAssets));
  };
  const handleOkStockpile = (selectedStockpile) => {
    onClose();
    dispatch(addStockpile(selectedStockpile));
  };

  return (
    <Dialog
      maxWidth='true'
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      TransitionProps={{ onEntering: handleEntering }}
      open={open}
      {...other}
    >

    {supplyType && supplyType === 'mainAsset' && ( 
        <AddDialogMainAssets onCancel={handleCancel} onSubmit={handleOkMainAsset} isOpen={open} />
    )}

    {supplyType && supplyType === 'stockpile' && (
        <AddDialogStockpile onCancel={handleCancel} onSubmit={handleOkStockpile} isOpen={open} />
    )}

      {/* Not selected supply type. First step */}
    {!supplyType && (
        <>
          <DialogTitle>Зробіть вибір</DialogTitle>
          <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column'}}>
            <Button color='secondary' autoFocus onClick={handleNextMainAsset}>
              Основні Засоби
            </Button>
            <Button color='secondary' onClick={handleNextStockpile}>Запаси</Button>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleCancel}>
              Скасувати
            </Button>
          </DialogActions>
        </>
    )}
      
    </Dialog>
  );
}

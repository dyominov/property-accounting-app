import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers';
import { updateDocument, getDocumentHeaderState } from '@/store/slices/document-header-slice';
import ScanUpload from '../../global/scan-upload';
import SaveDocumentDialog from '../../global/save-document-dialog';
import { getSaveDocumentDialogIsOpenState, setDialogIsOpen } from '../../../store/slices/save-document-dialog-slice';

export default function NewDocument({ document, allowedTypes }) {
  const dispatch = useDispatch();
  const header = useSelector(getDocumentHeaderState);
  const openSaveDocumentDialog = useSelector(getSaveDocumentDialogIsOpenState);
  const operation = allowedTypes[0].operation;

  const [internalState, setInternalState] = useState({ documentType: '' });

  const handleSaveDocumentDialogClose = () => {
    dispatch(setDialogIsOpen(false));
  };

  useEffect(() => {
    setInternalState((prevState) => ({
      ...prevState,
      documentType: document.type
    }));
  }, [document.type, header.date, header.number, header.type]);

  const handleChangeDocumentType = (event) => {
    const { value } = event.target;
    const payload = { name: 'type', value };

    setInternalState((prevState) => {
      return {
        ...prevState,
        documentType: value,
      };
    });
    dispatch(updateDocument(payload));
  };
  const handleChangeDocumentNumberValue = (event) => {
    const { value } = event.target;
    const payload = { name: 'number', value };
    dispatch(updateDocument(payload));
  };

  const handleChangeDateOfDocumentValue = (value) => {
    const payload = { name: 'date', value: value.toISOString() };
    dispatch(updateDocument(payload));
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'start' }}>
      <Stack spacing={1} sx={{ width: '100%' }}>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="select-document-type-label">Тип*</InputLabel>
          <Select
            labelId="select-document-type-label"
            id="select-document-type"
            value={internalState.documentType ? internalState.documentType : ''}
            onChange={handleChangeDocumentType}
            label="Тип"
          >
            {allowedTypes.map(type => {
              if (type.id === 1 && type.docType.title.localeCompare('Не визначено') === 0) {
                return (
                  <MenuItem key={type.id} value={type.id}>
                    <em>{type.docType.title}</em>
                  </MenuItem>
                );
              } else {
                return (
                  <MenuItem key={type.id} value={type.id}>{type.docType.title}</MenuItem>
                );
              }
            }
            )}
          </Select>
        </FormControl>
        <TextField fullWidth label="Номер документу" name='documentNumber' value={document.number} onChange={handleChangeDocumentNumberValue} variant="standard" />
        <ScanUpload />
      </Stack>
      <FormControlLabel label='Дата документу*' labelPlacement='top' control={<DateCalendar disableFuture value={new Date(document.date)} onChange={handleChangeDateOfDocumentValue} />} sx={{ mb: 2 }} />
      <SaveDocumentDialog
        open={openSaveDocumentDialog}
        onClose={handleSaveDocumentDialogClose}
        operation={operation}
      />
    </Box>
  );
};

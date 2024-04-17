import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { getTransferHolderState, updateHolder } from '../../../../store/slices/document-transferSupply-slice';

export default function Holder({notSystemUnits}) {
  const dispatch = useDispatch();

  const holderData = useSelector(getTransferHolderState);

  const [internalState, setInternalState] = useState({
    selectedNotSystemUnit: '',
    name: '',
    phone: '',
    location: '',
    extraInfo: '',
  });

  const handleChangeNotSystemUnit = (event) => {
    const { value } = event.target;

    setInternalState(prevState => {
      return {
        ...prevState,
        selectedNotSystemUnit: value,
      };
    });

    const payload = { name: 'notSystemUnit', value };
    dispatch(updateHolder(payload));
  };

  const handleChangeInputValue = (event) => {
    const { name, value } = event.target;
    const payload = { name, value };

    dispatch(updateHolder(payload));
  };

  return (
    <Box sx={{ py: 3 }}>
      <Typography
        sx={{ flex: '1 1 100%' }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Отримувач
      </Typography>
      <Stack spacing={1} sx={{ width: '100%' }}>
        <TextField label="Прізвище, Ім'я, По-батькові*"
          id='name' name='name'
          value={holderData.name}
          onChange={handleChangeInputValue}
          variant='standard'
        />
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="select-not-system-unit-label">Підрозділ*</InputLabel>
          <Select
            labelId="select-not-system-unit-label"
            id="select-not-system-unit"
            name="notSystemUnit"
            value={internalState.selectedNotSystemUnit}
            onChange={handleChangeNotSystemUnit}
            label="Підрозділ*"
          >
            {notSystemUnits.map(notSystemUnit => (
              <MenuItem key={notSystemUnit.id} value={notSystemUnit.id}>{notSystemUnit.title}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Box>
  );
}
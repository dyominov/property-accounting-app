import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Autocomplete, Box, FormControl, Input, InputAdornment, InputLabel, FormControlLabel, IconButton, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import { pink, teal } from '@mui/material/colors';
import { decrement, updateStockpile, updateObjectType } from '@/store/slices/document-addSupply-slice';
import { generalSettings } from '@/setupObjects/generalSettings';

export default function NewStockpile(props) {
  const dispatch = useDispatch();
  const {idx,listLength, groups, integers, stockpile } = props;

  const [internalState, setInternalState] = useState({
    selectedGroup: stockpile.group,
    selectedInteger: '',
    selectedThingType: 'stockpile',
  });

  useEffect(() => {
    setInternalState((prevState) => ({
      ...prevState,
      selectedInteger: stockpile.integer,
    }));
  }, [stockpile.integer]);

  const defaultGroupProps = {
    options: groups,
    getOptionLabel: (option) => option.title,
  };

  const handleObjectRemove = (idx) => {
    dispatch(decrement(idx));
  };

  const handleChangeGroupOptionValue = (value) => {
    setInternalState(prevState => {
      return {
        ...prevState,
        selectedGroup: value,
      };
    });
  };

  const handleChangeInteger = (event, idx) => {
    const { value } = event.target;
    const payload = { idx, name: 'integer', value };

    setInternalState(prevState => {
      return {
        ...prevState,
        selectedInteger: value,
      };
    });

    dispatch(updateStockpile(payload));
  };

  const handleChangeInputValue = (event, idx) => {
    const { name, value } = event.target;

    const payload = { idx, name, value };
    dispatch(updateStockpile(payload));
  };

  const handleChangeDateOfManufactureValue = (value, idx) => {
    const payload = { idx, name: 'dateOfManufacture', value: value.toISOString() };
    dispatch(updateStockpile(payload));
  };

  const handleChangeThingType = (type, idx) => {
    const payload = { idx, type };

    dispatch(updateObjectType(payload));
    setInternalState(prevState => {
      return {
        ...prevState,
        selectedThingType: type,
      };
    });
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'start' }}>
      {listLength > 1 && (
        <IconButton aria-label="remove" color="error" onClick={() => handleObjectRemove(idx)}>
          <RemoveCircleIcon />
        </IconButton>
      )}
      <Box sx={{ display: 'flex', flexGrow: 1, py:3 }}>
        <Stack spacing={1} sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {internalState.selectedThingType === 'mainAsset' ? <ChangeHistoryIcon sx={{ color: pink[500], mr: 1 }} /> : <CropSquareIcon sx={{ color: teal[500] }} />}
            <Select
              id={`select-thing-type-${idx}`}
              value={internalState.selectedThingType}
              onChange={({ target: { value } }) => handleChangeThingType(value, idx)}
              sx={{ flexGrow: 1, mr: 2 }}
            >
              <MenuItem value="mainAsset">Основний засіб</MenuItem>
              <MenuItem value="stockpile">Запаси</MenuItem>
            </Select>
            <TextField id={`title-${idx}`} fullWidth label="Найменування*" name='title' value={stockpile.title} onChange={e => handleChangeInputValue(e, idx)} variant="standard" />
          </Box>
          <Autocomplete
            {...defaultGroupProps}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={internalState.selectedGroup}
            onChange={(_, value) => {
              const payload = { idx, name: 'group', value };

              handleChangeGroupOptionValue(value);
              dispatch(updateStockpile(payload));
            }}
            inputValue={stockpile.group ? stockpile.group.title : ''}
            onInputChange={(_, value) => {
              if (!value) return;

              const findItem = groups.find(item => item.title.localeCompare(value) === 0);
              const valueId = findItem ? findItem.id : 0;

              if (valueId === 0) {
                const newItem = { id: valueId, title: value };
                const payload = { idx, name: 'group', value: newItem };

                handleChangeGroupOptionValue(newItem);
                dispatch(updateStockpile(payload));
              }
            }}
            renderInput={(params) => (
              <TextField {...params} name='group' label="Група" variant="standard" />
            )}
          />
          <TextField id={`serialNumber-${idx}`} fullWidth label="Заводський номер" name='serialNumber' value={stockpile.serialNumber} onChange={e => handleChangeInputValue(e, idx)} variant="standard" />
          <TextField id={`balanceAmount-${idx}`} fullWidth label="Балансова кількість*" name='balanceAmount' value={stockpile.balanceAmount} onChange={e => handleChangeInputValue(e, idx)} variant="standard" />
          <TextField id={`actualAmount-${idx}`} fullWidth label="Фактична кількість*" name='actualAmount' value={stockpile.actualAmount} onChange={e => handleChangeInputValue(e, idx)} variant="standard" />
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="select-integer-label">Одиниця вимірювання*</InputLabel>
            <Select
              labelId="select-integer-label"
              id="select-integer"
              value={internalState.selectedInteger ? internalState.selectedInteger : ''}
              onChange={(event) => handleChangeInteger(event, idx)}
              label="Одиниця вимірювання*"
            >
              {integers.map(integer => (
                <MenuItem key={integer.id} value={integer.id}>{integer.title}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField label="Вартість*"
            InputProps={{ endAdornment: < InputAdornment position="end" > {generalSettings.currency}</InputAdornment> }}
            id={`cost-${idx}`} name='cost'
            value={stockpile.cost}
            onChange={e => handleChangeInputValue(e, idx)}
            variant='standard'
          />
        </Stack>
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around' }}>
          <FormControlLabel label='Рік випуску*' labelPlacement='top' control={<DateCalendar disableFuture value={new Date(stockpile.dateOfManufacture)} onChange={(newValue) => handleChangeDateOfManufactureValue(newValue, idx)} />} sx={{ mb: 2 }} />
        </Box>
      </Box>
    </Box>
  );
}
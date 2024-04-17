import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Autocomplete, Box, FormControl, FormControlLabel, IconButton, Input, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import { pink, teal } from '@mui/material/colors';
import { decrement, updateMainAsset, updateObjectType } from '@/store/slices/document-addSupply-slice';
import { generalSettings } from '@/setupObjects/generalSettings';

export default function NewMainAsset(props) {
  const dispatch = useDispatch();
  const { idx, listLength, groups, categories, integers, mainAsset } = props;

  const [internalState, setInternalState] = useState({
    selectedGroup: mainAsset.group,
    selectedCategory: '',
    selectedInteger: '',
    selectedThingType: 'mainAsset',
  });

  useEffect(() => {
    setInternalState((prevState) => ({
      ...prevState,
      selectedCategory: mainAsset.category,
      selectedInteger: mainAsset.integer,
    }));
  }, [mainAsset.category, mainAsset.integer]);

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

  const handleChangeCategory = (event, idx) => {
    const { value } = event.target;
    const payload = { idx, name: 'category', value };

    setInternalState(prevState => {
      return {
        ...prevState,
        selectedCategory: value,
      };
    });

    dispatch(updateMainAsset(payload));
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

    dispatch(updateMainAsset(payload));
  };

  const handleChangeInputValue = (event, idx) => {
    const { name, value } = event.target;

    const payload = { idx, name, value };
    dispatch(updateMainAsset(payload));
  };

  const handleChangeDateOfManufactureValue = (value, idx) => {
    const payload = { idx, name: 'dateOfManufacture', value: value.toISOString() };
    dispatch(updateMainAsset(payload));
  };

  const handleChangeDateOfStartOperationValue = (value, idx) => {
    const payload = { idx, name: 'dateOfStartOperation', value: value.toISOString() };
    dispatch(updateMainAsset(payload));
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
    <Box sx={{ display: 'flex', alignItems: 'start', py: 3 }}>
      {listLength > 1 && (
        <IconButton aria-label="remove" color="error" onClick={() => handleObjectRemove(idx)}>
          <RemoveCircleIcon />
        </IconButton>
      )}
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
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
            <TextField id={`title-${idx}`} fullWidth label="Найменування*" name='title' value={mainAsset.title} onChange={e => handleChangeInputValue(e, idx)} variant="standard" />
          </Box>
          <Autocomplete
            {...defaultGroupProps}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={internalState.selectedGroup}
            onChange={(_, value) => {
              const payload = { idx, name: 'group', value };

              handleChangeGroupOptionValue(value);
              dispatch(updateMainAsset(payload));
            }}
            inputValue={mainAsset.group ? mainAsset.group.title : ''}
            onInputChange={(_, value) => {
              if (!value) return;

              const findItem = groups.find(item => item.title.localeCompare(value) === 0);
              const valueId = findItem ? findItem.id : 0;

              if (valueId === 0) {
                const newItem = { id: valueId, title: value };
                const payload = { idx, name: 'group', value: newItem };

                handleChangeGroupOptionValue(newItem);
                dispatch(updateMainAsset(payload));
              }
            }}
            renderInput={(params) => (
              <TextField {...params} name='group' label="Група" variant="standard" />
            )}
          />
          <TextField id={`inventoryNumber-${idx}`} fullWidth label="Інвентарний/номенклатурний номер" name='inventoryNumber' value={mainAsset.inventoryNumber} onChange={e => handleChangeInputValue(e, idx)} variant="standard" />
          <TextField id={`serialNumber-${idx}`} fullWidth label="Заводський номер" name='serialNumber' value={mainAsset.serialNumber} onChange={e => handleChangeInputValue(e, idx)} variant="standard" />
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="select-category-label">Категорія*</InputLabel>
            <Select
              labelId="select-category-label"
              id="select-category"
              value={internalState.selectedCategory ? internalState.selectedCategory : ''}
              onChange={(event) => handleChangeCategory(event, idx)}
              label="Категорія*"
            >
              {categories.map(category => (
                <MenuItem key={category.id} value={category.id}>{category.title}</MenuItem>
              ))}
            </Select>
          </FormControl>
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
            value={mainAsset.cost}
            onChange={e => handleChangeInputValue(e, idx)}
            variant='standard'
          />
        </Stack>
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
          <FormControlLabel label='Рік випуску*' labelPlacement='top' control={<DateCalendar disableFuture value={new Date(mainAsset.dateOfManufacture)} onChange={(newValue) => handleChangeDateOfManufactureValue(newValue, idx)} />} />
          <FormControlLabel label='Дата введення в експлуатацію' labelPlacement='top' control={<DateCalendar disableFuture value={new Date(mainAsset.dateOfStartOperation)} onChange={(newValue) => handleChangeDateOfStartOperationValue(newValue, idx)} />} />
        </Box>
      </Box>
    </Box>
  );
}
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Dialog, DialogTitle, Divider, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel } from '@mui/material';
import { headerColumns } from '@/setupObjects/stockpile/headerColumns';
import { useDispatch, useSelector } from 'react-redux';
import { getStockpileOptionsState, setStockpileOptions } from '@/store/slices/search-slice';

export default function SearchOptionsDialog(props) {
  const { onClose, open } = props;
  const dispatch = useDispatch();
  const searchOptions = useSelector(getStockpileOptionsState);
  const [searchByColumns, setSearchByColumns] = useState({ ...searchOptions.searchByColumns });
  const [matchCase, setMatchCase] = useState(searchOptions.matchCase);


  const handleChangeSearchByColumnsState = (event) => {
    setSearchByColumns({
      ...searchByColumns,
      [event.target.name]: event.target.checked,
    });
  };

  const handleChangeMatchCaseState = (event) => {
    setMatchCase(event.target.checked);
  };

  const handleClose = () => {
    onClose();
    dispatch(setStockpileOptions({
      searchByColumns: {
        ...searchByColumns,
      },
      matchCase,
    }));
  };

  return (
    <Dialog onClose={handleClose} open={open} sx={{ p: 2 }}>
      <DialogTitle>Додаткові опції пошуку</DialogTitle>
      <Divider />
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <FormControl>
          <FormLabel component="legend">Пошук за стовбцем</FormLabel>
          <FormGroup sx={{ pt: 0 }}>
            {headerColumns.map(({ title, label }) => (
              <FormControlLabel
                key={title}
                label={label}
                control={
                  <Checkbox
                    checked={searchByColumns[title]}
                    onChange={handleChangeSearchByColumnsState}
                    name={title}
                  />
                }
              />
            ))}
          </FormGroup>
        </FormControl>
        <Divider sx={{ my: 1 }} />
        <FormControl>
          <FormLabel component="legend">Інші опції</FormLabel>
          <FormGroup sx={{ pt: 0 }}>
            <FormControlLabel
              label='Враховувати регістр'
              control={
                <Checkbox
                  checked={matchCase}
                  onChange={handleChangeMatchCaseState}
                  name='matchCase'
                />
              }
            />
          </FormGroup>
        </FormControl>
      </Box>
    </Dialog>
  );
}

SearchOptionsDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

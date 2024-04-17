import { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Dialog,
  DialogTitle,
  Divider,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputAdornment,
  TextField,
  Typography,
  Grid,
  Input,
  IconButton,
  DialogContent
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { DateRange } from 'react-date-range';
import { headerColumns } from '@/setupObjects/main-assets/headerColumns';
import { uk } from 'date-fns/locale';
import { generalSettings } from '@/setupObjects/generalSettings';

export default function FilterDialog(props) {
  const { onClose, initialState, open } = props;
  const [columns, setFilterByColumns] = useState({ ...initialState.columns });
  const [dateOfManufactureRange, setdateOfManufactureRange] = useState(initialState.dateOfManufactureRange);
  const [dateOfStartOperationRange, setDateOfStartOperationRange] = useState(initialState.dateOfStartOperationRange);
  const [costRange, setCostRange] = useState(initialState.costRange);
  const [aowatRange, setAowatRange] = useState(initialState.aowatRange);
  
  const dateRangeSelected = (startDate, endDate) => startDate || endDate;
    
  const handleChangeFilterByColumnsState = (event) => {
    setFilterByColumns({
      ...columns,
      [event.target.name]: event.target.checked,
    });
  };

  // TO DO: validate range to be valid. For example start must be less or equal to end
  const handleChangeFilterByCostState = (event) => {
    setCostRange((prev) => ({
      ...prev,
      [event.target.name]: isNaN(parseInt(event.target.value)) ? null : event.target.value,
    }));
  };

  // TO DO: validate range to be valid. For example start must be less or equal to end
  const handleChangeFilterByAowatState = (event) => {
    setAowatRange((prev) => ({
      ...prev,
      [event.target.name]: isNaN(parseInt(event.target.value)) ? null : event.target.value,
    }));
  };

  const handleClose = () => {
    onClose({
      columns: {
        ...columns,
      },
      dateOfManufactureRange,
      dateOfStartOperationRange,
      costRange,
      aowatRange,
    });
  };

  const handleSelectDateOfManufactureRange = (values) => {
    setdateOfManufactureRange((prev) => ({
      ...prev,
      ...values.selection
    }));
  };

  const handleResetDateOfManufactureRange = () => {
    setdateOfManufactureRange((prev) => ({
      ...prev,
      startDate: null,
      endDate: null,
    }));
  };

  const handleSelectDateOfStartOperationRange = (values) => {
    setDateOfStartOperationRange((prev) => ({
      ...prev,
      ...values.selection
    }));
  };
  const handleResetDateOfStartOperationRange = () => {
    setDateOfStartOperationRange((prev) => ({
      ...prev,
      startDate: null,
      endDate: null,
    }));
  };

  return (
    <Dialog maxWidth="xl" scroll="paper" onClose={handleClose} open={open} sx={{ p: 2 }}>
      <DialogTitle>Фільтр</DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 2, display: 'flex' }}>
        <Grid container>
          <Grid item xs={6}>
            <FormControl>
              <FormLabel component="legend">Стовбці</FormLabel>
              <FormGroup sx={{ pt: 0 }}>
                {headerColumns.map(({ title, label }) => (
                  <FormControlLabel
                    key={title}
                    label={label}
                    control={
                      <Checkbox
                        checked={columns[title]}
                        onChange={handleChangeFilterByColumnsState}
                        name={title}
                      />
                    }
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Grid>
          <Grid item xs={6} sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormControl sx={{ mb: 3 }}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {dateRangeSelected(dateOfManufactureRange.startDate, dateOfManufactureRange.endDate) && (
                      <IconButton 
                        aria-label="reset" 
                        title="Скинути фільтр" 
                        color="error"
                        onClick={handleResetDateOfManufactureRange}
                      >
                        <HighlightOffIcon />
                      </IconButton>
                    )}
                    <Typography>Рік випуску</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <DateRange
                    locale={uk}
                    dateDisplayFormat="d MMM yyyy"
                    ranges={[dateOfManufactureRange]}
                    onChange={handleSelectDateOfManufactureRange}
                  />
                </AccordionDetails>
              </Accordion>
            </FormControl>
            <FormControl sx={{ mb: 3 }}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {dateRangeSelected(dateOfStartOperationRange.startDate, dateOfStartOperationRange.endDate) && (
                      <IconButton
                        aria-label="reset"
                        title="Скинути фільтр"
                        color="error"
                        onClick={handleResetDateOfStartOperationRange}
                      >
                        <HighlightOffIcon />
                      </IconButton>
                    )}
                    <Typography>Дата введення в експлуатацію</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <DateRange
                    locale={uk}
                    dateDisplayFormat="d MMM yyyy"
                    ranges={[dateOfStartOperationRange]}
                    onChange={handleSelectDateOfStartOperationRange}
                  />
                </AccordionDetails>
              </Accordion>
            </FormControl>
            <FormControl sx={{ mb: 3 }}>
              <FormLabel component="legend">Категорія</FormLabel>
              <FormGroup sx={{ pt: 0 }}>

              </FormGroup>
            </FormControl>
            <FormControl sx={{ mb: 3 }}>
              <FormLabel component="legend">Група</FormLabel>
              <FormGroup sx={{ pt: 0 }}>

              </FormGroup>
            </FormControl>
            <Box sx={{ mb: 3 }}>
              <FormLabel component="legend">Вартість</FormLabel>
              <FormGroup sx={{ pt: 0, flexWrap: 'nowrap', flexDirection: 'row' }}>
                <Input
                  startAdornment={<InputAdornment position="start">від</InputAdornment>}
                  endAdornment={<InputAdornment position="end">{generalSettings.currency}</InputAdornment>}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                  placeholder="0"
                  name="start"
                  value={costRange.start}
                  onChange={handleChangeFilterByCostState}
                />
                <Input
                  startAdornment={<InputAdornment position="start">до</InputAdornment>}
                  endAdornment={<InputAdornment position="end">{generalSettings.currency}</InputAdornment>}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', }}
                  name="end"
                  value={costRange.end}
                  onChange={handleChangeFilterByCostState}
                  sx={{ ml: 1 }}
                />
              </FormGroup>
            </Box>
            <Box sx={{ mb: 3 }}>
              <FormLabel component="legend">Сума зносу</FormLabel>
              <FormGroup sx={{ pt: 0, flexWrap: 'nowrap', flexDirection: 'row' }}>
                <Input
                  startAdornment={<InputAdornment position="start">від</InputAdornment>}
                  endAdornment={<InputAdornment position="end">{generalSettings.currency}</InputAdornment>}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', }}
                  placeholder="0"
                  name="start"
                  value={aowatRange.start}
                  onChange={handleChangeFilterByAowatState}
                />
                <Input
                  startAdornment={<InputAdornment position="start">до</InputAdornment>}
                  endAdornment={<InputAdornment position="end">{generalSettings.currency}</InputAdornment>}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', }}
                  name="end"
                  value={aowatRange.end}
                  onChange={handleChangeFilterByAowatState}
                  sx={{ ml: 1 }}
                />
              </FormGroup>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

FilterDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  initialState: PropTypes.object.isRequired,
};

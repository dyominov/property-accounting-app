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
import { headerColumns } from '@/setupObjects/documents/headerColumns';
import { uk } from 'date-fns/locale';
import { generalSettings } from '@/setupObjects/generalSettings';

export default function FilterDialog(props) {
  const { onClose, initialState, open } = props;
  const [columns, setFilterByColumns] = useState({ ...initialState.columns });
  const [dateRange, setDateRange] = useState(initialState.dateRange);
  const [dateOfRealizationRange, setDateOfRealizationRange] = useState(initialState.dateOfRealizationRange);
  
  const dateRangeSelected = (startDate, endDate) => startDate || endDate;
    
  const handleChangeFilterByColumnsState = (event) => {
    setFilterByColumns({
      ...columns,
      [event.target.name]: event.target.checked,
    });
  };

  const handleClose = () => {
    onClose({
      columns: {
        ...columns,
      },
      dateRange,
      dateOfRealizationRange,
    });
  };

  const handleSelectDateRange = (values) => {
    setDateRange((prev) => ({
      ...prev,
      ...values.selection
    }));
  };

  const handleResetDateOfCreationRange = () => {
    setDateRange((prev) => ({
      ...prev,
      startDate: null,
      endDate: null,
    }));
  };

  const handleSelectDateOfRealizationRange = (values) => {
    setDateOfRealizationRange((prev) => ({
      ...prev,
      ...values.selection
    }));
  };
  const handleResetDateOfRealizationRange = () => {
    setDateOfRealizationRange((prev) => ({
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
                    {dateRangeSelected(dateRange.startDate, dateRange.endDate) && (
                      <IconButton 
                        aria-label="reset" 
                        title="Скинути фільтр" 
                        color="error"
                        onClick={handleResetDateOfCreationRange}
                      >
                        <HighlightOffIcon />
                      </IconButton>
                    )}
                    <Typography>Дата створення</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <DateRange
                    locale={uk}
                    dateDisplayFormat="d MMM yyyy"
                    ranges={[dateRange]}
                    onChange={handleSelectDateRange}
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
                    {dateRangeSelected(dateOfRealizationRange.startDate, dateOfRealizationRange.endDate) && (
                      <IconButton
                        aria-label="reset"
                        title="Скинути фільтр"
                        color="error"
                        onClick={handleResetDateOfRealizationRange}
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
                    ranges={[dateOfRealizationRange]}
                    onChange={handleSelectDateOfRealizationRange}
                  />
                </AccordionDetails>
              </Accordion>
            </FormControl>
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

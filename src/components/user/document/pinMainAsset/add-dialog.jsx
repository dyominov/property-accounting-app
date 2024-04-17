import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useEffect, useRef, useState } from 'react';
import useFetchGet from '@/hooks/useFetch';
import { generalSettings } from '@/setupObjects/generalSettings';
import { Checkbox, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { DataTableHead } from './data-table';
import stableSort from '../../../../utils/stable-sort';
import { useDispatch, useSelector } from 'react-redux';
import { addMainAssets, getPinnedMainAssetsState } from '../../../../store/slices/document-pinMainAsset-slice';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export default function AddDialog(props) {
  const { onClose, open, ...other } = props;

  const selectedProp = useSelector(getPinnedMainAssetsState);
  const response = useFetchGet(`/api/GET/main-assets?status=OWNED`);
  const [selected, setSelected] = useState(selectedProp);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('title');
  const tableRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!open) {
      setSelected(selectedProp);
    }
  }, [selectedProp, open]);



  if (response.isLoading) {
    return <Box>Loading...</Box>;
  }
  if (response.isError) {
    return <Box>Error...</Box>;
  }

  const { data: rows } = response;

  const handleEntering = () => {
    if (tableRef.current != null) {
      tableRef.current.focus();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onClose();
    dispatch(addMainAssets(selected));
  };

  const handleRequestSort = (_, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectClick = (_, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (isDisabled(id)) return;

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (id) => {
    return selected.indexOf(id) !== -1;
  };

  const isDisabled = (id) => {
    return selectedProp.includes(id);
  };

  return (
    <Dialog
      maxWidth='true'
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      TransitionProps={{ onEntering: handleEntering }}
      open={open}
      {...other}
    >
      <DialogTitle>Основні засоби</DialogTitle>
      <DialogContent dividers>
        <TableContainer>
          <Table
            ref={tableRef}
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size='small'
          >
            <DataTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .map((row) => {
                  const isItemSelected = isSelected(row.id);
                  const isItemDisabled = isDisabled(row.id);
                  const labelId = `pin-ma-add-table-item-${row.id}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleSelectClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          disabled={isItemDisabled}
                          id={labelId}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.title}
                      </TableCell>
                      <TableCell align="center">{row.inventoryNumber}</TableCell>
                      <TableCell align="center">{row.serialNumber}</TableCell>
                      <TableCell align="center">{row.cost}&nbsp;{generalSettings.currency}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Скасувати
        </Button>
        <Button onClick={handleOk}>Прийняти</Button>
      </DialogActions>
    </Dialog>
  );
}

AddDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

function AddDialogFuture() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);

  const handleClickAddButton = () => {
    setOpen(true);
  };

  const handleCloseAddDialog = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <Button onClick={handleClickAddButton}>Add</Button>
      <AddDialog
        id="add-dialog"
        keepMounted
        open={open}
        onClose={handleCloseAddDialog}
        selected={selected}
      />
    </Box>
  );
}
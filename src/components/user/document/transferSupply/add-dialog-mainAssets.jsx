import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useEffect, useRef, useState } from 'react';
import useFetchGet from '@/hooks/useFetch';
import { generalSettings } from '@/setupObjects/generalSettings';
import { Checkbox, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { DataTableHead } from './data-table';
import stableSort from '../../../../utils/stable-sort';
import { useSelector } from 'react-redux';
import { getTransferredMainAssetsState } from '../../../../store/slices/document-transferSupply-slice';

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

export default function AddDialogMainAssets(props) {
  const { onCancel, onSubmit, isOpen, ...other } = props;

  const selectedProp = useSelector(getTransferredMainAssetsState);
  const fetchResponse = useFetchGet(`/api/GET/main-assets?status=OWNED`);
  const [selected, setSelected] = useState(selectedProp);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('title');
  const tableRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setSelected(selectedProp);
    }
  }, [selectedProp, isOpen]);



  if (fetchResponse.isLoading) {
    return <Box>Loading...</Box>;
  }
  if (fetchResponse.isError) {
    return <Box>Error...</Box>;
  }

  const { data: rows } = fetchResponse;

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

  {/* Main asset records exist*/ }
  if (rows && rows.length > 0) {
    return (
      <>
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
                {stableSort(rows.map(rMA => ({ ...rMA, amount: 1 })), getComparator(order, orderBy))
                  .map((row) => {
                    const isItemSelected = isSelected(row.id);
                    const isItemDisabled = isDisabled(row.id);
                    const labelId = `transfer-ma-add-table-item-${row.id}`;

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
                        <TableCell align="center">{row.integer.title}</TableCell>
                        <TableCell align="center">{row.amount}</TableCell>
                        <TableCell align="center">{row.cost}&nbsp;{generalSettings.currency}</TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={onCancel}>
            Скасувати
          </Button>
          <Button onClick={() => onSubmit(selected)}>Прийняти</Button>
        </DialogActions>
      </>
    );
  }

  {/* No main asset records (default)*/ }
  return (
    <>
      <DialogTitle>Основні засоби</DialogTitle>
      <DialogContent dividers>
        <Typography>На балансі не знаходиться жодних основних засобів, які можна передати</Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onCancel}>
          Скасувати
        </Button>
      </DialogActions>
    </>
  );
}

AddDialogMainAssets.propTypes = {
  onCancel: PropTypes.func, 
  onSubmit: PropTypes.func, 
  isOpen: PropTypes.bool,
};

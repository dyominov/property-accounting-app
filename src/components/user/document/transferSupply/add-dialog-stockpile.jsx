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
import { getTransferredStockpileState } from '../../../../store/slices/document-transferSupply-slice';
import NumberTextField from '../../../global/number-text-field';

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

export default function AddDialogStockpile(props) {
  const { onCancel, onSubmit, isOpen, ...other } = props;

  const selectedProp = useSelector(getTransferredStockpileState);
  const response = useFetchGet(`/api/GET/stockpile?status=OWNED`);
  const responseTransferred = useFetchGet(`/api/GET/stockpile-transferred/amount`);
  const [selected, setSelected] = useState(selectedProp);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('title');
  const tableRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setSelected(selectedProp);
    }
  }, [selectedProp, isOpen]);



  if (response.isLoading || responseTransferred.isLoading) {
    return <Box>Loading...</Box>;
  }
  if (response.isError || responseTransferred.isError) {
    return <Box>Error...{JSON.stringify(response.isError)}</Box>;
  }


  const { data: responseRows } = response;
  const { data: transferredRows } = responseTransferred;

  const rows = responseRows.map(row => {
    const tmpRow = { ...row };
    const idx = transferredRows.findIndex((trRow) => {
      return trRow.stockpileId === row.id;
    });

    if (idx > -1) {
      tmpRow.balanceAmount = row.balanceAmount - transferredRows[idx].amount;
      tmpRow.actualAmount = row.actualAmount - transferredRows[idx].amount;
    }

    return tmpRow;
  });


  const handleRequestSort = (_, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectStockpileClick = (_, id, balanceAmount) => {
    const isSelect = !isSelected(id);

    if (isDisabled(id)) return;

    if (isSelect) {
      setSelected((prevState) => {
        return {
          ...prevState,
          [id]: balanceAmount,
        };
      });
    } else {
      const tmp = {...selected};
      delete tmp[id];

      setSelected(tmp);
    }
  };

  const handleChangeAmount = (event) => {
    const id = event.target.name;
    const value = Number.parseInt(event.target.value);

    setSelected((prevState) => {
      return {
        ...prevState,
        [id]: value,
      };
    });
  };

  const isSelected = (id) => {
    return selected.hasOwnProperty(`${id}`);
  };

  const isDisabled = (id) => {
    return selectedProp.hasOwnProperty(`${id}`);
  };

  if (rows || rows.length > 0) {
    return (
      <>
        <DialogTitle>Запаси</DialogTitle>
        <DialogContent dividers>
          <TableContainer>
            <Table
              ref={tableRef}
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size='small'
            >
              <DataTableHead
                numSelected={Object.keys(selected).length}
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
                    const labelId = `transfer-spl-add-table-item-${row.id}`;

                    return (
                      <TableRow
                        hover
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
                            onClick={(event) => handleSelectStockpileClick(event, row.id, row.balanceAmount)}
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
                        <TableCell align="center">
                          {!isItemSelected && row.balanceAmount}
                          {isItemSelected && (
                            <NumberTextField name={row.id} value={selected[row.id]} min={1} max={row.actualAmount} onChange={handleChangeAmount} />
                          )}
                        </TableCell>
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

  {/* No stockpile records (default)*/ }
  return (
    <>
      <DialogTitle>Запаси</DialogTitle>
      <DialogContent dividers>
        <Typography>На балансі не знаходиться жодних запасів, які можна передати</Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onCancel}>
          Скасувати
        </Button>
      </DialogActions>
    </>
  );
}

AddDialogStockpile.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  isOpen: PropTypes.bool,
};

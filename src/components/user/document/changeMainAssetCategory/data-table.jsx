import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import { visuallyHidden } from '@mui/utils';
import { headerColumns } from '@/setupObjects/documents/changeMainAssetCategory/headerColumns';
import { generalSettings } from '@/setupObjects/generalSettings';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

import useFetchGet from '@/hooks/useFetch';
import { getTransferredSupplySelectedDataState, setSelectedTransferredSupply, resetSelect } from '@/store/slices/selected-data-slice';
import stableSort from '../../../../utils/stable-sort';
import { getChangedCategoryMainAssetsState, decrement } from '../../../../store/slices/document-changeMainAssetCategory-slice';
import { getChangeCategorySelectedDataState } from '../../../../store/slices/selected-data-slice';

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

export function DataTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          {onSelectAllClick && (
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all items',
              }}
            />
          )}
        </TableCell>
        {headerColumns
          .map(({ title, label }) => (
            <TableCell
              key={title}
              align='center'
              padding='none'
              sortDirection={orderBy === title ? order : false}
            >
              <TableSortLabel
                active={orderBy === title}
                direction={orderBy === title ? order : 'asc'}
                onClick={createSortHandler(title)}
              >
                {label}
                {orderBy === title ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))
        }
        <TableCell padding="checkbox">
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

DataTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function DataTableToolbar(props) {
  const { numSelected, title } = props;
  const rowsPlural = (numSelected === 1) ? 'рядок' : (numSelected >= 2 && numSelected <= 4) ? 'рядки' : 'рядків';

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          Позначено {numSelected} {rowsPlural}
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {title}
        </Typography>
      )}
    </Toolbar>
  );
}

DataTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
};

export default function DataTable() {
  const mainAssetIds = useSelector(getChangedCategoryMainAssetsState);
  const selectedSupply = useSelector(getChangeCategorySelectedDataState);
  const responseMainAssets = useFetchGet(`/api/GET/main-assets-selected`, mainAssetIds);

  const dispatch = useDispatch();

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('title');

  if (responseMainAssets.isLoading) {
    return <Box>Loading...</Box>;
  }
  if (responseMainAssets.isError) {
    return <Box>Error...</Box>;
  }

  const { data: rows } = responseMainAssets;

  const handleRequestSort = (_, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      dispatch(setSelectedTransferredSupply(newSelected));
      return;
    }
    dispatch(setSelectedTransferredSupply([]));
  };

  const handleSelectClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

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

    dispatch(setSelectedTransferredSupply(newSelected));
  };

  const handleObjectRemove = (id, type) => {
    dispatch(decrement({id, type}));
    dispatch(resetSelect());
  };



  const selected = selectedSupply;
  const isSelected = (name) => selected.indexOf(name) !== -1;

  return (
    <Box sx={{ width: '100%', height: '99%' }}>
      <Paper sx={{ width: '100%', mb: 2, height: '99%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box>
          <DataTableToolbar numSelected={selected.length} title='Обладнання' />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size='small'
            >
              <DataTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .map((row, idx) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `transfer-supply-table-item-${row.id}`;

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
                            onClick={(event) => handleSelectClick(event, row.id)}
                            id={labelId}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                          sx={{ display: 'flex', alignItems: 'center'}}
                        >
                          {row.title}
                        </TableCell>
                        <TableCell align="center">{row.inventoryNumber}</TableCell>
                        <TableCell align="center">{row.serialNumber}</TableCell>
                        <TableCell align="center">{row.integer.title}</TableCell>
                        <TableCell align="center">{row.cost}&nbsp;{generalSettings.currency}</TableCell>
                        <TableCell align="center">
                          <IconButton color="error" aria-label="delete" onClick={ () => handleObjectRemove(row.id, row.type) }>
                            <RemoveCircleIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
    </Box>
  );
}
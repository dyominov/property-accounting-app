import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { headerColumns } from '@/setupObjects/main-assets/headerColumns';
import { generalSettings } from '@/setupObjects/generalSettings';

import FilterDialog from './filter-dialog';
import { getMainAssetsSearchState } from '../../../store/slices/search-slice';
import useFetchGet from '@/hooks/useFetch';
import { getMainAssetsSelectedDataState, setSelectedMainAssets } from '@/store/slices/selected-data-slice';
import stableSort from '../../../utils/stable-sort';
import MainAssetStatus from '../../global/mainAsset-status';

const DATE_FORMAT = process.env.DATE_FORMAT;

function descendingComparator(a, b, orderBy) {
  switch (orderBy) {
    case 'group':
      if (b.group && a.group) return 0;

      if (b.group.id < a.group.id) {
        return -1;
      }
      if (b.group.id > a.group.id) {
        return 1;
      }
      return 0;
    default:
      if (b[orderBy] < a[orderBy]) {
        return -1;
      }
      if (b[orderBy] > a[orderBy]) {
        return 1;
      }
      return 0;
  }
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function DataTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, columnsFilter } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all items',
            }}
          />
        </TableCell>
        {headerColumns
          .filter(({ title }) => columnsFilter[title])
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
      </TableRow>
    </TableHead>
  );
}

DataTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  columnsFilter: PropTypes.object.isRequired,
};

function DataTableToolbar(props) {
  const { numSelected, title, onFilterDialogClick } = props;
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

      {numSelected === 0 && (
        <Tooltip title="Фільтр">
          <IconButton onClick={onFilterDialogClick}>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

DataTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
};

export default function DataTable() {
  const response = useFetchGet(`/api/GET/main-assets?status=OWNED&status=PINNED&status=UNDEFINED`);

  const dispatch = useDispatch();

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('title');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [filter, setFilter] = useState({
    columns: {
      title: true,
      group: true,
      dateOfManufacture: true,
      dateOfStartOperation: true,
      inventoryNumber: true,
      serialNumber: true,
      category: true,
      integer: true,
      cost: true,
      aowat: true,
    },
    dateOfManufactureRange: {
      startDate: null,
      endDate: null,
      key: 'selection',
    },
    dateOfStartOperationRange: {
      startDate: null,
      endDate: null,
      key: 'selection',
    },
    costRange: {
      start: '',
      end: ''
    },
    aowatRange: {
      start: '',
      end: ''
    },
    categories: {},
  });
  const search = useSelector(getMainAssetsSearchState);
  const selected = useSelector(getMainAssetsSelectedDataState);

  if (response.isLoading) {
    return <Box>Loading...</Box>;
  }
  if (response.isError) {
    return <Box>Error...</Box>;
  }

  const { data: rows } = response;

  const searchedRows = rows.filter(item => {
    const { expr, options } = search;
    let findedByTitle = false;
    let findedByGroup = false;
    let findedByDateOfManufacture = false;
    let findedByDateOfStartOperation = false;
    let findedByInventoryNumber = false;
    let findedBySerialNumber = false;
    let findedByCategory = false;
    let findedByInteger = false;
    let findedByCost = false;
    let findedByAowat = false;

    if (!expr) {
      findedByTitle = true;
      findedByGroup = true;
      findedByDateOfManufacture = true;
      findedByDateOfStartOperation = true;
      findedByInventoryNumber = true;
      findedBySerialNumber = true;
      findedByCategory = true;
      findedByInteger = true;
      findedByCost = true;
      findedByAowat = true;
    }

    if (options.searchByColumns.title && expr) {
      if (options.matchCase) {
        findedByTitle = item.title.includes(expr);
      } else {
        findedByTitle = item.title.toLowerCase().includes(expr.toLowerCase());
      }
    }

    if (options.searchByColumns.group && expr) {
      if (options.matchCase) {
        findedByGroup = item.group && item.group.title.includes(expr);
      } else {
        findedByGroup = item.group && item.group.title.toLowerCase().includes(expr.toLowerCase());
      }
    }

    if (options.searchByColumns.dateOfManufacture && expr) {
      findedByDateOfManufacture = moment(item.dateOfManufacture)
        .format(DATE_FORMAT)
        .includes(expr);
    }

    if (options.searchByColumns.dateOfStartOperation && expr) {
      findedByDateOfStartOperation = moment(item.dateOfStartOperation)
        .format(DATE_FORMAT)
        .includes(expr);
    }

    if (options.searchByColumns.inventoryNumber && expr) {
      findedByInventoryNumber = item.inventoryNumber.includes(expr);
    }

    if (options.searchByColumns.serialNumber && expr) {
      findedBySerialNumber = item.serialNumber.includes(expr);
    }

    if (options.searchByColumns.category && expr) {
      if (options.matchCase) {
        findedByCategory = item.category.title.includes(expr);
      } else {
        findedByCategory = item.category.title.toLowerCase().includes(expr.toLowerCase());
      }
    }

    if (options.searchByColumns.integer && expr) {
      if (options.matchCase) {
        findedByInteger = item.integer.title.includes(expr);
      } else {
        findedByInteger = item.integer.title.toLowerCase().includes(expr.toLowerCase());
      }
    }

    if (options.searchByColumns.cost && expr) {
      findedByCost = item.cost.toString().includes(expr);
    }

    if (options.searchByColumns.aowat && expr) {
      findedByAowat = item.aowat.toString().includes(expr);
    }

    return findedByTitle ||
      findedByGroup ||
      findedByDateOfManufacture ||
      findedByDateOfStartOperation ||
      findedByInventoryNumber ||
      findedBySerialNumber ||
      findedByCategory ||
      findedByInteger ||
      findedByCost ||
      findedByAowat;
  });

  const filteredRows = searchedRows.filter(item => {
    let filteredByCost = true;
    let filteredByAowat = true;
    let filteredByDateOfManufacture = true;
    let filteredByDateOfStartOperation = true;

    // filter by cost
    {
      const { start, end } = filter.costRange;
      if (start && end) {
        filteredByCost = (item.cost >= start) && (item.cost <= end);
      } else if (start && !end) {
        filteredByCost = item.cost >= start;
      } else if (!start && end) {
        filteredByCost = item.cost <= end;
      }
    }

    // filter by aowat
    {
      const { start, end } = filter.aowatRange;
      if (start && end) {
        filteredByAowat = (item.aowat >= start) && (item.aowat <= end);
      } else if (start && !end) {
        filteredByAowat = item.aowat >= start;
      } else if (!start && end) {
        filteredByAowat = item.aowat <= end;
      }
    }

    // filter by dateOfManufacture
    {
      const { startDate, endDate } = filter.dateOfManufactureRange;
      if (startDate && endDate) {
        filteredByDateOfManufacture = moment(item.dateOfManufacture).isSameOrAfter(startDate) && moment(item.dateOfManufacture).isSameOrBefore(endDate);
      } else if (startDate && !endDate) {
        filteredByDateOfManufacture = moment(item.dateOfManufacture).isSameOrAfter(startDate);
      } else if (!startDate && endDate) {
        filteredByDateOfManufacture = moment(item.dateOfManufacture).isSameOrBefore(endDate);
      }
    }

    // filter by dateOfStartOperation
    {
      const { startDate, endDate } = filter.dateOfStartOperationRange;
      if (startDate && endDate) {
        filteredByDateOfStartOperation = moment(item.dateOfStartOperation).isSameOrAfter(startDate) && moment(item.dateOfStartOperation).isSameOrBefore(endDate);
      } else if (startDate && !endDate) {
        filteredByDateOfStartOperation = moment(item.dateOfStartOperation).isSameOrAfter(startDate);
      } else if (!startDate && endDate) {
        filteredByDateOfStartOperation = moment(item.dateOfStartOperation).isSameOrBefore(endDate);
      }
    }


    return filteredByCost && filteredByAowat && filteredByDateOfManufacture && filteredByDateOfStartOperation;
  });

  const handleRequestSort = (_, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = filteredRows.map((n) => n.id);
      dispatch(setSelectedMainAssets(newSelected));
      return;
    }
    dispatch(setSelectedMainAssets([]));
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

    dispatch(setSelectedMainAssets(newSelected));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty filteredRows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length) : 0;

  const handleClickFilterDialogkOpen = () => {
    setOpenFilterDialog(true);
  };

  const handleFilterDialogClose = (value) => {
    setOpenFilterDialog(false);
    setFilter((prev) => ({
      ...prev,
      ...value
    }));
  };

  return (
    <Box sx={{ width: '100%', height: '99%' }}>
      <Paper sx={{ width: '100%', mb: 2, height: '99%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box>
          <DataTableToolbar numSelected={selected.length} title='Основні засоби' onFilterDialogClick={handleClickFilterDialogkOpen} />
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
                rowCount={filteredRows.length}
                columnsFilter={filter.columns}
              />
              <TableBody>
                {stableSort(filteredRows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `main-assets-table-item-${row.id}`;

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
                            id={labelId}
                          />
                        </TableCell>
                        {filter.columns.title && (
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <MainAssetStatus status={row.status} />
                              {row.title}
                            </Box>
                          </TableCell>
                        )}
                        {filter.columns.group && <TableCell align="right">{row.group ? row.group.title : ''}</TableCell>}
                        {filter.columns.dateOfManufacture && <TableCell align="center">{moment(row.dateOfManufacture).format(DATE_FORMAT)}</TableCell>}
                        {filter.columns.dateOfStartOperation && <TableCell align="center">{moment(row.dateOfStartOperation).format(DATE_FORMAT)}</TableCell>}
                        {filter.columns.inventoryNumber && <TableCell align="center">{row.inventoryNumber}</TableCell>}
                        {filter.columns.serialNumber && <TableCell align="center">{row.serialNumber}</TableCell>}
                        {filter.columns.category && <TableCell align="center">{row.category.title}</TableCell>}
                        {filter.columns.integer && <TableCell align="center">{row.integer.title}</TableCell>}
                        {filter.columns.cost && <TableCell align="center">{row.cost}&nbsp;{generalSettings.currency}</TableCell>}
                        {filter.columns.aowat && <TableCell align="center">{row.aowat}&nbsp;{generalSettings.currency}</TableCell>}
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 33 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FilterDialog
        initialState={filter}
        open={openFilterDialog}
        onClose={handleFilterDialogClose} />
    </Box>
  );
}
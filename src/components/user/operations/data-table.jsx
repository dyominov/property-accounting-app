import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
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
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { headerColumns } from '@/setupObjects/operations/headerColumns';
import { generalSettings } from '@/setupObjects/generalSettings';
import FilterDialog from './filter-dialog';
import { getOperationsSearchState } from '@/store/slices/search-slice';
import useFetchGet from '@/hooks/useFetch';
import { getOperationsSelectedDataState } from '@/store/slices/selected-data-slice';
import { Operation } from '@prisma/client';
import stableSort from '../../../utils/stable-sort';
import StyledTableRow from '../../global/styled-table-row';

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
  const { order, orderBy, onRequestSort, columnsFilter } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
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
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  columnsFilter: PropTypes.object.isRequired,
};

function DataTableToolbar(props) {
  const { title, onFilterDialogClick } = props;
  
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      <Typography
        sx={{ flex: '1 1 100%' }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        {title}
      </Typography>

      <Tooltip title="Фільтр">
        <IconButton onClick={onFilterDialogClick}>
          <FilterListIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
}

DataTableToolbar.propTypes = {
  title: PropTypes.string.isRequired,
};

export default function DataTable() {
  const response = useFetchGet(`/api/GET/operations`);

  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('date');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [filter, setFilter] = useState({
    columns: {
      title: true,
      type: true,
      rowType: true, // mainAsset, stockpile or document
      document: true,
      date: true,
      inventoryNumber: true,
      serialNumber: true,
      cost: true,
      user: true,
      scans: true,
    },
    dateRange: {
      startDate: null,
      endDate: null,
      key: 'selection',
    },
    costRange: {
      start: '',
      end: ''
    },
    types: {},
    rowTypes: {},
    users: {},
  });
  const search = useSelector(getOperationsSearchState);
  const selected = useSelector(getOperationsSelectedDataState);

  if (response.isLoading) {
    return <Box>Loading...</Box>;
  }
  if (response.isError) {
    return <Box>Error...</Box>;
  }

  const {data: rows} = response;

  const searchedRows = rows.map(item => {
    let type;

    switch (item.type) {
      case Operation.ADD_SUPPLY:
        type = 'Додавання МЦ';
        break;
      case Operation.PIN_MAIN_ASSET:
        type = 'Закріплення обладнання';
        break;
      case Operation.TRANSFER_SUPPLY:
        type = 'Передача обладнання';
        break;
      case Operation.CHANGE_CATEGORY:
        type = 'Зміна категорії';
        break;

      default:
        break;
    }
    return {
      ...item,
      type,
    };
  }).filter(item => {
    const { expr, options } = search;

    let findedByTitle = false;
    let findedByType = false;
    let findedByRowType = false;
    let findedByDocument = false;
    let findedByDate = false;
    let findedByInventoryNumber = false;
    let findedBySerialNumber = false;
    let findedByCost = false;
    let findedByUser = false;

    if (!expr) {
      findedByTitle = true;
      findedByType = true;
      findedByRowType = true;
      findedByDocument = true;
      findedByDate = true;
      findedByInventoryNumber = true;
      findedBySerialNumber = true;
      findedByCost = true;
      findedByUser = true;
    }

    if (options.searchByColumns.title && expr) {
      if (options.matchCase) {
        findedByTitle = item.title.includes(expr);
      } else {
        findedByTitle = item.title.toLowerCase().includes(expr.toLowerCase());
      }
    }

    if (options.searchByColumns.type && expr) {
      if (options.matchCase) {
        findedByType = item.type && item.type.includes(expr);
      } else {
        findedByType =item.type && item.type.toLowerCase().includes(expr.toLowerCase());
      }
    }
    if (options.searchByColumns.rowType && expr) {
      if (options.matchCase) {
        findedByRowType = item.rowType && item.rowType.includes(expr);
      } else {
        findedByRowType = item.rowType && item.rowType.toLowerCase().includes(expr.toLowerCase());
      }
    }
    if (options.searchByColumns.document && expr) {
      if (options.matchCase) {
        findedByDocument = item.document && item.document.includes(expr);
      } else {
        findedByDocument = item.document && item.document.toLowerCase().includes(expr.toLowerCase());
      }
    }

    if (options.searchByColumns.date && expr) {
      findedByDate = moment(item.date)
        .format(DATE_FORMAT)
        .includes(expr);
    }

    if (options.searchByColumns.inventoryNumber && expr) {
      findedByInventoryNumber = item.inventoryNumber.includes(expr);
    }

    if (options.searchByColumns.serialNumber && expr) {
      findedBySerialNumber = item.serialNumber.includes(expr);
    }

    if (options.searchByColumns.cost && expr) {
      findedByCost = item.cost === expr;
    }

    if (options.searchByColumns.user && expr) {
      if (options.matchCase) {
        findedByUser = item.user && item.user.includes(expr);
      } else {
        findedByUser = item.user && item.user.toLowerCase().includes(expr.toLowerCase());
      }
    }

    return findedByTitle || 
      findedByType || 
      findedByRowType || 
      findedByDocument || 
      findedByDate || 
      findedByInventoryNumber ||
      findedBySerialNumber ||
      findedByCost ||
      findedByUser;
  });

  const filteredRows = searchedRows.filter(item => {
    let filteredByCost = true;
    let filteredByUser= true;
    let filteredByDate = true;
    let filteredByType = true;

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

    // filter by date
    {
      const { startDate, endDate } = filter.dateRange;
      if (startDate && endDate) {
        filteredByDate = moment(item.date).isSameOrAfter(startDate) && moment(item.date).isSameOrBefore(endDate);
      } else if (startDate && !endDate) {
        filteredByDate = moment(item.date).isSameOrAfter(startDate);
      } else if (!startDate && endDate) {
        filteredByDate = moment(item.date).isSameOrBefore(endDate);
      }
    }

    return filteredByCost && filteredByDate;
  });

  const handleRequestSort = (_, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (_, newPage) => {
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
          <DataTableToolbar title='Операції' onFilterDialogClick={handleClickFilterDialogkOpen} />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size='small'
            >
              <DataTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                columnsFilter={filter.columns}
              />
              <TableBody>
                {stableSort(filteredRows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, idx) => {
                    const isItemSelected = isSelected(row.id);

                    return (
                      <StyledTableRow
                        hover
                        tabIndex={-1}
                        key={idx}
                      >
                        {filter.columns.title && <TableCell align="left">{row.title}</TableCell>}
                        {filter.columns.type && <TableCell align="left">{row.type}</TableCell>}
                        {filter.columns.document && <TableCell align="left">{row.document}</TableCell>}
                        {filter.columns.date && <TableCell align="center">{row.date}</TableCell>}
                        {filter.columns.inventoryNumber && <TableCell align="center">{row.inventoryNumber}</TableCell>}
                        {filter.columns.serialNumber && <TableCell align="center">{row.serialNumber}</TableCell>}
                        {filter.columns.cost && <TableCell align="center">{row.cost}&nbsp;{row.cost && generalSettings.currency}</TableCell>}
                        {filter.columns.user && <TableCell align="center">{row.user}</TableCell>}
                        {filter.columns.scans && <TableCell align="center">{row.scans ? row.scans : ''}</TableCell>}
                      </StyledTableRow>
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
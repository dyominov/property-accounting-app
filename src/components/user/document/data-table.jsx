import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
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
import { headerColumns } from '@/setupObjects/documents/headerColumns';
import FilterDialog from './filter-dialog';
import { getDocumentsSearchState } from '@/store/slices/search-slice';
import useFetchGet from '@/hooks/useFetch';
import { setSelectedDocuments, getDocumentsSelectedDataState } from '@/store/slices/selected-data-slice';
import { Operation } from '@prisma/client';
import stableSort from '../../../utils/stable-sort';
import StyledTableRow from '../../global/styled-table-row';

const DATE_FORMAT = process.env.DATE_FORMAT;

function descendingComparator(a, b, orderBy) {
  switch (orderBy) {
    case 'type':
      return b.type.docType.title.localeCompare(a.type.docType.title);
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
  const router = useRouter();
  const response = useFetchGet(`/api/GET/documents`);

  const dispatch = useDispatch();

  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('date');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [filter, setFilter] = useState({
    columns: {
      type: true,
      number: true,
      date: true,
      realizedAt: true,
      user: true,
    },
    dateRange: {
      startDate: null,
      endDate: null,
      key: 'selection',
    },
    dateOfRealizationRange: {
      startDate: null,
      endDate: null,
      key: 'selection',
    },
  });
  const search = useSelector(getDocumentsSearchState);
  const selected = useSelector(getDocumentsSelectedDataState);

  if (response.isLoading) {
    return <Box>Loading...</Box>;
  }
  if (response.isError) {
    return <Box>Error...</Box>;
  }

  const { data: rows } = response;

  const searchedRows = rows.filter(item => {
    const { expr, options } = search;

    let findedByType = false;
    let findedByNumber = false;
    let findedByDate = false;
    let findedByDateOfRealization = false;
    let findedByUser = false;

    if (!expr) {
      findedByType = true;
      findedByNumber = true;
      findedByDate = true;
      findedByDateOfRealization = true;
      findedByUser = true;
    }

    if (options.searchByColumns.type && expr) {
      if (options.matchCase) {
        findedByType = item.type && item.type.docType.title.includes(expr);
      } else {
        findedByType = item.type && item.type.docType.title.toLowerCase().includes(expr.toLowerCase());
      }
    }

    if (options.searchByColumns.number && expr) {
      if (options.matchCase) {
        findedByNumber = item.number.includes(expr);
      } else {
        findedByNumber = item.number.toLowerCase().includes(expr.toLowerCase());
      }
    }

    if (options.searchByColumns.date && expr) {
      findedByDate = moment(item.date)
        .format(DATE_FORMAT)
        .includes(expr);
    }

    if (options.searchByColumns.realizedAt && expr) {
      findedByDateOfRealization = moment(item.realizedAt)
        .format(DATE_FORMAT)
        .includes(expr);
    }

    if (options.searchByColumns.user && expr) {
      if (options.matchCase) {
        findedByUser = item.user && item.user.name.includes(expr);
      } else {
        findedByUser = item.user && item.user.name.toLowerCase().includes(expr.toLowerCase());
      }
    }

    return findedByType ||
      findedByNumber ||
      findedByDate ||
      findedByDateOfRealization ||
      findedByUser;
  });

  const filteredRows = searchedRows.filter(item => {
    let filteredByDate = true;
    let filteredByDateOfRealization = true;

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

    // filter by realizedAt
    {
      const { startDate, endDate } = filter.dateOfRealizationRange;
      if (startDate && endDate) {
        filteredByDateOfRealization = moment(item.realizedAt).isSameOrAfter(startDate) && moment(item.realizedAt).isSameOrBefore(endDate);
      } else if (startDate && !endDate) {
        filteredByDateOfRealization = moment(item.realizedAt).isSameOrAfter(startDate);
      } else if (!startDate && endDate) {
        filteredByDateOfRealization = moment(item.realizedAt).isSameOrBefore(endDate);
      }
    }


    return filteredByDate && filteredByDateOfRealization;
  });

  const handleRequestSort = (_, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = filteredRows.map((n) => ({ id: n.id, operation: n.type.operation }));
      dispatch(setSelectedDocuments(newSelected));
      return;
    }
    dispatch(setSelectedDocuments([]));
  };

  const handleSelectClick = (event, operation, id) => {
    event.stopPropagation();
    const selectedIndex = selected.findIndex(item => item.id === id && item.operation === operation);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, { id, operation });
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

    dispatch(setSelectedDocuments(newSelected));
  };
  const handleRowClick = (_, operation, id) => {
    let operationUrl = '';

    switch (operation) {
      case Operation.ADD_SUPPLY:
        operationUrl = 'add-supply';
        break;
      case Operation.PIN_MAIN_ASSET:
        operationUrl = 'pin-ma';
        break;
      case Operation.TRANSFER_SUPPLY:
        operationUrl = 'transfer-supply';
        break;
      case Operation.CHANGE_CATEGORY:
        operationUrl = 'change-ma-category';
        break;
      default:
        break;
    }
    router.push(`/document/${operationUrl}/${id}`);
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id, operation) => {
    return selected.findIndex(item => item.id === id && item.operation === operation) !== -1;
  };

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
          <DataTableToolbar numSelected={selected.length} title='Документи' onFilterDialogClick={handleClickFilterDialogkOpen} />
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
                  .map((row, idx) => {
                    const isItemSelected = isSelected(row.id, row.type.operation);
                    const labelId = `documents-table-item-${idx}`;

                    return (
                      <StyledTableRow
                        hover
                        tabIndex={-1}
                        key={idx}
                        selected={isItemSelected}
                        onClick={(event) => handleRowClick(event, row.type.operation, row.id)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            onClick={(event) => handleSelectClick(event, row.type.operation, row.id)}
                            color="primary"
                            checked={isItemSelected}
                            id={labelId}
                          />
                        </TableCell>
                        {filter.columns.type && (
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                          >
                            {row.type.docType.title}
                          </TableCell>
                        )}
                        {filter.columns.number && <TableCell align="center">{row.number}</TableCell>}
                        {filter.columns.date && <TableCell align="center">{moment(row.date).format(DATE_FORMAT)}</TableCell>}
                        {filter.columns.realizedAt && <TableCell align="center">{row.realizedAt ? moment(row.realizedAt).format(DATE_FORMAT) : ''}</TableCell>}
                        {filter.columns.user && <TableCell align="center">{row.creator.name}</TableCell>}
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
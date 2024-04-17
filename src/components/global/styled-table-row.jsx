import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.grey[200],
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  '&.MuiTableRow-hover:hover': {
    backgroundColor: theme.palette.grey[300]
  }
}));

export default StyledTableRow;
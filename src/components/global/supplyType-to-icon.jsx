import CropSquareIcon from '@mui/icons-material/CropSquare';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import { pink, teal } from '@mui/material/colors';

const SupplyTypeToIcon = ({type}) => {
  switch (type) {
    case 'ma':
      return <ChangeHistoryIcon sx={{ color: pink[500], mr: 1 }} />;
    case 's':
      return <CropSquareIcon sx={{ color: teal[500], mr: 1 }} />;
  }
};

export default SupplyTypeToIcon;
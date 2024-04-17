import { LinearProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";

export default function ProgressBar({progressInfo}) {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary">{progressInfo.label}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" value={progressInfo.percentage} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${progressInfo.percentage}%`}</Typography>
        </Box>
      </Box>
    </Box>
    
  );
}
import { MainAssetStatus as Status } from "@prisma/client";
import PushPinIcon from '@mui/icons-material/PushPin';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

const MainAssetStatus = ({status}) => {
  switch (status) {
    case Status.PINNED:
      return <PushPinIcon />;
    case Status.UNDEFINED:
      return <AccessTimeFilledIcon />;
  }
};

export default MainAssetStatus;
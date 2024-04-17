import PropTypes from 'prop-types';
import moment from 'moment';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import { useEffect, useRef, useState } from 'react';
import { Typography } from '@mui/material';
import ProgressBar from './progress-bar';
import { useSelector } from 'react-redux';
import { getDocumentHeaderState } from '@/store/slices/document-header-slice';
import { getObjectsState } from '@/store/slices/document-addSupply-slice';
import { useRouter } from 'next/router';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import DangerousIcon from '@mui/icons-material/Dangerous';
import { Box } from '@mui/system';
import { Operation } from '@prisma/client';
import { fetchPost, fetchGet } from '@/utils/fetchFns';
import { errorMessage } from '@/utils/message';
import delay from '../../utils/delay';
import runOnce from '../../utils/runOnce';
import FileUploadService from '../../services/file-upload-service';
import { useScanStore } from '../../store/store';
import { getSaveDocumentDialogIsRealizeState } from '../../store/slices/save-document-dialog-slice';
import { getHolderState, getPinnedMainAssetsState } from '../../store/slices/document-pinMainAsset-slice';
import { getTransferHolderState, getTransferredMainAssetsState, getTransferredStockpileState } from '../../store/slices/document-transferSupply-slice';
import { getChangedCategoryFullState } from '../../store/slices/document-changeMainAssetCategory-slice';

const DATE_FORMAT = process.env.DATE_FORMAT;

export default function SaveDocumentDialog(props) {
  const { onClose, open, operation, ...other } = props;

  const dialogRef = useRef(null);
  const router = useRouter();
  const scanFiles = useScanStore((state) => state.scans);
  const [documentTitle, setDocumentTitle] = useState('');
  const [isError, setIsError] = useState(false);
  const [progressInfo, setProgressInfo] = useState({
    percentage: 0,
    label: '',
  });

  const header = useSelector(getDocumentHeaderState);
  const objects = useSelector(getObjectsState);
  const holder = useSelector(getHolderState);
  const pinnedMainAssets = useSelector(getPinnedMainAssetsState);
  const transferredMainAssets = useSelector(getTransferredMainAssetsState);
  const transferredStockpile = useSelector(getTransferredStockpileState);
  const transferHolder = useSelector(getTransferHolderState);
  const changeCategoryDocument = useSelector(getChangedCategoryFullState);

  const realizeStatus = useSelector(getSaveDocumentDialogIsRealizeState);


  // reload parent page for proper runOnce execution
  useEffect(() => {
    const alreadyLoaded = sessionStorage.getItem('alreadyLoaded');

      if (!alreadyLoaded || alreadyLoaded === 'false') {
        sessionStorage.setItem('alreadyLoaded', true);
        window.location.reload();
      }
    }, []);

  useEffect(() => {
    if (header.type) {
      fetchGet(`/api/GET/document/type/${header.type}`)
        .then(type => {
          setDocumentTitle(`${type.data.title} ${header.number ? `№ ${header.number}` : ''} від ${moment(header.date).format(DATE_FORMAT)}`);
        });
    }
  }, [header.date, header.number, header.type]);

  const save = () => {
    const uploadScans = async (files) => {
      const perFilePercent = Math.floor(95.0 / files.length);
      const uploadPromises = files.map((file) => upload(file, perFilePercent));

      const result = await Promise.all(uploadPromises);

      if (!result) {
        setIsError(true);
      }

      const fileNames = result.map(response => response.data);

      return fileNames;
    };

    const upload = (file, perFilePercent) => {
      return FileUploadService.upload(file, operation, documentTitle, () => {
        setProgressInfo((prevState) => ({
          percentage: prevState.percentage + perFilePercent,
          label: `Збереження скан-копії ${file.name}`
        }));

      })
        .catch(() => {
          errorMessage(`Скан-копію ${file.name} не завантажено, помилка файлу.`);
        });
    };

    const saveDoc = (realize, scans = []) => {
      const finishDelay = (message) => {
        setProgressInfo({
          percentage: 99,
          label: message,
        });

        delay(2)
          .then(() => {
            setProgressInfo((prevState) => ({
              ...prevState,
              percentage: 100,
            }));

            delay(2)
              .then(() => {
                setProgressInfo((prevState) => ({
                  ...prevState,
                  percentage: 101,
                }));
              });
          });
      };

      let document = {};

      switch (operation) {
        case Operation.ADD_SUPPLY:
          document = {
            header,
            objects,
            scans,
          };

          if (realize) {
            fetchPost(`/api/POST/document/add-supply/save-realize`, document)
              .then(responseDoc => {
                if (responseDoc.isError) {
                  errorMessage(responseDoc.isError.message);
                  setIsError(true);
                  return;
                }
              })
              .catch(error => {
                errorMessage(error.message);
                setIsError(true);
              });

            finishDelay('Документ збережено і реалізовано');
          } else {
            fetchPost(`/api/POST/document/add-supply/save`, document)
              .then(responseDoc => {
                if (responseDoc.isError) {
                  errorMessage(responseDoc.isError.message);
                  setIsError(true);
                  return;
                }
              })
              .catch(error => {
                errorMessage(error.message);
                setIsError(true);
              });

            finishDelay('Документ збережено');
          }
          break;

        case Operation.PIN_MAIN_ASSET:
          document = {
            header,
            holder,
            pinnedMainAssets,
            scans,
          };

          if (realize) {
            fetchPost(`/api/POST/document/pin-ma/save-realize`, document)
              .then(responseDoc => {
                if (responseDoc.isError) {
                  errorMessage(responseDoc.isError.message);
                  setIsError(true);
                  return;
                }
              })
              .catch(error => {
                errorMessage(error.message);
                setIsError(true);
              });

            finishDelay('Документ збережено і реалізовано');
          } else {
            fetchPost(`/api/POST/document/pin-ma/save`, document)
              .then(responseDoc => {
                if (responseDoc.isError) {
                  errorMessage(responseDoc.isError.message);
                  setIsError(true);
                  return;
                }
              })
              .catch(error => {
                errorMessage(error.message);
                setIsError(true);
              });

            finishDelay('Документ збережено');
          }
          break;

        case Operation.TRANSFER_SUPPLY:
          document = {
            header,
            holder: transferHolder,
            mainAssets: transferredMainAssets,
            stockpile: transferredStockpile,
            scans,
          };

          if (realize) {
            fetchPost(`/api/POST/document/transfer-supply/save-realize`, document)
              .then(responseDoc => {
                if (responseDoc.isError) {
                  errorMessage(responseDoc.isError.message);
                  setIsError(true);
                  return;
                }
              })
              .catch(error => {
                errorMessage(error.message);
                setIsError(true);
              });

            finishDelay('Документ збережено і реалізовано');
          } else {
            fetchPost(`/api/POST/document/transfer-supply/save`, document)
              .then(responseDoc => {
                if (responseDoc.isError) {
                  errorMessage(responseDoc.isError.message);
                  setIsError(true);
                  return;
                }
              })
              .catch(error => {
                errorMessage(error.message);
                setIsError(true);
              });

            finishDelay('Документ збережено');
          }
          break;

        case Operation.CHANGE_CATEGORY:
          document = {
            header,
            ...changeCategoryDocument,
            scans,
          };

          console.log(document, 'DDDOCUME')

          if (realize) {
            fetchPost(`/api/POST/document/change-ma-category/save-realize`, document)
              .then(responseDoc => {
                if (responseDoc.isError) {
                  errorMessage(responseDoc.isError.message);
                  setIsError(true);
                  return;
                }
              })
              .catch(error => {
                errorMessage(error.message);
                setIsError(true);
              });

            finishDelay('Документ збережено і реалізовано');
          } else {
            fetchPost(`/api/POST/document/change-ma-category/save`, document)
              .then(responseDoc => {
                if (responseDoc.isError) {
                  errorMessage(responseDoc.isError.message);
                  setIsError(true);
                  return;
                }
              })
              .catch(error => {
                errorMessage(error.message);
                setIsError(true);
              });

            finishDelay('Документ збережено');
          }
          break;

        default:
          setIsError(true);
          break;
      }
    };

    if (scanFiles) {
      setProgressInfo((prevState) => ({
        ...prevState,
        label: 'Завантаження скан-копій...'
      }));

      uploadScans(scanFiles)
        .then((scans) => {
          setProgressInfo((prevState) => ({
            percentage: prevState.percentage + 1,
            label: 'Збереження документу...'
          }));

          saveDoc(realizeStatus, scans);
        });
    } else {
      saveDoc(realizeStatus);
    }
  };

  if (open) {
    runOnce(save);
  }

  const handleEntering = () => {
    if (dialogRef.current != null) {
      dialogRef.current.focus();
    }
  };

  const handleOk = () => {
    onClose();
    sessionStorage.setItem('alreadyLoaded', false);
    router.push('/');
  };

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '40%', minHeight: 235 } }}
      TransitionProps={{ onEntering: handleEntering }}
      open={open}
      {...other}
    >
      <DialogTitle>Збереження...</DialogTitle>
      <DialogContent dividers>
        {isError && (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '90px' }}>
            <DangerousIcon />
            <Typography variant="body1" sx={{ ml: 3, textAlign: 'left' }}>
              Помилка збереження
            </Typography>
          </Box>
        )}
        {!isError && (progressInfo.percentage < 101) && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <ReportProblemIcon />
              <Typography variant="body1" sx={{ ml: 3, textAlign: 'left' }}>
                Зачекайте доки завершиться збереження,
                не закривайте сторінку та не перезавантажуйте
                для коректної роботи програми!
              </Typography>
            </Box>
            <ProgressBar progressInfo={progressInfo} />
          </>
        )}
        {!isError && (progressInfo.percentage === 101) && (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '90px' }}>
            <CheckCircleIcon />
            <Typography variant="body1" sx={{ ml: 3, textAlign: 'left' }}>
              Документ успішно збережено
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOk} disabled={progressInfo.percentage < 101 && !isError}>Ок</Button>
      </DialogActions>
    </Dialog>
  );
}

SaveDocumentDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

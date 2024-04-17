import { Box, IconButton, ImageList, ImageListItem } from "@mui/material";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { useState } from "react";
import { useScanStore } from '../../store/store';

export default function ScanUpload({ sx }) {
  const setScans = useScanStore((state) => state.setScans);
  const [imagePreviews, setImagePreviews] = useState([]);

  const selectFiles = (event) => {
    let images = [];

    for (let i = 0; i < event.target.files.length; i++) {
      images.push(URL.createObjectURL(event.target.files[i]));
    }

    setImagePreviews(images);
    setScans(Array.from(event.target.files));
  };

  return (
    <Box sx={{...sx}}>
      <Box sx={{ display: 'flex' }}>
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="label"
        >
          <input hidden accept="image/*" type="file" name='scans' onChange={selectFiles} multiple />
          <AddAPhotoIcon />
        </IconButton>
      </Box>
      {imagePreviews && (
        <Box sx={{ width: '100%', height: 250, overflowY: 'scroll', my: 1 }} >
          <ImageList variant="masonry" cols={3} gap={8}>
            {imagePreviews.map((img, idx) => (
              <ImageListItem key={idx}>
                <img
                  className="preview"
                  src={`${img}`}
                  srcSet={`${img}`}
                  alt={`Scan ${idx + 1}`}
                  loading="lazy"
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      )}  
    </Box>
  );
}
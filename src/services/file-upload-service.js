import http from "../http-common";

const upload = (file, operation, documentTitle, onUploadProgress) => {
  let formData = new FormData();

  formData.append("file", file);
  formData.append('operation', operation);
  formData.append('documentTitle', documentTitle);

  return http.post("/api/POST/upload-scan", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
};

const FileUploadService = {
  upload,
};

export default FileUploadService; 
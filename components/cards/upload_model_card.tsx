import Card from "@mui/material/Card";
import { css } from "./styling";
import UploadIcon from "@mui/icons-material/Upload";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { useState } from "react";
import { useRouter } from "next/router";
import useUpload from "../hooks/upload_to_server";
import { IErrorUploadResponse } from "../../pages/api/filesUpload";
import { useAppDispatch } from "../../store/hooks/hooks";
import { previewPath } from "../../store/reducers/printing";

export default function UploadCard() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [uploading, setUploading] = useState(false);

  const { uploadFile } = useUpload({
    onUploadFinished: (response) => {
      dispatch(previewPath(response.writePath));
      router.push("/printing/upload");
    },
    onUploadError: (response: IErrorUploadResponse) => {
      // TODO: Make this a user notification
      console.log(response.error);
      setUploading(false);
    },
    onStartUpload: () => setUploading(true),
    folder: "models",
  });

  return (
    <>
      <input
        type="file"
        id="upload-input"
        style={{ display: "none" }}
        onChange={uploadFile}
        multiple={false}
        accept=".stl,.3mf,.obj"
      />
      <label htmlFor="upload-input">
        <Card sx={{ display: "flex", ...css }}>
          {uploading ? (
            <Box component="div" sx={{ width: "80%", margin: "auto" }}>
              <LinearProgress />
            </Box>
          ) : (
            <>
              <Box component="div" sx={{ flexGrow: 0.5 }} />
              <Box component="div" sx={{ display: "flex", margin: "auto" }}>
                <UploadIcon fontSize="large" />
              </Box>
              <Box component="div" sx={{ flexGrow: 0.5 }} />
            </>
          )}
        </Card>
      </label>
    </>
  );
}

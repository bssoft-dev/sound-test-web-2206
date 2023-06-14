import { useEffect, useState } from "react";
import axios from "axios";
import { useCtx } from "../../context/Context";

import { Button } from "@mui/material";

export default function FileUploadButton() {
    const context = useCtx();
    const {pathname, setAlert, fetchData, setServerHealth} = context;

    const [baseUrl, setBaseUrl] = useState('');
    const [isMultiple, setIsMultiple] = useState(false);

    useEffect(() => {
      switch(pathname) {
        case "/sound-test":
          setBaseUrl('https://sound.bs-soft.co.kr/analysis/uploadFile');
          fetchData('https://sound.bs-soft.co.kr/status');
          setIsMultiple(false);
          break;
        case "/bss-test":
          setBaseUrl('https://bss.bs-soft.co.kr/analysis/uploadFiles');
          fetchData('https://bss.bs-soft.co.kr/status');
          setIsMultiple(true);
          break; 
        case "/audio-test":
          setServerHealth(false);
        default:
          setServerHealth(false);
        }
    }, [pathname]);


    const uploadHandler = (event) => {
      const formData = new FormData();
      const files = event.target.files;
      // Array.from(files).forEach((file, i) => {
      //   formData.append('files', file);
      // });
      console.log(files.length);
      console.log('formData', formData)
      console.log(files[0]);
      
      if(isMultiple && files.length != 4) {
        setAlert({
          open: true, 
          type: "warning",
          message: "4개의 파일을 선택해 주세요."
        });
      } else {
        formData.append('file', files[0]);
        axios({
          url: baseUrl,
          method: 'POST',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(res => {
          if(res.status != 200) {
            setAlert({
              open: true, 
              type: "warning",
              message: "파일을 다시 확인해주세요."
            });
          }
          setAlert({
            open: true, 
            type: "success",
            message: "업로드를 완료하였습니다."
          });
          fetchData();
          console.log(res);
        }).catch(err => {
          setAlert({
            open: true, 
            type: "error",
            message: "업로드를 실패하였습니다. 파일을 다시 확인해주세요."
          });
        });
      }
    };

    if(!(pathname === "/sound-test" || pathname === "/bss-test")) {
      return "";
    }

    return (
      <Button variant="contained" component="label"
        sx={{marginLeft: {xs: 1, sm: 2}}}>
        파일업로드
        <input type="file" hidden
          sx={{ display: "none" }} 
          onChange={uploadHandler} 
          accept=".wav"
          multiple={isMultiple} />
      </Button>
    )
}
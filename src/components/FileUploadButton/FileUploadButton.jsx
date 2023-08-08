import { useEffect, useState } from "react";
import axios from "axios";
import { useCtx } from "../../context/Context";

import { Button } from "@mui/material";

export default function FileUploadButton() {
    const context = useCtx();
    const {pathname, setAlert, fetchData, setServerHealth, bssNumPerson, setLoading, handleSttResult} = context;

    const [baseUrl, setBaseUrl] = useState('');
    const [isMultiple, setIsMultiple] = useState(false);
    const uploadedPathNames = ["/sound-test", "/bss-test", "/stt-test"];
    const uploadedPathName = uploadedPathNames.includes(pathname);

    useEffect(() => {
      switch(pathname) {
        case "/sound-test":
          setBaseUrl('https://sound.bs-soft.co.kr/analysis/uploadFile');
          fetchData('https://sound.bs-soft.co.kr/status');
          setIsMultiple(false);
          break;
        case "/bss-test":
          setBaseUrl(`https://bss.bs-soft.co.kr/analysis/bss/${bssNumPerson}`);
          fetchData('https://bss.bs-soft.co.kr/status');
          setIsMultiple(true);
          break; 
        case "/audio-test":
          setServerHealth(false);
        case "/stt-test":
          setIsMultiple(false);
          setBaseUrl('https://sound.bs-soft.co.kr/analysis/stt/wavfile')
        default:
          setServerHealth(false);
        }
    }, [pathname, bssNumPerson]);

    const fetchHandler = (res) => {
      if (uploadedPathNames.includes(pathname)) {
        if (pathname === "/stt-test") {
          handleSttResult(res);
        } else {
          fetchData();
        }
      }
    }


    const uploadHandler = (event) => {
      setLoading(true);
      const files = event.target.files;
      const formData = new FormData();
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
      } 

      if(!isMultiple) {
        formData.append('file', files[0]);
      } else {
        Array.from(event.target.files).forEach((file, i) => {
          formData.append('files', file);
        });
      }

      axios({
        url: baseUrl,
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(res => {
        setLoading(false);
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
        fetchHandler(res.data);
        console.log(res);
      })
      .catch(err => {
        setLoading(false);
        setAlert({
          open: true, 
          type: "error",
          message: "업로드를 실패하였습니다. 파일을 다시 확인해주세요."
        });
      })
      .finally(() => event.target.value = "");
    }

    

    if(!(uploadedPathName)) {
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
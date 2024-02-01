import { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "@mui/material";
import { useStore } from "../../stores/useStore";
import { shallow } from "zustand/shallow";

export default function FileUploadButton() {
    const { pathname, setAlert, fetchData, setServerHealth, bssNumPerson, handleSttResult } = useStore(
      state => ({
        pathname: state.pathname, 
        setAlert: state.setAlert, 
        fetchData: state.fetchData, 
        setServerHealth: state.setServerHealth, 
        bssNumPerson: state.bssNumPerson, 
        handleSttResult: state.handleSttResult
      }), shallow
    );

    const [baseUrl, setBaseUrl] = useState('');
    const [isMultiple, setIsMultiple] = useState(false);
    const uploadedPathNames = ["/sound-test", "/bss-test", "/stt-test"];
    const uploadedPathName = uploadedPathNames.includes(pathname);

    useEffect(() => {
      switch(pathname) {
        case "/sound-test":
          setBaseUrl('https://sound.bs-soft.co.kr/analysis/uploadFile');
          setIsMultiple(false);
          break;
        case "/bss-test":      
          setBaseUrl(`https://bss.bs-soft.co.kr/analysis/bss/${bssNumPerson}`);
          fetchData('https://bss.bs-soft.co.kr/status');
          setIsMultiple(true);
          break; 
        // case "/audio-test":
        //   setServerHealth(false);
        case "/stt-test":
          setIsMultiple(false);
          setBaseUrl('https://stt.bs-soft.co.kr/analysis/stt/wavfile')
        // default:
        }
    }, [pathname, bssNumPerson]);

    const fetchHandler = (res) => {
      if (uploadedPathNames.includes(pathname)) {
        switch(pathname) {
          case "/stt-test":
            handleSttResult(res);
            break;
          // case "/sound-test": 
          //   break;
          case "/bss-test":
            fetchData('https://bss.bs-soft.co.kr/status');
            break;
        }
      }
    }


    const uploadHandler = (event) => {
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
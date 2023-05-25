import { Button } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useCtx } from "../../context/Context";

export default function FileUploadButton({fetchData}) {
    const context = useCtx();
    const {pathname, isAlert, setIsAlert} = context;

    const [baseUrl, setBaseUrl] = useState('');
    const [isMultiple, setIsMultiple] = useState(false);

    useEffect(() => {
        switch(pathname) {
            case "/sound-test":
                setBaseUrl('http://sound.bs-soft.co.kr/analysis/uploadFile');
                setIsMultiple(false);
                break;
            case "/bss-test":
                setBaseUrl('http://bss.bs-soft.co.kr/analysis/uploadFiles');
                setIsMultiple(true);
                break; 
        }
    }, [pathname])


    const uploadHandler = (event) => {
        const formData = new FormData();
        const files = event.target.files;
        // Array.from(files).forEach((file, i) => {
        //   formData.append('files', file);
        // });
        console.log(files.length);
        console.log(files[0]);
        
        if(isMultiple && files.length != 4) {
          setIsAlert({
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
              setIsAlert({
                open: true, 
                type: "warning",
                message: "파일을 다시 확인해주세요."
              });
            }
            setIsAlert({
              open: true, 
              type: "success",
              message: "업로드를 완료하였습니다."
            });
            fetchData();
            console.log(res);
          }).catch(err => {
            setIsAlert({
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
            sx={{marginLeft: 2}}>
            파일업로드
            <input type="file" hidden
              sx={{ display: "none" }} 
              onChange={uploadHandler} 
              accept=".wav"
              multiple={isMultiple} />
        </Button>
    )
}
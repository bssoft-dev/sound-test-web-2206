import { Button } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function FileUploadButton({fetchData}) {
    const [baseUrl, setBaseUrl] = useState('');
    const location = useLocation();

    useEffect(() => {
        switch(location.pathname) {
            case "/sound-test":
                setBaseUrl('http://sound.bs-soft.co.kr/analysis/uploadFile');
                break;
            case "/bss-test":
                setBaseUrl('http://bss.bs-soft.co.kr/analysis/uploadFiles');
                break; 
        }
    }, [location])


    const uploadHandler = (event) => {
        const formData = new FormData();
        // Array.from(event.target.files).forEach((file, i) => {
        //   formData.append('files', file);
        // });
        console.log(event.target.files[0]);
        formData.append('file', event.target.files[0]);
        axios({
          url: baseUrl,
          method: 'POST',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(res => {
          alert('업로드를 완료하였습니다.');
          fetchData()
        }).catch(err => {
          alert('업로드를 실패하였습니다. 파일을 다시 확인해주세요.');
        });
    };
    return (
        <Button variant="contained" component="label"
            sx={{marginLeft: 2}}>
            파일업로드
            <input type="file" sx={{ display: "none" }} onChange={uploadHandler} hidden multiple/>
        </Button>
    )
}
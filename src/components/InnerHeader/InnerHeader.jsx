import { Button, Typography } from "@mui/material";
import axios from "axios";

import TutorialModal from "../Modal/TutorialModal";

import './innerHeader.css'

export default function InnerHeader({title, fetchData}) {

	const uploadHandler = (event) => {
    const formData = new FormData();
    // Array.from(event.target.files).forEach((file, i) => {
    //   formData.append('files', file);
    // });
    console.log(event.target.files[0]);
    formData.append('file', event.target.files[0]);
    axios({
      url: `http://sound.bs-soft.co.kr/analysis/uploadFile`,
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

    return (<div className="innerHeader row">
        <Typography variant="h6" className="title" color="text.primary">
            {title}
        </Typography>
        <div className="btnWrap">
            <TutorialModal />
            <Button variant="contained" component="label">
                파일업로드
                <input type="file" sx={{ display: "none" }} onChange={uploadHandler} hidden multiple/>
            </Button>
        </div>
    </div>)
}
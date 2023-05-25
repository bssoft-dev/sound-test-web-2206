import { Typography } from "@mui/material";

import TutorialModal from "../Modal/TutorialModal";

import './innerHeader.css'
import FileUploadButton from "../../FileUploadButton/FileUploadButton";

export default function InnerHeader({title, fetchData}) {

    return (<div className="innerHeader row">
        <Typography variant="h5" className="title" color="text.primary">
            {title}
        </Typography>
        <div className="btnWrap">
          {/* 도움말은 해당 페이지에 맞춰서 변경 될 필요 있음 */}
          <TutorialModal />
          <FileUploadButton fetchData={fetchData} />
        </div>
    </div>)
}
import TutorialModal from "../Modal/TutorialModal";
import Microphone from "../../Microphone/Microphone";
import FileUploadButton from "../../FileUploadButton/FileUploadButton";
import { useCtx } from "../../../context/Context";
import './innerHeader.css'

import { Typography } from "@mui/material";

export default function InnerHeader() {
    const context = useCtx();
    const { title } = context;
    
    return (<div className="innerHeader row">
        <Typography variant="h5" className="title" color="text.primary">
            {title}
        </Typography>
        <div className="btnWrap">
          {/* 도움말은 해당 페이지에 맞춰서 변경 될 필요 있음 */}
          <TutorialModal />
          <Microphone />
          <FileUploadButton />
        </div>
    </div>)
}
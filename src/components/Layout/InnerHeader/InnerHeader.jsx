import { Typography } from "@mui/material";

import TutorialModal from "../Modal/TutorialModal";

import './innerHeader.css'
import FileUploadButton from "../../FileUploadButton/FileUploadButton";
import { useCtx } from "../../../context/Context";
import Microphone from "../../Microphone/Microphone";

export default function InnerHeader({fetchData}) {
    const context = useCtx();
    const {title} = context;

    return (<div className="innerHeader row">
        <Typography variant="h5" className="title" color="text.primary">
            {title}
        </Typography>
        <div className="btnWrap">
          {/* 도움말은 해당 페이지에 맞춰서 변경 될 필요 있음 */}
          <TutorialModal />
          <Microphone />
          <FileUploadButton fetchData={fetchData} />
        </div>
    </div>)
}
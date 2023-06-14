import { useCtx } from "../../../context/Context";
import TutorialModal from "../Modal/TutorialModal";
import Microphone from "../../Microphone/Microphone";
import FileUploadButton from "../../FileUploadButton/FileUploadButton";
import './innerHeader.css'

import { Typography } from "@mui/material";
import { RecordContextProvider } from "../../../context/RecordContext";

export default function InnerHeader() {
    const context = useCtx();
    const { pathname, title } = context;
    
    return (<div className="innerHeader row">
        <Typography variant="h5" className="title" color="text.primary">
            {title}
        </Typography>
        <div className="btnWrap">
          {/* 도움말은 해당 페이지에 맞춰서 변경 될 필요 있음 */}
          { !(pathname === '/') && <TutorialModal /> }
        {pathname === '/sound-test' &&
          <RecordContextProvider>
            <Microphone />
          </RecordContextProvider>
        }
          <FileUploadButton />
        </div>
    </div>)
}
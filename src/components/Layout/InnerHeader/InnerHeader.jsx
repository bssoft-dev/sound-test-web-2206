import { useCtx } from "../../../context/Context";
import TutorialModal from "../Modal/TutorialModal";
import Microphone from "../../Microphone/Microphone";
import FileUploadButton from "../../FileUploadButton/FileUploadButton";
import './innerHeader.css'

import { Box, Typography } from "@mui/material";
import BasicSelect from "../../FileUploadButton/BssSelect";

export default function InnerHeader() {
    const context = useCtx();
    const { pathname, title } = context;
    
    return (<Box className="innerHeader row">
        <Typography variant="h5" className="title" color="text.primary">
            {title}
        </Typography>
        <Box className="btnWrap">
          {/* 도움말은 해당 페이지에 맞춰서 변경 될 필요 있음 */}
          { !(pathname === '/') && <TutorialModal /> }
          {pathname === '/sound-test' &&
            <Microphone />
          }
          {pathname === '/bss-test' &&
            <BasicSelect />
          }
          <FileUploadButton />
        </Box>
    </Box>)
}
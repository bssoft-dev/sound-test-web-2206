import React from "react";
import { Box, Typography } from "@mui/material";
import TutorialModal from "../Modal/TutorialModal";
import Microphone from "../../Microphone/Microphone";
import FileUploadButton from "../../FileUploadButton/FileUploadButton";
import './innerHeader.css'
import BasicSelect from "../../FileUploadButton/BssSelect";
import { useStore } from "../../../stores/useStore";

export default function InnerHeader() {
    const { pathname, title } = useStore(
      state => ({
        pathname: state.pathname,
        title: state.title,
      })
    );

    
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
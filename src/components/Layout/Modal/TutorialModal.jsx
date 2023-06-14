import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, Tooltip } from '@mui/material';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { grey } from "@mui/material/colors";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function TutorialModal() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Tooltip title="도움말">
        <Button variant="contained" color="inherit"
            onClick={handleOpen}
            sx={{borderColor: grey[400], borderRadius: 4, backgroundColor: '#fff', color: grey[600], padding: '5px !important', minWidth: 'fit-content'}}>
            <QuestionMarkIcon fontSize="small" />
        </Button>
      </Tooltip>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="description"
      >
        <DialogTitle>{"도움말"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="description">
            해당 페이지에 대해 안내합니다
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>확인</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
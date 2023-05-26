import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, TextField } from '@mui/material';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ForGotPassword({open, handleOpen, handleClose}) {
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            userId: data.get('userId'),
            password: data.get('password'),
        });
    };
  return (<>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullWidth
        maxWidth='xs'
      >
        <DialogTitle>비밀번호 찾기</DialogTitle>
        <DialogContent>
            <Box component="form" 
                onSubmit={handleSubmit}
                sx={{ textAlign: 'center' }}>
                <TextField required fullWidth autoFocus
                    margin="dense"
                    id="name"
                    label="이름"
                    type="name"
                    variant="standard"
                />
                <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3 }}>
                    비밀번호 찾기
                </Button>
            </Box>
        </DialogContent>
      </Dialog>
    </>);
}
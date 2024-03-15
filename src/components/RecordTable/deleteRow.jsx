import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import supabase from "../../utils/supabase";
import { useState } from 'react';
import axios from 'axios';

export default function DeleteRow({ params, pathname }) {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const handleDeleteDatas = async () => {
        try {
            let response;
            switch(pathname) {
                case '/bss-test':
                    response = await axios.delete(
                        `https://bss.bs-soft.co.kr/files/delete?recKey=${params.row.recKey}`
                    );
                    break;
                case '/sound-test':
                    response = await axios.delete(
                        `https://sound.bs-soft.co.kr/files/delete?recKey=${params.row.recKey}`
                    );
                    break;
                case '/tts-test':
                    response = await axios.delete(
                        `https://tts.bs-soft.co.kr/delete-single/${params.row.name}`
                    );
                    break;
                }
                console.log(response);
            
        } catch (error) {
            console.log(error);
        }
        setOpen(false);
        //api로 삭제 
    }
    return (
        <>
            <IconButton aria-label="delete" size="small" 
                onClick={handleClickOpen}>
                <DeleteIcon fontSize="inherit" />
            </IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="title"
                aria-describedby="description"
            >
                <DialogTitle id="title">
                    {"삭제하기"}
                </DialogTitle>
                <DialogContent id="description">
                    recKey: {params.row.recKey}를 삭제하시겠습니까?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>취소</Button>
                    <Button onClick={handleDeleteDatas} autoFocus>삭제</Button>
                </DialogActions>
            </Dialog>
      </>
    )
}
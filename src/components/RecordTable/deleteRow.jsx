import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import supabase from "../../utils/supabase";
import { useState } from 'react';

export default function DeleteRow({ params }) {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const handleDeleteDatas = async () => {
        console.log(params.row.recKey);
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
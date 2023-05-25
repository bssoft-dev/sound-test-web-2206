import * as React from 'react';
import Snackbar, { snackbarClasses } from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import { useCtx } from '../../context/Context';

const CustomAlert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={4} ref={ref} {...props} />;
});

const CustomSnackbar = styled(Snackbar)(({ theme }) => ({
    "&.MuiSnackbar-root" : {
        top: theme.spacing(17),
    }
}));

export default function Alert() {
    const context = useCtx();
    const {isAlert, setIsAlert} = context;

    const handleClick = () => {
        setIsAlert((isAlert) => {
            return {...isAlert, open: true}
        });
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;

        setIsAlert((isAlert) => {
            return {...isAlert, open: false}
        });
    };

    return (
        <CustomSnackbar open={isAlert.open} 
            onClose={handleClose}
            autoHideDuration={6000}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <CustomAlert onClose={handleClose} severity={isAlert.type} sx={{ width: '100%' }}>
                {isAlert.message}
            </CustomAlert>
        </CustomSnackbar>
    );
}
import * as React from 'react';
import { useCtx } from '../../context/Context';

import MuiAlert from '@mui/material/Alert';
import Snackbar, { snackbarClasses } from '@mui/material/Snackbar';
import { styled } from '@mui/material/styles';

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
    const {isAlert, setAlert} = context;

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setAlert((isAlert) => {
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
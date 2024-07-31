import * as React from 'react';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { styled } from '@mui/material/styles';
import { useStore } from '../../stores/useStore';
import { shallow } from 'zustand/shallow';

const CustomAlert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={4} ref={ref} {...props} />;
});

const CustomSnackbar = styled(Snackbar)(({ theme }) => ({
    "&.MuiSnackbar-root" : {
        top: theme.spacing(17),
    }
}));

export default function Alert() {
    const {isAlert, setAlert} = useStore(
        state => ({
            isAlert: state.isAlert, 
            setAlert: state.setAlert
        }), shallow
    );

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
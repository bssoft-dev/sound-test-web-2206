import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ForGotPassword from "./ForGotPassword";

import { Box, Button, Card, CardActions, CardContent, CardHeader, FormControl, IconButton, Input, InputAdornment, InputLabel, TextField, Typography } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from "axios";
import { useCtx } from "../../../context/Context";

export default function Login() {    
    const context = useCtx();
    const { setAlert } = context;
    const [showPassword, setShowPassword] = useState(false);
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const params = new URLSearchParams();
        params.append('username', data.get('username'));
        params.append('password', data.get('password'));
        axios({
            url: 'https://sound.bs-soft.co.kr/auth/jwt/login',
            method: 'POST',
            data: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
        .then((res) => {
            sessionStorage.setItem('token', res.data.access_token);
            if(res.data.is_hyperuser) {
                localStorage.setItem('is_hyperuser', true);
            }
            setAlert((isAlert) => {
                return {...isAlert, open: false}
            });
            navigate('/');
        })
        .catch(err => {
            setAlert({
                open: true, 
                type: "error",
                message: "아이디 혹은 비밀번호를 확인하세요."
            })
        });
    };
    
    return (<>
        <Card
            sx={{ maxWidth: {
                xs: '80vw', sm: '400px'
            }, boxShadow: 3, mt: '-60px'}}>
            <CardHeader sx={{ pt: 3 }}
                title={
                <Typography variant="h4" color="text.secondary"
                    sx={{ fontSize: '1.8rem', textAlign: 'center' }}>
                        사운드 테스트 페이지
                </Typography>
            } />
            <CardContent sx={{ px: 3 }}>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField required fullWidth autoFocus
                        id="username"
                        label="아이디"
                        name="username"
                        autoComplete="username"
                        sx={{marginBottom: 3}}
                        variant="standard"
                    />
                    <FormControl fullWidth>
                        <InputLabel htmlFor="password" sx={{ml: '-14px'}}>비밀번호 *</InputLabel>
                        <Input required
                            id="password"
                            label="Password"
                            name="password"
                            autoComplete="password"
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword} >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>}
                        />
                    </FormControl>
                    <Button fullWidth
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}>
                        로그인
                    </Button>
                </Box>
            </CardContent>
            <CardActions sx={{justifyContent: "flex-end", pt: 0, pr: 2}}>
                <Button size="large"
                    onClick={handleOpen}>
                        비밀번호 찾기
                </Button>
            </CardActions>
        </Card>
        <ForGotPassword open={open} handleClose={handleClose} />
    </>)
}
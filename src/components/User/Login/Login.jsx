import { useState } from "react";
import { Box, Button, Card, CardActions, CardContent, CardHeader, FormControl, IconButton, Input, InputAdornment, InputLabel, TextField, Typography } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ForGotPassword from "./ForGotPassword";

export default function Login() {    
    const [showPassword, setShowPassword] = useState(false);
    const [open, setOpen] = useState(false);
    
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            userId: data.get('userId'),
            password: data.get('password'),
        });
    };
    
    return (<>
        <Card
            sx={{ maxWidth: 400, boxShadow: 3, mt: '-60px' }} >
            <CardHeader sx={{ pt: 3 }}
                title={
                <Typography variant="h4" fontWeight={600} color="text.secondary"
                    sx={{ fontSize: '1.8rem', textAlign: 'center' }}>
                        사운드 테스트 페이지
                </Typography>
            } />
            <CardContent sx={{ px: 3 }}>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField required fullWidth autoFocus
                        id="userId"
                        label="아이디"
                        name="userId"
                        autoComplete="userId"
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
        <ForGotPassword open={open} handleOpen={handleOpen} handleClose={handleClose} />
    </>)
}
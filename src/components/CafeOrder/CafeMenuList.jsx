import { Card, CardContent, Divider, Grid, List, ListItem, Typography } from "@mui/material"
import { StyledCardHeader, menuList } from "../../pages/CafeOrderTestPage"

export default function CafeMenuList () {

    const drinks = menuList.drinks;
    const desserts = menuList.desserts;

    return (
        <Card sx={{ height: { md: '100%' } }}>
            <StyledCardHeader title="메뉴" />
            <Divider />
            <CardContent sx={{ p: { md: 3 } }}>
                <Grid container 
                justifyContent="space-between" alignItems="flex-end">
                    <Typography variant="h6"
                        sx={{color: '#FF8A00'}}>
                        음료
                    </Typography>
                    <Typography textAlign="right"
                        sx={{fontSize: {xs: '14px', md: '1rem'}}}>
                        사이즈&#58; R&#40;레귤러&#41;, L&#40;라지&#41;
                    </Typography>
                </Grid>
                <Divider />
                <List sx={{ columnCount: 2, maxWidth: 'calc(100% -80px)' }}>
                {drinks && drinks.map((menu, index) => {
                    return <ListItem key={index}
                    sx={{
                        display: 'list-item', listStyleType: 'disc', listStylePosition: 'inside',
                        fontSize: { xs: '14px', lg: '1.2rem', }, py: {xs: 1, lg: '10px'}, px: { xs: 0, sm: 1, xl: 2 },
                        letterSpacing: {xs: '-1px', xl: 0}}} 
                    >
                    {menu}
                    </ListItem>
                })}
                </List>
                <Typography variant="h6"
                    sx={{mt: 2, color: '#FF8A00'}}>
                    디저트
                </Typography>
                <Divider />
                <List sx={{ columnCount: 2, maxWidth: 'calc(100% -80px)' }}>
                {desserts && desserts.map((menu, index) => {
                    return <ListItem key={index}
                    sx={{
                        display: 'list-item', listStyleType: 'disc', listStylePosition: 'inside',
                        fontSize: { xs: '14px', lg: '1.2rem', }, py: {xs: 1, lg: '10px'}, px: { xs: 0, sm: 1, xl: 2 },
                        letterSpacing: {xs: '-1px', xl: 0}}} 
                    >
                    {menu}
                    </ListItem>
                })}
                </List>
            </CardContent>
        </Card>
    )
}
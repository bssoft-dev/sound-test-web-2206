import { Card, CardContent, Divider, List, ListItem } from "@mui/material"
import { StyledCardHeader, menuList } from "../../pages/CafeOrderTestPage"

export default function CafeMenuList () {
    return (
        <Card sx={{ height: { md: '100%' } }}>
            <StyledCardHeader title="메뉴" />
            <Divider />
            <CardContent sx={{ p: { md: 3 } }}>
                <List sx={{ columnCount: 2, maxWidth: 'calc(100% -80px)' }}>
                {menuList && menuList.map((menu, index) => {
                    return <ListItem key={index}
                    sx={{
                        display: 'list-item', listStyleType: 'disc', listStylePosition: 'inside',
                        fontSize: { xs: '1rem', lg: '1.2rem', }, py: {xs: 1, lg: '10px'}, px: { xs: 0, sm: 1, xl: 2 },
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
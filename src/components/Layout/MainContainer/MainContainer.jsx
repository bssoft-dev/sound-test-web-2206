import InnerHeader from "../InnerHeader/InnerHeader";
import Header from "../Header/Header";

import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(theme => ({
    mainContainer: {
      width: 'calc(100vw - var(--sideNavWidth))',
      [theme.breakpoints.down('sm')]: {
        width: '100%',
      },
      height: '100vh',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'scroll',
      '&::-webkit-scrollbar': {
        display: 'none'
      },
      backgroundColor: '#f2f2f2'
    },
    content: {
        height: '100%',
        padding: '20px',
        paddingTop: '140px',
        '@media (max-width:600px)': {
          padding: '16px',
          paddingTop: '120px',
          
        }
    }
}));

export default function MainContainer({content}) {
    const classes = useStyles();

    return (<div className={classes.mainContainer}>
        <Header />
        <main>
            <InnerHeader />
            <div className={classes.content}>
                {content}
            </div>
        </main>
    </div>)
}
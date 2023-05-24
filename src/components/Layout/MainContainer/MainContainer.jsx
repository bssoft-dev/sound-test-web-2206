import InnerHeader from "../InnerHeader/InnerHeader";
import Header from "../Header/Header";

import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(theme => ({
    mainContainer: {
      width: 'calc(100vw - var(--sideNavWidth))',
      height: '100vh',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'scroll',
      '&::-webkit-scrollbar': {
        display: 'none'
      } 
    },
    content: {
        height: '100%',
        padding: '20px',
        paddingTop: '140px',
    }
}));

export default function MainContainer({content, title, fetchData}) {
    const classes = useStyles();

    return (<div className={classes.mainContainer}>
        <Header />
        <main>
            <InnerHeader title={title} fetchData={fetchData} />
            <div className={classes.content}>
                    {content}
            </div>
        </main>
    </div>)
}
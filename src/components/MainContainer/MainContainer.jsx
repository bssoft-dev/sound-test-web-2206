import InnerHeader from "../InnerHeader/InnerHeader";
import Header from "../Header/Header";

import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(theme => ({
    mainContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
        flex: 1,
        padding: '20px',
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
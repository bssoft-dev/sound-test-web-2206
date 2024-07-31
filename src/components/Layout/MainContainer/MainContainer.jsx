import React from "react";
import InnerHeader from "../InnerHeader/InnerHeader";
import Header from "../Header/Header";

import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(theme => ({
    mainContainer: {
      '--height': 'calc(var(--headerHight) * 2)',
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
      backgroundColor: '#fff',
      background: 'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,1) var(--height), rgba(242,242,242,1) var(--height), rgba(242,242,242,1) 100%)',
      '@media (max-width:600px)': {
        '--height': 'calc(var(--headerHight) * 2 + 8px)',
      }

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

    return (<div className={classes.mainContainer }>
        <Header />
        <main>
            <InnerHeader />
            <div className={classes.content}>
                {content}
            </div>
        </main>
    </div>)
}
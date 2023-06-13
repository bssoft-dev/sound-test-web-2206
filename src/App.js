import React, { useState } from "react";
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, responsiveFontSizes } from "@mui/material";

import IndexPage from "./pages/IndexPage";
import SoundTestPage from "./pages/SoundTestPage";
import BssTestPage from "./pages/BssTestPage";

import './styles.css';
import TestPage from "./pages/TestPage";
import LoginPage from "./pages/LoginPage";
import { ContextProvider } from "./context/Context";
import { grey, red } from "@mui/material/colors";
import AudioStreamingTestPage from "./pages/AudioStreamingTestPage";
import SttTestPage from "./pages/SttTestPage";

let theme = createTheme({
  palette: {
    error: {
      main: red[500],
    },
    Secondary: {
      light: grey[300],
      main: grey[500],
      dark: grey[700]
    }
  },
  typography: {
    fontFamily: 'Pretendard Variable',
    '@media (max-width: 600px)' : {
      fontSize: 14,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            fontSize: 12,
          }
        },
      },
    },
  },
});

function App() {
  return (<>
  <ThemeProvider theme={theme}>
      <Router>
        <ContextProvider>
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/sound-test" element={<SoundTestPage />} />
            <Route path="/bss-test" element={<BssTestPage />} />
            <Route path="/audio-test" element={<AudioStreamingTestPage />} />
            <Route path="/stt-test" element={<SttTestPage />} />
            {/* <Route path="/test" element={<TestPage />} /> */}
          </Routes>
        </ContextProvider>
      </Router>
  </ThemeProvider>
  </>)
  
}


export default App;

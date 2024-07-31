import React from "react";
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from "@mui/material";

import IndexPage from "./pages/IndexPage";
import SoundTestPage from "./pages/SoundTestPage";
import BssTestPage from "./pages/BssTestPage";

import './styles.css';
import TestPage from "./pages/TestPage";
import LoginPage from "./pages/LoginPage";
import { ContextProvider } from "./context/Context";
import { green, grey, red } from "@mui/material/colors";
import AudioStreamingTestPage from "./pages/AudioStreamingTestPage";
import SttTestPage from "./pages/SttTestPage";
import CafeOrderTestPage from "./pages/CafeOrderTestPage";
import TtsTestPage from "./pages/TtsTestPage";
import DangerSoundPage from "./pages/DangerSoundPage";

let theme = createTheme({
  palette: {
    error: {
      main: red[500],
    },
    secondary: {
      light: grey[300],
      main: grey[500],
      dark: grey[700]
    },
    warning: {
      main: '#FF8A00'
    },
    success: {
      light: green[300],
      main: green[500],
      dark: green[800]
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
            padding: '4px 12px'
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
            <Route path="/tts-test" element={<TtsTestPage />} />
            <Route path="/menu-test" element={<CafeOrderTestPage />} />
            <Route path="/danger-sound" element={<DangerSoundPage />} />
            <Route path="/test" element={<TestPage />} />
          </Routes>
        </ContextProvider>
      </Router>
  </ThemeProvider>
  </>)
  
}


export default App;

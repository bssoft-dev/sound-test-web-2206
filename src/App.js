import React, { useState } from "react";
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from "@mui/material";

import IndexPage from "./pages/IndexPage";
import SoundTestPage from "./pages/SoundTestPage";
import BssTestPage from "./pages/BssTestPage";

import './styles.css';
import TestPage from "./pages/TestPage";
import LoginPage from "./pages/LoginPage";

const theme = createTheme({
  typography: {
    fontFamily: 'Pretendard Variable'
  }
})

function App() {
  return (<>
  <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sound-test" element={<SoundTestPage />} />
          <Route path="/bss-test" element={<BssTestPage />} />
          {/* <Route path="/test" element={<TestPage />} /> */}
        </Routes>
      </Router>
  </ThemeProvider>
  </>)
  
}


export default App;

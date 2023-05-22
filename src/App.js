import React, { useState } from "react";
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from "@mui/material";

import IndexPage from "./pages/IndexPage";
import SoundTestPage from "./pages/SoundTestPage";
import TestPage from "./pages/TestPage";

import './styles.css';

const theme = createTheme({
  typography: {
    fontFamily: 'Pretendard Variable'
  }
})

function App() {
  return (<>
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/sound-test" element={<SoundTestPage />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
  </>)
  
}


export default App;

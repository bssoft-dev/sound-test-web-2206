import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';

export const useTitle = (initialTitle) => {
    const location = useLocation();
    const [title, setTitle] = useState('BSsoft Test Page');
    const updateTitle = () => {
        const htmlTitle = document.querySelector("title");
        if(location.pathname === '/') htmlTitle.innerText = title;
        else htmlTitle.innerText = `${initialTitle} - ${title}`;
    };
    useEffect(updateTitle, [title]);
    return setTitle;
};
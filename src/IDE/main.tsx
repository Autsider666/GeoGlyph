import React from 'react';
import ReactDOM from 'react-dom/client';
import './style/style.scss';
import {Router} from "./Router/Router.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Router/>
    </React.StrictMode>,
);

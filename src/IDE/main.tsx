import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import App from './App.tsx';
import './style.scss';
import {DisplayGraph} from "./routes/DisplayGraph.tsx";
import {ErrorPage} from "./routes/ErrorPage.tsx";
import {Root} from "./routes/Root.tsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                path: '',
                element: <App/>
            },
            {
                path: 'graph',
                element: <DisplayGraph />
            },
        ]
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
);

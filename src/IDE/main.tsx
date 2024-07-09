import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import Home from './pages/Home.tsx';
import './style.scss';
import {DisplayGraph} from "./pages/DisplayGraph.tsx";
import {ErrorPage} from "./pages/ErrorPage.tsx";
import {Root} from "./pages/Root.tsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                path: '',
                element: <Home/>
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

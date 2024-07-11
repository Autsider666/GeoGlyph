import {ReactElement} from "react";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {ErrorPage} from "../pages/ErrorPage.tsx";
import {Root} from "../pages/Root.tsx";
import {Routes} from "./Routes.tsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root/>,
        errorElement: <ErrorPage/>,
        children: Routes,
    }
]);

export const Router = (): ReactElement => <RouterProvider router={router}/>;
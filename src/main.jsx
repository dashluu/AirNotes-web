import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ErrorPage from "./error/ErrorPage.jsx";
import SignUpPage from "./auth/SignUpPage.jsx";
import NewDocumentPage from "./new_document/NewDocumentPage.jsx";
import EditDocumentPage, {loader as editDocumentLoader} from "./edit_document/EditDocumentPage.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>
    },
    {
        path: "/sign-up",
        element: <SignUpPage/>
    },
    {
        path: "/new",
        element: <NewDocumentPage/>
    },
    {
        path: "/notes/:documentId",
        element: <EditDocumentPage/>,
        loader: editDocumentLoader
    },
    {
        path: "/*",
        element: <ErrorPage/>
    }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
)

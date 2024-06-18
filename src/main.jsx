import React from "react";
import ReactDOM from "react-dom/client";
import App, {loader as appLoader} from "./App.jsx";
import "./index.css";
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import ErrorPage from "./error/ErrorPage.jsx";
import SignUpPage from "./auth/SignUpPage.jsx";
import NewDocumentPage from "./document/NewDocumentPage.jsx";
import EditDocumentPage, {loader as editDocumentLoader} from "./document/EditDocumentPage.jsx";
import SignInPage from "./auth/SignInPage.jsx";
import AuthRouter from "./auth_router/AuthRouter.jsx";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<AuthRouter/>}>
            <Route path="/" element={<App/>} loader={appLoader}/>
            <Route path="sign-up" element={<SignUpPage/>}/>
            <Route path="sign-in" element={<SignInPage/>}/>
            <Route path="new" element={<NewDocumentPage/>}/>
            <Route path="notes/:documentId" element={<EditDocumentPage/>} loader={editDocumentLoader}/>
            <Route path="*" element={<ErrorPage/>}/>
        </Route>
    )
);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
)

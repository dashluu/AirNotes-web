import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import ErrorPage from "./error/ErrorPage.jsx";
import SignUpPage from "./auth/SignUpPage.jsx";
import NewDocumentPage from "./document/NewDocumentPage.jsx";
import EditDocumentPage, {loader as editDocumentLoader} from "./document/EditDocumentPage.jsx";
import SignInPage from "./auth/SignInPage.jsx";
import AppRouter from "./app_router/AppRouter.jsx";
import Settings from "./settings/Settings.jsx";
import PasswordResetPage from "./auth/PasswordResetPage.jsx";
import TextGenPopup from "./popup/TextGenPopup.jsx";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<AppRouter/>}>
            <Route path="/" element={<App/>}/>
            <Route path="sign-up" element={<SignUpPage/>}/>
            <Route path="sign-in" element={<SignInPage/>}/>
            <Route path="new" element={<NewDocumentPage/>}/>
            <Route path="notes/:documentId" element={<EditDocumentPage/>} loader={editDocumentLoader}/>
            <Route path="settings" element={<Settings/>}/>
            <Route path="password-reset" element={<PasswordResetPage/>}/>
            <Route path="*" element={<ErrorPage/>}/>
        </Route>
    )
);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
)

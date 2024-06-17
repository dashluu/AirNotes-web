import Editor from "../editor/Editor.jsx";
import {auth} from "../firebase.js"
import {Navigate} from "react-router-dom";
import {onAuthStateChanged} from "firebase/auth";
import {useState} from "react";

function NewDocumentPage() {
    const [getRender, setRender] = useState(null);

    onAuthStateChanged(auth, (user) => {
        // Render UI depending on user authentication
        if (user) {
            setRender(
                <Editor documentId="" title="" content="" isNewDocument={true}></Editor>
            );
        } else {
            setRender(
                <Navigate to="/sign-in"></Navigate>
            )
        }
    });

    return getRender;
}

export default NewDocumentPage;
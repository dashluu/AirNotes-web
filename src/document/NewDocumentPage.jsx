import Editor from "../editor/Editor.jsx";
import {useEffect} from "react";
import {onAuthStateChanged} from "firebase/auth";
import {auth, paths} from "../backend.js";
import {useNavigate} from "react-router-dom";

function NewDocumentPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate(paths.signIn);
            }
        });

        return () => {
            unsubscribe();
        }
    }, []);

    return (
        <Editor documentId="" title="" content="" date="" isNewDocument={true}></Editor>
    );
}

export default NewDocumentPage;
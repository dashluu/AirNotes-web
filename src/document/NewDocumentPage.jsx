import EditorPage from "../editor/EditorPage.jsx";
import {useEffect} from "react";
import {onAuthStateChanged} from "firebase/auth";
import {auth, paths} from "../backend.js";
import {useNavigate} from "react-router-dom";

function NewDocumentPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const unsubUser = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate(paths.signIn);
            }
        });

        return () => {
            unsubUser();
        };
    }, []);

    return (
        <EditorPage docId=""
                    thumbnail="https://firebasestorage.googleapis.com/v0/b/airnotes-8ae79.appspot.com/o/files%2Fthumbnail.jpg?alt=media&token=30c22fd4-197d-4dcc-8058-cda1effc4442"
                    title=""
                    content=""
                    isNewDoc={true}
                    loadRecent={true}/>
    );
}

export default NewDocumentPage;
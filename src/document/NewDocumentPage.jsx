import EditorPage from "../editor/EditorPage.jsx";
import {useEffect, useState} from "react";
import {onAuthStateChanged} from "firebase/auth";
import {auth, defaultThumbnail, paths, storage} from "../backend.js";
import {useNavigate} from "react-router-dom";
import FullDocument from "../models/FullDocument.js";
import {getDownloadURL, ref} from "firebase/storage";

function NewDocumentPage() {
    const navigate = useNavigate();
    const [getFullDoc, setFullDoc] = useState(new FullDocument(
        "", "", "", "", "", "", ""
    ));

    async function fetchThumbnail() {
        try {
            const url = await getDownloadURL(ref(storage, defaultThumbnail));
            setFullDoc(new FullDocument("", "", url, "", "", "", ""));
        } catch (error) {
            navigate(paths.error);
        }
    }

    useEffect(() => {
        const unsubUser = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchThumbnail();
            } else {
                navigate(paths.signIn);
            }
        });

        return () => {
            unsubUser();
        };
    }, []);

    return (
        <EditorPage fullDoc={getFullDoc} isNewDoc={true}/>
    );
}

export default NewDocumentPage;
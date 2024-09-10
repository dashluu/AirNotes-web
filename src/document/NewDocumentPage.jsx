import EditorPage from "../editor/EditorPage.jsx";
import {useEffect, useState} from "react";
import {onAuthStateChanged} from "firebase/auth";
import {auth, defaultThumbnail, paths, storage} from "../backend.js";
import {useNavigate} from "react-router-dom";
import FullDocument from "../models/FullDocument.js";
import {getDownloadURL, ref} from "firebase/storage";

function NewDocumentPage() {
    const navigate = useNavigate();
    const [getUser, setUser] = useState(null);
    const [getFullDoc, setFullDoc] = useState(null);

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
                setUser(user);
            } else {
                navigate(paths.signIn);
            }
        });

        return () => {
            unsubUser();
        };
    }, []);

    return (
        <EditorPage user={getUser} fullDoc={getFullDoc}/>
    );
}

export default NewDocumentPage;
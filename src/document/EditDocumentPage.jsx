import EditorPage from "../editor/EditorPage.jsx";
import {useLoaderData, useNavigate} from "react-router-dom";
import {auth, docDAO, paths} from "../backend.js";
import {useEffect, useState} from "react";
import {onAuthStateChanged} from "firebase/auth";

export async function loader({params}) {
    return params.docId;
}

function EditDocumentPage() {
    const navigate = useNavigate();
    const docId = useLoaderData();
    const [getFullDoc, setFullDoc] = useState(null);

    async function fetchDoc(userId, docId) {
        try {
            const fullDoc = await docDAO.getFullDoc(userId, docId);
            setFullDoc(fullDoc);
        } catch (error) {
            navigate(paths.error);
        }
    }

    useEffect(() => {
        const unsubUser = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchDoc(user.uid, docId);
            } else {
                navigate(paths.signIn);
            }
        });

        return () => {
            unsubUser();
        };
    }, []);

    return (
        <EditorPage getFullDoc={getFullDoc} setFullDoc={setFullDoc} isNewDoc={false} loaded={getFullDoc !== null}/>
    );
}

export default EditDocumentPage;
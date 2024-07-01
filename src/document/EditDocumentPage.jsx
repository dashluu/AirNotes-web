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
    const [getLoadRecent, setLoadRecent] = useState(false);

    async function fetchDoc(userId, docId) {
        await docDAO.accessFullDoc(userId, docId)
            .then((fullDoc) => {
                setFullDoc(fullDoc);
                setLoadRecent(true);
            })
            .catch(() => {
                navigate(paths.error);
            });
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
        <EditorPage docId={getFullDoc ? getFullDoc.id : ""}
                    thumbnail={getFullDoc ? getFullDoc.thumbnail : ""}
                    title={getFullDoc ? getFullDoc.title : ""}
                    content={getFullDoc ? getFullDoc.content : ""}
                    isNewDoc={false}
                    loadRecent={getLoadRecent}/>
    );
}

export default EditDocumentPage;
import EditorPage from "../editor/EditorPage.jsx";
import {useLoaderData, useNavigate} from "react-router-dom";
import {auth, documentDAO, paths} from "../backend.js";
import {useEffect, useState} from "react";
import {onAuthStateChanged} from "firebase/auth";

export async function loader({params}) {
    return params.documentId;
}

function EditDocumentPage() {
    const navigate = useNavigate();
    const documentId = useLoaderData();
    const [getFullDocument, setFullDocument] = useState(null);

    async function fetchDocument(userId, documentId) {
        await documentDAO.getFullDocument(userId, documentId)
            .then((fullDocument) => {
                setFullDocument(fullDocument);
            })
            .catch(() => {
                navigate(paths.error);
            });
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchDocument(user.uid, documentId);
            } else {
                navigate(paths.signIn);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <EditorPage documentId={getFullDocument ? getFullDocument.id : ""}
                    title={getFullDocument ? getFullDocument.title : ""}
                    content={getFullDocument ? getFullDocument.content : ""}
                    isNewDocument={false}/>
    );
}

export default EditDocumentPage;
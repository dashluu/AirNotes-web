import Editor from "../editor/Editor.jsx";
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

    async function fetchDocument(documentId) {
        await documentDAO.getFullDocument(documentId)
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
                fetchDocument(documentId);
            } else {
                navigate(paths.signIn);
            }
        });

        return () => {
            unsubscribe();
        }
    }, []);

    return (
        <Editor documentId={getFullDocument ? getFullDocument.id : ""}
                title={getFullDocument ? getFullDocument.title : ""}
                content={getFullDocument ? getFullDocument.content : ""}
                date={getFullDocument ? getFullDocument.date : ""}
                isNewDocument={false}>
        </Editor>
    );
}

export default EditDocumentPage;
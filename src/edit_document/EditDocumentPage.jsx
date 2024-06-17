import {doc, getDoc} from "firebase/firestore";
import Editor from "../editor/Editor.jsx";
import {db} from "../firebase.js";
import FullDocument from "../models/FullDocument.js";
import {redirect, useLoaderData} from "react-router-dom";

export async function loader({params}) {
    try {
        const documentRef = doc(db, "documents", params.documentId);
        const documentSnapshot = await getDoc(documentRef);

        if (!documentSnapshot.exists()) {
            return redirect("/error");
        }

        return FullDocument.ToFullDocument(documentSnapshot);
    } catch (error) {
        return redirect("/error");
    }
}

function EditDocumentPage() {
    const fullDocument = useLoaderData();

    return (
        <Editor documentId={fullDocument.id} title={fullDocument.title}
                content={fullDocument.content} isNew={false}>
        </Editor>
    )
}

export default EditDocumentPage;
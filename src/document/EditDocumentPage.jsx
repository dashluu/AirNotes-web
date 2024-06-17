import {doc, getDoc} from "firebase/firestore";
import Editor from "../editor/Editor.jsx";
import {auth, db} from "../firebase.js";
import FullDocument from "../models/FullDocument.js";
import {redirect, useLoaderData} from "react-router-dom";

export async function loader({params}) {
    try {
        if (auth.currentUser === null) {
            // If the user is not signed in, go to the sign-in page
            return redirect("/sign-in");
        }

        const documentRef = doc(db, "documents", params.documentId);
        const documentSnapshot = await getDoc(documentRef);

        if (!documentSnapshot.exists()) {
            // Document does not exist
            return redirect("/error");
        }

        if (documentSnapshot.data().userId !== auth.currentUser.uid) {
            // TODO: access resource not belong to the user
            return redirect("/error");
        }

        return FullDocument.ToFullDocument(documentSnapshot);
    } catch (error) {
        // Error while loading the document
        return redirect("/error");
    }
}

function EditDocumentPage() {
    const fullDocument = useLoaderData();

    return (
        <Editor documentId={fullDocument.id} title={fullDocument.title}
                content={fullDocument.content} isNewDocument={false}>
        </Editor>
    );
}

export default EditDocumentPage;
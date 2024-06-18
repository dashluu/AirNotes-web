import DocumentUpdate from "../models/DocumentUpdate.js";
import {auth, db} from "../firebase.js";
import {addDoc, collection, deleteDoc, doc, setDoc} from "firebase/firestore";

export default class DocumentDAO {
    async update(documentId, title, content) {
        const documentUpdate = new DocumentUpdate(
            auth.currentUser.uid,
            title,
            content
        );

        if (!documentId) {
            // New document
            const documentRef = await addDoc(
                collection(db, "documents"),
                DocumentUpdate.FromDocumentUpdate(documentUpdate)
            );

            documentId = documentRef.id;
        } else {
            // Updating existing document
            await setDoc(
                doc(db, "documents", documentId),
                DocumentUpdate.FromDocumentUpdate(documentUpdate),
                {merge: true}
            );
        }

        return documentId;
    }

    async delete(documentId) {
        await deleteDoc(doc(db, "documents", documentId));
        return true;
    }
}
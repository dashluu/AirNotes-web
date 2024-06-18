import DocumentUpdate from "../models/DocumentUpdate.js";
import {auth, db} from "../firebase.js";
import {addDoc, collection, deleteDoc, doc, setDoc, serverTimestamp} from "firebase/firestore";

export default class DocumentDAO {
    async update(documentId, title, content) {
        // Get server time since it's more accurate
        const timestamp = serverTimestamp();
        const documentUpdate = new DocumentUpdate(
            auth.currentUser.uid,
            title,
            content,
            timestamp
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

        return [documentId, timestamp];
    }

    async delete(documentId) {
        await deleteDoc(doc(db, "documents", documentId));
        return true;
    }
}
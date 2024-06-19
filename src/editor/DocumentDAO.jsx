import DocumentUpdate from "../models/DocumentUpdate.js";
import {auth, db} from "../firebase.js";
import {
    query,
    orderBy,
    limit,
    startAt,
    where,
    addDoc,
    collection,
    deleteDoc,
    doc,
    serverTimestamp,
    getDoc,
    getDocs,
    updateDoc
} from "firebase/firestore";
import FullDocument from "../models/FullDocument.js";
import DocumentSummary from "../models/DocumentSummary.js";

export default class DocumentDAO {
    static documentsPerPage = 20;

    async update(documentId, title, content) {
        // Get server time since it's more accurate
        // A placeholder only, server replaces this with real timestamp once data is uploaded
        const timestamp = serverTimestamp();
        const documentUpdate = new DocumentUpdate(auth.currentUser.uid, title, content, timestamp);

        if (!documentId) {
            // New document
            const documentRef = await addDoc(
                collection(db, "documents"),
                DocumentUpdate.FromDocumentUpdate(documentUpdate)
            );

            documentId = documentRef.id;
        } else {
            // Updating existing document
            await updateDoc(
                doc(db, "documents", documentId),
                DocumentUpdate.FromDocumentUpdate(documentUpdate)
            );
        }

        return await this.getFullDocument(documentId);
    }

    async delete(documentId) {
        await deleteDoc(doc(db, "documents", documentId));
        return true;
    }

    async getFullDocument(documentId) {
        const documentRef = doc(db, "documents", documentId);
        const documentSnapshot = await getDoc(documentRef);

        if (!documentSnapshot.exists() || documentSnapshot.data().userId !== auth.currentUser.uid) {
            return null;
        }

        return FullDocument.ToFullDocument(documentSnapshot);
    }

    async getDocumentSummaryList(userId, page) {
        const cursor = page * DocumentDAO.documentsPerPage;
        const documentQuery = query(
            collection(db, "documents"),
            orderBy("date"),
            where("userId", "==", userId),
            startAt(cursor),
            limit(DocumentDAO.documentsPerPage));
        const documentSnapshotList = await getDocs(documentQuery);
        let documentSnapshot;
        let documentSummaryList = [];
        let documentSummary;

        for (let i = 0; i < documentSnapshotList.size; i++) {
            documentSnapshot = documentSnapshotList.docs[i];
            documentSummary = DocumentSummary.ToDocumentSummary(documentSnapshot);
            documentSummaryList.push(documentSummary);
        }

        return documentSummaryList;
    }
}
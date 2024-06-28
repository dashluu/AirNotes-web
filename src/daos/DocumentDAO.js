import DocumentUpdate from "../models/DocumentUpdate.js";
import {auth, db} from "../backend.js";
import {
    query,
    orderBy,
    limit,
    startAfter,
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
                DocumentUpdate.fromDocumentUpdate(documentUpdate)
            );

            documentId = documentRef.id;
        } else {
            // Updating existing document
            await updateDoc(
                doc(db, "documents", documentId),
                DocumentUpdate.fromDocumentUpdate(documentUpdate)
            );
        }

        return await this.getFullDocument(documentId);
    }

    async delete(documentId) {
        await deleteDoc(doc(db, "documents", documentId));
    }

    async getFullDocument(documentId) {
        const documentRef = doc(db, "documents", documentId);
        const documentSnapshot = await getDoc(documentRef);

        if (!documentSnapshot.exists() || documentSnapshot.data().userId !== auth.currentUser.uid) {
            return null;
        }

        return FullDocument.toFullDocument(documentSnapshot);
    }

    async getDocumentSummaryList(userId, page, cursor) {
        let documentQuery;

        if (page === 0) {
            documentQuery = query(
                collection(db, "documents"),
                where("userId", "==", userId),
                orderBy("date", "desc"),
                limit(DocumentDAO.documentsPerPage)
            );
        } else {
            documentQuery = query(
                collection(db, "documents"),
                where("userId", "==", userId),
                orderBy("date", "desc"),
                startAfter(cursor),
                limit(DocumentDAO.documentsPerPage)
            );
        }

        const documentSnapshotList = await getDocs(documentQuery);
        let documentSummaryList = [];
        let documentSnapshot;
        let documentSummary;

        for (let i = 0; i < documentSnapshotList.size; i++) {
            documentSnapshot = documentSnapshotList.docs[i];
            documentSummary = DocumentSummary.toDocumentSummary(documentSnapshot);
            documentSummaryList.push(documentSummary);
        }

        return documentSummaryList;
    }
}
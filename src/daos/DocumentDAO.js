import DocumentUpdate from "../models/DocumentUpdate.js";
import {db} from "../backend.js";
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

    async update(userId, documentId, thumbnail, title, content) {
        // Get server time since it's more accurate
        // A placeholder only, server replaces this with real timestamp once data is uploaded
        const lastModified = serverTimestamp();
        const lastAccessed = serverTimestamp();
        const documentUpdate = new DocumentUpdate(userId, thumbnail, title, content, lastModified, lastAccessed);

        if (!documentId) {
            // New document
            await addDoc(
                collection(db, "documents"),
                DocumentUpdate.fromDocumentUpdate(documentUpdate)
            ).then((documentRef) => {
                documentId = documentRef.id;
            });
        } else {
            // Updating existing document
            await updateDoc(
                doc(db, "documents", documentId),
                DocumentUpdate.fromDocumentUpdate(documentUpdate)
            );
        }

        return await this.getFullDocument(userId, documentId);
    }

    async delete(documentId) {
        await deleteDoc(doc(db, "documents", documentId));
    }

    async accessFullDocument(userId, documentId) {
        await updateDoc(
            doc(db, "documents", documentId),
            {
                lastAccessed: serverTimestamp()
            }
        );

        return await this.getFullDocument(userId, documentId);
    }

    async getFullDocument(userId, documentId) {
        const documentRef = doc(db, "documents", documentId);
        const documentSnapshot = await getDoc(documentRef);

        if (!documentSnapshot.exists() || documentSnapshot.data().userId !== userId) {
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
                orderBy("lastAccessed", "desc"),
                limit(DocumentDAO.documentsPerPage)
            );
        } else {
            documentQuery = query(
                collection(db, "documents"),
                where("userId", "==", userId),
                orderBy("lastAccessed", "desc"),
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
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
    updateDoc,
    getDocs,
    onSnapshot
} from "firebase/firestore";
import FullDocument from "../models/FullDocument.js";
import DocumentSummary from "../models/DocumentSummary.js";

export default class DocumentDAO {
    static docsPerPage = 20;

    async update(userId, docId, thumbnail, title, content) {
        // Get server time since it's more accurate
        // A placeholder only, server replaces this with real timestamp once data is uploaded
        const lastModified = serverTimestamp();
        const lastAccessed = serverTimestamp();
        const docUpdate = new DocumentUpdate(userId, thumbnail, title, content, lastModified, lastAccessed);

        if (!docId) {
            // New document
            await addDoc(
                collection(db, "documents"),
                DocumentUpdate.fromDocUpdate(docUpdate)
            ).then((docRef) => {
                docId = docRef.id;
            });
        } else {
            // Updating existing document
            await updateDoc(
                doc(db, "documents", docId),
                DocumentUpdate.fromDocUpdate(docUpdate)
            );
        }

        return await this.getFullDoc(userId, docId);
    }

    async delete(docId) {
        await deleteDoc(doc(db, "documents", docId));
    }

    async accessFullDoc(userId, docId) {
        await updateDoc(
            doc(db, "documents", docId),
            {
                lastAccessed: serverTimestamp()
            }
        );

        return await this.getFullDoc(userId, docId);
    }

    async getFullDoc(userId, docId) {
        const docRef = doc(db, "documents", docId);
        const docSnapshot = await getDoc(docRef);

        if (!docSnapshot.exists() || docSnapshot.data().userId !== userId) {
            return null;
        }

        return FullDocument.toFullDoc(docSnapshot);
    }

    #updateDocSummaryList(snapshot, docSummaryList) {
        snapshot.forEach((docSnapshot) => {
            const docSummary = DocumentSummary.toDocSummary(docSnapshot);
            docSummaryList.push(docSummary);
        });
    }

    async getDocSummaryList(userId, page, cursor) {
        let docQuery;

        if (page === 0) {
            docQuery = query(
                collection(db, "documents"),
                where("userId", "==", userId),
                orderBy("lastAccessed", "desc"),
                limit(DocumentDAO.docsPerPage)
            );
        } else {
            docQuery = query(
                collection(db, "documents"),
                where("userId", "==", userId),
                orderBy("lastAccessed", "desc"),
                startAfter(cursor),
                limit(DocumentDAO.docsPerPage)
            );
        }

        let docSummaryList = [];
        const docSnapshotList = await getDocs(docQuery);
        this.#updateDocSummaryList(docSnapshotList, docSummaryList);

        const unsub = onSnapshot(docQuery, (querySnapshot) => {
            docSummaryList = [];
            this.#updateDocSummaryList(querySnapshot, docSummaryList);
        });

        return [unsub, docSummaryList];
    }
}
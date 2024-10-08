import DocumentUpdate from "../models/DocumentUpdate.js";
import {db} from "../backend.js";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getCountFromServer,
    getDoc,
    getDocs,
    limit,
    // onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    startAfter,
    updateDoc,
    where
} from "firebase/firestore";
import FullDocument from "../models/FullDocument.js";
import DocumentSummary from "../models/DocumentSummary.js";

export default class DocumentDAO {
    static docsPerPage = 2;
    static recentNumDocs = 4;

    async update(userId, docId, thumbnail, title, content) {
        // Get server time since it's more accurate
        // A placeholder only, server replaces this with real timestamp once data is uploaded
        const lastModified = serverTimestamp();
        const lastAccessed = serverTimestamp();
        const docUpdate = new DocumentUpdate(userId, thumbnail, title, content, lastModified, lastAccessed);

        if (!docId) {
            // New document
            const docRef = await addDoc(
                collection(db, "documents"),
                DocumentUpdate.fromDocUpdate(docUpdate)
            );
            docId = docRef.id;
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

    async accessFullDoc(docId) {
        await updateDoc(
            doc(db, "documents", docId),
            {
                lastAccessed: serverTimestamp()
            }
        );
    }

    async getFullDoc(userId, docId) {
        const docRef = doc(db, "documents", docId);
        const docSnapshot = await getDoc(docRef);

        if (!docSnapshot.exists() || docSnapshot.data().userId !== userId) {
            return null;
        }

        return FullDocument.snapshotToFullDoc(docSnapshot);
    }

    async getDocSummaryPage(userId, cursor) {
        let docQuery;

        if (!cursor) {
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

        return await getDocs(docQuery);
    }

    async getDocSummaryList(userId, numItems) {
        let docQuery = query(
            collection(db, "documents"),
            where("userId", "==", userId),
            orderBy("lastAccessed", "desc"),
            limit(numItems)
        );

        let docSummaryList = [];
        const docSnapshotList = await getDocs(docQuery);
        let i = 0;

        docSnapshotList.forEach((docSnapshot) => {
            if (i < docSnapshotList.size) {
                const docSummary = DocumentSummary.snapshotToDocSummary(docSnapshot);
                docSummaryList.push(docSummary);
                i++;
            }
        });

        // Live update, not needed for now
        // const unsub = onSnapshot(docQuery, (querySnapshot) => {
        //     docSummaryList = [];
        //     i = 0;
        //
        //     querySnapshot.forEach((docSnapshot) => {
        //         if (i < querySnapshot.size) {
        //             const docSummary = DocumentSummary.toDocSummary(docSnapshot);
        //             docSummaryList.push(docSummary);
        //         }
        //     });
        // });

        // return [unsub, docSummaryList];
        return docSummaryList;
    }

    async countPages(userId) {
        let docQuery = query(
            collection(db, "documents"),
            where("userId", "==", userId)
        );

        const snapshot = await getCountFromServer(docQuery);
        return Math.ceil(snapshot.data().count / DocumentDAO.docsPerPage);
    }
}
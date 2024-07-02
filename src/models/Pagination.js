import {docDAO} from "../backend.js";
import DocumentSummary from "./DocumentSummary.js";

export default class Pagination {
    constructor() {
        this.currPage = 1;
        this.numItems = 0;
        this.pageList = [];
        this.docSnapshotList = null;
    }

    async fetchPage(userId, pageNum) {
        if (pageNum < 1 || pageNum > this.pageList.length + 1) {
            throw new Error("Page out of bounds");
        }

        if (pageNum <= this.pageList.length) {
            return this.pageList[pageNum - 1];
        }

        const cursor = this.pageList.length === 0 ? null : this.docSnapshotList.docs[this.docSnapshotList.docs.length - 1];
        let page = [];
        let i = this.numItems;
        this.docSnapshotList = await docDAO.getDocSummaryPage(userId, cursor);

        this.docSnapshotList.forEach((docSnapshot) => {
            const docSummary = DocumentSummary.toDocSummary(docSnapshot);
            page.push(docSummary);
            i++;
        });

        this.numItems = i;
        this.pageList.push(page);
        return page;
    }

    async prevPage(userId) {
        return await this.fetchPage(userId, --this.currPage);
    }

    async nextPage(userId) {
        return await this.fetchPage(userId, ++this.currPage);
    }
}
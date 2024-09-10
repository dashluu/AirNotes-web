import {docDAO} from "../backend.js";
import DocumentSummary from "./DocumentSummary.js";
import DocumentDAO from "../daos/DocumentDAO.js";

export default class Pagination {
    constructor() {
        this.currPage = 1;
        this.lastDocs = [];
        this.docList = null;
        this.searchMode = false;
        this.numPages = 0;
    }

    reset(searchMode) {
        this.currPage = 1;
        this.lastDocs = [];
        this.docList = null;
        this.searchMode = searchMode;
        this.numPages = 0;
    }

    // This method loads results page by page using cursor
    async fetchRecentNotesPage(userId, pageNum) {
        this.numPages = await docDAO.countPages(userId);
        const cursor = pageNum <= 1 ? null : this.lastDocs[pageNum - 2];
        let page = [];
        this.docList = await docDAO.getDocSummaryPage(userId, cursor);

        this.docList.forEach((docSnapshot) => {
            const docSummary = DocumentSummary.snapshotToDocSummary(docSnapshot);
            page.push(docSummary);
        });

        if (pageNum > this.lastDocs.length && this.docList.docs.length > 0) {
            this.lastDocs.push(this.docList.docs[this.docList.docs.length - 1]);
        }

        return page;
    }

    // This only returns a page of results as we speculate that one page is enough to show the user most relevant results
    async fetchSearchPage(userId, query) {
        const searchModel = {
            user_id: userId,
            query: query,
        };

        const response = await fetch(`${import.meta.env.VITE_AI_SERVER}/filter`, {
            method: "post",
            body: JSON.stringify(searchModel),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            this.numPages = 1;
            const searchResult = await response.json();
            this.docList = searchResult.splice(0, DocumentDAO.recentNumDocs);
            let page = [];

            for (let i = 0; i < this.docList.length; i++) {
                page.push(DocumentSummary.objToDocSummary(this.docList[i]));
            }

            return page;
        } else {
            throw new Error(await response.text());
        }
    }

    async prevRecentNotesPage(userId) {
        return await this.fetchRecentNotesPage(userId, --this.currPage);
    }

    async nextRecentNotesPage(userId) {
        return await this.fetchRecentNotesPage(userId, ++this.currPage);
    }

    async prevSearchPage(userId, query) {
        return await this.fetchSearchPage(userId, query, --this.currPage);
    }

    async nextSearchPage(userId, query) {
        return await this.fetchSearchPage(userId, query, ++this.currPage);
    }
}
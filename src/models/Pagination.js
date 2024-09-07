import {docDAO} from "../backend.js";
import DocumentSummary from "./DocumentSummary.js";
import DocumentDAO from "../daos/DocumentDAO.js";

export default class Pagination {
    constructor() {
        this.currPage = 1;
        this.pageList = [];
        this.summaryList = null;
        this.searchMode = false;
    }

    reset(searchMode) {
        this.currPage = 1;
        this.pageList = [];
        this.summaryList = null;
        this.searchMode = searchMode;
    }

    // This method loads results page by page using cursor
    async fetchRecentNotesPage(userId, pageNum) {
        if (pageNum <= this.pageList.length) {
            return this.pageList[pageNum - 1];
        }

        const cursor = this.pageList.length === 0 ? null : this.summaryList.docs[this.summaryList.docs.length - 1];
        let page = [];
        this.summaryList = await docDAO.getDocSummaryPage(userId, cursor);

        this.summaryList.forEach((docSnapshot) => {
            const docSummary = DocumentSummary.snapshotToDocSummary(docSnapshot);
            page.push(docSummary);
        });

        this.pageList.push(page);
        return page;
    }

    // This method loads the search result entirely and paginates the results using page number rather than cursor
    // We speculated that the number of documents returned by search should be small enough for full search results
    async fetchSearchPage(userId, query, pageNum) {
        if (pageNum <= this.pageList.length) {
            return this.pageList[pageNum - 1];
        }

        const searchModel = {
            user_id: userId,
            query: query,
        };

        const response = await fetch(`${import.meta.env.VITE_AI_SERVER}/search`, {
            method: "post",
            body: JSON.stringify(searchModel),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            this.summaryList = await response.json();
            let page = null;

            for (let i = 0; i < this.summaryList.length; i++) {
                if (i % DocumentDAO.docsPerPage === 0) {
                    page = [DocumentSummary.objToDocSummary(this.summaryList[i])];
                    this.pageList.push(page);
                } else {
                    page.push(DocumentSummary.objToDocSummary(this.summaryList[i]));
                }
            }

            return this.pageList[pageNum - 1];
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
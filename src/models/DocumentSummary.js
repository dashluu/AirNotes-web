export default class DocumentSummary {
    constructor(id, title, date) {
        this.id = id;
        this.title = title;
        this.date = date;
    }

    toString() {
        return `id: ${this.id}\ntitle:${this.title}\ndate:${this.date}`;
    }

    static getDateStr(timestamp) {
        const date = timestamp.toDate();
        return `${date.toLocaleDateString("en-US")} ${date.toLocaleTimeString("en-US")}`;
    }

    static ToDocumentSummary(snapshot) {
        const data = snapshot.data();
        return new DocumentSummary(snapshot.id, data.title, this.getDateStr(data.date));
    }
}
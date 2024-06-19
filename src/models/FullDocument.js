export default class FullDocument {
    constructor(id, userId, title, content, date) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.content = content;
        this.date = date;
    }

    toString() {
        return `id: ${this.id}\nuserId:${this.userId}\ntitle:${this.title}\ncontent:${this.content}\ndate:${this.date}`;
    }

    static FromFullDocument(fullDocument) {
        return {
            id: fullDocument.id,
            userId: fullDocument.userId,
            title: fullDocument.title,
            content: fullDocument.content,
            date: fullDocument.date
        };
    }

    static getDateStr(timestamp) {
        const date = timestamp.toDate();
        return `${date.toLocaleDateString("en-US")} ${date.toLocaleTimeString("en-US")}`;
    }

    static ToFullDocument(snapshot) {
        const data = snapshot.data();
        return new FullDocument(snapshot.id, data.userId, data.title, data.content, this.getDateStr(data.date));
    }
}
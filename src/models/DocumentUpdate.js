export default class DocumentUpdate {
    constructor(userId, title, content, date) {
        this.userId = userId;
        this.title = title;
        this.content = content;
        this.date = date;
    }

    toString() {
        return `userId:${this.userId}\ntitle:${this.title}\ncontent:${this.content}\ndate:${this.date}`;
    }

    static FromDocumentUpdate(documentUpdate) {
        return {
            userId: documentUpdate.userId,
            title: documentUpdate.title,
            content: documentUpdate.content,
            date: documentUpdate.date
        };
    }

    static getDateStr(timestamp) {
        const date = timestamp.toDate();
        return date.toLocaleDateString("en-US");
    }

    static ToDocumentUpdate(snapshot) {
        const data = snapshot.data();
        return new DocumentUpdate(data.userId, data.title, data.content, this.getDateStr(data.date));
    }
}
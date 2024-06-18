class DocumentUpdate {
    constructor(userId, title, content, date) {
        this.userId = userId;
        this.title = title;
        this.content = content;
        this.date = date;
    }

    static FromDocumentUpdate(documentUpdate) {
        return {
            userId: documentUpdate.userId,
            title: documentUpdate.title,
            content: documentUpdate.content,
            date: documentUpdate.date
        };
    }

    static ToDocumentUpdate(snapshot) {
        const data = snapshot.data();
        return new DocumentUpdate(data.userId, data.title, data.content, data.date);
    }
}

export default DocumentUpdate;
class DocumentUpdate {
    constructor(userId, title, content) {
        this.userId = userId;
        this.title = title;
        this.content = content;
    }

    static FromDocumentUpdate(documentUpdate) {
        return {
            userId: documentUpdate.userId,
            title: documentUpdate.title,
            content: documentUpdate.content,
        };
    }

    static ToDocumentUpdate(snapshot) {
        const data = snapshot.data();
        return new DocumentUpdate(data.userId, data.title, data.content);
    }
}

export default DocumentUpdate;
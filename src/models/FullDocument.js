class FullDocument {
    constructor(id, userId, title, content) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.content = content;
    }

    toString() {
        return `id: ${this.id}\nuserId:${this.userId}\ntitle:${this.title}\ncontent:${this.content}`;
    }

    static FromFullDocument(fullDocument) {
        return {
            id: fullDocument.id,
            userId: fullDocument.userId,
            title: fullDocument.title,
            content: fullDocument.content,
        };
    }

    static ToFullDocument(snapshot) {
        const data = snapshot.data();
        return new FullDocument(snapshot.id, data.userId, data.title, data.content);
    }
}

export default FullDocument;
export default class DocumentUpdate {
    constructor(userId, thumbnail, title, content, lastModified, lastAccessed) {
        this.userId = userId;
        this.thumbnail = thumbnail;
        this.title = title;
        this.content = content;
        this.lastModified = lastModified;
        this.lastAccessed = lastAccessed;
    }

    toString() {
        return `userId: ${this.userId}\n
        thumbnail: ${this.thumbnail}\n
        title: ${this.title}\n
        content: ${this.content}\n
        last modified: ${this.lastModified}\n
        last accessed: ${this.lastAccessed}\n`;
    }

    static fromDocumentUpdate(documentUpdate) {
        return {
            userId: documentUpdate.userId,
            thumbnail: documentUpdate.thumbnail,
            title: documentUpdate.title,
            content: documentUpdate.content,
            lastModified: documentUpdate.lastModified,
            lastAccessed: documentUpdate.lastAccessed
        };
    }
}
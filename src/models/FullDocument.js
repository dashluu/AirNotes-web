export default class FullDocument {
    constructor(id, thumbnail, userId, title, content, lastModified, lastAccessed) {
        this.id = id;
        this.userId = userId;
        this.thumbnail = thumbnail;
        this.title = title;
        this.content = content;
        this.lastModified = lastModified;
        this.lastAccessed = lastAccessed;
    }

    toString() {
        return `id: ${this.id}\n
        user id: ${this.userId}\n
        thumbnail: ${this.thumbnail}\n
        title: ${this.title}\n
        content: ${this.content}\n
        last modified: ${this.lastModified}\n
        last accessed: ${this.lastAccessed}\n`;
    }

    static getDateStr(timestamp) {
        const date = timestamp.toDate();
        return `${date.toLocaleDateString("en-US")} ${date.toLocaleTimeString("en-US")}`;
    }

    static toFullDocument(snapshot) {
        const data = snapshot.data();
        return new FullDocument(
            snapshot.id,
            data.userId,
            data.thumbnail,
            data.title,
            data.content,
            this.getDateStr(data.lastModified),
            this.getDateStr(data.lastAccessed)
        );
    }
}
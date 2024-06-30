export default class DocumentSummary {
    constructor(id, thumbnail, title, lastModified, lastAccessed) {
        this.id = id;
        this.thumbnail = thumbnail;
        this.title = title;
        this.lastModified = lastModified;
        this.lastAccessed = lastAccessed;
    }

    toString() {
        return `id: ${this.id}\n
        thumbnail: ${this.thumbnail}\n
        title: ${this.title}\n
        last modified: ${this.lastModified}\n
        last accessed: ${this.lastAccessed}\n`;
    }

    static getDateStr(timestamp) {
        const date = timestamp.toDate();
        return `${date.toLocaleDateString("en-US")} ${date.toLocaleTimeString("en-US")}`;
    }

    static toDocSummary(snapshot) {
        const data = snapshot.data();
        return new DocumentSummary(
            snapshot.id,
            data.thumbnail,
            data.title,
            this.getDateStr(data.lastModified),
            this.getDateStr(data.lastAccessed)
        );
    }
}
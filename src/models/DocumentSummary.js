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

    static getDateStr(date) {
        return `${date.toLocaleDateString("en-US")} ${date.toLocaleTimeString("en-US")}`;
    }

    static snapshotToDocSummary(snapshot) {
        const data = snapshot.data();
        return new DocumentSummary(
            snapshot.id,
            data.thumbnail,
            data.title,
            this.getDateStr(data.lastModified.toDate()),
            this.getDateStr(data.lastAccessed.toDate())
        );
    }

    static objToDocSummary(obj) {
        return new DocumentSummary(
            obj.id,
            obj.thumbnail,
            obj.title,
            this.getDateStr(new Date(obj.lastModified)),
            this.getDateStr(new Date(obj.lastAccessed))
        );
    }
}
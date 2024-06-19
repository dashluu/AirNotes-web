import Editor from "../editor/Editor.jsx";
import {redirect, useLoaderData} from "react-router-dom";
import {documentDAO} from "../firebase.js";

export async function loader({params}) {
    const fullDocument = await documentDAO.getFullDocument(params.documentId);

    if (fullDocument) {
        return fullDocument;
    }

    // Error while loading the document
    return redirect("/error");
}

function EditDocumentPage() {
    const fullDocument = useLoaderData();

    return (
        <Editor documentId={fullDocument.id}
                title={fullDocument.title}
                content={fullDocument.content}
                date={fullDocument.date}
                isNewDocument={false}>
        </Editor>
    );
}

export default EditDocumentPage;
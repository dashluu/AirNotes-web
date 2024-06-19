import "./App.scss";
import NavBar from "./navbar/NavBar.jsx";
import Card from "./card/Card.jsx";
import CardGrid from "./card/CardGrid.jsx";
import {useEffect, useState} from "react";
import {documentDAO, auth} from "./firebase.js";
import {onAuthStateChanged} from "firebase/auth";

function App() {
    const [getPage, setPage] = useState([]);

    async function fetchPage() {
        await onAuthStateChanged(auth, async (user) => {
            const documentSummaryList = await documentDAO.getDocumentSummaryList(user.uid, 0, null);
            const page = []

            for (let i = 0; i < documentSummaryList.length; i++) {
                page.push(
                    <Card key={i}
                          thumbnail="/thumbnail.jpg"
                          documentId={`${documentSummaryList[i].id}`}
                          title={`${documentSummaryList[i].title}`}
                          date={`${documentSummaryList[i].date}`}
                    />
                );
            }

            setPage(page);
        });
    }

    useEffect(() => {
        fetchPage();
    }, []);

    return (
        <div className="home-page">
            <NavBar/>
            <CardGrid topic="Technology" cards={getPage}/>
        </div>
    )
}

export default App;
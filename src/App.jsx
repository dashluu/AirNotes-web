import "./App.scss";
import NavBar from "./navbar/NavBar.jsx";
import Card from "./card_grid/Card.jsx";
import CardGrid from "./card_grid/CardGrid.jsx";
import {useEffect, useRef, useState} from "react";
import {documentDAO, auth} from "./firebase.js";
import {onAuthStateChanged} from "firebase/auth";

function App() {
    const pageBackground = useRef(null);
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
        if (pageBackground.current) {
            if (window.scrollY < pageBackground.current.offsetTop) {
                pageBackground.current.classList.remove("page-background-sticky");
            } else {
                pageBackground.current.classList.add("page-background-sticky");
            }
        }

        fetchPage();
    }, []);

    return (
        <div className="home-page">
            <NavBar/>
            <div className="page-background" ref={pageBackground}></div>
            <CardGrid cards={getPage}/>
        </div>
    )
}

export default App;
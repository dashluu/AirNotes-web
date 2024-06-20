import "./App.scss";
import NavBar from "./navbar/NavBar.jsx";
import Card from "./card_grid/Card.jsx";
import CardGrid from "./card_grid/CardGrid.jsx";
import {useEffect, useRef, useState} from "react";
import {documentDAO, auth} from "./firebase.js";
import {onAuthStateChanged} from "firebase/auth";
import {useNavigate} from "react-router-dom";

function App() {
    const navigate = useNavigate();
    const pageBackground = useRef(null);
    const [getCardList, setCardList] = useState([]);

    function fetchCardList() {
        let redirect = false;

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
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

                setCardList(page);
            } else {
                redirect = true;
            }
        });

        if (redirect) {
            unsubscribe();
            navigate("/sign-in");
        }
    }

    useEffect(() => {
        if (pageBackground.current) {
            if (window.scrollY < pageBackground.current.offsetTop) {
                pageBackground.current.classList.remove("page-background-sticky");
            } else {
                pageBackground.current.classList.add("page-background-sticky");
            }
        }
    });

    // Fetch data once
    useEffect(() => {
        fetchCardList();
    }, [])

    return (
        <div className="home-page">
            <NavBar/>
            <div className="page-background" ref={pageBackground}></div>
            <CardGrid cards={getCardList}/>
        </div>
    )
}

export default App;
import "./App.scss";
import NavBar from "./navbar/NavBar.jsx";
import Card from "./card_grid/Card.jsx";
import CardGrid from "./card_grid/CardGrid.jsx";
import {useEffect, useState} from "react";
import {auth, docDAO, paths, statusMessages} from "./backend.js";
import {onAuthStateChanged} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import Pagination from "./models/Pagination.js";
import Status from "./status/Status.jsx";
import StatusController from "./StatusController.js";

function App() {
    const navigate = useNavigate();
    const [getUser, setUser] = useState(null);
    const [getCardList, setCardList] = useState([]);
    const [getNumPages, setNumPages] = useState(0);
    const [getCurrPage, setCurrPage] = useState(1);
    const [getPrevPageDisabled, setPrevPageDisabled] = useState(true);
    const [getNextPageDisabled, setNextPageDisabled] = useState(false);
    const [getStatusDisplay, setStatusDisplay] = useState("none");
    const [getStatusIconClass, setStatusIconClass] = useState("");
    const [getStatusMessageClass, setStatusMessageClass] = useState("");
    const [getStatusIcon, setStatusIcon] = useState("");
    const [getStatusMessage, setStatusMessage] = useState("");
    const pagination = new Pagination();
    const statusController = new StatusController(
        setStatusDisplay, setStatusIconClass, setStatusMessageClass, setStatusIcon, setStatusMessage
    );

    async function fetchPage(userId, pageNum) {
        statusController.displayProgress();

        await pagination.fetchPage(userId, pageNum)
            .then((page) => {
                const cardList = page.map((docSummary, i) => <Card key={i} docSummary={docSummary}/>);
                setCardList(cardList);
                statusController.displayResult(true, statusMessages.loadedPageOk);
            })
            .catch(() => {
                // TODO: handle error
            });
    }

    async function fetchNumPages(userId) {
        await docDAO.countPages(userId)
            .then((numPages) => {
                setNumPages(numPages);
            })
            .catch(() => {
                // TODO: handle error
            });
    }

    function prevPage() {
        if (getUser) {
            pagination.prevPage(getUser.uid);
            setCurrPage(pagination.currPage);
        } else {
            navigate(paths.signIn);
        }
    }

    function nextPage() {
        if (getUser) {
            pagination.nextPage(getUser.uid);
            setCurrPage(pagination.currPage);
        } else {
            navigate(paths.signIn);
        }
    }

    useEffect(() => {
        const unsubUser = onAuthStateChanged(auth, (user) => {
            setUser(user);

            if (user) {
                fetchPage(user.uid, getCurrPage);
                fetchNumPages(user.uid);
            } else {
                navigate(paths.signIn);
            }
        });

        return () => {
            unsubUser();
        };
    }, []);

    useEffect(() => {
        setPrevPageDisabled(getCurrPage === 1);
    }, [getCurrPage]);

    useEffect(() => {
        setNextPageDisabled(getCurrPage === getNumPages);
    }, [getCurrPage]);

    return (
        <div className="home-page">
            <NavBar/>
            <div className="home-container">
                <div className="toolbar">
                    <div className="toolbar-button-container">
                        <button className="toolbar-button new-button"
                                onClick={() => {
                                    navigate(paths.newDoc);
                                }}
                                title="New">
                            <span className="material-symbols-outlined">edit_square</span>
                        </button>
                    </div>
                    <div className="page-navigator">
                        <button className="prev-page-button toolbar-button"
                                disabled={getPrevPageDisabled}
                                onClick={() => {
                                    prevPage();
                                }}>
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <div className="page">{getCurrPage} - {getNumPages}</div>
                        <button className="next-page-button toolbar-button"
                                disabled={getNextPageDisabled}
                                onClick={() => {
                                    nextPage();
                                }}>
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                </div>
                <Status display={getStatusDisplay}
                        iconClass={getStatusIconClass}
                        messageClass={getStatusMessageClass}
                        icon={getStatusIcon}
                        message={getStatusMessage}/>
                <CardGrid cards={getCardList}/>
            </div>
        </div>
    )
}

export default App;
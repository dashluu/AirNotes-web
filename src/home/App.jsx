import "./App.scss";
import NavBar from "../navbar/NavBar.jsx";
import NoteGridCard from "./NoteGridCard.jsx";
import NoteGrid from "./NoteGrid.jsx";
import {useEffect, useState} from "react";
import {auth, docDAO, paths} from "../backend.js";
import {onAuthStateChanged} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import Pagination from "../models/Pagination.js";
import Status from "../status/Status.jsx";
import StatusController from "../ui_elements/StatusController.js";
import ToolbarButton from "../ui_elements/ToolbarButton.jsx";
import PageNav from "./PageNav.jsx";

function App() {
    const navigate = useNavigate();
    const [getUser, setUser] = useState(null);
    const [getCardList, setCardList] = useState([]);
    const [getNumPages, setNumPages] = useState(0);
    const [getCurrPage, setCurrPage] = useState(1);
    const prevPageDisabled = getCurrPage === 1;
    const nextPageDisabled = getCurrPage === getNumPages;
    const [getStatusDisplay, setStatusDisplay] = useState("none");
    const [getStatusIconClass, setStatusIconClass] = useState("");
    const [getStatusMessageClass, setStatusMessageClass] = useState("");
    const [getStatusIcon, setStatusIcon] = useState("");
    const [getStatusMessage, setStatusMessage] = useState("");
    const [getPagination, setPagination] = useState(new Pagination());
    const statusController = new StatusController(
        setStatusDisplay, setStatusIconClass, setStatusMessageClass, setStatusIcon, setStatusMessage
    );

    async function fetchPage(userId, pageNum) {
        statusController.displayProgress();

        try {
            const page = await getPagination.fetchPage(userId, pageNum);
            const cardList = page.map((docSummary, i) => <NoteGridCard key={i} docSummary={docSummary}/>);
            setCardList(cardList);
            statusController.hideStatus();
        } catch (error) {
            navigate(paths.error);
        }
    }

    async function fetchNumPages(userId) {
        try {
            const numPages = await docDAO.countPages(userId);
            setNumPages(numPages);
        } catch (error) {
            navigate(paths.error);
        }
    }

    async function prevPage() {
        if (getUser) {
            statusController.displayProgress();

            try {
                const page = await getPagination.prevPage(getUser.uid);
                const cardList = page.map((docSummary, i) => <NoteGridCard key={i} docSummary={docSummary}/>);
                setCardList(cardList);
                setCurrPage(getPagination.currPage);
                statusController.hideStatus();
            } catch (error) {
                statusController.displayFailure(error.message);
            }
        } else {
            navigate(paths.signIn);
        }
    }

    async function nextPage() {
        if (getUser) {
            statusController.displayProgress();

            try {
                const page = await getPagination.nextPage(getUser.uid);
                const cardList = page.map((docSummary, i) => <NoteGridCard key={i} docSummary={docSummary}/>);
                setCardList(cardList);
                setCurrPage(getPagination.currPage);
                statusController.hideStatus();
            } catch (error) {
                statusController.displayFailure(error.message);
            }
        } else {
            navigate(paths.signIn);
        }
    }

    async function loadFirstPage(userId) {
        await fetchPage(userId, getCurrPage);
        await fetchNumPages(userId);
    }

    useEffect(() => {
        const unsubUser = onAuthStateChanged(auth, (user) => {
            setUser(user);

            if (user) {
                loadFirstPage(user.uid);
            } else {
                navigate(paths.signIn);
            }
        });

        return () => {
            unsubUser();
        };
    }, []);

    return (
        <div className="home-page">
            <NavBar/>
            <div className="home-container">
                <div className="toolbar-container">
                    <div className="toolbar">
                        <ToolbarButton title="New" icon="edit_square"
                                       click={() => navigate(paths.newDoc)}/>
                        <input type="search" className="search-input text-input" placeholder="Search notes..."/>
                    </div>
                    <PageNav currPage={getCurrPage} numPages={getNumPages}
                             prevPageDisabled={prevPageDisabled} nextPageDisabled={nextPageDisabled}
                             prevPage={() => prevPage()}
                             nextPage={() => nextPage()}/>
                </div>
                <Status display={getStatusDisplay}
                        iconClass={getStatusIconClass}
                        messageClass={getStatusMessageClass}
                        icon={getStatusIcon}
                        message={getStatusMessage}/>
                <NoteGrid cards={getCardList}/>
            </div>
        </div>
    )
}

export default App;
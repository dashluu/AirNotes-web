import "./PageNav.scss";

function PageNav({currPage, numPages, prevPageDisabled, nextPageDisabled, prevPage, nextPage}) {
    return (
        <div className="page-nav">
            <button className="prev-page-button page-nav-button"
                    disabled={prevPageDisabled}
                    onClick={prevPage}>
                <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <div className="page">{currPage} - {numPages}</div>
            <button className="next-page-button page-nav-button"
                    disabled={nextPageDisabled}
                    onClick={nextPage}>
                <span className="material-symbols-outlined">chevron_right</span>
            </button>
        </div>
    )
}

export default PageNav;
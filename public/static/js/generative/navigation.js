
document.addEventListener('keydown', (event) => {
    if (event.key === "ArrowLeft") {
        goToPreviousPage();
    } else if (event.key === "ArrowRight") {
        goToNextPage();
    }
});


let pages = ['one', 'conway', 'airplane'];

function goToPreviousPage() {
    let pathParts = location.pathname.split('/');
    let currentPage = pathParts[pathParts.length - 1];
    let index = pages.indexOf(currentPage);
    if (index > 0) {
        let newPage = pages[index - 1];
        pathParts[pathParts.length - 1] = newPage;
        location.href = pathParts.join('/');
    }
}


function goToNextPage() {
    let pathParts = location.pathname.split('/');
    let currentPage = pathParts[pathParts.length - 1];
    let index = pages.indexOf(currentPage);
    if (index < pages.length - 1) {
        let newPage = pages[index + 1];
        pathParts[pathParts.length - 1] = newPage;
        location.href = pathParts.join('/');
    }
}
async function init() {
    const table = document.getElementById('products');

    const resp = await axios.get(`${BACKEND_URL}/products?page=${0}&pageSize=${DEFAULT_PAGE_SIZE}`);
    resp.data.data.forEach((el) => {
        const childElement = document.createElement('tr');

        // index
        const indexElement = document.createElement('td');
        const indexTxt = document.createTextNode(el.id);
        indexElement.appendChild(indexTxt);

        // name
        const nameElement = document.createElement('td');
        const nameTxt = document.createTextNode(el.name);
        nameElement.appendChild(nameTxt);

        // description
        const descriptionElement = document.createElement('td');
        const descriptionTxt = document.createTextNode(el.description);
        descriptionElement.appendChild(descriptionTxt);

        // category
        const categoryElement = document.createElement('td');
        const categoryTxt = document.createTextNode(el.category);
        categoryElement.appendChild(categoryTxt);

        // view button
        const btnElement = document.createElement('td');
        const btn = document.createElement('button');
        const btnTxt = document.createTextNode('view detail');
        btn.appendChild(btnTxt);
        btn.addEventListener('click', (e) => {
            location.href = `product-detail.html?id=${el.id}`;
        });
        btnElement.appendChild(btn);

        childElement.appendChild(indexElement);
        childElement.appendChild(nameElement);
        childElement.appendChild(descriptionElement);
        childElement.appendChild(categoryElement);
        childElement.appendChild(btnElement);

        table.appendChild(childElement);
    });

    const limit = DEFAULT_PAGE_SIZE;
    const totalPage = Math.round(resp.data.meta.total / limit);
    console.log('totalPage', totalPage);

    renderPaginationBar(totalPage);
}

async function prev() {
    const lastChild = document.querySelectorAll('.page-number:last-child')[0];
    const currentPageElement = document.getElementsByClassName('active')[0];
    const currentPage = parseInt(currentPageElement.getInnerHTML());
    const totalPage = parseInt(lastChild.getInnerHTML());
    if (currentPage === 1) {
        return;
    }

    // check rerender
    const nextValue = currentPage - 1;
    await axios.get(`${BACKEND_URL}/products?page=${nextValue - 1}&pageSize=${DEFAULT_PAGE_SIZE}`).then((res) => {
        console.log('data:...', res.data);
        if (res.data?.data?.length) {
            renderTable(res.data.data);
        } else {
            console.log("failed");
        }
    });
    if (nextValue <= totalPage - 3 && nextValue >= 3) {
        renderPagination(nextValue, totalPage);
        return;
    }

    const desiredPageElement = currentPageElement.previousElementSibling;
    if (!desiredPageElement) {
        return;
    }

    const nextButton = document.getElementById('nextPage');
    currentPageElement.classList.remove('active');
    desiredPageElement.classList.add('active');
    nextButton.removeAttribute('disabled');
    if (currentPage === 2) {
        const prevButton = document.getElementById('prevPage');
        prevButton.setAttribute('disabled', '');
    }
}

async function next() {
    const lastChild = document.querySelectorAll('.page-number:last-child')[0];
    const currentPageElement = document.getElementsByClassName('active')[0];
    const currentPage = parseInt(currentPageElement.getInnerHTML());
    const totalPage = parseInt(lastChild.getInnerHTML());
    if (currentPage === totalPage) {
        return;
    }

    // check rerender
    const nextValue = currentPage + 1;
    await axios.get(`${BACKEND_URL}/products?page=${nextValue - 1}&pageSize=${DEFAULT_PAGE_SIZE}`).then((res) => {
        console.log('data:...', res.data);
        if (res.data?.data?.length) {
            renderTable(res.data.data);
        } else {
            console.log("failed");
        }
    });
    if (nextValue > 3 && nextValue <= totalPage - 2) {
        renderPagination(nextValue, totalPage);
        return;
    }

    const desiredPageElement = currentPageElement.nextElementSibling;
    if (!desiredPageElement) {
        return;
    }

    const prevButton = document.getElementById('prevPage');
    currentPageElement.classList.remove('active');
    desiredPageElement.classList.add('active');
    prevButton.removeAttribute('disabled');
    if (currentPage === totalPage - 1) {
        const nextButton = document.getElementById('nextPage');
        nextButton.setAttribute('disabled', '');
    }
}

function renderPageType1(paginationElement, nextPage, totalPage) {
    for (let page = 1; page <= 3; page++) {
        const pageElement = document.createElement('div');
        pageElement.classList.add('page-number');
        if (page === nextPage) {
            pageElement.classList.add('active');
        }
        const pageTxt = document.createTextNode(page);
        pageElement.appendChild(pageTxt);
        pageElement.addEventListener('click', (e) => {
            const currentPageElement = document.getElementsByClassName('active')[0];
            const currentPage = parseInt(currentPageElement.getInnerHTML());
            currentPageElement.classList.remove('active');
            e.currentTarget.classList.add('active');
            e.currentTarget.setAttribute('disabled', '');
            goTo(currentPage, page, totalPage);
        });

        paginationElement.appendChild(pageElement);
    }

    // last
    const lastPageElement = document.createElement('div');
    lastPageElement.classList.add('page-number');
    const totalPageTxt = document.createTextNode(totalPage);
    lastPageElement.appendChild(totalPageTxt);
    lastPageElement.addEventListener('click', (e) => {
        const currentPageElement = document.getElementsByClassName('active')[0];
        const currentPage = parseInt(currentPageElement.getInnerHTML());
        currentPageElement.classList.remove('active');
        e.currentTarget.classList.add('active');
        e.currentTarget.setAttribute('disabled', '');
        goTo(currentPage, totalPage, totalPage);
    });
    const lastPageLinkElement = document.createElement('div');
    lastPageLinkElement.classList.add('page-link');
    const lastPageLinkTxt = document.createTextNode('...');
    lastPageLinkElement.appendChild(lastPageLinkTxt);

    paginationElement.appendChild(lastPageLinkElement);
    paginationElement.appendChild(lastPageElement);
}

function renderPageType2(paginationElement, nextPage, totalPage) {
    // pre
    const firstPageElement = document.createElement('div');
    firstPageElement.classList.add('page-number');
    const firstPageTxt = document.createTextNode('1');
    firstPageElement.appendChild(firstPageTxt);
    firstPageElement.addEventListener('click', (e) => {
        const currentPageElement = document.getElementsByClassName('active')[0];
        const currentPage = parseInt(currentPageElement.getInnerHTML());
        currentPageElement.classList.remove('active');
        e.currentTarget.classList.add('active');
        e.currentTarget.setAttribute('disabled', '');
        goTo(currentPage, 1, totalPage);
    });
    const pageLinkElement = document.createElement('div');
    pageLinkElement.classList.add('page-link');
    const pageLinkTxt = document.createTextNode('...');
    pageLinkElement.appendChild(pageLinkTxt);

    paginationElement.appendChild(firstPageElement);
    paginationElement.appendChild(pageLinkElement);

    for (let page = nextPage - 1; page <= nextPage + 1; page++) {
        const pageElement = document.createElement('div');
        pageElement.classList.add('page-number');
        if (page === nextPage) {
            pageElement.classList.add('active');
        }
        const pageTxt = document.createTextNode(page);
        pageElement.appendChild(pageTxt);
        pageElement.addEventListener('click', (e) => {
            const currentPageElement = document.getElementsByClassName('active')[0];
            const currentPage = parseInt(currentPageElement.getInnerHTML());
            currentPageElement.classList.remove('active');
            e.currentTarget.classList.add('active');
            e.currentTarget.setAttribute('disabled', '');
            goTo(currentPage, page, totalPage);
        });

        paginationElement.appendChild(pageElement);
    }

    // last
    const lastPageElement = document.createElement('div');
    lastPageElement.classList.add('page-number');
    const totalPageTxt = document.createTextNode(totalPage);
    lastPageElement.appendChild(totalPageTxt);
    lastPageElement.addEventListener('click', (e) => {
        const currentPageElement = document.getElementsByClassName('active')[0];
        const currentPage = parseInt(currentPageElement.getInnerHTML());
        currentPageElement.classList.remove('active');
        e.currentTarget.classList.add('active');
        e.currentTarget.setAttribute('disabled', '');
        goTo(currentPage, totalPage, totalPage);
    });
    const lastPageLinkElement = document.createElement('div');
    lastPageLinkElement.classList.add('page-link');
    const lastPageLinkTxt = document.createTextNode('...');
    lastPageLinkElement.appendChild(lastPageLinkTxt);

    paginationElement.appendChild(lastPageLinkElement);
    paginationElement.appendChild(lastPageElement);
}

function renderPageType3(paginationElement, nextPage, totalPage) {
    // pre
    const firstPageElement = document.createElement('div');
    firstPageElement.classList.add('page-number');
    const firstPageTxt = document.createTextNode('1');
    firstPageElement.appendChild(firstPageTxt);
    firstPageElement.addEventListener('click', (e) => {
        const currentPageElement = document.getElementsByClassName('active')[0];
        const currentPage = parseInt(currentPageElement.getInnerHTML());
        currentPageElement.classList.remove('active');
        e.currentTarget.classList.add('active');
        e.currentTarget.setAttribute('disabled', '');
        goTo(currentPage, 1, totalPage);
    });
    const pageLinkElement = document.createElement('div');
    pageLinkElement.classList.add('page-link');
    const pageLinkTxt = document.createTextNode('...');
    pageLinkElement.appendChild(pageLinkTxt);

    paginationElement.appendChild(firstPageElement);
    paginationElement.appendChild(pageLinkElement);

    for (let page = totalPage - 2; page <= totalPage; page++) {
        const pageElement = document.createElement('div');
        pageElement.classList.add('page-number');
        if (page === nextPage) {
            pageElement.classList.add('active');
        }
        const pageTxt = document.createTextNode(page);
        pageElement.appendChild(pageTxt);
        pageElement.addEventListener('click', (e) => {
            const currentPageElement = document.getElementsByClassName('active')[0];
            const currentPage = parseInt(currentPageElement.getInnerHTML());
            currentPageElement.classList.remove('active');
            e.currentTarget.classList.add('active');
            e.currentTarget.setAttribute('disabled', '');
            goTo(currentPage, page, totalPage);
        });

        paginationElement.appendChild(pageElement);
    }
}

function renderPagination(page, totalPage) {
    const paginationElement = document.getElementById('pages');
    paginationElement.innerHTML = '';
    if (page !== 1) {
        const prevButton = document.getElementById('prevPage');
        prevButton.removeAttribute('disabled');
    } else {
        const prevButton = document.getElementById('prevPage');
        prevButton.setAttribute('disabled', '');
    }
    if (page !== totalPage) {
        const nextButton = document.getElementById('nextPage');
        nextButton.removeAttribute('disabled');
    } else {
        const nextButton = document.getElementById('nextPage');
        nextButton.setAttribute('disabled', '');
    }
    if (page <= 3) {
        renderPageType1(paginationElement, page, totalPage);
        return;
    } else if (page > 3 && page <= totalPage - 3) {
        renderPageType2(paginationElement, page, totalPage);
        return;
    }

    renderPageType3(paginationElement, page, totalPage);
}

function goTo(currentPage, nextPage, totalPage) {
    console.log('click!!!!!!!!!', nextPage);
    renderPagination(nextPage, totalPage);

    axios.get(`${BACKEND_URL}/products?page=${nextPage - 1}&pageSize=${DEFAULT_PAGE_SIZE}`).then((res) => {
        console.log('data:...', res.data);
        if (res.data?.data?.length) {
            renderTable(res.data.data);
        } else {
            console.log("failed");
        }
    });
}

function renderTable(data) {
    const table = document.getElementById('products');
    table.innerHTML = '';
    data.forEach((el) => {
        const childElement = document.createElement('tr');

        // index
        const indexElement = document.createElement('td');
        const indexTxt = document.createTextNode(el.id);
        indexElement.appendChild(indexTxt);

        // name
        const nameElement = document.createElement('td');
        const nameTxt = document.createTextNode(el.name);
        nameElement.appendChild(nameTxt);

        // description
        const descriptionElement = document.createElement('td');
        const descriptionTxt = document.createTextNode(el.description);
        descriptionElement.appendChild(descriptionTxt);

        // category
        const categoryElement = document.createElement('td');
        const categoryTxt = document.createTextNode(el.category);
        categoryElement.appendChild(categoryTxt);

        // view button
        const btnElement = document.createElement('td');
        const btn = document.createElement('button');
        const btnTxt = document.createTextNode('view detail');
        btn.appendChild(btnTxt);
        btn.addEventListener('click', (e) => {
            location.href = 'product-detail.html';
        });
        btnElement.appendChild(btn);

        childElement.appendChild(indexElement);
        childElement.appendChild(nameElement);
        childElement.appendChild(descriptionElement);
        childElement.appendChild(categoryElement);
        childElement.appendChild(btnElement);

        table.appendChild(childElement);
    });
}

function renderPaginationBar(totalPage) {
    const currentPage = 1;
    // pagination events
    const prevButton = document.getElementById('prevPage');
    prevButton.setAttribute('disabled', '');
    if (currentPage === totalPage) {
        const nextButton = document.getElementById('nextPage');
        nextButton.setAttribute('disabled', '');
    }
    const pages = document.getElementById('pages');
    pages.innerHTML = '';
    // full pages
    if (totalPage <= 5) {
        for (let page = 1; page <= totalPage; page++) {
            const pageElement = document.createElement('div');
            pageElement.classList.add('page-number');
            if (page === 1) {
                pageElement.classList.add('active');
            }
            const pageTxt = document.createTextNode(page);
            pageElement.appendChild(pageTxt);
            pageElement.addEventListener('click', (e) => {
                const currentPageElement = document.getElementsByClassName('active')[0];
                const currentPage = parseInt(currentPageElement.getInnerHTML());
                currentPageElement.classList.remove('active');
                e.currentTarget.classList.add('active');
                e.currentTarget.setAttribute('disabled', '');
                goTo(currentPage, page, totalPage);
            });

            pages.appendChild(pageElement);
        }

        return;
    }

    // not full
    for (let page = 1; page <= 3; page++) {
        const pageElement = document.createElement('div');
        pageElement.classList.add('page-number');
        if (page === 1) {
            pageElement.classList.add('active');
        }
        const pageTxt = document.createTextNode(page);
        pageElement.appendChild(pageTxt);
        pageElement.addEventListener('click', (e) => {
            const currentPageElement = document.getElementsByClassName('active')[0];
            const currentPage = parseInt(currentPageElement.getInnerHTML());
            currentPageElement.classList.remove('active');
            e.currentTarget.classList.add('active');
            e.currentTarget.setAttribute('disabled', '');
            goTo(currentPage, page, totalPage);
        });

        pages.appendChild(pageElement);
    }

    const pageLinkElement = document.createElement('div');
    pageLinkElement.classList.add('page-link');
    const pageLinkTxt = document.createTextNode('...');
    pageLinkElement.appendChild(pageLinkTxt);

    const lastPageElement = document.createElement('div');
    lastPageElement.classList.add('page-number');
    const totalPageTxt = document.createTextNode(totalPage);
    lastPageElement.appendChild(totalPageTxt);
    lastPageElement.addEventListener('click', (e) => {
        const currentPageElement = document.getElementsByClassName('active')[0];
        const currentPage = parseInt(currentPageElement.getInnerHTML());
        currentPageElement.classList.remove('active');
        e.currentTarget.classList.add('active');
        e.currentTarget.setAttribute('disabled', '');
        goTo(currentPage, totalPage, totalPage);
    });

    pages.appendChild(pageLinkElement);
    pages.appendChild(lastPageElement);
}

async function search() {
    const table = document.getElementById('products');
    const pages = document.getElementById('pages');
    table.innerHTML = '';
    pages.innerHTML = '';
    let url = `${BACKEND_URL}/products?page=${0}&pageSize=${DEFAULT_PAGE_SIZE}`;
    const productName = document.getElementById('productName').value;
    const categoryName = document.getElementById('categoryName').value;
    if (productName) {
        url += `&name=${productName}`;
    }
    if (categoryName) {
        url += `&category=${categoryName}`;
    }

    const resp = await axios.get(url);

    if (resp.data?.data?.length && resp.data?.meta?.total) {
        const totalPage = Math.round(resp.data.meta.total / DEFAULT_PAGE_SIZE);
        renderTable(resp.data.data);
        renderPaginationBar(totalPage);
    }
}

async function initProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const resp = await axios.get(`${BACKEND_URL}/products/${id}`);
    if (!resp.data?.data) {
        return;
    }

    // render detail
    const idElement = document.getElementById('id');
    const nameElement = document.getElementById('name');
    const descriptionElement = document.getElementById('description');
    const categoryElement = document.getElementById('category');
    const priceElement = document.getElementById('price');

    idElement.innerText = resp.data.data.id;
    nameElement.innerHTML = resp.data.data.name;
    descriptionElement.innerHTML = resp.data.data.description;
    categoryElement.innerHTML = resp.data.data.category;
    priceElement.innerHTML = resp.data.data.price;
}
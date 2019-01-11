export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchReslist: document.querySelector('.results__list'),
    searchLoad: document.querySelector('.results'),
    searchResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list'),
    logo: document.querySelector('.header__logo')
};

export const elementStrings = {
    loader: "loader"
};

export const renderLoader = parent => {
    const loader = `
            <div class="${elementStrings.loader}">    
                <svg>
                    <use href="img/icons.svg#icon-cw"></use>
                </svg>
            </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
};

export const removeLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if(loader) {
        loader.parentElement.removeChild(loader);
    }
    
};
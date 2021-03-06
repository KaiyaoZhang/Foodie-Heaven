import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = "";
}

export const clearResult = () => {
    elements.searchReslist.innerHTML = "";
    elements.searchResPages.innerHTML = "";
}

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
}

export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if(title.length > limit) {
        const splitTitle = title.split(/[\s-]+/);
        if(splitTitle[0].length > limit) {
            return `${splitTitle[0]} ...`;
        }
        splitTitle.reduce((acc, cur) => {
           if(acc + cur.length <= limit) {
               newTitle.push(cur);
           } 
            return acc + cur.length;
        },0);
        
        return `${newTitle.join(" ")} ...`;
    }
}

const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link" id="${recipe.recipe_id}" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchReslist.insertAdjacentHTML('beforeend', markup);
}

//type: "pre" or "next"
const createButton = (page, type) => `
        <button class="btn-inline results__btn--${type}" data-goto=${type === 'pre' ? page - 1 : page +1}>
            <span>Page ${type === 'pre' ? page - 1 : page +1}</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${type === 'pre' ? 'left' : 'right'}"></use>
            </svg>
        </button>
`;

const renderButton = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults/resPerPage);
    let button;
    if(page === 1 && pages > 1){
        button = createButton(page, 'next');
    }else if(page < pages){
        button = `
            ${createButton(page, 'next')}
            ${createButton(page, 'pre')}
    `;

    }else if(page === pages && pages > 1){
        button = createButton(page, 'pre');
    }
    
    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
}

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    //render results of current page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    recipes.slice(start, end).forEach(renderRecipe);
    
    //render pagination buttons
    renderButton(page, recipes.length, resPerPage);
}
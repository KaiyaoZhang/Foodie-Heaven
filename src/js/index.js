import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import Driver from 'driver.js';
//import 'driver.js/dist/driver.min.css';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, removeLoader } from './views/base';

/* Global state of the app
   1. Search object
   2. Current recipe object
   3. Shopping list object
   4. Liked recipes
*/

const state = {};

// Search Controller
const controlSearch = async () => {
    // 1) Get query from view
    const query = searchView.getInput();
    
    if(query) {
        // 2) New search object and add to state
        state.search = new Search(query);
        
        // 3) Prepare UI for  results
        searchView.clearInput();
        searchView.clearResult();
        renderLoader(elements.searchLoad);
        
        try{
            // 4) Search for recipes
            await state.search.getResults();

            // 5) Render results  on UI
            removeLoader();
            searchView.renderResults(state.search.result);    
        }catch{
         alert('Something wrong with the search...'); 
         removeLoader();
    }
        
        
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})
 
elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResult();
        searchView.renderResults(state.search.result, goToPage);
    }
    
})

// Recipe Controller
const controlRecipe = async () => {
    //Get Id from URL
    const id = window.location.hash.replace('#', '');
    
    if(id) {
        //Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        
        //Highlight selected search item
        searchView.highlightSelected(id);
        //Create new recipe object
        state.recipe = new Recipe(id);

            //try{
                //Get recipe data
                await state.recipe.getRecipe();
                state.recipe.parseIngredients();

                //Calculate servings and time
                state.recipe.calcServings();
                state.recipe.calcTime();

                //Render recipe
                removeLoader();
                recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
            //}
        //catch(error){
                //alert('Error processing recipe!');
            //}
        }
}

['load', 'hashchange'].forEach(event => addEventListener(event, controlRecipe));

const controlList = () => {
    // Create a new list IF there in none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

//Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);

    // Handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

//Like controller

const constrolLike = () => {
    if(!state.likes) {
        state.likes = new Likes();
    } 
    
    const currentId = state.recipe.id;
    
    //User doesn't have liked this recipe
    if(!state.likes.isLiked(currentId)) {
        //Add like to the state
        const newLike = state.likes.addLike(
            currentId,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        //Toggle the like button
        likesView.toggleLikeBtn(true);
        //Add like to the user list
        likesView.renderLike(newLike);
        
    //User has liked this recipe    
    } else {
        //Remove like from the state
        state.likes.deleteLike(currentId);
        //Toggle the like button
        likesView.toggleLikeBtn(false);
        //Remove like from UI list
        likesView.deleteLike(currentId);
    }
    
    likesView.toggleLikeMenu(state.likes.getNumLikes());
}

//Restore liked recipes on page load

window.addEventListener('load', () => {
    state.likes = new Likes();
    
    //Restore likes
    state.likes.readStorage();
    
    //Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    
    //Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));    
});




//Handing recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        constrolLike();
    }
});

/*elements.logo.addEventListener('click', () => {
    const driver = new Driver();
    driver.highlight({
    element: '#text',
    popover: {
    title: 'Title',
    description: 'Descr',
    // position can be left, left-center, left-bottom, top,
    // top-center, top-right, right, right-center, right-bottom,
    // bottom, bottom-center, bottom-right
    position: 'right',
  }
});
})*/
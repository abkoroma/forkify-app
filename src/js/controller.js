import 'core-js/stable';
//import { async } from 'regenerator-runtime';
import { 
  loadRecipe, loadSearchResults, state, getSearchResult, updateServings,
  addBookmark, removeBookmark, uploadRecipe
} from './model';
import recipeview from './views/recipeview';
import searchview from './views/searchview';
import resultsview from './views/resultsview';
import paginationview from './views/paginationview';
import bookmarksview from './views/bookmarksview';
import addrecipeview from './views/addrecipeview';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
/*if (module.hot) {
  module.hot.accept();
}*/

async function showRecipe() {
  try {
    const recipeId = window.location.hash.slice(1);
  
    if (!recipeId) return;
    recipeview.loadSpinner();

    resultsview.update(getSearchResult());

    bookmarksview.update(state.bookmarks);

    //fetching and loading recipes
    await loadRecipe(recipeId);

    //rendering recipe
    recipeview.render(state.recipe);
  } catch(err) {
    recipeview.errorMessage();
    console.log(err);
  }
}

async function showSearchResults() {
  try {
    const query = searchview.getQuery();

    if (!query) return;
    resultsview.loadSpinner();

    await loadSearchResults(query)
    .catch((err) =>
      recipeview.errorMessage(err)
    );

    //resultsview.render(state.search.results);
    resultsview.render(getSearchResult());

    paginationview.render(state.search);
  } catch(err) {
    console.log(err);
  }

}

function controlPagination(goToPage) {
  resultsview.render(getSearchResult(goToPage));
  paginationview.render(state.search);
}

function controlServings(newServings) {
  //update the recipe serving (in state)
  updateServings(newServings);
  //update the render view
  recipeview.update(state.recipe);
  //recipeview.update(state.recipe);
}

function controlAddBookmark() {
  //add or remove bbokmark
  if (!state.recipe.bookmarked) {
    addBookmark(state.recipe);
  } else {
    removeBookmark(state.recipe.id);
  }
  //update recipe view
  recipeview.update(state.recipe);

  //render bookmark
  bookmarksview.render(state.bookmarks);
}

function controlBookmarks() {
  bookmarksview.render(state.bookmarks);
}

async function controlAddRecipe(newRecipe) {
  try {
    addrecipeview.loadSpinner();

    await uploadRecipe(newRecipe).catch(err => {
      addrecipeview.errorMessage(err);
    });

    recipeview.render(state.recipe);

    addrecipeview.errorMessage();

    bookmarksview.render(state.bookmarks);

    window.history.pushState(null, '', `#${state.recipe.id}`);

    setTimeout(function() {
      addrecipeview.toggleWindow();
    }, 2500);
  } catch(err) {
    addrecipeview.errorMessage(err.message);
  }

}

function init() {
  bookmarksview.handlerRenderBookmarks(controlBookmarks);
  recipeview.addEventHandlerRender(showRecipe);
  recipeview.updateServingsHander(controlServings);
  recipeview.addEventHandlerBookmark(controlAddBookmark);
  searchview.addEventHandlerSearch(showSearchResults);
  paginationview.paginationClickHandler(controlPagination);
  addrecipeview.handlerUplaodRecipe(controlAddRecipe);
}
init();


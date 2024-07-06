//state object with a recipe, search, and bookmark object
//function for loading recipe
import { API_URL, API_KEY } from "./config";
import { reqJSON } from "./helpers";

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: 10,
    },
    bookmarks: [],
}

function createRecipeObject(data) {
    const { recipes } = data.data.recipes;

    return {
        id: recipes.id,
        title: recipes.title,
        publisher: recipes.publisher,
        sourceUrl: recipes.source_url,
        image: recipes.image_url,
        servings: recipes.servings,
        cookingTime: recipes.cooking_time,
        ingredients: recipes.ingredients,
        ...(recipes.key && { key: recipes.key }),
    };
}

export async function loadRecipe(recipeId) {
    try {
        const recipeData = await reqJSON(`${API_URL}${recipeId}?key=${API_KEY}`);
        console.log(recipeData);

        state.recipe = createRecipeObject(recipeData);
        console.log(state.recipe);

        if (state.bookmarks.some(bookmark => bookmark.id === recipeId)) {
            state.recipe.bookmarked = true;
        } else {
            state.recipe.bookmark = false;
        }
        console.log(state.recipe);
    } catch (err) {
        throw err;
    }

}

export async function loadSearchResults(query) {
    try {
        state.search.query = query;

        const searchData = await reqJSON(`${API_URL}?search=${query}&key=${API_KEY}`)
        .catch((err) => {
            throw err
        });
        console.log(searchData);

        state.search.results = searchData.data.recipes.map(recipe => {
            return {
                id: recipe.id,
                image: recipe.image_url,
                publisher: recipe.publisher,
                title: recipe.title,
                ...(recipe.key && { key: recipe.key }),
            }
        });
        state.search.page = 1;   
        console.log(state.search.results);
    } catch(err) {
        throw err;
    }
}

export function getSearchResult(page = state.search.page) {
    state.search.page = page;
    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;
    return state.search.results.slice(start, end);
}

export function updateServings(newServings) {
    state.recipe.ingredients.forEach(ingredient => {
        ingredient.quantity = (ingredient.quantity *  newServings) / state.recipe.servings;
    });

    state.recipe.servings = newServings;
}

function persistBookmarks() {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export function addBookmark(recipe) {
    state.bookmarks.push(recipe);

    //mark current recipe as bookmark
    if (recipe.id === state.recipe.id) {
        state.recipe.bookmarked = true;
    }

    persistBookmarks();
}

export function removeBookmark(id) {
    const index = state.bookmarks.findIndex(ele => ele.id === id);
    state.bookmarks.splice(index, 1);

    //mark current recipe as not bookmark
    if (id === state.recipe.id) {
        state.recipe.bookmarked = false;
    }

    persistBookmarks();
}

function init() {
    const storedBookmarks = localStorage.getItem('bookmarks');
    if (storedBookmarks) {
        state.bookmarks = JSON.parse(storedBookmarks);
    }
}
init();

function clearBookmarks() {
    localStorage.clear('bookmarks');
}

clearBookmarks();

export async function uploadRecipe(newRecipe) {
    try {
        const ingredients = Object.entries(newRecipe)
        .filter(entry => 
            entry[0].startsWith('ingredient') && entry[1] !== '')
            .map(ingredient => {
                const ingredientsArr = ingredient[1].split(',').map(ele => ele.trim());
                if (ingredientsArr.length !== 3) {
                    throw new Error('Wrong ingredient format!');
                }

                const [quantity, unit, description] = ingredientsArr
            
                return { quantity: quantity ?  +quantity : null, unit, description };
            }
        );

        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        };

        const recipesData = await reqJSONJSON(
            `${API_URL}?key=${API_KEY}`, recipe
        );
        state.recipe = createRecipeObject(recipesData);
        addBookmark(state.recipe);
    } catch(err) {
        throw err;
    }
    
}

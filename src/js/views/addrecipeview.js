import View from "./view";

class AddRecipeView extends View {

    constructor() {
        super();
        this._parentElement = document.querySelector('.upload');
        this._window = document.querySelector('.add-recipe-window');
        this._overlay = document.querySelector('.overlay');
        this._btnOpen = document.querySelector('.nav__btn--add-recipe');
        this._btnClose = document.querySelector('.btn--close-modal');

        this._handlerShowAddRecipeWindow();
        this._handlerCloseAddRecipeWindow();
    }

    toggleWindow() {
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
    }

    _handlerShowAddRecipeWindow() {
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    }

    _handlerCloseAddRecipeWindow() {
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
        this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    }

    handlerUplaodRecipe(handler) {
        this._parentElement.addEventListener('submit', function(event) {
            event.preventDefault();
            const dataArray = [...new FormData(this)];
            const data = Object.fromEntries(dataArray);
            handler(data);
        });
    }

    _generateMarkup() {}

}

export default new AddRecipeView();
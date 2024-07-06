import View from "./view";

class SearchView extends View {

    constructor() {
        super();
        this._parentElement = document.querySelector('.search');
    }

    _clearInput() {
        this._parentElement.querySelector('.search__field').value = '';
    }

    getQuery() {
        const query = this._parentElement.querySelector('.search__field').value;
        this._clearInput();
        return query;
    }

    addEventHandlerSearch(handler) {
        this._parentElement.addEventListener('submit', function(event) {
            event.preventDefault();
            handler();
        });
    }

}

export default new SearchView();
import View from "./view";
import iconsUrl from '../../img/icons.svg';

const [icons] = iconsUrl.split("?");

class Pagination extends View {

    constructor() {
        super();
        this._parentElement = document.querySelector('.pagination');
    }

    paginationClickHandler(handler) {
        this._parentElement.addEventListener('click', function(event) {
            const btn = event.target.closest('.btn--inline');
            if (!btn) return;
            const goToPage = +btn.dataset.goto;
            handler(goToPage);
        });
    }

    _generateMarkup() {
        //page 1
        const currPage = this._data.page;
        const numOfPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
        //page 1, and other pages
        if (currPage === 1 && numOfPages > 1) {
            return `
                <button data-goto="${currPage + 1}" class="btn--inline pagination__btn--next">
                    <span>Page ${currPage + 1}</span>
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
            `;
        }
        //last page
        if (currPage === numOfPages && numOfPages > 1) {
            return `
                <button data-goto="${currPage - 1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${currPage - 1}</span>
                </button>
            `;
        }
        //other page
        if (currPage < numOfPages) {
            return `
                <button data-goto="${currPage - 1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${currPage - 1}</span>
                </button>
                <button data-goto="${currPage + 1}" class="btn--inline pagination__btn--next">
                    <span>Page ${currPage + 1}</span>
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
            `;
        }
        //page 1, no other pages
        return ``;
    }


}

export default new Pagination();
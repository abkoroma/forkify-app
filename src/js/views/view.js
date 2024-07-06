import iconsUrl from '../../img/icons.svg';

const [icons] = iconsUrl.split("?");

export default class View {

    _data;


    render(data, render = true) {
        if (!data || (Array.isArray(data) && data.length === 0)) {
            return this.errorMessage();
        }

        this._data = data;
        const recipesMarkup = this._generateMarkup();

        if (!render) return recipesMarkup;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', recipesMarkup);
    }

    update(data) {
        this._data = data;
        const newMarkup = this._generateMarkup();

        //convert markup string to a dom element
        const newDom = document.createRange().createContextualFragment(newMarkup);
        const newElements = Array.from(newDom.querySelectorAll('*'));
        const currElement = Array.from(this._parentElement.querySelectorAll('*'));

        newElements.forEach((newEle, i) => {
            const currEle = currElement[i];
            if (!newEle.isEqualNode(currEle) && newEle.firstChild?.nodeValue.trim() !== '') {
                currEle.textContent = newEle.textContent;
            }

            if (!newEle.isEqualNode(currEle)) {
                Array.from(newEle.attributes).forEach(attr =>
                    currEle.setAttribute(attr.name, attr.value) 
                );
            }
        });
    }

    _clear() {
        this._parentElement.innerHTML = '';
    }

    loadSpinner() {
        const markup = `
          <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    errorMessage(message = "Recipe not found, try again") {
        const markup = `
            <div class="error">
                <div>
                    <svg>
                        <use href="${icons}#icon-alert-triangle"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    successMessage(message = "") {
        const markup = `
            <div class="error">
                <div>
                    <svg>
                        <use href="${icons}#icon-smile"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }
}
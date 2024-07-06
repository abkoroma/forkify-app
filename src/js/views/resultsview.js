import View from "./view";
import previewview from "./previewview";
import iconsUrl from '../../img/icons.svg';

const [icons] = iconsUrl.split("?");

class ResultView extends View {

    constructor() {
        super();
        this._parentElement = document.querySelector('.results');
    }

    _generateMarkup() {
        return this._data.map(
            result => previewview.render(result, false)
        ).join('');
    }

}

export default new ResultView();
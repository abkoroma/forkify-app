import View from "./view";
import previewview from "./previewview";
import iconsUrl from '../../img/icons.svg';

const [icons] = iconsUrl.split("?");

class BookmarksView extends View {

    constructor() {
        super();
        this._parentElement = document.querySelector('.bookmarks__list');
    }

    handlerRenderBookmarks(handler) {
        window.addEventListener('load', handler);
    }

    _generateMarkup() {
        return this._data.map(
            bookmark => previewview.render(bookmark, false)
        ).join('');
    }
    
}

export default new BookmarksView();
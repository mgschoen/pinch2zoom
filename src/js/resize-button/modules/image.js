export default class Image {
    constructor(id) {
        this.image = document.getElementById(id);
        this.zoomLayer = document.querySelector('[data-img-id="' + id + '"]');
        this.openZoomLink = this.image.querySelector('a.image-open-zoom');
        this.closeZoomLink = this.zoomLayer.querySelector('a.image-close-zoom');
        this.zoomDetailLink = this.zoomLayer.querySelector('a.image-zoom-detail');
        this.zoomUndetailLink = this.zoomLayer.querySelector('a.image-zoom-undetail');
        
        this.boundOnDocumentScroll = event => this.closeZoom(event);

        this.detailState = 'STATE_NORMAL';

        this.init();
    }

    init() {
        this.openZoomLink.addEventListener('click', this.openZoom.bind(this));
        this.closeZoomLink.addEventListener('click', this.closeZoom.bind(this));
        this.zoomDetailLink.addEventListener('click', this.onDetailLinkClicked.bind(this));
        this.zoomUndetailLink.addEventListener('click', this.onUndetailLinkClicked.bind(this));
    }

    openZoom(event) {
        event.preventDefault();
        this.detailState = 'STATE_NORMAL';
        this.zoomLayer.dataset.open = true;
        document.addEventListener('scroll', this.boundOnDocumentScroll);
    }

    closeZoom(event) {
        event.preventDefault();
        this.zoomLayer.dataset.open = false;
        document.removeEventListener('scroll', this.boundOnDocumentScroll);
    }

    onDetailLinkClicked(event) {
        event.preventDefault();
        this.zoomLayer.classList.add('detail');
        document.removeEventListener('scroll', this.boundOnDocumentScroll);
        this.detailState = 'STATE_DETAIL';
    }

    onUndetailLinkClicked(event) {
        event.preventDefault();
        this.zoomLayer.classList.remove('detail');
        document.addEventListener('scroll', this.boundOnDocumentScroll);
        this.detailState = 'STATE_NORMAL';
    }

    toggleVisibilityState(element, visible) {
        if (visible) {
            element.style.removeProperty('display');
        } else {
            element.style.display = 'none';
        }
    }

    get detailState() {
        return this._detailState;
    }

    set detailState(value) {
        switch(value) {
            case 'STATE_DETAIL':
                this.toggleVisibilityState(this.zoomDetailLink, false);
                this.toggleVisibilityState(this.zoomUndetailLink, true);
                break;
            case 'STATE_NORMAL':
            default:
                this.toggleVisibilityState(this.zoomDetailLink, true);
                this.toggleVisibilityState(this.zoomUndetailLink, false);
        }
        this._detailState = value;
    }
}

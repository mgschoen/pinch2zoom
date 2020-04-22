export default class Image {
    constructor(id) {
        this.image = document.getElementById(id);
        this.zoomLayer = document.querySelector('[data-img-id="' + id + '"]');
        this.zoomLayerImage = this.zoomLayer.querySelector('img');
        this.openZoomLink = this.image.querySelector('a.image-open-zoom');
        this.closeZoomLink = this.zoomLayer.querySelector('a.image-close-zoom');
        
        this.boundOnDocumentScroll = event => this.closeZoom(event);
        this.boundOnZoomImageTouched = event => this.onZoomImageTouched(event);
        this.boundOnTapTimeoutExpired = () => this.onTapTimeoutExpired();

        this.detailState = 'STATE_NORMAL';
        this.numTaps = 0;
        this.tapDelay = 500;

        this.init();
    }

    init() {
        this.openZoomLink.addEventListener('click', this.openZoom.bind(this));
        this.closeZoomLink.addEventListener('click', this.closeZoom.bind(this));
        this.zoomLayerImage.addEventListener('touchend', this.boundOnZoomImageTouched)
    }

    onZoomImageTouched(event) {
        event.preventDefault();
        if (this.numTaps === 0) {
            this.numTaps++;
            this.tapTimeout = window.setTimeout(this.boundOnTapTimeoutExpired, this.tapDelay);
        } else if (this.numTaps === 1) {
            window.clearTimeout(this.tapTimeout);
            this.tapTimeout = null;
            this.numTaps = 0;
            this.toggleDetailState();
        }
    }

    onTapTimeoutExpired() {
        this.numTaps = 0;
        this.tapTimeout = null;
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

    toggleDetailState() {
        this.detailState = (this.detailState === 'STATE_NORMAL')
            ? 'STATE_DETAIL'
            : 'STATE_NORMAL';
    }

    openDetail() {
        this.zoomLayer.classList.add('detail');
        document.removeEventListener('scroll', this.boundOnDocumentScroll);
    }

    closeDetail() {
        this.zoomLayer.classList.remove('detail');
        document.addEventListener('scroll', this.boundOnDocumentScroll);
    }

    get detailState() {
        return this._detailState;
    }

    set detailState(value) {
        switch(value) {
            case 'STATE_DETAIL':
                this.openDetail();
                break;
            case 'STATE_NORMAL':
            default:
                this.closeDetail();
        }
        this._detailState = value;
    }
}
 
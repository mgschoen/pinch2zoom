import Hammer from 'hammerjs';

export default class Image {
    constructor(id) {
        this.image = document.getElementById(id);
        this.zoomLayer = document.querySelector('[data-img-id="' + id + '"]');
        this.zoomLayerImage = this.zoomLayer.querySelector('img');
        this.openZoomLink = this.image.querySelector('a.image-open-zoom');
        this.closeZoomLink = this.zoomLayer.querySelector('a.image-close-zoom');
        
        this.boundOnDocumentScroll = event => this.closeZoom(event);
        this.boundOnPinchEnd = event => this.onPinchEnd(event);
        this.boundOnPanStart = event => this.onPanStart(event);
        this.boundOnPan = event => this.onPan(event);
        this.boundOnPanEnd = event => this.onPanEnd(event);

        this.detailState = 'STATE_NORMAL';
        this.translation = 0;
        this.isPanning = false;
        this.panStartPointerX = null;
        this.panStartTranslation = null;

        this.init();
    }

    init() {
        this.openZoomLink.addEventListener('click', this.openZoom.bind(this));
        this.closeZoomLink.addEventListener('click', this.closeZoom.bind(this));

        this.hammer = new Hammer(this.zoomLayer);
        this.hammer.get('pinch').set({enable: true});
        this.hammer.on('pinchend',this.boundOnPinchEnd);
    }

    onPinchEnd(event) {
        let pinchType = event.additionalEvent;
        if (pinchType === 'pinchout') {
            this.detailState = 'STATE_DETAIL';
            this.initPan();
        } else if (pinchType === 'pinchin') {
            this.detailState = 'STATE_NORMAL';
            this.destroyPan();
        }
    }

    onPanStart(event) {
        this.resetPan();
        this.isPanning = true;
        this.panStartPointerX = event.center.x;
        this.panStartTranslation = this.translation;
    }

    onPan(event) {
        let panType = event.additionalEvent;
        if (this.isPanning && (panType === 'panleft' || panType === 'panright')) {
            let pointerDistance = event.center.x - this.panStartPointerX;
            let translationDistance = this.translation - this.panStartTranslation;
            let distance = pointerDistance - translationDistance;
            this.panBy(distance);
        }
    }

    onPanEnd() {
        this.resetPan();
    }

    initPan() {
        this.hammer.on('panstart', this.boundOnPanStart);
        this.hammer.on('panmove', this.boundOnPan);
        this.hammer.on('panend', this.boundOnPanEnd);
    }

    destroyPan() {
        this.hammer.off('panstart', this.boundOnPanStart);
        this.hammer.off('panmove', this.boundOnPan);
        this.hammer.off('panend', this.boundOnPanEnd);
    }

    panBy(delta) {
        let maxTranslation = (this.zoomLayerImage.offsetWidth - window.innerWidth) / 2;
        let nextTranslation = this.translation + delta;
        if (Math.abs(nextTranslation) <= maxTranslation) {
            this.zoomLayerImage.style.transform = 'translateX(' + nextTranslation + 'px)';
            this.translation = nextTranslation;
        }
    }

    resetTranslation() {
        this.zoomLayerImage.style.transform = '';
        this.translation = 0;
    }

    resetPan() {
        this.isPanning = false;
        this.panStartPointerX = null;
        this.panStartTranslation = null;
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
        this.resetTranslation();
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
 
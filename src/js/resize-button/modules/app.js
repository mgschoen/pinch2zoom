import Image from './image';

export default class App {
    constructor() {
        this.images = [];
        this.init()
    }

    init() {
        let imageElements = document.querySelectorAll('figure.image');
        imageElements.forEach(element => {
            let imageId = element.getAttribute('id');
            if (imageId) {
                let image = new Image(imageId);
                this.images.push(image);
            }
        });
    }
}

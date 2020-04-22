import Image from './image';

export default class App {
    constructor() {
        this.images = [];
        this.init()
    }

    init() {
        let imageElements = document.querySelectorAll('figure.image');
        for (let i = 0; i < imageElements.length; i++) {
            let element = imageElements[i];
            let imageId = element.getAttribute('id');
            if (imageId) {
                let image = new Image(imageId);
                this.images.push(image);
            }
        }
    } 
}

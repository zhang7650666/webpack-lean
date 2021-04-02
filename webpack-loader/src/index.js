class Hadwin{
    constructor(name) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
}

const hadwin = new Hadwin('Hadwin');
console.log('name', hadwin.getName())

import mv from './img/nv.jpg';
const eImg = document.createElement('img')
eImg.src = mv;
document.body.appendChild(eImg)


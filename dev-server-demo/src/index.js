require('@babel/polyfill')
import str from './test'
require('../src/css/index.css')
require('../src/css/font.scss')
import nv1 from '../src/img/nv1.jpg';
import axios from 'axios'
const {add} = require('./calc').default

console.log('hello webpack' + str)
const testFn = () => {
    console.log('testFN')
}
testFn()

@lean
class Person {
    type = 'cat'
}
// const person = new Person()
console.log(Person.type)

function lean(target) {
    target.type = 'pig'
}

const image = new Image();
image.src = nv1;
document.body.appendChild(image)

axios.get('/api/username').then((res) => {
    console.log('相应', res)
}).catch((err) => {
    console.log('err', err)
})

let url;
if(DEV) {
    url = "localhost"
} else {
    url = 'production'
}
console.log('url', url)

console.log('calc', add(3,4))
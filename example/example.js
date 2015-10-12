var Movearound = require('..');
var dom = document.querySelector('.languages');

// all
var movearound = new Movearound(dom, 'col');
movearound.bind();
movearound.on('update', function(){
    console.log(11);
});

var numbers = document.getElementById('numbers');
var m = new Movearound(numbers, 'column');
m.bind();

document.querySelector('#add').addEventListener('click', function(){
    var el = document.createElement('div');
    el.innerHTML = 'Go';
    var target = document.querySelector('.languages .col:first-child');
    target.appendChild(el);
})

document.querySelector('#remove').addEventListener('click', function(){
    var el = document.querySelector('.col div:first-child');
    el.parentNode.removeChild(el);
})

document.querySelector('#addcolumn').addEventListener('click', function(){
    var el = document.createElement('div');
    el.style.height = '300px';
    el.className = 'col';
    document.querySelector('.languages').appendChild(el);
})

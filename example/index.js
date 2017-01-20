'use strict';

const Deferrari = require('../index');
const deferrari = new Deferrari();


deferrari.deferUntil('nye')
.then(result => console.log('Happy', result));

deferrari.deferUntil('nye')
.then(result => console.log('Merry', result));

deferrari.deferUntil('nye')
.then(result => console.log('Feliz', result));

setTimeout(() => {
  deferrari.resolve('nye', 'New Years');

  // Will be resolved immediately because resolution is stored.
  deferrari.deferUntil('nye')
  .then(result => console.log('Am I late? Anyway, happy', result));
}, 1500);

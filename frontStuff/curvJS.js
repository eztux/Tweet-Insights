let test = require('circletype.min.js')
var demo1 = new CircleType(document.getElementById('demo1'));
window.addEventListener('resize', function updateRadius() {
  demo4.radius(demo4.element.offsetWidth / 2);
});
updateRadius();
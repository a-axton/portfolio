import THREE from 'three';
import Shapes from './shapes';
import TWEEN from 'tween.js';
import { randomRange } from './utils';

let oldX, oldY;
let direction = { x: 1, y: 1};
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let pauseMouseMovement = false;

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
let renderer = new THREE.WebGLRenderer({alpha: true});
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let startingPos = {
  x: camera.position.x,
  y: camera.position.y
};
let light = new THREE.AmbientLight(0x404040);
let fog = new THREE.Fog(0x6170F9, -300, 1900);
let shapes = new Shapes();
let light2 = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
let axis = new THREE.AxisHelper( 700 );

scene.fog = fog;
scene.add(light2);
scene.add(light);
// scene.add(axis);

shapes.getShapes().forEach((shape, i) => {
  shape.scale.x = .01;
  shape.scale.y = .01;
  shape.scale.z = .01;
  let coords = {
    scale: 0
  }
  let tween = new TWEEN.Tween(coords)
    .easing(TWEEN.Easing.Circular.InOut)
    .delay(randomRange(180, 260) * i)
    .to({
      scale: 1
    }, 1400)
    .onUpdate(function () {
      shape.scale.x = this.scale;
      shape.scale.y = this.scale;
      shape.scale.z = this.scale;
    })
    .start();
  scene.add(shape);
});

camera.position.z = 1000;
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('background').appendChild(renderer.domElement);

window.onresize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight);
};

window.onmousemove = (e) => {
  e.preventDefault();
  oldX = mouseX;
  oldY = mouseY;
  mouseX = e.clientX - (window.innerWidth / 2);
  mouseY = e.clientY - (window.innerHeight / 2);
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
  direction = {
    x: oldX < mouseX ? 1 : -1,
    y: oldY < mouseY ? -1 : 1
  }
};

const animatePage = (direction, currentPage, nextPage) => {
  let tweenStart = {
    x: 0,
    y: 0
  };
  let tweenEnd = {
    x: 0,
    y: 0
  };
  
  // home to about
  if (currentPage === 'home' && nextPage === 'about') {
    tweenStart.x = startingPos.x;
    tweenStart.y = startingPos.y;
    tweenEnd.x = startingPos.x;
    tweenEnd.y = -window.innerHeight * 1.8;

    camera.position.z = 1000;
    camera.lookAt(startingPos.x, startingPos.y, 1000);
  }
  // home to projects
  else if (currentPage === 'home' && nextPage === 'projects') {
    tweenStart.x = startingPos.x;
    tweenStart.y = startingPos.y;
    tweenEnd.x = window.innerWidth * 2;
    tweenEnd.y = startingPos.y;

    camera.position.z = 1000;
    camera.lookAt(startingPos.x, startingPos.y, 1000);
  }
  // about to projects
  else if (currentPage === 'about' && nextPage === 'projects') {
    tweenStart.x = camera.position.x;
    tweenStart.y = camera.position.y;
    tweenEnd.x = window.innerWidth * 2;
    tweenEnd.y = startingPos.y;
  }
  // projects to about
  else if (currentPage === 'projects' && nextPage === 'about') {
    tweenStart.x = camera.position.x;
    tweenStart.y = camera.position.y;
    tweenEnd.x = startingPos.x;
    tweenEnd.y = -window.innerHeight * 1.8;
  }
  else if (nextPage === 'home') {
    tweenStart.x = camera.position.x;
    tweenStart.y = camera.position.y;
    tweenEnd.x = startingPos.x;
    tweenEnd.y = startingPos.y;
  }
  
  var tween = new TWEEN.Tween(tweenStart)
    .easing(TWEEN.Easing.Exponential.Out)
    .to(tweenEnd, 1800)
    .onUpdate(function () {
      camera.position.x = this.x;
      camera.position.y = this.y;
    })
    .start();
}

const animate = (time) => {
  var intersects;

  shapes.getShapes().forEach((shape, i) => {
    shape.rotation.y += 0.003;
  });

  if (!pauseMouseMovement) {
    camera.position.x += (mouseX - camera.position.x) * 0.02;
    camera.position.y += (- mouseY - camera.position.y) * 0.02;
    camera.lookAt(scene.position);
    camera.updateMatrixWorld();

    raycaster.setFromCamera(mouse, camera);
    intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
      let shape = intersects[0];
      let ding = new Audio('/sounds/kit1/07.wav');

      if (!shape.object.animating && shape.face) {
        ding.play();

        let x = shape.object.position.x;
        let y = shape.object.position.y;
        let color = shape.face.color.r;
        let coords = {
          x: x,
          y: y,
          color: 0
        };

        shape.face.color.setRGB(0, 0, 0);
        shape.object.geometry.colorsNeedUpdate = true;

        var tween = new TWEEN.Tween(coords)
          .easing(TWEEN.Easing.Circular.Out)
          .to({
            x: x + (direction.x * 100),
            y: y + (direction.y * 100),
            color: color
          }, 400)
          .onUpdate(function () {
            shape.object.position.x = this.x;
            shape.object.position.y = this.y;
            shape.face.color.setRGB(this.color, this.color, this.color);
            shape.object.geometry.colorsNeedUpdate = true;
          })
          .onComplete(function () {
            shape.object.animating = false;
          })
          .start();
      }
      intersects[0].object.animating = true;
    }  
  }
  

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  TWEEN.update(time);
}

renderer.render(scene, camera);
requestAnimationFrame(animate);

export default {
  pauseMouseMovement: () => {
    pauseMouseMovement = true;
  },
  resumeMouseMovement: () => {
    pauseMouseMovement = false;
  },
  animate: animatePage
};

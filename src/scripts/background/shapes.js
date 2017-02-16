import THREE from 'three';
import { randomRange } from './utils';

export default class Shapes {
  constructor (opts = {
    count: 12
  }) {
    this.count = opts.count;
    this.shapeSettings = [
      // landing
      // top left
      {
        x: -.8,
        y: 1.4,
        z: 0,
        size: 250
      },
      // top right
      {
        x: .6,
        y: .9,
        z: 100,
        size: 60
      },
      // bottom right
      {
        x: 1.5,
        y: -.9,
        z: -200,
        size: 260
      },
      {
        x: .7,
        y: -.5,
        z: 50,
        size: 75
      },
      // bottom left
      {
        x: -1.2,
        y: -.8,
        z: 50,
        size: 145
      },
      {
        x: -1.4,
        y: -.1,
        z: 0,
        size: 50
      },
      // about near photos
      {
        x: -.83,
        y: -4.2,
        z: -100,
        size: 80
      },
      {
        x: -.92,
        y: -4.3,
        z: 220,
        size: 160
      },
      // about lower right
      {
        x: 1.2,
        y: -4,
        z: 200,
        size: 93
      },
      // about left
      {
        x: -1.8,
        y: -2,
        z: 40,
        size: 100
      },
      // projects right
      {
        x: 6,
        y: .4,
        z: 40,
        size: 240
      },
      {
        x: 5.25,
        y: 1.55,
        z: -40,
        size: 80
      },
    ];
    this.shapes = this._build();
  }

  getShapes () {
    return this.shapes;
  }

  getNoise () {
    var noiseSize = 600;
    var size = noiseSize * noiseSize;
    var data = new Uint8Array( 4 * size );
    for ( var i = 0; i < size; i ++ ) {
      data[ i ] = Math.random() * 150 | 0;
    }
    var dt = new THREE.DataTexture( data, noiseSize, noiseSize, THREE.LuminanceFormat );
    dt.wrapS = THREE.RepeatWrapping;
    dt.wrapT = THREE.RepeatWrapping;
    dt.needsUpdate = true;
    return dt;
  }

  _build () {
    return this.shapeSettings.map((settings) => {
      let size = settings.size || randomRange(30, 230);
      let shapeGeometry = new THREE.TetrahedronGeometry(size, 0);
      let shapeMaterial = new THREE.MeshPhongMaterial({
        color: 'tomato',
        vertexColors: THREE.FaceColors,
        // transparent: true,
        alphaMap: this.getNoise(),
        fog: true
      });
      let shape = new THREE.Mesh(shapeGeometry, shapeMaterial);
      let rangeX = window.innerWidth/2;
      let rangeY = window.innerHeight/2;

      // set colors of faces manually
      shape.geometry.faces[0].color = new THREE.Color(1, 1, 1);
      shape.geometry.faces[1].color = new THREE.Color(.3, .3, .3);
      shape.geometry.faces[2].color = new THREE.Color(.6, .6, .6);
      shape.geometry.faces[3].color = new THREE.Color(.3, .3, .3);

      // we want to upate colors at some point
      shape.geometry.colorsNeedUpdate = true;
      shape.geometry.dynamic = true;

      // random position and starting rotation
      shape.rotation.x = Math.random() * 360;
      shape.rotation.y = Math.random() * 360;
      shape.rotation.z = Math.random() * 360;
      
      shape.position.x = rangeX * settings.x;
      shape.position.y = rangeY * settings.y;
      shape.position.z = settings.z;
      // shape.position.x = randomRange(-rangeX, rangeX);
      // shape.position.y = randomRange(-rangeY, rangeY);
      // shape.position.z = randomRange(-400, 400);

      return shape;
    });
  }
};

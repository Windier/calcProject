//import {THREE,mathBox,matches,arraysEqual} from 'mathbox'

class mathBoxEnv {
  constructor(element) {
    this.element = element;
    this.mathbox = this.initializeMathBox();
    this.domain = this.initializeDomain();
    this.view = this.initializeView();
    this.userVariables = [];
    // {'name':'g','variables':['x'],'expression':'sin(x)'}
  }

  initializeMathBox() {
    var mathbox = mathBox({
      plugins: ["core", "cursor", "controls", "stats"],
      controls: {
        klass: THREE.OrbitControls,
        parameters: {
          noKeys: true
          // noZoom: true,
          // noRotate: true,
        },
        element: this.element
      }
    }).set({
      focus: 3
    });

    var three = mathbox.three;

    three.camera.position.set(0, 0, 3);
    three.renderer.setClearColor(new THREE.Color(0xeeeeee), 1.0);

    return mathbox;
  }

  initializeDomain() {
    // cartesian range
    let δ = 1;
    let two_δ = 2.0 * δ;
    let domain = this.mathbox.cartesian({
      range: [
        [-δ, δ],
        [-δ, δ],
        [-δ, δ]
      ],
      scale: [1, 1, 1]
      //rotation: [-π/2, 0, -π/2]
    });

    return domain;
  }

  initializeView() {
    let colors = {
      x: new THREE.Color(0xff4136),
      y: new THREE.Color(0x2ecc40),
      z: new THREE.Color(0x0074d9)
    };
    let SIZE = 64;
    let contour_scale = 0.12;

    let view = this.domain;
    view.axis({});
    view.axis({
      axis: 2 // "y" also works
    });
    view
      .scale({
        divide: 5
      })
      .grid({
        niceX: false,
        niceY: false,
        width: 0.5,
        opacity: 0.45
      });
    return view;
  }
}

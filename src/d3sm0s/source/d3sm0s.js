class d3sm0s {
  constructor() {
    this.mathbox = this.initializeMathBox();
    this.view = this.initializeView();
    //this.curves = $('#equationScope').scope().equations;
  }

  initializeMathBox(){
    var mathbox = mathBox({
      plugins: ['core', 'cursor','stats','controls'],
      controls: {
        klass: THREE.OrbitControls
      }
    });
    var three = mathbox.three;

    three.camera.position.set(1, 1, 2);
    three.renderer.setClearColor(new THREE.Color(0xFFFFFF), 1.0);

    return mathbox;
  };

  initializeView(){
    // cartesian range
    var δ = 2*π;
    var two_δ = 2.0*δ;
    // divisions in the range, for example: divergence_points will be
    // a SIZE x SIZE grid, some low-resolution artifacts may appear
    // with SIZE < 16
    var SIZE = 64;
    var contour_scale = 0.12;

    var xMin = -2, xMax = 2, yMin = -2, yMax = 2;

    // domain = mathbox.cartesian({
    //  range: [[-δ, δ], [-δ, δ], [-δ, δ]],
    //  scale: [1, 1, 1],
    // });

    var view = this.mathbox
    .set({
      focus: 3,
    });

    // view
    // .axis({
    //   axis: 1,
    //   range: [0,0.1],
    //   color: 'red'
    // })
    // .axis({
    //   axis: 2,
    //   range: [0,0.1],
    //   color: 'green'
    // })
    // .axis({
    //   axis: 3,
    //   range: [0,0.1],
    //   color: 'blue'
    // });

    view
    .cartesian({
      range: [[-δ, δ], [-δ, δ], [-δ, δ]],
      scale: [1, 1, 1],
      rotation: [-π/2, 0, -π/2]
    })
    .grid({
      divideX: 10,
      divideY: 10,
      niceX: false,
      niceY: false,
      width: 0.5,
      opacity: 0.45,
      zBias: -90,
    });

    return view;
  }

  // addCurve(f){
  //   this.curves.push(new mathObject(f,this.view));
  // }

  // addSurface(f){
  //   this.curves.push(
  //     this.mathbox
  //     .area({
  //       // id: "sampler",
  //       width: 256,
  //       height: 256,
  //       live: false,
  //       expr: function(emit, x, y, i, j, t, d){
  //         emit(x, y, f(x,y,t));
  //       },
  //       items: 1,
  //       channels: 3
  //     })
  //     .surface({
  //       //width: 0.7,
  //       shaded: true,
  //       color: this.color
  //     })
  //   );
  // }
}

class mathObject {
  constructor(f,view,color) {
    this.domain = this.createDomain(view);
    this.data = this.createData();
    this.primitive = this.createPrimitive();
    this.old_variables = [];
    this.variables = [];
    this.dimension_changed = false;
    this.type = 1;
    this.color = color;
    this.attachedGraph = false;

  };
  createDomain(view){
    var δ = 2*π;
    return view.cartesian({
      range: [[-δ, δ], [-δ, δ], [-δ, δ]],
      scale: [1, 1, 1],
      rotation: [-π/2, 0, -π/2]
    })
  }
  createData(){
    return this.domain.interval({
        // id: "sampler",
        width: 1,
        live: false,
        expr: function(emit, x, i, t, d){
          emit(x, NaN);
        },
        items: 1,
        channels: 2
      })
  };
  createPrimitive(){
    return this.data.line({
        width: 1.5,
        color: this.color
      });
  }

  createLineData(){
    this.attachedGraph = true;
    return this.domain.interval({
      width: 256,
      live: false,
      expr: function(emit, x, i, t, d){
        emit(x, NaN);
      },
      items: 1,
      channels: 2
    })
  }
  createLinePrimitive(){
    return this.data.line({
        width: 1.5,
        color: this.color
      });
  }
  createSurfData(){
    this.attachedGraph = true;
    return this.domain.area({
      width: 128,
      height: 128,
      live: false,
      expr: function(emit, x, y ,i, j, t, d){
        emit(x, y, NaN);
      },
      items: 1,
      channels: 3
    })
  }
  createSurfPrimitive(){
    return this.data
    .shader({
      code: "#vertex-xyz",
    })
    .vertex({
      pass: 'data'
    })
    .shader({
      code: "#fragment-xyz",
      scale: 0.25
    })
    .fragment({
      gamma: true
    })
    .surface({
        color: this.color,
        shaded: true,
      });
  }
  // }
  updateLineExpression(f){
    this.data.set({
        expr: function(emit, x, i, t, d){
          emit(x, f(x));
        }
    })
  }
  updateSurfExpression(f){
    this.data.set({
      expr: function(emit, x, y ,i, j, t, d){
        emit(x, y, f(x,y));
      },
    })
  }
  // updateToSurf(){
  //   this.data
  // }

  latexParser(latex){
    var P = this.parseExpression(latex);
    var success = true;
    try {
      var f = Function('x','y','z','return ' + P);
    } catch (error) {
      this.clearData();
      console.log('Invalid Input');
      return null
    }
    if (this.dimension_changed || !this.attachedGraph){
      this.clearData()
      let dim = this.variables.length;
      switch (dim) {
        case 1:
          this.data = this.createLineData();
          this.primitive = this.createLinePrimitive();
          this.updateLineExpression(f);
          this.type = 1;
          break;
        case 2:
          this.data = this.createSurfData();
          this.primitive = this.createSurfPrimitive();
          this.type = 2;
          break;
      }
    }
    console.log(this.type)
    switch (this.type) {
      case 1:
        this.updateLineExpression(f);
        break;
      case 2:
        this.updateSurfExpression(f);
        break;
    }     
  }

  clearData(){
    this.primitive.remove();
    this.data.remove();
    this.attachedGraph = false;
  }

  parseExpression(str){

    var regex_equality = /(.*)=(.*)/g;
    var regex = [{tex: /\\frac{([^{}]*)}{([^{}]*)}/g, replacement: '($1)/($2)'},
                 {tex: /(\\left|\\right)/g,           replacement: ''},
                 {tex: /\\(cos|sin|tan|log)/g,        replacement: 'Math.$1'},
                 {tex: /\\cdot/g,                     replacement: '*'}];
    var independent_variables_regex = [/x/g, /y/g, /z/g];
    var independent_variables = ['x','y','z'];
    this.variables = [];
    this.dimension_changed = false;
    // Look for built in variables
    for (let i = 0; i < 3; i++) {
      if ((str.match(independent_variables_regex[i])||[]).length != 0)
      {
        this.variables.push(independent_variables[i]);
      }
    }
    if (!arraysEqual(this.variables,this.old_variables)){
      this.dimension_changed = true;
    }
    // Parse the expression
    for (let i = 0; i < regex.length; i++)
    {
      while ((str.match(regex[i].tex)||[]).length != 0)
      {
        str = str.replace(regex[i].tex,regex[i].replacement);
      }
    }
    console.log(this.variables);
    console.log(this.dimension_changed);
    this.old_variables = this.variables;
    return str;
  }
}


// class latexParser extends mathObject{
//   constructor(latex){
//     super();

//     var regex_equality = /(.*)=(.*)/g;
//     var regex = [{tex: /\\frac{([^{}]*)}{([^{}]*)}/g, replacement: '($1)/($2)'},
//                  {tex: /(\\left|\\right)/g,           replacement: ''},
//                  {tex: /\\(cos|sin|tan|log)/g,        replacement: '$1'},
//                  {tex: /\\cdot/g,                     replacement: '*'}];
//     var independent_variables_regex = [/x/g, /y/g, /z/g];
//     var independent_variables = ['x','y','z'];
//   }

//   updateFieldFunc(mathbox_object,P)
//   {
//     var success = true;
//     try
//     {
//       f = Parser.parse(P).toJSFunction(['x','t']);
//     }
//     catch(err)
//     {
//       var success = false;
//       console.log('Invalid Input');
//     }
//     if (success)
//     {
//       mathbox_object.updateData(f);
//     }
//   }

//   parseExpression(str)
//   {
//     var found = '';
//     // Look for built in variables
//       if ((str.match(independent_variables_regex[i])||[]).length != 0)
//       {
//         found.push(independent_variables[i])
//       }
//     }
//     console.log(found);
//     // Parse the expression
//     for (let i = 0; i < regex.length; i++)
//     {
//       while ((str.match(regex[i].tex)||[]).length != 0)
//       {
//         str = str.replace(regex[i].tex,regex[i].replacement);
//       }
//     }
//     return str;
//   };
// }

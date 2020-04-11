export default class mathObject {
  constructor(func, view, id) {
    this.view = view;
    this.func = func;
    this.id = id;
    this.domain = this.createDomain(this.view);
    this.color = "#" + (((1 << 24) * Math.random()) | 0).toString(16);
    this.data = null;
    this.primitive = null;
  }

  createDomain(view) {
    var L = 10;
    const pi = 3.14159;
    return view
      // .cartesian({
      //   id: this.id + "domain",
      //   range: [
      //     [-L, L],
      //     [-L, L],
      //     [-L, L],
      //   ],
      //   scale: [1, 1, 1],
      //   //rotation: [-pi/2, 0, -pi/2]
      // });
  }

  createLineData() {
    const f = this.func;
    this.data = this.view.interval({
      id: this.id + "data",
      width: 1024,
      live: true,
      expr: function (emit, x, i, t, d) {
        emit(x, f(x,t));
      },
      items: 1,
      channels: 2,
    });
  }

  createLinePrimitive() {
    this.primitive = this.data.line({
      id: this.id + "primitive",
      width: 1.5,
      color: this.color,
    });
  }

  createSurfData() {
    const f = this.func;
    console.log(this.func)
    this.data = this.domain.area({
      id: this.id + "data",
      width: 128,
      height: 128,
      live: true,
      expr: function (emit, x, y, i, j, time, delta) {
        emit(x, y, f(x,y,time));
      },
      items: 1,
      channels: 3,
    });
  }

  createSurfPrimitive() {
    this.primitive = this.data
      .shader(
        {
          code: "#vertex-xyz",
        },
        // {
        //   time: function (t) {
        //     return t / 4;
        //   },
        //   intensity: function (t) {
        //     t = t / 4;
        //     let intensity = 0.5 + 0.5 * Math.cos(t / 3);
        //     intensity = 1.0 - Math.pow(intensity, 4);
        //     return intensity;
        //   },
        // }
      )
      .vertex({
        pass: "data",
      })
      .shader({
        code: "#fragment-xyz",
        scale: 0.25,
      })
      .fragment({
        gamma: true,
      })
      .surface({
        id: this.id + "primitive",
        color: this.color,
        shaded: true,
      });
  }

  clearData() {
    this.primitive.remove();
    this.data.remove();
    this.attachedGraph = false;
  }

  // updateLineExpression(f){
  //   this.data.set({
  //       expr: function(emit, x, i, t, d){
  //         emit(x, f(x));
  //       }
  //   })
  // };

  // updateSurfExpression(f){
  //   this.data.set({
  //     expr: function(emit, x, y ,i, j, t, d){
  //       emit(x, y, f(x,y));
  //     },
  //   })
  // };
}

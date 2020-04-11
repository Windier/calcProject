export let symbolPool = {
    sin: { type: "BuiltInFunction", numArgs: 1 },
    cos: { type: "BuiltInFunction", numArgs: 1 },
    tan: { type: "BuiltInFunction", numArgs: 1 },
    sqrt: { type: "BuiltInFunction", numArgs: 1 },
    abs: { type: "BuiltInFunction", numArgs: 1 },
    floor: { type: "BuiltInFunction", numArgs: 1 },
    ceil: { type: "BuiltInFunction", numArgs: 1 },
    sign: { type: "BuiltInFunction", numArgs: 1 },
    exp: { type: "BuiltInFunction", numArgs: 1 },
    pow: { type: "BuiltInFunction", numArgs: 2 },
    max: { type: "BuiltInFunction", numArgs: 1 },
    min: { type: "BuiltInFunction", numArgs: 1 },
    x: { type: "BuiltInVariable" },
    y: { type: "BuiltInVariable" },
    z: { type: "BuiltInVariable" },
    t: { type: "BuiltInVariable" },
  };

  export let userFunctions = {
    //f: { args: ['x','y'], expr: 'Math.sin(x+y)' },
  };
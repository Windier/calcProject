// Mathjs Parser
import { parse } from "mathjs";

// Unique set of variables in an array
const unique = (arr) => [...new Set(arr)];

export const exprParser = (latex) => {
  let validFunction = true;
  let func = null;
  let node = null;

  let symbolPool = {
    sin: "BuiltInFunction",
    cos: "BuiltInFunction",
    x: "BuiltInVariable",
    y: "BuiltInVariable",
    t: "BuiltInVariable",
  };

  const validadeNodes = (nodeTree) => {
    let valid = true;
    let unknownFunctions = [];
    nodeTree.traverse(function (node, path, parent) {
      if (node.isSymbolNode) {
        const symbolName = symbolPool[node.name];
        if (typeof symbolName === "undefined") {
          valid = false;
          console.log("Unknown Symbol " + node.name);
        }
        switch (symbolName) {
          case "BuiltInFunction":
            let numArgs = 0; // Assumes function with no arguments (invalid)
            try{
              // Tests if function node (symbol parent) have any argument
              numArgs = Object.keys(parent.args).length;
            } catch(e){};
            if (numArgs == 0) {
              console.log(node.name + ' requires arguments')
            }
            break;
          case "BuiltInVariable":
            break;
        }
      }
    });
    return valid;
  };

  // switch (node.type) {
  //   case "FunctionNode":
  //     console.log(node.name)
  //     if (typeof functionPool[node.name] === "undefined") {
  //       // valid = false;
  //       console.log('Unknown Function')
  //     }
  //     break;
  //   case "SymbolNode":
  //     if (typeof symbolPool[node.name] === "undefined") {
  //       // valid = false;
  //     }
  //     break;
  // }

  // isKnownSymbol = (expr) => {
  //   return expr;
  // };

  // checkCyclicDefinition = (expr) => {
  //   return expr;
  // };

  const substituteLaTeX = (expr) => {
    let outExpression = expr;
    const regex = [
      { tex: /\\frac{([^{}]*)}{([^{}]*)}/g, replacement: "($1)/($2)" },
      { tex: /(\\left|\\right)/g, replacement: "" },
      { tex: /{/g, replacement: "(" },
      { tex: /}/g, replacement: ")" },
      { tex: /\\/g, replacement: "" },
      { tex: /\\cdot/g, replacement: "*" },
    ];

    // Substitute regex matches
    for (let i = 0; i < regex.length; i++) {
      while ((outExpression.match(regex[i].tex) || []).length != 0) {
        outExpression = outExpression.replace(
          regex[i].tex,
          regex[i].replacement
        );
      }
    }
    return outExpression;
  };

  const findSymbols = (node) => {
    return node.filter(function (node) {
      return node.isSymbolNode && (node.name === "x") | (node.name === "y");
    });
  };

  const expr = substituteLaTeX(latex);
  //console.log(expr);

  let parsed = false;
  try {
    node = parse(expr);
    console.log(expr);
    validFunction = validadeNodes(node);
  } catch (error) {
    validFunction = false;
  }

  let exprCompiled;
  let symbols;
  let variables;

  // if (validFunction) {
  //   switch (node.type) {
  //     case "SymbolNode":
  //       exprCompiled = node.compile();
  //       symbols = findSymbols(node);
  //       variables = unique(symbols.map((node) => node.name)).sort();
  //       break;
  //     case "FunctionNode":
  //       exprCompiled = node.compile();
  //       symbols = findSymbols(node);
  //       variables = unique(symbols.map((node) => node.name)).sort();
  //       break;
  //     case "FunctionAssignmentNode":
  //       exprCompiled = node.expr.compile();
  //       variables = unique(node.params);
  //       break;
  //     default:
  //       return [false, null, []];
  //   }
  //func = (x, y, z) => exprCompiled.evaluate({ x: x, y: y, z: z });
  return [false, null, []];
  return [validFunction, func, variables];
  // }
};

// Mathjs Parser
import { parse } from "mathjs";

// Unique set of variables in an array
const unique = (arr) => [...new Set(arr)];

let symbolPool = {
  sin: "BuiltInFunction",
  cos: "BuiltInFunction",
  tan: "BuiltInFunction",
  sqrt: "BuiltInFunction",
  abs: "BuiltInFunction",
  floor: "BuiltInFunction",
  ceil: "BuiltInFunction",
  sign: "BuiltInFunction",
  exp: "BuiltInFunction",
  x: "BuiltInVariable",
  y: "BuiltInVariable",
  t: "BuiltInVariable",
};

export const latexParser = (latex) => {
  let validFunction = true;
  let func = null;
  let node = null;

  const validadeNodes = (nodeTree) => {
    let valid = true;
    let unknownFunctions = [];
    nodeTree.traverse(function (node, path, parent) {
      if (node.isSymbolNode) {
        const symbolName = symbolPool[node.name];
        if (typeof symbolName === "undefined") {
          console.log("Unknown Symbol " + node.name);
          valid = false;
        } else {
          switch (symbolName) {
            case "BuiltInFunction":
              let numArgs = 0; // Assumes function with no arguments (invalid)
              try {
                // Tests if function node (symbol parent) have any argument
                if (parent.isFunctionNode) {
                  numArgs = Object.keys(parent.args).length;
                }
              } catch (e) {}
              if (numArgs == 0) {
                console.log(node.name + " requires arguments");
                valid = false;
              }
              break;
            case "BuiltInVariable":
              break;
          }
        }
      }
    });
    return valid;
  };

  const substituteLaTeX = (expr) => {
    let outExpression = expr;
    const regex = [
      { tex: /\\cdot/g, replacement: "*" },
      { tex: /\\operatorname\s*{(.*?)}/g, replacement: "$1" },
      {
        tex: /\\frac\s*{((?!\\frac{).*?)}{((?!\\frac{).*?)}/g,
        replacement: "($1)/($2)",
      },
      { tex: /(\\left|\\right)/g, replacement: "" },
      { tex: /{/g, replacement: "(" },
      { tex: /}/g, replacement: ")" },
      { tex: /\\/g, replacement: "" },
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
    return node.filter((node) => {
      return node.isSymbolNode && (symbolPool[node.name] === "BuiltInVariable");
    });
  };

  console.time("Timer");
  const expr = substituteLaTeX(latex);
  try {
    node = parse(expr);
    validFunction = validadeNodes(node);
  } catch (error) {
    validFunction = false;
  }
  console.timeEnd("Timer");

  let exprCompiled;
  let symbols;
  let variables;

  if (validFunction) {
    switch (node.type) {
      case "FunctionAssignmentNode":
        exprCompiled = node.expr.compile();
        variables = unique(node.params);
        break;
      default:
        exprCompiled = node.compile();
        symbols = findSymbols(node);
        variables = unique(symbols.map((node) => node.name)).sort();
        break;
    };
    func = (x, y, t) => exprCompiled.evaluate({ x: x, y: y, t: t });
    return [validFunction, func, variables];
  } else {
    return [validFunction, null, []];
  }
};

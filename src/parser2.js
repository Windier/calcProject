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
  pow: "BuiltInFunction",
  max: "BuiltInFunction",
  min: "BuiltInFunction",
  x: "BuiltInVariable",
  y: "BuiltInVariable",
  t: "BuiltInTimeVariable",
};

let userFunctions = {
  //f: { args: ['x','y'], expr: "Math.sin(x+y)" },
};

const parseUserFunctionNode = (node) => {
  const userFunc = userFunctions[node.fn];
  const userFuncArgs = userFunc.args;
  let userFuncExpr = userFunc.expr.slice();

  let output = ["("]; // Wrap it in parenthesis
  for (let i = 0; i < userFuncArgs.length; i++) {
    // Regex to find the ith argument in func expression
    const regex = new RegExp(userFuncArgs[i], "g");
    const arg = parseExpr(node.args[i]);
    // Replace the user expression argument with typed function argument
    userFuncExpr = userFuncExpr.replace(regex, arg);
  }
  output.push(userFuncExpr); // Push modified expression
  output.push(")"); // Close parenthesis
  return String(output.join(""));
};

const parseFunctionNode = (node) => {
  const numArgs = node.args.length;
  let output =
    typeof symbolPool[node.fn] === "undefined"
      ? [String(node.fn), "("]
      : ["Math." + String(node.fn), "("];
  for (let i = 0; i < numArgs; i++) {
    output.push(parseExpr(node.args[i]), ",");
  }
  output.pop();
  output.push(")");
  return String(output.join(""));
};

const parseOperatorNode = (node) => {
  switch (node.op) {
    case "^":
      return (
        "Math.pow(" +
        parseExpr(node.args[0]) +
        "," +
        parseExpr(node.args[1]) +
        ")"
      );
    case "-":
      if (node.fn === "unaryMinus") {
        return "-" + parseExpr(node.args[0]);
      } else {
        return String(
          parseExpr(node.args[0]) + node.op + parseExpr(node.args[1])
        );
      }
    case "+":
      if (node.fn === "unaryPlus") {
        return "-" + parseExpr(node.args[0]);
      } else {
        return String(
          parseExpr(node.args[0]) + node.op + parseExpr(node.args[1])
        );
      }
    default:
      return String(
        parseExpr(node.args[0]) + node.op + parseExpr(node.args[1])
      );
  }
};

const parseExpr = (node) => {
  switch (node.type) {
    case "FunctionNode":
      switch (symbolPool[node.fn]) {
        case "BuiltInFunction":
          return parseFunctionNode(node);
        case 'UserDefinedFunction':
          return parseUserFunctionNode(node);
      }

    case "OperatorNode":
      return parseOperatorNode(node);
    case "SymbolNode":
      return String(node.name);
    case "ConstantNode":
      return String(node.value);
    case "ParenthesisNode":
      return "(" + parseExpr(node.content) + ")";
  }
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
      outExpression = outExpression.replace(regex[i].tex, regex[i].replacement);
    }
  }
  return outExpression;
};

const findSymbols = (node) => {
  return node.filter((node) => {
    return node.isSymbolNode && symbolPool[node.name] === "BuiltInVariable";
  });
};

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
          case "UserDefinedFunction":
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

const defineUserFunction = (name, expr, args) => {
  userFunctions[name] = { expr: expr, args: args };
  symbolPool[name] = "UserDefinedFunction";
  console.log(userFunctions);
};

export const latexParser = (latex) => {
  let validNodeTree = true;
  let func = null;
  let node = null;

  console.time("Timer");
  const expr = substituteLaTeX(latex);
  try {
    node = parse(expr);
    validNodeTree = validadeNodes(node);
  } catch (error) {
    validNodeTree = false;
  }
  console.timeEnd("Timer");

  let exprCompiled;
  let symbols;
  let variables;

  if (validNodeTree) {
    switch (node.type) {
      case "FunctionAssignmentNode":
        const funcExpr = parseExpr(node.expr);
        func = new Function("x", "y", "t", "return " + funcExpr);
        variables = node.params;
        defineUserFunction(node.name, funcExpr, node.params);
        break;
      default:
        func = new Function("x", "y", "t", "return " + parseExpr(node));
        symbols = findSymbols(node);
        variables = unique(symbols.map((node) => node.name)).sort();
        break;
    }
    // console.log(func);
    // func = (x, y, t) => exprCompiled.evaluate({ x: x, y: y, t: t });
    return [validNodeTree, func, variables];
    return [false, null, []];
  } else {
    return [validNodeTree, null, []];
  }
};

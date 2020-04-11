import { symbolPool, userFunctions } from "./userDefinitions";

// Unique set of variables in an array
export const unique = (arr) => [...new Set(arr)];

const parseUserFunctionNode = (node) => {
  const userFunc = userFunctions[node.fn];
  const userFuncArgs = userFunc.args;
  let userFuncExpr = userFunc.expr.slice();

  let output = ["("]; // Wrap it in parenthesis
  for (let i = 0; i < userFuncArgs.length; i++) {
    // Regex to find the ith argument in func expression
    const regex = new RegExp("(?<=\\W)" + userFuncArgs[i] + "(?=\\W)", "g");
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
    typeof symbolPool[node.fn].type === "undefined"
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
      };
    default:
      return String(
        parseExpr(node.args[0]) + node.op + parseExpr(node.args[1])
      );
  }
};

export const parseExpr = (node) => {
  switch (node.type) {
    case "FunctionNode":
      switch (symbolPool[node.fn].type) {
        case "BuiltInFunction":
          return parseFunctionNode(node);
        case "UserDefinedFunction":
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

export const substituteLaTeX = (expr) => {
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

export const validadeNodes = (nodeTree) => {
  let valid = true;
  nodeTree.traverse(function (node, path, parent) {
    if (node.isSymbolNode) {
      const symbolName = symbolPool[node.name];
      if (typeof symbolPool[node.name] === "undefined") {
        console.log("Unknown Symbol " + node.name);
        valid = false;
      } else {
        switch (symbolName.type) {
          case "UserDefinedFunction":
          case "BuiltInFunction":
            let numArgs = 0; // Assumes function with no arguments (invalid)
            try {
              // Tests if function node (symbol parent) has any argument
              if (parent.isFunctionNode) {
                numArgs = Object.keys(parent.args).length;
                if (numArgs != symbolPool[node.name].numArgs) {
                  valid = false;
                  console.log(
                    node.name +
                      " requires " +
                      symbolPool[node.name].numArgs +
                      " arguments"
                  );
                }
              }
            } catch (e) {
              valid = false;
              console.log(
                node.name +
                  " requires " +
                  symbolPool[node.name].numArgs +
                  " arguments"
              );
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

export const defineUserFunction = (name, expr, args) => {
  userFunctions[name] = { expr: expr, args: args };
  symbolPool[name] = { type: "UserDefinedFunction", numArgs: args.length };
};

export const findSymbols = (node) => {
  return node.filter((node) => {
    return (
      node.isSymbolNode && symbolPool[node.name].type === "BuiltInVariable"
    );
  });
};

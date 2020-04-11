// Mathjs Parser
import { parse } from "mathjs";

import * as util from './parserFunctions'

export const latexParser = (latex) => {
  let validNodeTree = true;
  let func = null;
  let node = null;

  //console.time("Timer");
  const expr = util.substituteLaTeX(latex);
  try {
    node = parse(expr);
  } catch (error) {
    console.log("Invalid expression");
    return [false, null, []];
  }

  let args, argsInExpr;

  switch (node.type) {
    case "FunctionAssignmentNode":
      validNodeTree = util.validadeNodes(node.expr);
      if (!validNodeTree) {
        return [false, null, []];
      }
      const funcExpr = util.parseExpr(node.expr);
      args = node.params;
      argsInExpr = util.findSymbols(node.expr);
      argsInExpr = util.unique(argsInExpr.map((node) => node.name));
      if (argsInExpr.some((el) => args.indexOf(el) == -1)) {
        console.log("Mismatch between function arguments and expression");
        return [false, null, []];
      }
      func = new Function(...args, "return " + funcExpr);
      util.defineUserFunction(node.name, funcExpr, node.params);
      break;
    default:
      validNodeTree = util.validadeNodes(node);
      if (!validNodeTree) {
        return [false, null, []];
      }

      args = util.findSymbols(node);
      args = util.unique(args.map((node) => node.name));

      func = new Function(...args, "return " + util.parseExpr(node));
      break;
  }
  console.log(func);
  //return [false, null, []];
  return [validNodeTree, func, args];
};

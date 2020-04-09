// This function takes as input a LaTeX expression typed by the user
// and outputs a success/failure variable, a function and its variables
export const latexParser = latex => {
  let variables = [];
  let validFunction = false; // Assumes expression is invalid
  let func = null;

  const buildFunction = expr => {
    const P = parseExpression(expr);
    let F = null;
    try {
      F = Function("x", "y", "z", "return " + P);
      validFunction = true;
      //console.log(expr);
    } catch (error) {
      console.log("Invalid Input");
      F = null;
      validFunction = false;
    }
    return F;
  };

  const parseExpression = expr => {
    let outExpression = expr;
    const regex = [
      { tex: /\\frac{([^{}]*)}{([^{}]*)}/g, replacement: "($1)/($2)" },
      { tex: /(\\left|\\right)/g, replacement: "" },
      { tex: /\\(cos|sin|tan|log)/g, replacement: "Math.$1" },
      { tex: /\\cdot/g, replacement: "*" },
      // { tex: /(?!.*[\+\-\/\*])(.*)\^\{(.*)\}/g, replacement: 'Math.pow($1,$2)'}
    ];

    // Parse the expression
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

  const checkDimension = expr => {
    const independent_variables_regex = [/x/g, /y/g, /z/g];
    const independent_variables = ["x", "y", "z"];
    let variables = [];
    // Look for built-in variables
    for (let i = 0; i < 3; i++) {
      if ((expr.match(independent_variables_regex[i]) || []).length != 0) {
        variables.push(independent_variables[i]);
      }
    }
    return variables;
  };

  // Look for built-in variables
  variables = checkDimension(latex);
  // Tries to build a function out of input expression
  func = buildFunction(parseExpression(latex));
  return [validFunction, func, variables];
};

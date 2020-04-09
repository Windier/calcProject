// This algorithm intends to pre process the expression 
// given by the user and quickly decide if it is valid 
// or not before fowarding it to math.js parser

// This function takes an expression as input and outputs
// a validity variable
const preProcess = (latex) => {

    const substituteLaTeX = expr => {
        let outExpression = expr;
        const regex = [
          { tex: /\\frac{([^{}]*)}{([^{}]*)}/g, replacement: "($1)/($2)" },
          { tex: /(\\left|\\right)/g, replacement: "" },
          { tex: /\\(cos|sin|tan|log)/g, replacement: "Math.$1" },
          { tex: /\\cdot/g, replacement: "*" },
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

}

export {preProcess}
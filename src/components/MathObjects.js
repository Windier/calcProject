import React from "react";
import EditableMathField, { addStyles as addMathquillStyles } from "react-mathquill"

addMathquillStyles();

const config = {
  spaceBehavesLikeTab: true,
  leftRightIntoCmdGoes: 'up',
  restrictMismatchedBrackets: false,
  sumStartsWithNEquals: true,
  supSubsRequireOperand: true,
  charsThatBreakOutOfSupSub: '',
  autoSubscriptNumerals: true,
  autoCommands: 'pi theta sqrt rho',
  autoOperatorNames: 'sin cos tan log abs floor ceil mod exp sign',
  maxDepth: 10,
};

export class MathObjects extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.config = config;
  };

  render() {
    return (
      <EditableMathField
        config = {this.config}
        latex={this.props.latex} // Initial latex value for the input field
        onChange={mathField => {
          // LaTeX Expression has changed, so get the updated latex expression
          const latex = mathField.latex();
          // Update parent state with current latex expression
          this.props.updateHandler(latex, this.props.id, this.props.index,mathField.text());
        }}
      />
    );
  }
}

/* <List>
{this.props.equations.map((name,i) => <ListItemText key={i}><span>{name}</span></ListItemText>)}
</List> */

/* <ListItem>
	<MathQuill
		latex = {this.state.latex} // Initial latex value for the input field
		onChange = {mathField => {
			const latex = mathField.latex()
			console.log(latex)
			this.setState({ latex })
		}}
	/>
</ListItem> */

// items: {
// 	...prevState.items,
// 	[prevState.items[1].name]: e.target.value,
// },

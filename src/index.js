import React from "react";
import { render } from "react-dom";
import mathObject from "./mathboxObject";

import AddEquation from "./components/AddEquation";
import { MathObjects } from "./components/MathObjects";
import { latexParser } from "./parser";
import { exprParser } from "./parser2"

// Material UI Components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import { ListItem, Button, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import BugReportIcon from "@material-ui/icons/BugReport";

export class App extends React.Component {
  constructor() {
    super();
    this.mathbox = window.mathbox;
    this.state = {
      mathObjects: []
      // [{ id: "IDCPE", expression: "\\sin(x)", active: false }]
    };
  }

  updateMathObjectState = (latex, id, index, expr) => {
    const stateCopy = this.state.mathObjects.slice();
    stateCopy.expression = latex;
    this.setState({ mathObjects: stateCopy });
    this.parseExpression(latex, id, index);
  };

  addMathObject = () => {
    const stateCopy = this.state.mathObjects.slice();
    stateCopy.push({
      expression: "",
      id: this.genUniqueID()
    });
    this.setState({ mathObjects: stateCopy });
  };

  removeMathObject = (id, index) => {
    const isGraphAttached = this.state.mathObjects[index].active;

    if (isGraphAttached) {
      this.mathbox.view.select("#" + id + "domain").remove();
      this.mathbox.view.select("#" + id + "data").remove();
      this.mathbox.view.select("#" + id + "primitive").remove();
    }

    const stateCopy = this.state.mathObjects.slice();
    stateCopy.splice(index, 1);
    this.setState({ mathObjects: stateCopy });
  };

  parseExpression = (expr, id, index) => {
    const [validFunction, func, variables] = exprParser(expr);
    //console.log(latex, id, validFunction, variables);

    const isGraphAttached = this.state.mathObjects[index].active;

    if (isGraphAttached) {
      this.mathbox.view.select("#" + id + "domain").remove();
      this.mathbox.view.select("#" + id + "data").remove();
      this.mathbox.view.select("#" + id + "primitive").remove();
      const stateCopy = this.state.mathObjects.slice();
      stateCopy[index].active = false;
      this.setState({ mathObjects: stateCopy });
    }

    if (validFunction) {
      let object = new mathObject(func, window.mathbox.view, id);
      switch (variables.length) {
        case 1:
          object.createLineData();
          object.createLinePrimitive();
          break;
        case 2:
          object.createSurfData();
          object.createSurfPrimitive();
          break;
      }
      const stateCopy = this.state.mathObjects.slice();
      stateCopy[index].active = true;
      this.setState({ mathObjects: stateCopy });
    } else {
      // Remove Data and Primitive
      this.mathbox.view.select("#" + id + "domain").remove();
      this.mathbox.view.select("#" + id + "data").remove();
      this.mathbox.view.select("#" + id + "primitive").remove();
      const stateCopy = this.state.mathObjects.slice();
      stateCopy[index].active = false;
      this.setState({ mathObjects: stateCopy });
    }
  };

  debugMethod = () => {
    console.log("Debug!!");
  };

  genUniqueID = () => Math.random().toString(36).substr(2, 5).toUpperCase();

  render() {
    return (
      <div>
        <AddEquation addNewObjectHandler={this.addMathObject} />
        <List>
          {this.state.mathObjects.map((object, index) => (
            <ListItem key={object.id}>
              <MathObjects
                latex={object.expression}
                id={object.id}
                index={index}
                updateHandler={this.updateMathObjectState}
              />
              <IconButton
                aria-label="delete"
                onClick={() => this.removeMathObject(object.id, index)}
              >
                <CloseIcon />
              </IconButton>
              <IconButton
                aria-label="delete"
                onClick={() => this.debugMethod()}
              >
                <BugReportIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </div>
    );
  }
}

render(<App />, document.querySelector("#app"));

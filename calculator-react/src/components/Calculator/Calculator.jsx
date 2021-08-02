import React, { Component } from 'react';
import './Calculator.css';

import Display from '../Display/Display';
import Keypad from '../Keypad/Keypad';
import './Calculator.css';
import axios from "axios";

class Calculator extends Component {
  state = {
    displayValue: '0',
    numbers: ['9', '8', '7', '6', '5', '4', '3', '2', '1', '.', '0', 'ce'],
    operators: ['/', 'x', '-', '+', 'c'],
    selectedOperator: '',
    storedValue: ''
  };

  componentDidMount = () => {
    document.addEventListener('keydown', this.handleKeyPress);
  };

  componentWillUnmount = () => {
    document.removeEventListener('keydown', this.handleKeyPress);
  };

  callOperator = async () => {
    let {displayValue, selectedOperator, storedValue} = this.state;
    const updateStoredValue = displayValue;

    switch (selectedOperator) {
      case '+':
        displayValue = await axios.get(`http://localhost:3000/arithmetic?operation=add&operand1=${storedValue}&operand2=${displayValue}`);
        break;
      case '-':
        displayValue = await axios.get(`http://localhost:3000/arithmetic?operation=subtract&operand1=${storedValue}&operand2=${displayValue}`);
        break;
      case 'x':
        displayValue = await axios.get(`http://localhost:3000/arithmetic?operation=multiply&operand1=${storedValue}&operand2=${displayValue}`);
        break;
      case '/':
        displayValue = await axios.get(`http://localhost:3000/arithmetic?operation=divide&operand1=${storedValue}&operand2=${displayValue}`);
        break;
      default:
        displayValue = '0';
    }

    displayValue = displayValue.data && displayValue.data.result ? displayValue.data.result.toString() : '0';
    selectedOperator = '';
    if (displayValue === 'NaN' || displayValue === 'Infinity') displayValue = '0';

    this.setState({displayValue, selectedOperator, storedValue: updateStoredValue});
  };

  handleKeyPress = (event) => {
    const { numbers, operators } = this.state;

    if (event.key === 'Backspace') this.updateDisplay('ce');
    if (event.key === 'Enter' || event.key === '=') this.callOperator();

    numbers.forEach((number) => {
      if (event.key === number) this.updateDisplay(number);
    });

    operators.forEach((operator) => {
      if (event.key === operator) this.setOperator(operator);
    });
  };

  setOperator = (value) => {
    let { displayValue, selectedOperator, storedValue } = this.state;

    if (value === 'c') {
      storedValue = '';
      displayValue = '0';
      selectedOperator = '';

      this.setState({ displayValue, selectedOperator, storedValue });
      return;
    }

    if (selectedOperator === '') {
      storedValue = displayValue;
      displayValue = '0';
      selectedOperator = value;
    } else {
      selectedOperator = value;
    }
    this.setState({ displayValue, selectedOperator, storedValue });

  };

  updateDisplay = (value) => {
    let { displayValue } = this.state;

    if (value === '.' && displayValue.includes('.')) value = '';

    if (value === 'ce') {
      displayValue = displayValue.substr(0, displayValue.length - 1);
      if (displayValue === '') displayValue = '0';
    } else {
      displayValue === '0' ? (displayValue = value) : (displayValue += value);
    }

    this.setState({ displayValue });
  };

  render() {
    const { displayValue, numbers, operators } = this.state;

    return (
      <div className="calculator-container">
        <Display displayValue={displayValue} />
        <Keypad
          handleKeyPress={this.handleKeyPress}
          operators={operators}
          callOperator={this.callOperator}
          numbers={numbers}
          setOperator={this.setOperator}
          updateDisplay={this.updateDisplay}
        />
      </div>
    );
  }
}

export default Calculator;

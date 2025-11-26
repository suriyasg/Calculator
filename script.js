const expressionElement = document.getElementById("display");

let expression = ""

function appendToExpression(value) {
    if(expression.length === 0 && value.search(/[+,\-,x,\%,÷]/) !== -1) {
        alert("Can not enter these +,-,x,%,÷ operators first!")
        return
    }

    if(value === '=') {
        expression = evaluateExpression()
    }
    else if(value === 'CE') {
        expression = expression.slice(0, expression.length-1)
    }
    else if(value === 'C') {
        expression = ""
    }
    else {
        expression += value
    }
    expressionElement.innerText = expression
}

// Currently only supports simple expressions (i.e one operator) 
function evaluateExpression() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/search
    let index = expression.search(/[+,\-,x,\%,÷]/)
    if(index !== -1) {
        const operand1 = Number(expression.slice(0, index))
        const operand2 = Number(expression.slice(index+1, expression.length))
        const operation = expression.at(index)

        return String(calculate(operand1, operand2, operation))
    }
    return expression
}

function calculate(operand1, operand2, operation) {
    switch (operation) {
        case '+':
            return operand1 + operand2
        case '-':
            return operand1 - operand2
        case 'x':
            return operand1 * operand2
        case '÷':
            return operand1 / operand2
        case '%':
            return operand1 % operand2
        default:
            expression = ""
            alert("Can not find operation")
    }
}
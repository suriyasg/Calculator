const expressionElement = document.getElementById("display");

let expression = ""

function appendToExpression(value) {
    if(expression.length === 0 && isOperator(value)) {
        alert("Can not enter these +,-,x,%,/ operators first!")
        return
    }

    if(value.search(/[√]/) !== -1) {
        alert("Square root functionality not added Try others!")
        return
    }

    if(isOperator(value) && isOperator(expression.at(expression.length-1))) {
        alert("Can not enter operators back to back!")
        return
    }

    // TEST Simualtion: 3/0 = 'Infinity' -> Infinity * 0 = 'NaN'
    if((expression === 'Infinity' || expression === 'NaN') && value !== 'CE' && value !== 'C') {
        alert(`Can not operate on indefinites clear ${expression} using CE or C first`)
        return
    }

    if(value === '=') {
        let array = splitExpression(expression)
        let answer = evaluateArray(array)
        expression = String(answer)
    }
    else if(value === 'CE') {
        if(expression === 'Infinity' || expression === 'NaN') {
            expression = ""
        }
        else {
            expression = expression.slice(0, expression.length-1)
        }
    }
    else if(value === 'C') {
        expression = ""
    }
    else {
        expression += value
    }
    expressionElement.innerText = expression
}

// splits operands and operators into substrings
function splitExpression(expression) {
    let array = []
    let lastOperatorPosition = 0
    let placeholder = ""
    for(i=0; i < expression.length; i++) {
        if(isOperator(expression.at(i))) {
            array.push(Number(placeholder))
            placeholder =""
            array.push(expression.at(i))
            lastOperatorPosition = i
        }
        else if(i === expression.length-1) {
            array.push(Number(placeholder+expression.at(i)))
        }
        else {
            placeholder += expression.at(i)
        }
    }
    console.log(array)
    return array
}


// 24 + 24 / 24 + 24 / 24
// 24 + s 1 s + 24 / 24
// 24 + s 1 s + s 1 s
// s 25 s s s + s 1 s

function evaluateArray(array) {
    // DMAS
    // let index = array.findIndex('/')
    let index = seekIndex(array, '/')
    let rightHandIndex = undefined
    let leftHandIndex = undefined
    while(index !== -1) {
        rightHandIndex = findRightOperand(index, array)
        leftHandIndex = findLeftOperand(index, array)
        array[index] = array[leftHandIndex] /  array[rightHandIndex]
        array[rightHandIndex] = 's'
        array[leftHandIndex] = 's'
        index = seekIndex(array,'/')
    }

    index = seekIndex(array, 'x')
    while(index !== -1) {
        rightHandIndex = findRightOperand(index, array)
        leftHandIndex = findLeftOperand(index, array)
        array[index] = array[leftHandIndex] *  array[rightHandIndex]
        array[rightHandIndex] = 's'
        array[leftHandIndex] = 's'
        index = seekIndex(array, 'x')
    }

    index = seekIndex(array, '+')
    while(index !== -1) {
        rightHandIndex = findRightOperand(index, array)
        leftHandIndex = findLeftOperand(index, array)
        console.log("array[leftHandIndex]", array[leftHandIndex] )
        console.log("array[rightHandIndex]", array[rightHandIndex])
        array[index] = array[leftHandIndex] +  array[rightHandIndex]
        array[rightHandIndex] = 's'
        array[leftHandIndex] = 's'
        index = seekIndex(array, '+')
    }

    index = seekIndex(array, '-')
    while(index !== -1) {
        rightHandIndex = findRightOperand(index, array)
        leftHandIndex = findLeftOperand(index, array)
        array[index] = array[leftHandIndex] -  array[rightHandIndex]
        array[rightHandIndex] = 's'
        array[leftHandIndex] = 's'
        index = seekIndex(array, '-')
    }

    for(i = 0; i < array.length; i++) {
        console.log(array.at(i))
        if(array.at(i) == 's') {
            continue
        }
        else {
            return array.at(i)
        }
    }
}

function findRightOperand(operatorIndex, array) {
    for(i = operatorIndex + 1; i < array.length; i++) {
        if(array.at(i) === 's') {
            continue
        }
        else {
            return i
        }
    }
}

function findLeftOperand(operatorIndex, array) {
    for(i = operatorIndex - 1; i >= 0; i--) {
        if(array.at(i) === 's') {
            continue
        }
        else {
            return i
        }
    }
}

function seekIndex(array, target) {
    for(i = 0; i < array.length; i++) {
        if(array.at(i) === target) {
            console.log(target, "at", i)
            return i
        }
    }
    return -1
}

// Only supports simple expressions (i.e one operator) 
function evaluateSingleExpression() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/search
    let index = expression.search(/[+,\-,x,\%,\/]/)
    if(index !== -1) {
        const operand1 = Number(expression.slice(0, index))
        const operand2 = Number(expression.slice(index+1, expression.length))
        const operation = expression.at(index)

        return String(calculateSingleExpression(operand1, operand2, operation))
    }
    return expression
}

function calculateSingleExpression(operand1, operand2, operation) {
    switch (operation) {
        case '+':
            return operand1 + operand2
        case '-':
            return operand1 - operand2
        case 'x':
            return operand1 * operand2
        case '/':
            return operand1 / operand2
        case '%':
            return operand1 % operand2
        default:
            expression = ""
            alert("Can not find operation")
    }
}

function isOperator(value) {
    return value.search(/[+,\-,x,\%,/]/) !== -1
}

function hasDMASOperator(value) {
    return value.search(/[+,\-,x,\/]/) !== -1
}

function findDivision(expression) {
    return expression.search(/[\/]/) !== -1
}

function findMultiplication(expression) {
    return expression.search(/[x]/) !== -1
}

function findAddition(expression) {
    return expression.search(/[+]/) !== -1
}

function findSubstraction(expression) {
    return expression.search(/[\-]/) !== -1
}
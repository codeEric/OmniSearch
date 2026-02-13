export const safeMathEval = (expression: string): number | string => {
    let sanitizedExpression = expression.replace(/\s+/g, "");

    const lastChar = sanitizedExpression.slice(-1);
    if (["+", "-", "*", "/"].includes(lastChar)) {
        sanitizedExpression = sanitizedExpression.slice(0, -1);
    }

    if (sanitizedExpression === "" || sanitizedExpression === "-") {
        return parseFloat(sanitizedExpression) || 0;
    }

    const tokens = sanitizedExpression.match(/(-?\d+(\.\d+)?|[+\-*/])/g);

    if (!tokens) {
        return "Error";
    }

    let tempArray = [...tokens];

    for (let i = 0; i < tempArray.length; i++) {
        if (tempArray[i] === "*" || tempArray[i] === "/") {
            const operator = tempArray[i];
            const operand1 = parseFloat(tempArray[i - 1]);
            const operand2 = parseFloat(tempArray[i + 1]);

            let result: number;
            if (operator === "*") {
                result = operand1 * operand2;
            } else if (operand2 === 0) {
                return "Division by zero";
            } else {
                result = operand1 / operand2;
            }

            tempArray.splice(i - 1, 3, result.toString());
            i = i - 1;
        }
    }

    let finalResult = parseFloat(tempArray[0]);
    for (let i = 1; i < tempArray.length; i += 2) {
        const operator = tempArray[i];
        const operand = parseFloat(tempArray[i + 1]);

        if (operator === "+") {
            finalResult += operand;
        } else {
            finalResult -= operand;
        }
    }

    return finalResult;
};

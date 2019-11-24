const DEFAULT_SEPARATOR = ",";
const SECONDARY_SEPARATOR = "\n";
const STARTER_SEPARATOR = "//";
const MAX_NUMBER = 1000;

export class NoNegatives extends Error {
    constructor(numbers) {
        super(`negatives not allowed: ${numbers}`);
    }
}

export class StringCalculator {
    constructor() {
        this.addInvokeCount = 0;
    }

    Add(input) {
        this._incrementInvokeCount();

        const elements = GetElements(input);

        this._throwIfNegatives(elements);
       
        const valid = this._filterOutBigNumbers(elements);

        return this._add(valid);     
    }
    _add(elements) {
        return elements.reduce((acc, current) => acc + current);
    }
    _throwIfNegatives(elements) {
        const negatives = elements.filter(isNegative);
        if(negatives.length > 0) {
            throw new NoNegatives(negatives);
        }
    }
    _filterOutBigNumbers(elements) {
        return elements.filter(isAcceptable);
    }
    _incrementInvokeCount() {
        this.addInvokeCount++;
    }
    GetCalledCount() {
        return this.addInvokeCount;
    }
}

function isAcceptable(number) {
    return number <= MAX_NUMBER;
}

function isNegative(number) {
    return number < 0;
}

// TODO: Can be a class, the only public api for this block is GetElements
function getSeparatorFor(inputString) {
    return hasCustomSeparator(inputString) ? 
        getCustomSeparatorFrom(inputString) :
        DEFAULT_SEPARATOR;
}
function getCustomSeparatorFrom(inputString) {
    return inputString
        .split(SECONDARY_SEPARATOR)[0]
        .replace(STARTER_SEPARATOR, "");
}
function hasCustomSeparator(inputString) {
    return inputString.startsWith(STARTER_SEPARATOR);
}

function getNumbers(inputString) {
    return hasCustomSeparator(inputString) ?
        getDelimitedNumbers(inputString) :
        inputString;

}
function getDelimitedNumbers(inputString){
    return inputString.split(SECONDARY_SEPARATOR)[1];
}
function getSeparatedElements(inputString, delimiter = DEFAULT_SEPARATOR) {
    return inputString
        .replace(SECONDARY_SEPARATOR, delimiter)
        .split(delimiter)
        .map(item => Number.parseInt(item || 0));
}
function GetElements(inputString) {
    const separator = getSeparatorFor(inputString);
    const numbers = getNumbers(inputString);
    return getSeparatedElements(numbers, separator);
}

export default StringCalculator;
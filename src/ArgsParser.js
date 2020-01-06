const VALID_TYPES = ['boolean', 'string', 'integer'];

export class InvalidSchemaError extends Error {
    constructor(reason) {
        super(`The provided schema was in an invalid format:
            ${reason}`);
    }
}

export class ArgumentNotDefinedError extends Error {
    constructor(name) {
        super(`The argument "${name}" was not defined in the schema.`);
    }
}

export class DuplicateInputError extends Error {
    constructor(name) {
        super(`The argument "${name}" was defined more than once on the input.`);
    }
}


export class ArgsParser {
    constructor(schema) {        
        this._checkInput(schema);

        this._argumentMap = new Map();
        this._schema = new Schema(schema);
    }
    // get all argNames in input
    // check if they exist in schema
    // at this moment we're considering that we will always have the input arg with a value
    // ["-l", "true", "-d", "lala"]
    // ["-l"] => invalid input
    parse(input){
        if(input.length > 0) {
            const inputInPairs = this._splitIntoPairs(input);

            inputInPairs.forEach(([rawFlagName, flagValue]) => {
                const flagName = rawFlagName.replace('-','');

                this._errorIfFlagIsNotDefinedInSchema(flagName);
                this._errorIfArgumentAlreadyDefined(flagName);

                this._argumentMap.set(flagName, flagValue);
            });
        }
    }
    getValue(name){
        this._errorIfFlagIsNotDefinedInSchema(name);

        let value = this._argsContains(name) ?
            this._getArgValue(name) :
            this._schema.getDefault(name);

        return this._parseValue(name, value);
    }

    _errorIfFlagIsNotDefinedInSchema(flagName) {
        if(!this._schema.contains(flagName)) {
            throw new ArgumentNotDefinedError(flagName);
        }
    }

    _errorIfArgumentAlreadyDefined(flagName) {
        if (this._argumentMap.has(flagName)){
            throw new DuplicateInputError(flagName);
        }
    }

    _parseValue(name, value) {
        const parserFunction = this._schema.getValueParser(name);
        return parserFunction(value);
    }
    _argsContains(name) {
        return this._argumentMap.has(name);
    }
    _getArgValue(name) {
        return this._argumentMap.get(name);
    }

    _checkInput(schema) {
        if(!schema){
            throw new TypeError("Should inform a schema");
        }
        if(!Array.isArray(schema)) {
            throw new TypeError("The schema should be an array of objects.");
        }        
    }
    _splitIntoPairs(inputArray) {
        const inputInPairs = [];
        for (let i=0; i < inputArray.length; i+=2){
            inputInPairs.push(inputArray.slice(i,i+2));
        }
        return inputInPairs;
    }
}

const PARSER_MAP = {
    boolean: (value) => value.toLowerCase() === 'true',
    integer: (value) => Number.parseInt(value),
    string: (value) => value.toString()
};

class Schema {
    constructor(schema) {
        this._validate(schema);

        this._schema = schema;
    }

    getType(name){
        return this._schema
            .filter(item => item.name === name)[0]
            .type;
    }
    getDefault(name) {
        return this._schema
            .filter(item => item.name === name)[0]
            .default;
    }
    contains(name) {
        return this._schema.some(item => item.name === name);
    }
    getValueParser(name) {
        const type = this.getType(name);
        return PARSER_MAP[type];
    }

    _validate(schema) {
        for(let validation of SCHEMA_VALIDATORS) {
            validation(schema);
        }
    }
}

const SCHEMA_VALIDATORS = [
    (schema) => {
        if (schema.length === 0) {
            throw new InvalidSchemaError("The schema cannot be empty.");
        }
    },
    (schema) => {
        if(schema.some(field => !field.name)) {
            throw new InvalidSchemaError("Missing arg name")
        } 
    },
    (schema) => {
        if(schema.some(field => !field.type)) {
            throw new InvalidSchemaError("Missing arg type")
        }
    },
    (schema) => {
        if(schema.some(field => !field.hasOwnProperty('default'))) {
            throw new InvalidSchemaError("Missing arg default value")
        }
    },
    (schema) => {
        if(schema.some(field => !VALID_TYPES.includes(field.type))){
            throw new InvalidSchemaError("Invalid arg type")
        }
    }
];

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

export class ArgsParser {
    constructor(schema) {        
        this._checkInput(schema);
        this._args = [];
        this._schema = new Schema(schema);
    }
    // get all argNames in input
    // check if they exist in schema
    // at this moment we're considering that we will always have the input arg with a value
    // ["-l", "true", "-d", "lala"]
    // ["-l"] => invalid input
    // ["-l", "true", "-d", "lala"] => [["-l", "true"], ["-d", "lala"]]
    // array.slice(start, end);
    //  array.slice(0, 2) => ["-l", "true"]
    // TODO: NEXT SESSION START ON THIS ONE. - REFACTOR THE HELL OUT OF IT.
    parse(input){
        
        if(input.length > 0) {

            const greatInput = [];

            for (let i=0; i<input.length; i+=2){
                greatInput.push(input.slice(i,i+2));
            }

            greatInput.forEach(element => {
                if(!this._schema.contains(element[0].replace('-',''))) {
                    throw new ArgumentNotDefinedError(element[0].replace('-',''));
                }
            });
        }

        this._args = input;
    }
    getValue(name){
        if (!this._schema.contains(name)){
            throw new ArgumentNotDefinedError(name);
        }

        let value = this._argsContains(name) ?
            this._getArgValue(name) :
            this._schema.getDefault(name);

        return this._parseValue(name, value);
    }

    _parseValue(name, value) {
        const parserFunction = this._schema.getValueParser(name);
        return parserFunction(value);
    }
    _argsContains(name) {
        return this._args.indexOf(`-${name}`) >= 0;
    }
    _getArgValue(name) {
        const flagIndex = this._args.indexOf(`-${name}`);
        return this._args[flagIndex + 1];
    }

    _checkInput(schema) {

        if(!schema){
            throw new TypeError("Should inform a schema");
        }
        if(!Array.isArray(schema)) {
            throw new TypeError("The schema should be an array of objects.");
        }        
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
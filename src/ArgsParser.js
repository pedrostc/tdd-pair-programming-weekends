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
        this._schema = new Schema(schema);
    }

    getValue(name){
        if (!this._schema.contains(name)){
            throw new ArgumentNotDefinedError(name);
        }

        const defaultValue = this._schema.getDefault(name);
        const parser = this._schema.getParser(name);

        return parser(defaultValue);
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
    boolean: (value) => Boolean(value),
    integer: (value) => Number.parseInt(value),
    string: (value) => value.toString()
};

class Schema {
    constructor(schema) {
        this._validate(schema);

        this._schema = schema;
    }

    getParser(name) {
        const type = this.getType(name);
        return PARSER_MAP[type];
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
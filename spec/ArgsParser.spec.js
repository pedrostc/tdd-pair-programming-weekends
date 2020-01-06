import { expect } from "chai";
import {
    InvalidSchemaError,
    ArgumentNotDefinedError,
    ArgsParser,
    DuplicateInputError
} from "../src/ArgsParser"

/**
 * [{
 *  name: string,
 *  type: string,
 *  default: string
 * }, ...]
 */

describe('ArgsParser', () => {    
    describe('schema validation', () => {
        it('should throw error if nothing is passed.', () => {
            const action = () => new ArgsParser();
    
            expect(action).to.throw(TypeError, /Should inform a schema/);
        });
        it('should throw error if schema is not an array.', () => {
            const schema = 1;
            const action = () => new ArgsParser(schema);
    
            expect(action).to.throw(TypeError, /array/);
        });

        it('should throw error for an empty schema.', () => {
            const schema = [];
            const action = () => new ArgsParser(schema);

            expect(action).to.throw(InvalidSchemaError, /empty/);
        });
        it('should throw error if schema does not inform the arg name.', () =>{
            const schema = [{type: 'string', default: 'mariola'}];
            const action = () => new ArgsParser(schema);

            expect(action).to.throw(InvalidSchemaError, /Missing arg name/);
        });
        it('should throw error if schema has empty arg name.', () =>{
            const schema = [{ name: '', type: 'string', default: 'mariola'}];
            const action = () => new ArgsParser(schema);

            expect(action).to.throw(InvalidSchemaError, /Missing arg name/);
        });

        it('should throw error if schema does not inform the arg type.', () =>{
            const schema = [{name: 'l', default: 'mariola'}];
            const action = () => new ArgsParser(schema);

            expect(action).to.throw(InvalidSchemaError, /Missing arg type/);
        });
        it('should throw error if schema has empty arg type.', () =>{
            const schema = [{name: 'l', type: '', default: 'mariola'}];
            const action = () => new ArgsParser(schema);

            expect(action).to.throw(InvalidSchemaError, /Missing arg type/);
        });
        // valid -> boolean, integer, string
        it('should throw error for invalid type.', () => {
            const schema = [{name: 'l', type: 'mariola', default: 'mariola'}];
            const action = () => new ArgsParser(schema);

            expect(action).to.throw(InvalidSchemaError, /Invalid arg type/);
        });

        it('should throw error if schema does not inform the default value.', () =>{
            const schema = [{name: 'l', type: 'integer'}];
            const action = () => new ArgsParser(schema);

            expect(action).to.throw(InvalidSchemaError, /Missing arg default value/);
        });        
        it('should not throw error if the default value is an empty string.', () =>{
            const schema = [{name: 'l', type: 'integer', default: ''}];
            const action = () => new ArgsParser(schema);

            expect(action).to.not.throw(InvalidSchemaError, /Missing arg default value/);
        });        
    });

    it('should return the default value in the schema for not parsed argument', () => {
        const schema = [{name: 'd', type: 'string', default: '/usr/home'}];
        const argValue = new ArgsParser(schema).getValue('d');

        expect(argValue).to.equals('/usr/home');
    });
    it('should throw an error if try to get an arg that is not defined on the schema.', () => {
        const schema = [{name: 'd', type: 'string', default: '/usr/home'}];
        const action = () => new ArgsParser(schema).getValue('l');

        expect(action).to.throw(ArgumentNotDefinedError, /"l" was not defined in the schema/);
    });

    // it should return the default value with the correct type
    const defaultValueTypeTestCases = [
        { 
            schema: [{name: 'l', type: 'boolean', default: 'true'}],
            expectedOutput: true
        }, {
            schema: [{name: 'p', type: 'integer', default: '8080'}],
            expectedOutput: 8080
        }, {
            schema: [{name: 'd', type: 'string', default: '/usr/home'}],
            expectedOutput: '/usr/home'
        }
    ];
    defaultValueTypeTestCases.forEach(({schema, expectedOutput}) => {
        const type = schema[0].type;
        it(`should return the default value with the correct type: ${type}`, () => {
            const flagName = schema[0].name;
            const actualValue = new ArgsParser(schema).getValue(flagName);
    
            expect(actualValue).to.equals(expectedOutput);
        });
    });

    // inputArgs => ["-l","-p","8080","-d","/usr/logs"]
    // inputArgs = ["-d", "/usr/mariola"]; parser.getValue("d") === "/usr/mariola";
    it('should return the default value for a flag that is not passed in', () => {
        const schema = [{name: 'd', type: 'string', default: '/usr/home'}];
        const inputArgs = [];

        const flagName = 'd';
        const expectedOutput = '/usr/home';

        const parser = new ArgsParser(schema);
        
        parser.parse(inputArgs);
        const actualValue = parser.getValue(flagName);

        expect(actualValue).to.equals(expectedOutput);
    });

    it('should raise error when trying to parse flags not defined in the schema', () => {
        const schema = [{name: 'd', type: 'string', default: '/usr/home'}];
        const inputArgs = ['-l', 'true'];

        const parser = new ArgsParser(schema);
        
        const action = () => parser.parse(inputArgs);

        expect(action).to.throw(ArgumentNotDefinedError, /"l" was not defined in the schema/);
    });

    const GetValueTestCases = [
        { 
            schema: [{name: 'l', type: 'boolean', default: 'true'}],
            inputArgs: ["-l","false"],
            flagName: "l",
            expectedOutput: false,
            testCaseName: "Boolean"
        },{ 
            schema: [
                {name: 'l', type: 'boolean', default: 'true'},
                {name: 'd', type: 'string', default: '/usr/local'}
            ],
            inputArgs: ["-l","false","-d",""],
            flagName: "d",
            expectedOutput: "",
            testCaseName: "String"
        },{ 
            schema: [
                {name: 'l', type: 'boolean', default: 'true'},
                {name: 'd', type: 'string', default: '/usr/local'}
            ],
            inputArgs: ["-d","-l","-l","false"],
            flagName: "l",
            expectedOutput: false,
            testCaseName: "Multiple Flags Boolean edge case"
        },{ 
            schema: [
                {name: 'l', type: 'string', default: 'true'},
                {name: 'd', type: 'string', default: '/usr/local'}
            ],
            inputArgs: ["-l","-d","-d","-l"],
            flagName: "d",
            expectedOutput: "-l",
            testCaseName: "Multiple Flags String edge case"
        }
    ];
    GetValueTestCases.forEach(({schema, inputArgs, flagName, expectedOutput, testCaseName}) => {
        it(`should return the value for a flag that is passed in: ${testCaseName}`, () => {
            const parser = new ArgsParser(schema);
            
            parser.parse(inputArgs);
            const actualValue = parser.getValue(flagName);
    
            expect(actualValue).to.equals(expectedOutput);
        });    
    });
   

    it('should throw error if the same flag is passed more than once', () => {
        const schema = [{name: 'd', type: 'string', default: '/usr/home'}];
        const inputArgs = ['-d', 'true', '-d', 'false'];

        const parser = new ArgsParser(schema);
        
        const action = () => parser.parse(inputArgs);

        expect(action).to.throw(DuplicateInputError, /"d" was defined more than once on the input/);
    });

    it('should parse boolean flags without explicit value', () => {
        const schema = [{name: 'l', type: 'boolean', default: 'false'}];
        const inputArgs = ['-l'];
        const expectedValue = true;

        const parser = new ArgsParser(schema);
        parser.parse(inputArgs);

        const actualValue = parser.getValue('l');

        expect(actualValue).to.equal(expectedValue);
    });

    it('should throw an error for non-existing flags after boolean flag without explicit value', () => {

        const schema = [
            {name: 'l', type: 'boolean', default: 'false'},
            {name: 'd', type: 'string', default: '/usr/local'}
        ];
        const inputArgs = ["-l","-FakeFlag","-d","value"]; // ["-l", "true", "-FakeFlag", "-d", "-l", "true"]

        const parser = new ArgsParser(schema);
        const action = () => parser.parse(inputArgs);

        expect(action).to.throw(ArgumentNotDefinedError, /"FakeFlag" was not defined in the schema/);
    })
});

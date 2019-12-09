import { expect } from "chai";
import { InvalidSchemaError, ArgumentNotDefinedError, ArgsParser } from "../src/ArgsParser"

/**
 * [{
 *  name: string,
 *  type: string,
 *  default: string
 * }, ...]
 */

describe('ArgsParser', () => {    
    it('should throw error if schema is not an array.', () => {
        const schema = 1;
        const action = () => new ArgsParser(schema);

        expect(action).to.throw(TypeError, /array/);
    });

    it('should throw error if nothing is passed.', () => {
        const action = () => new ArgsParser();

        expect(action).to.throw(TypeError, /Should inform a schema/);
    });

    describe('schema validation', () => {
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
});

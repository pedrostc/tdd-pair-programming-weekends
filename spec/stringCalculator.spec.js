import { expect } from "chai";
import { StringCalculator, NoNegatives } from "../src/StringCalculator";

/**
 * TODO
 * 1 - return 0 for an empty string
 * 2 - return the parsed number for string with a single number in it
 * 3 - should sum the two number for a string in the format D,D
 * 4 - should handle N comma separated numbers
 * 5 - Should accept new lines and commas as separators
 * 6 - Support different delimiters - “//[delimiter]\n[numbers...]”
 * 7 - Does not accept negative numbers
 */

describe("StringCalculator.Add", () => {
    it("should return 0 for an empty string", () => {
        const calculator = new StringCalculator();

        const actual = calculator.Add("");

        expect(actual).to.equals(0);
    });

    it("should return the parsed number for a single number input", () => {
        const calculator = new StringCalculator();

        const actual = calculator.Add("5");

        expect(actual).to.equals(5);
    });

    it("should return the parsed sum for a double number input", () =>{
        const calculator = new StringCalculator();

        const actual = calculator.Add("3,7");

        expect(actual).to.equals(10);
    });

    it("should return the parsed sum all numbers in the comma separated string.", () =>{
        const calculator = new StringCalculator();

        const actual = calculator.Add("1,1,2,3,5,8,13");

        expect(actual).to.equals(33);
    });

    it("should return the parsed sum all numbers in the new line or comma separated string.", () =>{
        const calculator = new StringCalculator();

        const actual = calculator.Add("5\n6,7");

        expect(actual).to.equals(18);
    });

    it("should accept a custom delimiter for a string in the format: //[del]\n[nbrs..]", () =>{
        const calculator = new StringCalculator();

        const actual = calculator.Add("//;\n1;2;3");

        expect(actual).to.equals(6);
    });
  
    it("should throw an exception for negative numbers showing them.", () =>{
        const calculator = new StringCalculator();

        const action = () => calculator.Add("-1");

        // Check regex because we can have problems here. aka -10
        expect(action).to.throw(NoNegatives, /-1\b/);
    });    
    
    it("should throw an exception showing all negative numbers in the input.", () =>{
        const calculator = new StringCalculator();

        const action = () => calculator.Add("//_\n-1_0_3_-2");

        // Check regex because we can have problems here. aka -10
        expect(action).to.throw(NoNegatives, /-1\b,-2\b/);
    });  

    it("should return how many times Add() was invoked", () =>{
        const calculator = new StringCalculator();

        calculator.Add("2,3");
        calculator.Add("5,7");


        let calledCount = calculator.GetCalledCount();

        expect(calledCount).to.equals(2);
    }); 
    
    it("should return how many times Add() was invoked even with exceptions", () =>{
        const calculator = new StringCalculator();

        try {
            calculator.Add("2,3");
            calculator.Add("5,-7");
        } catch {}

        let calledCount = calculator.GetCalledCount();

        expect(calledCount).to.equals(2);
    });

    it("should ignore numbers > 1000", () =>{
        const calculator = new StringCalculator();

        const actual = calculator.Add("1001,2,1000");

        expect(actual).to.equals(1002);
    });
});
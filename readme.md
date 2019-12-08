# TDD Pair Programming Weekends

## Environment Setup
The katas on this repo were developed using Node.js, Mocha, Chai and Babel.
For setting up the environment, just run `npm install` to install all dependencies.
If you want a cleaner env. you can use the `initial-setup` tag as your starting point by:
```
git branch <new-branch-name> initial-setup
git checkout <new-branch-name>
```

Mocha is configured to run all tests inside of the `./spec` folder and parse all code using Babel so that we can use ES2017 syntax.

## Session 1: ~~Asteroid Blues~~ Ping Pong with the string calculator.
- Kata
    + [String Calculator](https://osherove.com/tdd-kata-1)

- Pair Programming Style
    + [Ping-Pong Style](http://wiki.c2.com/?PairProgrammingPingPongPattern)

### Objectives
- Abordar o basico de TDD
    + Small increments (baby steps)
        * Requirements Driven
    + Red-Green-Refactor

## TDD
TDD is a development discipline that focuses on setting expectations about the code and letting those drive the code's implementation. As a side effect we have a set of automated tests that ensure that the code is doing what it's supposed to. They gives us the power to refactor the code and make it clean and readable knowing that it still behaves the same. They also gives a very fast feedback loop, which makes it simpler to check if everything is ok or not.
The tests on TDD are "developer tests", and they express what we expect the system under test (SUT) to do. These expectations reflect the requirements that we have for the piece of software that we're building.


### Red - Green - Refactor
- Red - Write a failing test (and see it failing)
    + In this step we are setting our objectives, what the code should do, how the API should look like and such.
    + We can use the API that we want to idealy exist.
    + Make some design decisions on the API: What the input look like, how I expect to get my result and such.

- Green - Make the test pass (as fast as possible)
    + Just make the test pass, as fast as you can.
    + Implement whatever code is the most obvious to make the test pass.
    + We are not focusing in making the code clean or follow patterns or best practices on this step.
    + We want make sure that we have code that does what it's supposed to do (and that is defined by the failing test).
    + Only implement enought to make the test pass.
    + All previous test need to still pass.
    + Once we're done, let's REFACTOR.

- Refactor - Make the code clean (without changing it's desired behaviour)
    + "Refactor to remove duplication"
    + Now we will look at our code more critically and will clean it up.
    + Remove code duplication.
    + Data duplication is also duplication and need to be taken care of.
    + We can insert the necessary abstraction and design patterns on this step.

## Ping Pong Pair Programming

- A writes a new test and sees that it fails.
- B implements the code needed to pass the test.
- B writes the next test and sees that it fails.
- A implements the code needed to pass the test. 

## KISS - Keep It Simple Stupid

## YAGNI - You Ain't Gonna Need It
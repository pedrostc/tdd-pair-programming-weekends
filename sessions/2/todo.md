# TODO

- [X] Define the schema
    + [X] empty schema should raise an error
    + [X] non array schema should raise an error
    + [X] if nothing is passed in place of the schema should throw error
    + [X] pass flag name, type (Bool, string, integer), and default value.
        * [X] schema should inform name
        * [X] schema should inform type
        * [X] schema should inform default
    + [X] test schema fields?
    + [X] should return the schema default for not informed arguments

- [X] try and get an argument that's not on the schema.
- [] Validate missing default value considering arg type
- [X] Empty string is a valid value for the "default" schema field
- [X] Parse default value to target type

- [] flags should be one character, preceeded by a minus sign
- [] arguments that are not in the schema should raise error explaining the situation
- [] the program can ask for the flag using it's name. "nameof -p -> p"
- [] input will be an array of string. ``
- [] handle if input parameter has empty spaces
- [] check for invalid extra space btw flags

## Examples
- `-l -p 8080 -d /usr/logs -> ["-l","-p","8080","-d","/usr/logs"]`
- `-l  -p 8080 -n `
/**
 * Executes simple instructions, is Turing complete.
 */

type Increment<X extends number> = [
    1  , 2  , 3  , 4  , 5  , 6  , 7  , 8  , 9  , 10 ,
    11 , 12 , 13 , 14 , 15 , 16 , 17 , 18 , 19 , 20 ,
    21 , 22 , 23 , 24 , 25 , 26 , 27 , 28 , 29 , 30 ,
    31 , 32 , 33 , 34 , 35 , 36 , 37 , 38 , 39 , 40 ,
    41 , 42 , 43 , 44 , 45 , 46 , 47 , 48 , 49 , 50 ,
    51 , 52 , 53 , 54 , 55 , 56 , 57 , 58 , 59 , 60 ,
    61 , 62 , 63 , 64 , 65 , 66 , 67 , 68 , 69 , 70 ,
    71 , 72 , 73 , 74 , 75 , 76 , 77 , 78 , 79 , 80 ,
    81 , 82 , 83 , 84 , 85 , 86 , 87 , 88 , 89 , 90 ,
    91 , 92 , 93 , 94 , 95 , 96 , 97 , 98 , 99 , 100,
    101, 102, 103, 104, 105, 106, 107, 108, 109, 110,
    111, 112, 113, 114, 115, 116, 117, 118, 119, 120,
    121, 122, 123, 124, 125, 126, 127, 0  ,
][X];

type Decrement<X extends number> = [
    27, 0  , 1  , 2  , 3  , 4  , 5  , 6  , 7  , 8  ,
    9  , 10 , 11 , 12 , 13 , 14 , 15 , 16 , 17 , 18 ,
    19 , 20 , 21 , 22 , 23 , 24 , 25 , 26 , 27 , 28 ,
    29 , 30 , 31 , 32 , 33 , 34 , 35 , 36 , 37 , 38 ,
    39 , 40 , 41 , 42 , 43 , 44 , 45 , 46 , 47 , 48 ,
    49 , 50 , 51 , 52 , 53 , 54 , 55 , 56 , 57 , 58 ,
    59 , 60 , 61 , 62 , 63 , 64 , 65 , 66 , 67 , 68 ,
    69 , 70 , 71 , 72 , 73 , 74 , 75 , 76 , 77 , 78 ,
    79 , 80 , 81 , 82 , 83 , 84 , 85 , 86 , 87 , 88 ,
    89 , 90 , 91 , 92 , 93 , 94 , 95 , 96 , 97 , 98 ,
    99 , 100, 101, 102, 103, 104, 105, 106, 107, 108,
    109, 110, 111, 112, 113, 114, 115, 116, 117, 118,
    119, 120, 121, 122, 123, 124, 125, 126,
][X];

type Subtract<A extends number, B extends number> = B extends 0 ? A : Subtract<Decrement<A>, Decrement<B>>;

type GreaterThan<A extends number, B extends number> = A extends B ? false : Decrement<B> extends 0 ? true : Decrement<A> extends 0 ? false : GreaterThan<Decrement<A>, Decrement<B>>;

type GreaterThanOrEqualTo<A extends number, B extends number> = A extends B ? true : GreaterThan<A, B>;

type Modulo<A extends number, B extends number> = B extends 0 ? never : B extends 1 ? 0 : A extends 0 ? A : GreaterThanOrEqualTo<A, B> extends true ? Modulo<Subtract<A, B>, B> : A;

type Format<S extends string> = S extends `\n${infer O}` ? O : S;

type Noop = never;

type Instruction = 
    | ["push", number]
    | ["pop", Noop]
    | ["inc", Noop]
    | ["dec", Noop]
    | ["mod", number]
    | ["goto", number]
    | ["print", Noop]
    | ["log", string]
    | ["exit", Noop]
    | [`if${bigint}`, number]
    | ["return", Noop]
;

type Execute<
    Instructions extends Instruction[],
    Line extends number = 0,
    Stack extends number[] = [],
    From extends number = 0,
    Output extends string = ""
> = Instructions[Line] extends [infer Command, infer Arg]
    ? Command extends "push"
        ? Execute<Instructions, Increment<Line>, [...Stack, Arg], From, Output>
        : Command extends "pop"
            ? Stack extends [...infer First, infer _]
                ? Execute<Instructions, Increment<Line>, First, From, Output>
                : Execute<Instructions, Increment<Line>, Stack, From, Output>
            : Command extends "inc"
                ? Stack extends [...infer First, infer Last]
                    ? Execute<Instructions, Increment<Line>, [...First, Increment<Last>], From, Output>
                    : Execute<Instructions, Increment<Line>, Stack, From, Output>
                : Command extends "dec"
                    ? Stack extends [...infer First, infer Last]
                        ? Execute<Instructions, Increment<Line>, [...First, Decrement<Last>], From, Output>
                        : Execute<Instructions, Increment<Line>, Stack, From, Output>
                    : Command extends "mod"
                        ? Stack extends [...infer _, infer Last]
                            ? Execute<Instructions, Increment<Line>, [...Stack, Modulo<Last, Arg>], From, Output>
                            : Execute<Instructions, Increment<Line>, Stack, From, Output>
                        : Command extends "goto"
                            ? Execute<Instructions, Arg & number, Stack, Line, Output>
                            : Command extends "print"
                                ? Stack extends [...infer _, infer Last]
                                    ? Execute<Instructions, Increment<Line>, Stack, From, `${Output}\n${Last}`>
                                    : Execute<Instructions, Increment<Line>, Stack, From, Output>
                                : Command extends "log"
                                    ? Execute<Instructions, Increment<Line>, Stack, From, `${Output}\n${Arg}`>
                                    : Command extends "exit"
                                        ? Output
                                        : Command extends `if${bigint}`
                                            ? Command extends `if${infer N}`
                                                ? Stack extends [...infer _, infer Last]
                                                    ? Last extends N
                                                        ? Execute<Instructions, Arg & number, Stack, From, Output>
                                                        : Execute<Instructions, Increment<Line>, Stack, From, Output>
                                                    : Execute<Instructions, Increment<Line>, Stack, From, Output>
                                                : never
                                            : Command extends "return"
                                                ? Execute<Instructions, From, Stack, Line, Output>
                                                : never
    : Output
;

type VirtualMachine<Instructions extends Instruction[]> = Format<Execute<Instructions>>;

type FizzBuzz = VirtualMachine<[
    /*0 */["push", 0],
    /*1 */["inc", Noop],
    /*2 */["if100", 26],
    /*3 */["mod", 15],
    /*4 */["if0", 6],
    /*5 */["goto", 9],
    /*6 */["pop", Noop],
    /*7 */["log", "FizzBuzz"],
    /*8 */["goto", 1],
    /*9 */["pop", Noop],
    /*10*/["mod", 5],
    /*11*/["if0", 13],
    /*12*/["goto", 16],
    /*13*/["pop", Noop],
    /*14*/["log", "Buzz"],
    /*15*/["goto", 1],
    /*16*/["pop", Noop],
    /*17*/["mod", 3],
    /*18*/["if0", 20],
    /*19*/["goto", 23],
    /*20*/["pop", Noop],
    /*21*/["log", "Fizz"],
    /*22*/["goto", 1],
    /*23*/["pop", Noop],
    /*24*/["print", Noop],
//  /*25*/["goto", 1], // Type instantiation is excessively deep and possibly infinite. (2589)
    /*26*/["exit", Noop]
]>;

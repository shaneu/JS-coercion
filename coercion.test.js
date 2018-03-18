describe('+ operator', () => {
  it('should concatenate if the other operand is already a string or can become a string', () => {
    /* eslint-disable-next-line */
    const test1 = [1, 2, 3] + 'hello';
    const expectedResult1 = '1,2,3hello';
    expect(test1).toBe(expectedResult1);

    /* eslint-disable-next-line */
    const test2 = { a: 'hey' } + 'hello';
    const expectedResult2 = '[object Object]hello';
    expect(test2).toBe(expectedResult2);

    const func = () => 'Oh, ';
    /* eslint-disable-next-line */
    const test3 = func + 'hello';
    // prettier-ignore
    const expectedResult3 = `function func() {
      return 'Oh, ';
    }hello`;
    expect(test3).toBe(expectedResult3);

    /* eslint-disable-next-line */
    const test4 = [1, 2, 3] + [4, 5, 6];
    const expectedResult4 = '1,2,34,5,6';
    expect(test4).toBe(expectedResult4);

    /* eslint-disable-next-line */
    const test5 = [1] + 2;
    const expectedResult5 = '12';
    expect(test5).toBe(expectedResult5);

    const test6 = {} + [];
    const expectedResult6 = '[object Object]';
    expect(test6).toBe(expectedResult6);

    /* eslint-disable-next-line */
    const test7 = 2 + '42';
    const expectedResult7 = '242';
    expect(test7).toBe(expectedResult7);

    /* eslint-disable-next-line */
    const test8 = '2' + 42;
    const expectedResult8 = '242';
    expect(test8).toBe(expectedResult8);

    /* eslint-disable-next-line */
    const test9 = '' + 42;
    const expectedResult9 = '42';
    expect(test9).toBe(expectedResult9);

    // It should be noted In the case of using the '+' operator to perform implicit coercion of a value
    // to produce a string, the JS engine calls an internal algorithm ToPrimitive on the value.
    // That algorithm first looks for a .valueOf method on the object to see if that operation will
    // produce a string. If there is no .valueOf method, or it does not produce a string, it looks
    // next for a .toString method, and calls that. However, when using explicit coercion on a value,
    // using the String() function, that function uses the .toString method, not .valueOf
    // To demonstrate:

    const obj = {
      valueOf: () => 42,
      toString: () => 2,
    };

    /* eslint-disable-next-line */
    const test10 = obj + '';
    const expectedResult10 = '42';
    expect(test10).toBe(expectedResult10);

    /* eslint-disable-next-line */
    const test11 = String(obj);
    const expectedResult11 = '2';
    expect(test11).toBe(expectedResult11);
  });
});

describe('- operator', () => {
  it('should implicitly coerce a value to a number', () => {
    const test1 = '3.456' - 0;
    const expectedResult1 = 3.456;
    expect(test1).toBe(expectedResult1);

    // much like the + operator, the internal ToPrimitive is called on an [] object which first
    // tries .valueOf to produce a string, then .toString() when that fails to produce
    // a primitive value. Because the - operator is only defined for mathematical operations
    // those string values are then coerced into numbers before finally being subtracted
    const test2 = [3] - [1];
    const expectedResult2 = 2;
    expect(test2).toBe(expectedResult2);

    const test3 = {} - 2;
    expect(test3).toBeNaN();
  });
});

describe('implicit boolean coercion', () => {
  describe(`when a value is passed: 
    to an if condition, 
    to the test condition in a for loop header, 
    to a while/do while loop test condition, 
    to the test condition in a ? : epression,
    as the left hand operand in a || or && expression`, () => {
    it('should be implicitly coerced to a boolean value', () => {
      // the JS engine defines an internal algorithm ToBoolean to converet a value that
      // isn't already a boolean into a boolean value by checking if it's one of the 5 falsy
      // values the spec defines: 1. undefined, 2. null, 3. 0 or -0 or NaN, 4. "", 5. false.
      // If the value isn't a member of that list, it's truthy

      const a = 42;
      const b = 'abc';
      let c;
      const d = null;

      expect(a).toBeTruthy();
      expect(c).toBeFalsy();
      expect(d ? a : b).toBeTruthy();
      expect((a && d) || c).toBeFalsy();
      expect((a && b) || c).toBeTruthy();
    });
  });

  describe('short circut operators && and ||', () => {
    describe('&&', () => {
      describe('when the value on the left is truthy', () => {
        it('should return the value on the right', () => {
          const a = 42;
          const b = 'abc';
          const c = null;

          expect(a && b).toBe(b);
          expect(b && c).toBe(c);
        });
      });

      describe('when the value on the left is falsy', () => {
        it('should return the value on the left', () => {
          const a = 42;
          const c = null;

          expect(c && a).toBe(c);
        });
      });
    });

    describe('||', () => {
      describe('when the value on the left is truthy', () => {
        it('should return the value on the left', () => {
          const a = 42;
          const b = 'abc';
          const c = null;

          expect(a || b).toBe(a);
          expect(b || c).toBe(b);
          expect(a && (b || c)).toBeTruthy();
          expect(a && (c || b)).toBeTruthy();
        });
      });

      describe('when the value on the left is falsy', () => {
        it('should return the value on the right', () => {
          const a = 42;
          let b;
          const c = null;

          expect(c || a).toBe(a);
          expect(c || b).toBe(b);
        });
      });
    });
  });
});

/* eslint eqeqeq: 0 */

// 1. If either side of the comparison can have true or false values
// dont ever use '=='
// 2. If either side of the comparison can have '', 0, [], seriously consider
// not using '=='
describe('strict === and loose ==', () => {
  // '===' disallows coercion, '==' allows coercion
  describe('when comparing values with ==== and == of the same types', () => {
    it('should return the same result for either equality check', () => {
      // when the types are identical both equality checks use the same algorithm to
      // test equality

      const a = 42;
      const b = 42;
      const c = 'hello';
      const d = 'hello';

      expect(a === b).toBe(true);
      expect(a == b).toBe(true);
      expect(c === d).toBe(true);
      expect(c == d).toBe(true);
      expect(a === d).toBe(false);
      expect(a == d).toBe(false);
    });
  });

  describe('when comparing objects', () => {
    describe('when using === or ==', () => {
      // when comparing objects '===' and '==' behave exaclty the same
      it('should return true only if values being compared hold a refernce to the same object', () => {
        const obj = { a: `I'm an object` };
        const arr = [1, 2, 3];
        const func = () => {};

        const objWithFunc = {
          a: func,
        };

        const objWithFunc2 = {
          b: func,
        };
        expect(objWithFunc.a === objWithFunc2.b).toBe(true);
        expect(objWithFunc.a == objWithFunc2.b).toBe(true);
        expect(objWithFunc.a == func).toBe(true);
        expect(objWithFunc2.b == func).toBe(true);

        const a = obj;
        const b = obj;
        expect(a === b).toBe(true);
        expect(a == b).toBe(true);
        expect(a === obj).toBe(true);
        expect(a == obj).toBe(true);
        expect(b === obj).toBe(true);
        expect(b == obj).toBe(true);

        const a2 = arr;
        const b2 = arr;
        expect(a2 === b2).toBe(true);
        expect(a2 == b2).toBe(true);
        expect(a2 === arr).toBe(true);
        expect(a2 == arr).toBe(true);
        expect(b2 === arr).toBe(true);
        expect(b2 == arr).toBe(true);

        const a3 = func;
        const b3 = func;
        expect(a3 === b3).toBe(true);
        expect(a3 == b3).toBe(true);
        expect(a3 === func).toBe(true);
        expect(a3 == func).toBe(true);
        expect(b3 === func).toBe(true);
        expect(b3 == func).toBe(true);
      });

      it('should return false if values do not refer to same object', () => {
        const obj = { a: `I'm an object` };
        const obj2 = { a: `I'm an object` };
        expect(obj === obj2).toBe(false);
        expect(obj == obj2).toBe(false);

        const func = () => {};
        const objWithFunc = {
          a: func,
        };
        const objWithFunc2 = {
          b: () => {},
        };
        expect(objWithFunc.a === objWithFunc2.b).toBe(false);
        expect(objWithFunc.a == objWithFunc2.b).toBe(false);

        const a = obj;
        const b = obj2;
        expect(a === b).toBe(false);
        expect(a == b).toBe(false);

        const arr = [1, 2, 3];
        const a2 = arr;
        const b2 = [1, 2, 3];
        expect(a2 === b2).toBe(false);
        expect(a2 == b2).toBe(false);
      });
    });
  });

  describe('NaN equality properties', () => {
    describe('when NaN is compared to itself', () => {
      it('should return false', () => {
        // NaN is the only value in JS to not equal itself
        expect(NaN === NaN).toBe(false);
        expect(NaN == NaN).toBe(false);
      });
    });
  });

  describe('stings to numbers', () => {
    describe('when compared with ==', () => {
      it('should return true for stings that contain the same value as a number', () => {
        const a = '42';
        const b = 42;

        // consider x == y: if x is a number and y is a string, return the result of calling
        // internal ToNumber coercion algorithm on y, so compare number to number. If x is a
        // string and y is a number call internal ToNumber on x

        // allows coercion
        expect(a == b).toBe(true);
        // does not allow coercion
        expect(a === b).toBe(false);
      });
    });
  });

  describe('comparing anything to a boolean with ==', () => {
    it('should convert the boolean to a number, then compare', () => {
      const a = '42';
      const b = true;

      // when comparing a non-boolean value to a boolean, the engine will call the internal
      // ToNumber algorithm on the boolean value and then compare the values. In the case of 'true',
      // ToBoolean returns 1, 0 for 'false'. In this case, the boolean value is coerced to 1, and then compared
      // with the string "42". That string is then convereted to a number, and the comparison of 1 == 42 returns
      // false, even though both are truthy values.
      expect(a == b).toBe(false);
      expect(b == 1).toBe(true);

      // here the boolean true is coerced to a number, 1, and compared to the string 'true'. Becuase they
      // are of different types, the engine will attempt to convert 'true' to a number, but can't,
      // so returns false
      expect('true' == true).toBe(false);
    });
  });

  describe('comparing nulls to undefineds', () => {
    describe('when using ==', () => {
      it('should be true that null is loosley equal to undefined', () => {
        // when null and undefined are compared using the == opeartor, they
        // coerce to eachothers value and are loosley equal to themselves,
        // and only themselves, no other value, even if that value is falsy

        const a = null;
        const b = undefined;

        expect(a == b).toBe(true);
        expect(a == null).toBe(true);
        expect(b == null).toBe(true);

        expect(a == false).toBe(false);
        expect(b == false).toBe(false);

        expect(a == '').toBe(false);
        expect(b == '').toBe(false);

        expect(a == 0).toBe(false);
        expect(b == 0).toBe(false);
      });
    });
  });

  describe('comparing objects to nonobjects', () => {
    // the js engine calls the internal ToPrimitive algorithm on the object value to
    // return a primitave value. In the case the object is being compared to a string,
    // the equalty check is done at this point. If the object is being compared to a number
    // the internal ToNumber algorithm is called on the now string representation of the object
    // and both numbers are compared
    describe('when the object is convereted to a primitive value', () => {
      it('should return true if both values are the same', () => {
        const a = [42];
        const b = 42;
        expect(a == b).toBe(true);

        const a2 = 'abc';
        const b2 = new String(a2);
        expect(a2 == b2).toBe(true);
        expect(b2.valueOf()).toBe(a2);
        expect(a2 === b2).toBe(false);

        const a3 = null;
        // same as {}, null and undefined can't be boxed
        const b3 = new Object(a3);
        // null is only loosley equal to null or undefined
        expect(a3 == b3).toBe(false);

        const a4 = undefined;
        // same as {}, null and undefined can't be boxed
        const b4 = new Object(a4);
        expect(a4 == b4).toBe(false);

        const a5 = NaN;
        const b5 = new Object(NaN);
        // NaN is the only value that is not equal to itself
        expect(a5 == b5).toBe(false);
      });
    });
  });

  describe('Falsy comparisons', () => {
    describe('when 25 flasy values are compared with eachother', () => {
      it('should provide reasonable results for 17 of the comparisons', () => {
        expect('0' == null).toBe(false);
        expect(undefined == '0').toBe(false);
        expect(NaN == '0').toBe(false);
        expect('0' == 0).toBe(true);
        expect('0' == '').toBe(false);
        expect(false == null).toBe(false);
        expect(undefined == false).toBe(false);
        expect(NaN == false).toBe(false);
        expect({} == false).toBe(false);
        expect({} == false).toBe(false);
        expect('' == null).toBe(false);
        expect(undefined == '').toBe(false);
        expect(NaN == '').toBe(false);
        expect({} == '').toBe(false);
        expect(0 == null).toBe(false);
        expect(undefined == 0).toBe(false);
        expect(NaN == 0).toBe(false);
        expect({} == 0).toBe(false);
      });

      it('should produce 7 results that are unxepected', () => {
        // false is coerced to the number 0 then compared against the
        // string '0'. This string is then coerced to a number, and 0 is compared
        // to 0
        expect('0' == false).toBe(true);
        // same as above, false is coerced to 0
        expect(false == 0).toBe(true);
        // false is convered to 0, and ToNumber is called on '', resulting in 0
        expect(false == '').toBe(true);
        // ToPrimitive and ToBoolean come into play here. ToBoolean converts false to 0.
        // ToPrimitive is called on the array object. It tries valueOf first to return a primitive
        // value. When that fails it tries .toString(), which returns ''. The == algorithm attempts to
        // coerce the values to the same time, so '' is converted to a number, resulting in 0.
        expect([] == false).toBe(true);
        expect('' == 0).toBe(true);
        expect([] == '').toBe(true);
        expect([] == 0).toBe(true);
      });

      describe('crazy corner cases', () => {
        it('should shock and awe', () => {
          // First, the unary ! operator flips the value of []. Since [] isn't one of the
          // 5 falsy values in JS, it is true, and the ! operator makes it false. We are then
          // comparing [] == false. As we've seen, false is coerced to 0, ToPrimitive coerces []
          // to the string '', which == then coerces to the number 0, and 0 is equal to 0

          expect([] == ![]).toBe(true);
          // ToPrimitive is called on [null], which ends up using .toString() to coerce a primitive
          // value. The result, '' is then compared to '', and the result is true
          expect([null] == '').toBe(true);
        });
      });
    });
  });
});

describe('+ operator', () => {
  it('should concatenate if the other operand is already a string or can become a string', () => {
    /* eslint-disable-next-line */
    const test1 = [1, 2, 3] + 'hello';
    const expectedResult1 = '1,2,3hello';

    /* eslint-disable-next-line */
    const test2 = { a: 'hey' } + 'hello';
    const expectedResult2 = '[object Object]hello';

    const func = () => 'Oh, ';
    /* eslint-disable-next-line */
    const test3 = func + 'hello';
    // prettier-ignore
    const expectedResult3 = `function func() {
      return 'Oh, ';
    }hello`;

    /* eslint-disable-next-line */
    const test4 = [1, 2, 3] + [4, 5, 6];
    const expectedResult4 = '1,2,34,5,6';

    /* eslint-disable-next-line */
    const test5 = [1] + 2;
    const expectedResult5 = '12';

    const test6 = {} + [];
    const expectedResult6 = '[object Object]';

    /* eslint-disable-next-line */
    const test7 = 2 + '42';
    const expectedResult7 = '242';

    /* eslint-disable-next-line */
    const test8 = '2' + 42;
    const expectedResult8 = '242';

    /* eslint-disable-next-line */
    const test9 = '' + 42;
    const expectedResult9 = '42';

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

    /* eslint-disable-next-line */
    const test11 = String(obj);
    const expectedResult11 = '2';

    expect(test1).toBe(expectedResult1);
    expect(test2).toBe(expectedResult2);
    expect(test3).toBe(expectedResult3);
    expect(test4).toBe(expectedResult4);
    expect(test5).toBe(expectedResult5);
    expect(test6).toBe(expectedResult6);
    expect(test7).toBe(expectedResult7);
    expect(test8).toBe(expectedResult8);
    expect(test9).toBe(expectedResult9);
    expect(test10).toBe(expectedResult10);
    expect(test11).toBe(expectedResult11);
  });
});

describe('- operator', () => {
  it('should implicitly coerce a value to a number', () => {
    const test1 = '3.456' - 0;
    const expectedResult1 = 3.456;

    // much like the + operator, the internal ToPrimitive is called on an [] object which first
    // tries .valueOf to produce a string, then .toString() when that fails to produce
    // a primitive value. Because the - operator is only defined for mathematical operations
    // those string values are then coerced into numbers before finally being subtracted
    const test2 = [3] - [1];
    const expectedResult2 = 2;

    const test3 = {} - 2;

    expect(test1).toBe(expectedResult1);
    expect(test2).toBe(expectedResult2);
    expect(test3).toBeNaN();
  });
});

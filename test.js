var expect = require('chai').expect;
var sinon = require('sinon');

var _ = require('./downline');

describe('downline', function () {

    describe('groupBy function', function () {

        /*********************************
         *
         *   _.groupBy
         *
         *   in lodash: https://lodash.com/docs#groupBy
         *
         *   IMPORTANT note: the following specs do not encompass ALL features of lodash's groupBy;
         *   for example: taking an object as a parameter
         *
         *   Given a collection put through an iterator function, an object will be returned with
         *   keys relating to the return values of each element through the iterator and values as
         *   an array of those elements
         *
         *   e.g.
         *
         *      the collection `staff` ['Liz', 'Ceren', 'Shanna', 'Charlotte']
         *
         *      the `iterator` function (staffMember) {
         *          return staffMember[0]; // first letter of name
         *      }
         *
         *      _.groupBy(staff, iterator) returns
         *
         *     {
         *       'C': ['Ceren', 'Charlotte'],
         *       'L': ['Liz'],
         *       'S': ['Shanna']
         *     }
         *
         *
         *********************************/

        var users;
        beforeEach(function () {
            users = [
                { name: 'Greg', age: 12, state: 'NJ' },
                { name: 'Julie', age: 18, state: 'NY' },
                { name: 'Bobby', age: 24, state: 'NJ' },
                { name: 'Mark', age: 56, state: 'TX' },
                { name: 'Nicole', age: 21, state: 'NV' },
                { name: 'Joe', age: 13, state: 'NY' },
                { name: 'Emily', age: 56, state: 'MA' },
                { name: 'Katherine', age: 21, state: 'NJ' },
                { name: 'John', age: 6, state: 'TX' }
            ];
        });

        xit('should return an object', function () {

            var returnValue = _.groupBy(users, function (user) {
                return user.age > 13;
            });

            expect(returnValue).to.be.an('object');

        });

        describe('returned object', function () {

            xit('should have keys that match return values from the iterator\
                and the value of each key should be an array of the elements\
                that was the parameter when the key was returned', function () {

                var returnValue = _.groupBy(users, function (user) {
                    if (user.age > 13) {
                        return 'over13';
                    } else {
                        return 'underOrExactly13';
                    }
                });

                expect(returnValue.underOrExactly13).to.be.an('array');
                expect(returnValue.underOrExactly13).to.have.length(3);
                expect(returnValue.over13).to.have.length(users.length - 3);

                var namesOfYoungOnes = returnValue.underOrExactly13.map(function (user) {
                    return user.name;
                });

                expect(namesOfYoungOnes).to.be.deep.equal(['Greg', 'Joe', 'John']);

            });

            xit('should pull and group by specific property if a string is\
                provided instead of a function', function () {

                var returnValue = _.groupBy(users, 'state');

                expect(Object.keys(returnValue)).to.be.deep.equal([
                    'NJ',
                    'NY',
                    'TX',
                    'NV',
                    'MA'
                ]);

                expect(returnValue.NJ).to.have.length(3);

                var namesFromNewJersey = returnValue.NJ.map(function (user) {
                    return user.name;
                });

                expect(namesFromNewJersey).to.be.deep.equal(['Greg', 'Bobby', 'Katherine']);

            });

        });

    });

    describe('flattenDeep function', function () {

        /*********************************
         *
         *   _.flattenDeep
         *
         *   in lodash: https://lodash.com/docs#flattenDeep
         *
         *   Takes an array that may or may not include sub-arrays (or sub*-sub-arrays recursive)
         *   and returns a new array of all the elements in every array top-level
         *
         *   e.g. the array:
         *
         *   [1, 2, 3, [4, 5, 6, [7, 8, 9, [10]]], 11, [12, 13]]
         *
         *   through flattenDeep returns
         *
         *   [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
         *
         *********************************/

        xit('should return an array of the elements available inside of a given array,\
            including top level elements and elements that exist in subarrays', function () {

            var nums = [1, [2, 3], 5, 6, 9, [1, 2, 5, 9, 8], 0, [4, 5, 6]];

            var flattenedNums = [1, 2, 3, 5, 6, 9, 1, 2, 5, 9, 8, 0, 4, 5, 6];

            expect(_.flattenDeep(nums)).to.be.deep.equal(flattenedNums);

        });

        xit('should flatten recursively', function () {

            var nums = [1, [2, 3, [1, 6, 8]], 5, 6, 9, [1, 2, 5, 9, 8, [1, [9]]], 0, [4, [6, [7, 8]], 5, 6]];

            var flattenedNums = [1, 2, 3, 1, 6, 8, 5, 6, 9, 1, 2, 5, 9, 8, 1, 9, 0, 4, 6, 7, 8, 5, 6];

            expect(_.flattenDeep(nums)).to.be.deep.equal(flattenedNums);

        });

        xit('should flatten recursively down to any arbitary level of nested arrays', function () {

            /****
             * In most cases, if you passed the previous test, you will pass this one.
             * If you are not passing this one, you need to implement true recursion.
             * ****/

            var generatedFlattened = [];

            var makeSubArray = function () {
                return Math.random() < .2;
            };

            var oneToTen = function () {
                return Math.ceil(Math.random() * 10);
            };

            var LEVELS_DEEP_LIMIT = Math.ceil(Math.random() * 5) + 5;

            var generateArrayOfTenElements = function (levelsDeep) {

                var thisArray = [];
                var aNumber;
                var i = 0;

                for (; i < 10; i++) {

                    if (makeSubArray() && levelsDeep < LEVELS_DEEP_LIMIT) {
                        thisArray.push(generateArrayOfTenElements(levelsDeep + 1));
                    } else {
                        aNumber = oneToTen();
                        thisArray.push(aNumber);
                        generatedFlattened.push(aNumber);
                    }

                }

                return thisArray;

            };

            var generatedNums = generateArrayOfTenElements(0);

            expect(_.flattenDeep(generatedNums)).to.be.deep.equal(generatedFlattened);

        });

    });

    describe('flowRight (compose) function', function () {

        /*********************************
         *
         *   _.flowRight (formerly known as _.compose)
         *
         *   in lodash: https://lodash.com/docs#flowRight
         *
         *   Takes an arbitrary amount of functions and returns a new function that uses its arguments
         *   and calls the provided functions from right to left (last to first). The argument for each
         *   function (except the first) is determined by the return value of the function to its right.
         *   The call to the function returned by flowRight evaluates to the return value of the leftmost
         *   function.
         *
         *   e.g.
         *
         *   sayHello = function (name) {
         *      return 'Hello, ' + name;
         *   }
         *
         *   addExclamation = function (s) {
         *      return s + '!';
         *   }
         *
         *   smallTalk = function (s) {
         *      return s + ' Nice weather we are having, eh?';
         *   }
         *
         *   greetEnthusiastically = _.flowRight(addExclamation, sayHello)
         *
         *   greetEnthusiastically('Omri')
         *   --> returns 'Hello, Omri!'
         *
         *   (sayHello is called with 'Omri', addExclamation is called with 'Hello, Omri')
         *
         *
         *
         *   greetEnthusiasticallyAndTalkAboutWeather = _.flowRight(smallTalk, greetEnthusiastically)
         *
         *   greetEnthusiasticallyAndTalkAboutWeather('Gabriel')
         *   --> returns 'Hello, Gabriel! Nice weather we are having, eh?'
         *
         *   (greetEnthusiastically is called with 'Gabriel', smallTalk is called with 'Hello, Gabriel!')
         *
         *********************************/

        var add2;
        var add1;
        var multiply3;
        var divide2;

        beforeEach(function () {

            add2 = sinon.spy(function (n) {
                return n + 2;
            });

            add1 = sinon.spy(function (n) {
                return n + 1;
            });

            multiply3 = sinon.spy(function (n) {
                return n * 3;
            });

            divide2 = sinon.spy(function (n) {
                return n / 2;
            });

        });

        xit('should return a new function that calls the provided functions from right to left\
            with return value of the previous function, and finally evaluates to the return value\
            of the leftmost function', function () {

            var add3 = _.flowRight(add2, add1);

            var returnValue = add3(0);

            expect(add1.calledWith(0)).to.be.equal(true);
            expect(add2.calledWith(1)).to.be.equal(true);
            expect(returnValue).to.be.equal(3);

        });

        xit('should take an arbitrary amount of functions to compose', function () {

            var add1ThenMultiplyBy3ThenDivideBy2 = _.flowRight(divide2, multiply3, add1);

            var returnValue1 = add1ThenMultiplyBy3ThenDivideBy2(1);

            expect(add1.calledWith(1)).to.be.equal(true);
            expect(multiply3.calledWith(2)).to.be.equal(true);
            expect(divide2.calledWith(6)).to.be.equal(true);
            expect(returnValue1).to.be.equal(3);

            var add10 = _.flowRight(add2, add2, add2, add2, add2);

            var returnValue2 = add10(5);

            expect(add2.callCount).to.be.equal(5);
            expect(returnValue2).to.be.equal(15);

        });

        xit('should call the rightmost function with all given arguments', function () {

            var mathMaxSpy = sinon.spy(Math, 'max');

            var multiplyMaxBy3 = _.flowRight(multiply3, Math.max);

            var returnValue = multiplyMaxBy3(6, 5, 1, 3, 5, 10, 2, 3);

            expect(mathMaxSpy.calledWithExactly(6, 5, 1, 3, 5, 10, 2, 3)).to.be.equal(true);
            expect(multiply3.calledWith(10)).to.be.equal(true);
            expect(returnValue).to.be.equal(30);

        });

    });

});
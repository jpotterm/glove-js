function arrayEquals(x, y) {
    if (x.length !== y.length) return false;

    for (var i = 0; i < x.length; ++i) {
        if (x[i] !== y[i]) {
            return false;
        }
    }

    return true;
}

function runTests(tests) {
    var output = [];
    var allPassed = true;

    for (var i = 0; i < tests.length; ++i) {
        var test = tests[i];
        var result = test();

        for (var label in result) {
            var passed = result[label];

            if (!passed) {
                allPassed = false;
                output.push('Test failed: ' + label);
            }
        }
    }

    if (allPassed) {
        console.log('All tests passed!');
    } else {
        console.log(output.join('\n'));
    }
}

module.exports = {
    arrayEquals: arrayEquals,
    runTests: runTests,
};

var util = require('util');
var assert = require('assert');
var Ajv = require('ajv');
var ajv = new Ajv();
var context_schema = require('./serrano.context.schema');
var view_schema = require('./serrano.view.schema');


function test_summary(test) {
    if (test.should_succeed) {
	return test.description + ' (succeeded)';
    } else {
	return test.description + ' (failed as expected)';
    }
}


/* Helper function for ensuring that the tests are defined properly */
function check_tests(tests) {
    const tests_schema = {
	type: "array",
	items: {
	    type: "object",
	    properties: {
		data: {},
		description: {type: "string"},
		should_succeed: {type: "boolean"}
	    },
	    required: ["data", "description", "should_succeed"]
	}
    }
    validate_tests = ajv.compile(tests_schema);
    if (!validate_tests(tests)) {
	var str = util.format(validate_tests.errors)
	throw new Error('test.js contains an invalid test: ' + str)
    }
}

describe('ContextSchema', function() {
    var validate_context;  // function to validate a context
    var tests = [
	{
	    data: {
		type: "and",
		children: [
		    {
			concept: 2,
			language: "Patient Gender is M",
			cleaned_value: [
			    {
				value: "M",
				label: "M"
			    }
			],
			value: [
			    "M"
			],
			field: 1,
			operator: "in"
		    }
		]
	    },
	    description: "A typical single-condition tree",
	    should_succeed: true
	}
	,{
	    data: {
		"type":"or",
		"children":[
		    {
			"type":"and",
			"children":[
			    {
				"operator":"range",
				"field":2,
				"concept":1,
				"value":[
				    "1/1/1979",
				    "1/1/1980"
				],
				"language":"Patient Birthdate is between 1979-01-01 and 1980-01-01"
			    },
			    {
				"concept":2,
				"language":"Patient Gender is M",
				"cleaned_value":[
				    {
					"value":"M",
					"label":"M"
				    }
				],
				"value":[
				    "M"
				],
				"field":1,
				"operator":"in"
			    }
			]
		    },
		    {
			"concept":61,
			"language":"Tuberculosis Prophylaxis Plan is CONTINUE REGIMEN",
			"cleaned_value":[
			    {
				"value":"CONTINUE REGIMEN",
				"label":"CONTINUE REGIMEN"
			    }
			],
			"value":[
			    "CONTINUE REGIMEN"
			],
			"field":81,
			"operator":"in"
		    }
		]
	    },
	    description: "A multi-node tree",
	    should_succeed: true
	}
    ]

    before('context schema compiles', function() {
	validate_context = ajv.compile(context_schema);
	check_tests(tests);
    });

    tests.forEach(function(test) {
	it(test_summary(test), function() {
	    if (test.should_succeed) {
		assert.equal(validate_context(test.data), true);
	    } else {
		assert.equal(validate_context(test.data), false);
	    }
	});
    });
    
});


describe('ViewSchema', function() {
    var validate_view;  // function to validate a view
    var tests = [
	{
	    data: {
		columns: [
		    10,
		    1,
		    2
		]
	    },
	    description: "columns, no ordering",
	    should_succeed: true
	},
	{
	    data: {
		columns: [
		]
	    },
	    description: "empty columns, no ordering",
	    should_succeed: true
	},
	{
	    data: {
		columns: [
		    1,
		    2
		],
		ordering: [
		    2,
		    "asc"
		]
	    },
	    description: "both columns and ordering",
	    should_succeed: true
	},
	{
	    data: {
		columns: [
		    1,
		    2
		],
		ordering: [
		]
	    },
	    description: "columns non-empty, ordering empty",
	    should_succeed: true
	},
	{
	    data: {
		columns: [
		],
		ordering: [
		]
	    },
	    description: "both columns and ordering empty",
	    should_succeed: true
	},
	{
	    data: {
		columnsBAD: [
		    1,
		    2
		],
		ordering: [
		    2,
		    "asc"
		]
	    },
	    description: "columns renamed to something else",
	    should_succeed: false
	},
	{
	    data: {
		columns: [
		    1,
		    2
		],
		ordering: [
		    2,
		    "asc",
		    1,
		    "desc"
		]
	    },
	    description: "too many items in ordering",
	    should_succeed: false
	}
    ];

    before('view schema compiles', function() {
	validate_view = ajv.compile(view_schema);
	check_tests(tests);
    });

    tests.forEach(function(test) {
	it(test_summary(test), function() {
	    if (test.should_succeed) {
		assert.equal(validate_view(test.data), true);
	    } else {
		assert.equal(validate_view(test.data), false);
	    }
	});
    });
});

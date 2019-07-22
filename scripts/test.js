'use strict';
process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';

const Jest = require('jest');
const argv = process.argv.slice(2);
Jest.run(argv);

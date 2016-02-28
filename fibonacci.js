/*
Name:           fibonacci
Description:    This function calculates fibonacci numbers for one or endless iterations.
Author:         Franklin van de Meent (https://frankl.in)
Source & docs:  https://github.com/fvdm/nodejs-fibonacci
Contact:        https://github.com/fvdm/nodejs-fibonacci/issues
License:        Unlicense / Public Domain (see UNLICENSE FILE)
                <https://github.com/fvdm/nodejs-fibonacci/raw/master/UNLICENSE>
*/

var bignum = require ('bignum');
var EventEmitter = require ('events') .EventEmitter;

module.exports = new EventEmitter ();
module.exports.doWhile = false;


/**
 * Start iteration
 *
 * @param limit {number=0} - Run fibonacci iterations
 * @returns {object} - result or limitResult
 */

function startIteration (limit) {
  var next = bignum (1);
  var cur = bignum (-1);
  var last = bignum (0);
  var loop = bignum (0);
  var start = new Date () .getTime ();
  var result = {};
  var limitResult = {};

  limit = bignum (limit);
  module.exports.doWhile = true;

  while (module.exports.doWhile) {
    // prev cur -> now last
    // prev next -> now cur
    last = cur;
    cur = next;
    next = cur.add (last);

    result.number = next.toString ();
    result.length = next.toString () .length;
    result.iterations = loop.toString ();
    result.ms = new Date () .getTime () - start;

    module.exports.emit ('result', result);

    // found the one
    if (loop.toString() === limit.toString()) {
      module.exports.doWhile = false;
      module.exports.emit ('done', result);
      return result;
    }

    // catch infinity
    if (next === 'Infinity') {
      limitResult = {
        reason: 'infinity',
        max_limit: Number.MAX_LIMIT.toString (),
        last_result: result,
        iterations: loop.toString (),
        intended: limit ? limit : null
      };

      module.exports.doWhile = false;
      module.exports.emit ('stop', limitResult);
    }

    // count
    loop = loop.add (1);
  }
}


/**
 * Stop iteration
 *
 * @returns {void}
 */

function killIteration () {
  module.exports.doWhile = false;
}

// ready
module.exports.iterate = startIteration;
module.exports.kill = killIteration;

import 'sass/main.scss';

// Vendor stuff
import 'jquery';
// require('modernizr');

import 'foundation/js/foundation/foundation';
//require('foundation/js/foundation/foundation.abide.js');
// require('foundation/js/foundation/foundation.accordion');
//require('foundation/js/foundation/foundation.alert.js');
// require('foundation/js/foundation/foundation.clearing');
// require('foundation/js/foundation/foundation.dropdown');
// require('foundation/js/foundation/foundation.equalizer');
import 'foundation/js/foundation/foundation.interchange';
//require('foundation/js/foundation/foundation.joyride.js');
// require('foundation/js/foundation/foundation.magellan');
// require('foundation/js/foundation/foundation.offcanvas');
//require('foundation/js/foundation/foundation.orbit.js');
import 'foundation/js/foundation/foundation.reveal';
//require('foundation/js/foundation/foundation.slider.js');
import 'foundation/js/foundation/foundation.tab';
//require('foundation/js/foundation/foundation.tooltip.js');
// require('foundation/js/foundation/foundation.topbar');
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/htmlmixed/htmlmixed';

// Our stuff
import BabelREPL from 'babel/repl';


// A good case for the weakmap, since we need to keep track of
// what component holds. Alternatives would be to somehow
// keep track of these relationships some other way, maybe
// with some data-id or an array you need to loop through.
let weakmap = new WeakMap();
$('.js-example').each(function(index, el) {
  let repl = new BabelREPL($(el));

  // Assigning the jquery object won't work. You need to actually
  // access the index.
  weakmap.set($(this).find('.tabs')[0], repl);
});

// Mainly for creating the tabs.
$(document).foundation();

// Need to keep track of this, so we can refresh the editor since
// it and tabs don't exactly agree with each other without some help.
$('.tabs').on('toggled', function (event, tab) {
  // Need to check if the key exists in the weakmap, since
  // we have the other tabs on the right to account for
  if (weakmap.has($(tab).parent()[0])) {
    weakmap.get($(tab).parent()[0]).refresh();
  }
});
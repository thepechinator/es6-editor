webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _babelRepl = __webpack_require__(1);
	
	var _babelRepl2 = _interopRequireDefault(_babelRepl);
	
	module.exports = _babelRepl2['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* jshint evil: true */
	
	/**
	* Code inspired and taken from https://babeljs.io/scripts/repl.js.
	*/
	
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	__webpack_require__(2);
	__webpack_require__(5);
	
	// A library required to get this library working.
	__webpack_require__(7);
	
	// More 3rd party libraries, but these are actually required to get this class
	// working.
	var CodeMirror = __webpack_require__(8);
	__webpack_require__(10);
	__webpack_require__(11);
	
	// babel is provided in an external script tag
	
	var BabelREPL = (function () {
	  function BabelREPL($context) {
	    var _this = this;
	
	    _classCallCheck(this, BabelREPL);
	
	    this.$context = $context;
	
	    this.$consoleReporter = this.$context.find('.js-console');
	    this.$output = $context.find('.js-output');
	    this.$toggleFullScreen = $context.find('.js-toggle-fs');
	
	    // Create the CodeMirror editors which give us nice things
	    // like line number, key maps, and syntax highlighting.
	    this.editorCompiled = CodeMirror.fromTextArea($context.find('.js-demo-compiled')[0], {
	      mode: "javascript",
	      lineNumbers: true,
	      matchBrackets: true,
	      tabSize: 2,
	      readOnly: true,
	      theme: 'seti',
	      keyMap: 'sublime'
	    });
	
	    this.editor = CodeMirror.fromTextArea($context.find('.js-demo-text')[0], {
	      mode: "javascript",
	      lineNumbers: true,
	      matchBrackets: true,
	      tabSize: 2,
	      theme: 'seti',
	      keyMap: 'sublime'
	    });
	
	    // Compile what's already in there.
	    this.compile(this.editor.getValue());
	
	    // Attach to change event so we can recompile each time something
	    // changes.
	    this.editor.on('change', _.debounce(this.handleCodeChange, 500).bind(this));
	
	    this.$toggleFullScreen.click(function () {
	      $context.toggleClass('is-full');
	
	      if ($context.hasClass('is-full')) {
	        _this.$toggleFullScreen.text('Exit Full Screen');
	      } else {
	        _this.$toggleFullScreen.text('Full Screen');
	      }
	
	      _this.editor.refresh();
	      _this.editorCompiled.refresh();
	    });
	  }
	
	  // The following methods are taken from Babel's REPL
	  // code, though many of them have been modified to
	  // fit our needs.
	
	  _createClass(BabelREPL, [{
	    key: 'refresh',
	    value: function refresh() {
	      // console.log('refresh');
	      this.editor.refresh();
	      this.editorCompiled.refresh();
	    }
	  }, {
	    key: 'handleCodeChange',
	    value: function handleCodeChange(instance, changeObj) {
	      this.compile(instance.getValue());
	    }
	  }, {
	    key: 'clear',
	    value: function clear() {
	      this.editorCompiled.setValue('');
	      this.$output.empty();
	      this.$consoleReporter.empty();
	    }
	  }, {
	    key: 'compile',
	    value: function compile(code) {
	      var transformed = undefined;
	
	      // Clear our output and console each time we recompile.
	      this.clear();
	
	      try {
	        // console.log('code', code);
	        transformed = babel.transform(code, {});
	        //console.log('past transform');
	        this.editorCompiled.setValue(transformed.code);
	        //console.log('past setValue');
	        this.evaluate(transformed.code);
	        //console.log('past evaluate');
	      } catch (err) {
	        // console.log('ERROR thrown', transformed.code);
	        // don't throw it.. just output it
	        this.$output.text(err.message);
	        this.$consoleReporter.text(err.message);
	      }
	    }
	  }, {
	    key: 'evaluate',
	    value: function evaluate(code) {
	      if (typeof this.capturingConsole === 'undefined') {
	        // extend console
	        this.capturingConsole = Object.create(console);
	      }
	      var capturingConsole = this.capturingConsole;
	
	      var $consoleReporter = this.$consoleReporter;
	      var buffer = [];
	      var error = undefined;
	      var done = false;
	
	      function flush() {
	        //console.log('buffer', buffer);
	        $consoleReporter.text(buffer.join('\n'));
	      }
	
	      function write(data) {
	        buffer.push(data);
	        if (done) {
	          flush();
	        }
	      }
	
	      capturingConsole.clear = function () {
	        buffer = [];
	        flush();
	      };
	
	      capturingConsole.error = function () {
	        error = true;
	        capturingConsole.log.apply(capturingConsole, arguments);
	      };
	
	      capturingConsole.log = capturingConsole.info = capturingConsole.debug = function () {
	        if (this !== capturingConsole) {
	          return;
	        }
	
	        var args = Array.prototype.slice.call(arguments);
	        Function.prototype.apply.call(console.log, console, args);
	
	        var logs = args.reduce(function (logs, log) {
	          console.log('log', log);
	          if (typeof log === 'string') {
	            // console.log('string');
	            logs.push(log);
	          } else if (typeof log === 'symbol') {
	            logs.push(String(log));
	          } else if (log instanceof Function) {
	            // console.log('function');
	            logs.push(log.toString());
	          } else {
	            // console.log('log', log);
	            // We need to account for DOM elements.
	            if (typeof log !== 'undefined' && typeof log.outerHTML !== 'undefined') {
	              logs.push(log.outerHTML);
	            } else {
	              try {
	                log = JSON.stringify(log);
	              } catch (e) {}
	              logs.push(String(log));
	            }
	          }
	
	          return logs;
	        }, []);
	
	        // console.log('logs', logs);
	        write(logs.join('\n'));
	      };
	
	      try {
	        // So this is actually running the code we obtained
	        // and setting the console used as the capturingConsole
	        // we created. It's cool because it gives us control
	        // over what to replace in our block of our code.
	        // (function(console, $$, code) {}(capturingConsole, this.$output));
	        new Function('console', '$$', 'require', code)(capturingConsole, this.$output, this.myRequire);
	      } catch (err) {
	        error = err;
	        buffer.push(err.message);
	      }
	
	      done = true;
	      flush();
	
	      if (error) {
	        throw error;
	      }
	    }
	  }, {
	    key: 'myRequire',
	    value: function myRequire(id) {
	      return {
	        a: function a() {
	          return 'i am a';
	        },
	        b: function b() {
	          return 'i am beaver';
	        }
	      };
	    }
	  }]);
	
	  return BabelREPL;
	})();
	
	exports['default'] = BabelREPL;
	module.exports = exports['default'];

/***/ },
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	// CodeMirror, copyright (c) by Marijn Haverbeke and others
	// Distributed under an MIT license: http://codemirror.net/LICENSE
	
	(function(mod) {
	  if (true) // CommonJS
	    mod(__webpack_require__(8));
	  else if (typeof define == "function" && define.amd) // AMD
	    define(["../../lib/codemirror"], mod);
	  else // Plain browser env
	    mod(CodeMirror);
	})(function(CodeMirror) {
	  "use strict";
	
	  var noOptions = {};
	  var nonWS = /[^\s\u00a0]/;
	  var Pos = CodeMirror.Pos;
	
	  function firstNonWS(str) {
	    var found = str.search(nonWS);
	    return found == -1 ? 0 : found;
	  }
	
	  CodeMirror.commands.toggleComment = function(cm) {
	    cm.toggleComment();
	  };
	
	  CodeMirror.defineExtension("toggleComment", function(options) {
	    if (!options) options = noOptions;
	    var cm = this;
	    var minLine = Infinity, ranges = this.listSelections(), mode = null;
	    for (var i = ranges.length - 1; i >= 0; i--) {
	      var from = ranges[i].from(), to = ranges[i].to();
	      if (from.line >= minLine) continue;
	      if (to.line >= minLine) to = Pos(minLine, 0);
	      minLine = from.line;
	      if (mode == null) {
	        if (cm.uncomment(from, to, options)) mode = "un";
	        else { cm.lineComment(from, to, options); mode = "line"; }
	      } else if (mode == "un") {
	        cm.uncomment(from, to, options);
	      } else {
	        cm.lineComment(from, to, options);
	      }
	    }
	  });
	
	  CodeMirror.defineExtension("lineComment", function(from, to, options) {
	    if (!options) options = noOptions;
	    var self = this, mode = self.getModeAt(from);
	    var commentString = options.lineComment || mode.lineComment;
	    if (!commentString) {
	      if (options.blockCommentStart || mode.blockCommentStart) {
	        options.fullLines = true;
	        self.blockComment(from, to, options);
	      }
	      return;
	    }
	    var firstLine = self.getLine(from.line);
	    if (firstLine == null) return;
	    var end = Math.min(to.ch != 0 || to.line == from.line ? to.line + 1 : to.line, self.lastLine() + 1);
	    var pad = options.padding == null ? " " : options.padding;
	    var blankLines = options.commentBlankLines || from.line == to.line;
	
	    self.operation(function() {
	      if (options.indent) {
	        var baseString = null;
	        for (var i = from.line; i < end; ++i) {
	          var line = self.getLine(i);
	          var whitespace = line.slice(0, firstNonWS(line));
	          if (baseString == null || baseString.length > whitespace.length) {
	            baseString = whitespace;
	          }
	        }
	        for (var i = from.line; i < end; ++i) {
	          var line = self.getLine(i), cut = baseString.length;
	          if (!blankLines && !nonWS.test(line)) continue;
	          if (line.slice(0, cut) != baseString) cut = firstNonWS(line);
	          self.replaceRange(baseString + commentString + pad, Pos(i, 0), Pos(i, cut));
	        }
	      } else {
	        for (var i = from.line; i < end; ++i) {
	          if (blankLines || nonWS.test(self.getLine(i)))
	            self.replaceRange(commentString + pad, Pos(i, 0));
	        }
	      }
	    });
	  });
	
	  CodeMirror.defineExtension("blockComment", function(from, to, options) {
	    if (!options) options = noOptions;
	    var self = this, mode = self.getModeAt(from);
	    var startString = options.blockCommentStart || mode.blockCommentStart;
	    var endString = options.blockCommentEnd || mode.blockCommentEnd;
	    if (!startString || !endString) {
	      if ((options.lineComment || mode.lineComment) && options.fullLines != false)
	        self.lineComment(from, to, options);
	      return;
	    }
	
	    var end = Math.min(to.line, self.lastLine());
	    if (end != from.line && to.ch == 0 && nonWS.test(self.getLine(end))) --end;
	
	    var pad = options.padding == null ? " " : options.padding;
	    if (from.line > end) return;
	
	    self.operation(function() {
	      if (options.fullLines != false) {
	        var lastLineHasText = nonWS.test(self.getLine(end));
	        self.replaceRange(pad + endString, Pos(end));
	        self.replaceRange(startString + pad, Pos(from.line, 0));
	        var lead = options.blockCommentLead || mode.blockCommentLead;
	        if (lead != null) for (var i = from.line + 1; i <= end; ++i)
	          if (i != end || lastLineHasText)
	            self.replaceRange(lead + pad, Pos(i, 0));
	      } else {
	        self.replaceRange(endString, to);
	        self.replaceRange(startString, from);
	      }
	    });
	  });
	
	  CodeMirror.defineExtension("uncomment", function(from, to, options) {
	    if (!options) options = noOptions;
	    var self = this, mode = self.getModeAt(from);
	    var end = Math.min(to.ch != 0 || to.line == from.line ? to.line : to.line - 1, self.lastLine()), start = Math.min(from.line, end);
	
	    // Try finding line comments
	    var lineString = options.lineComment || mode.lineComment, lines = [];
	    var pad = options.padding == null ? " " : options.padding, didSomething;
	    lineComment: {
	      if (!lineString) break lineComment;
	      for (var i = start; i <= end; ++i) {
	        var line = self.getLine(i);
	        var found = line.indexOf(lineString);
	        if (found > -1 && !/comment/.test(self.getTokenTypeAt(Pos(i, found + 1)))) found = -1;
	        if (found == -1 && (i != end || i == start) && nonWS.test(line)) break lineComment;
	        if (found > -1 && nonWS.test(line.slice(0, found))) break lineComment;
	        lines.push(line);
	      }
	      self.operation(function() {
	        for (var i = start; i <= end; ++i) {
	          var line = lines[i - start];
	          var pos = line.indexOf(lineString), endPos = pos + lineString.length;
	          if (pos < 0) continue;
	          if (line.slice(endPos, endPos + pad.length) == pad) endPos += pad.length;
	          didSomething = true;
	          self.replaceRange("", Pos(i, pos), Pos(i, endPos));
	        }
	      });
	      if (didSomething) return true;
	    }
	
	    // Try block comments
	    var startString = options.blockCommentStart || mode.blockCommentStart;
	    var endString = options.blockCommentEnd || mode.blockCommentEnd;
	    if (!startString || !endString) return false;
	    var lead = options.blockCommentLead || mode.blockCommentLead;
	    var startLine = self.getLine(start), endLine = end == start ? startLine : self.getLine(end);
	    var open = startLine.indexOf(startString), close = endLine.lastIndexOf(endString);
	    if (close == -1 && start != end) {
	      endLine = self.getLine(--end);
	      close = endLine.lastIndexOf(endString);
	    }
	    if (open == -1 || close == -1 ||
	        !/comment/.test(self.getTokenTypeAt(Pos(start, open + 1))) ||
	        !/comment/.test(self.getTokenTypeAt(Pos(end, close + 1))))
	      return false;
	
	    // Avoid killing block comments completely outside the selection.
	    // Positions of the last startString before the start of the selection, and the first endString after it.
	    var lastStart = startLine.lastIndexOf(startString, from.ch);
	    var firstEnd = lastStart == -1 ? -1 : startLine.slice(0, from.ch).indexOf(endString, lastStart + startString.length);
	    if (lastStart != -1 && firstEnd != -1 && firstEnd + endString.length != from.ch) return false;
	    // Positions of the first endString after the end of the selection, and the last startString before it.
	    firstEnd = endLine.indexOf(endString, to.ch);
	    var almostLastStart = endLine.slice(to.ch).lastIndexOf(startString, firstEnd - to.ch);
	    lastStart = (firstEnd == -1 || almostLastStart == -1) ? -1 : to.ch + almostLastStart;
	    if (firstEnd != -1 && lastStart != -1 && lastStart != to.ch) return false;
	
	    self.operation(function() {
	      self.replaceRange("", Pos(end, close - (pad && endLine.slice(close - pad.length, close) == pad ? pad.length : 0)),
	                        Pos(end, close + endString.length));
	      var openEnd = open + startString.length;
	      if (pad && startLine.slice(openEnd, openEnd + pad.length) == pad) openEnd += pad.length;
	      self.replaceRange("", Pos(start, open), Pos(start, openEnd));
	      if (lead) for (var i = start + 1; i <= end; ++i) {
	        var line = self.getLine(i), found = line.indexOf(lead);
	        if (found == -1 || nonWS.test(line.slice(0, found))) continue;
	        var foundEnd = found + lead.length;
	        if (pad && line.slice(foundEnd, foundEnd + pad.length) == pad) foundEnd += pad.length;
	        self.replaceRange("", Pos(i, found), Pos(i, foundEnd));
	      }
	    });
	    return true;
	  });
	});


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	// CodeMirror, copyright (c) by Marijn Haverbeke and others
	// Distributed under an MIT license: http://codemirror.net/LICENSE
	
	// A rough approximation of Sublime Text's keybindings
	// Depends on addon/search/searchcursor.js and optionally addon/dialog/dialogs.js
	
	(function(mod) {
	  if (true) // CommonJS
	    mod(__webpack_require__(8), __webpack_require__(12), __webpack_require__(13));
	  else if (typeof define == "function" && define.amd) // AMD
	    define(["../lib/codemirror", "../addon/search/searchcursor", "../addon/edit/matchbrackets"], mod);
	  else // Plain browser env
	    mod(CodeMirror);
	})(function(CodeMirror) {
	  "use strict";
	
	  var map = CodeMirror.keyMap.sublime = {fallthrough: "default"};
	  var cmds = CodeMirror.commands;
	  var Pos = CodeMirror.Pos;
	  var mac = CodeMirror.keyMap["default"] == CodeMirror.keyMap.macDefault;
	  var ctrl = mac ? "Cmd-" : "Ctrl-";
	
	  // This is not exactly Sublime's algorithm. I couldn't make heads or tails of that.
	  function findPosSubword(doc, start, dir) {
	    if (dir < 0 && start.ch == 0) return doc.clipPos(Pos(start.line - 1));
	    var line = doc.getLine(start.line);
	    if (dir > 0 && start.ch >= line.length) return doc.clipPos(Pos(start.line + 1, 0));
	    var state = "start", type;
	    for (var pos = start.ch, e = dir < 0 ? 0 : line.length, i = 0; pos != e; pos += dir, i++) {
	      var next = line.charAt(dir < 0 ? pos - 1 : pos);
	      var cat = next != "_" && CodeMirror.isWordChar(next) ? "w" : "o";
	      if (cat == "w" && next.toUpperCase() == next) cat = "W";
	      if (state == "start") {
	        if (cat != "o") { state = "in"; type = cat; }
	      } else if (state == "in") {
	        if (type != cat) {
	          if (type == "w" && cat == "W" && dir < 0) pos--;
	          if (type == "W" && cat == "w" && dir > 0) { type = "w"; continue; }
	          break;
	        }
	      }
	    }
	    return Pos(start.line, pos);
	  }
	
	  function moveSubword(cm, dir) {
	    cm.extendSelectionsBy(function(range) {
	      if (cm.display.shift || cm.doc.extend || range.empty())
	        return findPosSubword(cm.doc, range.head, dir);
	      else
	        return dir < 0 ? range.from() : range.to();
	    });
	  }
	
	  cmds[map["Alt-Left"] = "goSubwordLeft"] = function(cm) { moveSubword(cm, -1); };
	  cmds[map["Alt-Right"] = "goSubwordRight"] = function(cm) { moveSubword(cm, 1); };
	
	  var scrollLineCombo = mac ? "Ctrl-Alt-" : "Ctrl-";
	
	  cmds[map[scrollLineCombo + "Up"] = "scrollLineUp"] = function(cm) {
	    var info = cm.getScrollInfo();
	    if (!cm.somethingSelected()) {
	      var visibleBottomLine = cm.lineAtHeight(info.top + info.clientHeight, "local");
	      if (cm.getCursor().line >= visibleBottomLine)
	        cm.execCommand("goLineUp");
	    }
	    cm.scrollTo(null, info.top - cm.defaultTextHeight());
	  };
	  cmds[map[scrollLineCombo + "Down"] = "scrollLineDown"] = function(cm) {
	    var info = cm.getScrollInfo();
	    if (!cm.somethingSelected()) {
	      var visibleTopLine = cm.lineAtHeight(info.top, "local")+1;
	      if (cm.getCursor().line <= visibleTopLine)
	        cm.execCommand("goLineDown");
	    }
	    cm.scrollTo(null, info.top + cm.defaultTextHeight());
	  };
	
	  cmds[map["Shift-" + ctrl + "L"] = "splitSelectionByLine"] = function(cm) {
	    var ranges = cm.listSelections(), lineRanges = [];
	    for (var i = 0; i < ranges.length; i++) {
	      var from = ranges[i].from(), to = ranges[i].to();
	      for (var line = from.line; line <= to.line; ++line)
	        if (!(to.line > from.line && line == to.line && to.ch == 0))
	          lineRanges.push({anchor: line == from.line ? from : Pos(line, 0),
	                           head: line == to.line ? to : Pos(line)});
	    }
	    cm.setSelections(lineRanges, 0);
	  };
	
	  map["Shift-Tab"] = "indentLess";
	
	  cmds[map["Esc"] = "singleSelectionTop"] = function(cm) {
	    var range = cm.listSelections()[0];
	    cm.setSelection(range.anchor, range.head, {scroll: false});
	  };
	
	  cmds[map[ctrl + "L"] = "selectLine"] = function(cm) {
	    var ranges = cm.listSelections(), extended = [];
	    for (var i = 0; i < ranges.length; i++) {
	      var range = ranges[i];
	      extended.push({anchor: Pos(range.from().line, 0),
	                     head: Pos(range.to().line + 1, 0)});
	    }
	    cm.setSelections(extended);
	  };
	
	  map["Shift-" + ctrl + "K"] = "deleteLine";
	
	  function insertLine(cm, above) {
	    cm.operation(function() {
	      var len = cm.listSelections().length, newSelection = [], last = -1;
	      for (var i = 0; i < len; i++) {
	        var head = cm.listSelections()[i].head;
	        if (head.line <= last) continue;
	        var at = Pos(head.line + (above ? 0 : 1), 0);
	        cm.replaceRange("\n", at, null, "+insertLine");
	        cm.indentLine(at.line, null, true);
	        newSelection.push({head: at, anchor: at});
	        last = head.line + 1;
	      }
	      cm.setSelections(newSelection);
	    });
	  }
	
	  cmds[map[ctrl + "Enter"] = "insertLineAfter"] = function(cm) { insertLine(cm, false); };
	
	  cmds[map["Shift-" + ctrl + "Enter"] = "insertLineBefore"] = function(cm) { insertLine(cm, true); };
	
	  function wordAt(cm, pos) {
	    var start = pos.ch, end = start, line = cm.getLine(pos.line);
	    while (start && CodeMirror.isWordChar(line.charAt(start - 1))) --start;
	    while (end < line.length && CodeMirror.isWordChar(line.charAt(end))) ++end;
	    return {from: Pos(pos.line, start), to: Pos(pos.line, end), word: line.slice(start, end)};
	  }
	
	  cmds[map[ctrl + "D"] = "selectNextOccurrence"] = function(cm) {
	    var from = cm.getCursor("from"), to = cm.getCursor("to");
	    var fullWord = cm.state.sublimeFindFullWord == cm.doc.sel;
	    if (CodeMirror.cmpPos(from, to) == 0) {
	      var word = wordAt(cm, from);
	      if (!word.word) return;
	      cm.setSelection(word.from, word.to);
	      fullWord = true;
	    } else {
	      var text = cm.getRange(from, to);
	      var query = fullWord ? new RegExp("\\b" + text + "\\b") : text;
	      var cur = cm.getSearchCursor(query, to);
	      if (cur.findNext()) {
	        cm.addSelection(cur.from(), cur.to());
	      } else {
	        cur = cm.getSearchCursor(query, Pos(cm.firstLine(), 0));
	        if (cur.findNext())
	          cm.addSelection(cur.from(), cur.to());
	      }
	    }
	    if (fullWord)
	      cm.state.sublimeFindFullWord = cm.doc.sel;
	  };
	
	  var mirror = "(){}[]";
	  function selectBetweenBrackets(cm) {
	    var pos = cm.getCursor(), opening = cm.scanForBracket(pos, -1);
	    if (!opening) return;
	    for (;;) {
	      var closing = cm.scanForBracket(pos, 1);
	      if (!closing) return;
	      if (closing.ch == mirror.charAt(mirror.indexOf(opening.ch) + 1)) {
	        cm.setSelection(Pos(opening.pos.line, opening.pos.ch + 1), closing.pos, false);
	        return true;
	      }
	      pos = Pos(closing.pos.line, closing.pos.ch + 1);
	    }
	  }
	
	  cmds[map["Shift-" + ctrl + "Space"] = "selectScope"] = function(cm) {
	    selectBetweenBrackets(cm) || cm.execCommand("selectAll");
	  };
	  cmds[map["Shift-" + ctrl + "M"] = "selectBetweenBrackets"] = function(cm) {
	    if (!selectBetweenBrackets(cm)) return CodeMirror.Pass;
	  };
	
	  cmds[map[ctrl + "M"] = "goToBracket"] = function(cm) {
	    cm.extendSelectionsBy(function(range) {
	      var next = cm.scanForBracket(range.head, 1);
	      if (next && CodeMirror.cmpPos(next.pos, range.head) != 0) return next.pos;
	      var prev = cm.scanForBracket(range.head, -1);
	      return prev && Pos(prev.pos.line, prev.pos.ch + 1) || range.head;
	    });
	  };
	
	  var swapLineCombo = mac ? "Cmd-Ctrl-" : "Shift-Ctrl-";
	
	  cmds[map[swapLineCombo + "Up"] = "swapLineUp"] = function(cm) {
	    var ranges = cm.listSelections(), linesToMove = [], at = cm.firstLine() - 1, newSels = [];
	    for (var i = 0; i < ranges.length; i++) {
	      var range = ranges[i], from = range.from().line - 1, to = range.to().line;
	      newSels.push({anchor: Pos(range.anchor.line - 1, range.anchor.ch),
	                    head: Pos(range.head.line - 1, range.head.ch)});
	      if (range.to().ch == 0 && !range.empty()) --to;
	      if (from > at) linesToMove.push(from, to);
	      else if (linesToMove.length) linesToMove[linesToMove.length - 1] = to;
	      at = to;
	    }
	    cm.operation(function() {
	      for (var i = 0; i < linesToMove.length; i += 2) {
	        var from = linesToMove[i], to = linesToMove[i + 1];
	        var line = cm.getLine(from);
	        cm.replaceRange("", Pos(from, 0), Pos(from + 1, 0), "+swapLine");
	        if (to > cm.lastLine())
	          cm.replaceRange("\n" + line, Pos(cm.lastLine()), null, "+swapLine");
	        else
	          cm.replaceRange(line + "\n", Pos(to, 0), null, "+swapLine");
	      }
	      cm.setSelections(newSels);
	      cm.scrollIntoView();
	    });
	  };
	
	  cmds[map[swapLineCombo + "Down"] = "swapLineDown"] = function(cm) {
	    var ranges = cm.listSelections(), linesToMove = [], at = cm.lastLine() + 1;
	    for (var i = ranges.length - 1; i >= 0; i--) {
	      var range = ranges[i], from = range.to().line + 1, to = range.from().line;
	      if (range.to().ch == 0 && !range.empty()) from--;
	      if (from < at) linesToMove.push(from, to);
	      else if (linesToMove.length) linesToMove[linesToMove.length - 1] = to;
	      at = to;
	    }
	    cm.operation(function() {
	      for (var i = linesToMove.length - 2; i >= 0; i -= 2) {
	        var from = linesToMove[i], to = linesToMove[i + 1];
	        var line = cm.getLine(from);
	        if (from == cm.lastLine())
	          cm.replaceRange("", Pos(from - 1), Pos(from), "+swapLine");
	        else
	          cm.replaceRange("", Pos(from, 0), Pos(from + 1, 0), "+swapLine");
	        cm.replaceRange(line + "\n", Pos(to, 0), null, "+swapLine");
	      }
	      cm.scrollIntoView();
	    });
	  };
	
	  map[ctrl + "/"] = function(cm) {
	    cm.toggleComment({ indent: true });
	  }
	
	  cmds[map[ctrl + "J"] = "joinLines"] = function(cm) {
	    var ranges = cm.listSelections(), joined = [];
	    for (var i = 0; i < ranges.length; i++) {
	      var range = ranges[i], from = range.from();
	      var start = from.line, end = range.to().line;
	      while (i < ranges.length - 1 && ranges[i + 1].from().line == end)
	        end = ranges[++i].to().line;
	      joined.push({start: start, end: end, anchor: !range.empty() && from});
	    }
	    cm.operation(function() {
	      var offset = 0, ranges = [];
	      for (var i = 0; i < joined.length; i++) {
	        var obj = joined[i];
	        var anchor = obj.anchor && Pos(obj.anchor.line - offset, obj.anchor.ch), head;
	        for (var line = obj.start; line <= obj.end; line++) {
	          var actual = line - offset;
	          if (line == obj.end) head = Pos(actual, cm.getLine(actual).length + 1);
	          if (actual < cm.lastLine()) {
	            cm.replaceRange(" ", Pos(actual), Pos(actual + 1, /^\s*/.exec(cm.getLine(actual + 1))[0].length));
	            ++offset;
	          }
	        }
	        ranges.push({anchor: anchor || head, head: head});
	      }
	      cm.setSelections(ranges, 0);
	    });
	  };
	
	  cmds[map["Shift-" + ctrl + "D"] = "duplicateLine"] = function(cm) {
	    cm.operation(function() {
	      var rangeCount = cm.listSelections().length;
	      for (var i = 0; i < rangeCount; i++) {
	        var range = cm.listSelections()[i];
	        if (range.empty())
	          cm.replaceRange(cm.getLine(range.head.line) + "\n", Pos(range.head.line, 0));
	        else
	          cm.replaceRange(cm.getRange(range.from(), range.to()), range.from());
	      }
	      cm.scrollIntoView();
	    });
	  };
	
	  map[ctrl + "T"] = "transposeChars";
	
	  function sortLines(cm, caseSensitive) {
	    var ranges = cm.listSelections(), toSort = [], selected;
	    for (var i = 0; i < ranges.length; i++) {
	      var range = ranges[i];
	      if (range.empty()) continue;
	      var from = range.from().line, to = range.to().line;
	      while (i < ranges.length - 1 && ranges[i + 1].from().line == to)
	        to = range[++i].to().line;
	      toSort.push(from, to);
	    }
	    if (toSort.length) selected = true;
	    else toSort.push(cm.firstLine(), cm.lastLine());
	
	    cm.operation(function() {
	      var ranges = [];
	      for (var i = 0; i < toSort.length; i += 2) {
	        var from = toSort[i], to = toSort[i + 1];
	        var start = Pos(from, 0), end = Pos(to);
	        var lines = cm.getRange(start, end, false);
	        if (caseSensitive)
	          lines.sort();
	        else
	          lines.sort(function(a, b) {
	            var au = a.toUpperCase(), bu = b.toUpperCase();
	            if (au != bu) { a = au; b = bu; }
	            return a < b ? -1 : a == b ? 0 : 1;
	          });
	        cm.replaceRange(lines, start, end);
	        if (selected) ranges.push({anchor: start, head: end});
	      }
	      if (selected) cm.setSelections(ranges, 0);
	    });
	  }
	
	  cmds[map["F9"] = "sortLines"] = function(cm) { sortLines(cm, true); };
	  cmds[map[ctrl + "F9"] = "sortLinesInsensitive"] = function(cm) { sortLines(cm, false); };
	
	  cmds[map["F2"] = "nextBookmark"] = function(cm) {
	    var marks = cm.state.sublimeBookmarks;
	    if (marks) while (marks.length) {
	      var current = marks.shift();
	      var found = current.find();
	      if (found) {
	        marks.push(current);
	        return cm.setSelection(found.from, found.to);
	      }
	    }
	  };
	
	  cmds[map["Shift-F2"] = "prevBookmark"] = function(cm) {
	    var marks = cm.state.sublimeBookmarks;
	    if (marks) while (marks.length) {
	      marks.unshift(marks.pop());
	      var found = marks[marks.length - 1].find();
	      if (!found)
	        marks.pop();
	      else
	        return cm.setSelection(found.from, found.to);
	    }
	  };
	
	  cmds[map[ctrl + "F2"] = "toggleBookmark"] = function(cm) {
	    var ranges = cm.listSelections();
	    var marks = cm.state.sublimeBookmarks || (cm.state.sublimeBookmarks = []);
	    for (var i = 0; i < ranges.length; i++) {
	      var from = ranges[i].from(), to = ranges[i].to();
	      var found = cm.findMarks(from, to);
	      for (var j = 0; j < found.length; j++) {
	        if (found[j].sublimeBookmark) {
	          found[j].clear();
	          for (var k = 0; k < marks.length; k++)
	            if (marks[k] == found[j])
	              marks.splice(k--, 1);
	          break;
	        }
	      }
	      if (j == found.length)
	        marks.push(cm.markText(from, to, {sublimeBookmark: true, clearWhenEmpty: false}));
	    }
	  };
	
	  cmds[map["Shift-" + ctrl + "F2"] = "clearBookmarks"] = function(cm) {
	    var marks = cm.state.sublimeBookmarks;
	    if (marks) for (var i = 0; i < marks.length; i++) marks[i].clear();
	    marks.length = 0;
	  };
	
	  cmds[map["Alt-F2"] = "selectBookmarks"] = function(cm) {
	    var marks = cm.state.sublimeBookmarks, ranges = [];
	    if (marks) for (var i = 0; i < marks.length; i++) {
	      var found = marks[i].find();
	      if (!found)
	        marks.splice(i--, 0);
	      else
	        ranges.push({anchor: found.from, head: found.to});
	    }
	    if (ranges.length)
	      cm.setSelections(ranges, 0);
	  };
	
	  map["Alt-Q"] = "wrapLines";
	
	  var cK = ctrl + "K ";
	
	  function modifyWordOrSelection(cm, mod) {
	    cm.operation(function() {
	      var ranges = cm.listSelections(), indices = [], replacements = [];
	      for (var i = 0; i < ranges.length; i++) {
	        var range = ranges[i];
	        if (range.empty()) { indices.push(i); replacements.push(""); }
	        else replacements.push(mod(cm.getRange(range.from(), range.to())));
	      }
	      cm.replaceSelections(replacements, "around", "case");
	      for (var i = indices.length - 1, at; i >= 0; i--) {
	        var range = ranges[indices[i]];
	        if (at && CodeMirror.cmpPos(range.head, at) > 0) continue;
	        var word = wordAt(cm, range.head);
	        at = word.from;
	        cm.replaceRange(mod(word.word), word.from, word.to);
	      }
	    });
	  }
	
	  map[cK + ctrl + "Backspace"] = "delLineLeft";
	
	  cmds[map["Backspace"] = "smartBackspace"] = function(cm) {
	    if (cm.somethingSelected()) return CodeMirror.Pass;
	
	    var cursor = cm.getCursor();
	    var toStartOfLine = cm.getRange({line: cursor.line, ch: 0}, cursor);
	    var column = CodeMirror.countColumn(toStartOfLine, null, cm.getOption("tabSize"));
	    var indentUnit = cm.getOption("indentUnit");
	
	    if (toStartOfLine && !/\S/.test(toStartOfLine) && column % indentUnit == 0) {
	      var prevIndent = new Pos(cursor.line,
	        CodeMirror.findColumn(toStartOfLine, column - indentUnit, indentUnit));
	
	      // If no smart delete is happening (due to tab sizing) just do a regular delete
	      if (prevIndent.ch == cursor.ch) return CodeMirror.Pass;
	
	      return cm.replaceRange("", prevIndent, cursor, "+delete");
	    } else {
	      return CodeMirror.Pass;
	    }
	  };
	
	  cmds[map[cK + ctrl + "K"] = "delLineRight"] = function(cm) {
	    cm.operation(function() {
	      var ranges = cm.listSelections();
	      for (var i = ranges.length - 1; i >= 0; i--)
	        cm.replaceRange("", ranges[i].anchor, Pos(ranges[i].to().line), "+delete");
	      cm.scrollIntoView();
	    });
	  };
	
	  cmds[map[cK + ctrl + "U"] = "upcaseAtCursor"] = function(cm) {
	    modifyWordOrSelection(cm, function(str) { return str.toUpperCase(); });
	  };
	  cmds[map[cK + ctrl + "L"] = "downcaseAtCursor"] = function(cm) {
	    modifyWordOrSelection(cm, function(str) { return str.toLowerCase(); });
	  };
	
	  cmds[map[cK + ctrl + "Space"] = "setSublimeMark"] = function(cm) {
	    if (cm.state.sublimeMark) cm.state.sublimeMark.clear();
	    cm.state.sublimeMark = cm.setBookmark(cm.getCursor());
	  };
	  cmds[map[cK + ctrl + "A"] = "selectToSublimeMark"] = function(cm) {
	    var found = cm.state.sublimeMark && cm.state.sublimeMark.find();
	    if (found) cm.setSelection(cm.getCursor(), found);
	  };
	  cmds[map[cK + ctrl + "W"] = "deleteToSublimeMark"] = function(cm) {
	    var found = cm.state.sublimeMark && cm.state.sublimeMark.find();
	    if (found) {
	      var from = cm.getCursor(), to = found;
	      if (CodeMirror.cmpPos(from, to) > 0) { var tmp = to; to = from; from = tmp; }
	      cm.state.sublimeKilled = cm.getRange(from, to);
	      cm.replaceRange("", from, to);
	    }
	  };
	  cmds[map[cK + ctrl + "X"] = "swapWithSublimeMark"] = function(cm) {
	    var found = cm.state.sublimeMark && cm.state.sublimeMark.find();
	    if (found) {
	      cm.state.sublimeMark.clear();
	      cm.state.sublimeMark = cm.setBookmark(cm.getCursor());
	      cm.setCursor(found);
	    }
	  };
	  cmds[map[cK + ctrl + "Y"] = "sublimeYank"] = function(cm) {
	    if (cm.state.sublimeKilled != null)
	      cm.replaceSelection(cm.state.sublimeKilled, null, "paste");
	  };
	
	  map[cK + ctrl + "G"] = "clearBookmarks";
	  cmds[map[cK + ctrl + "C"] = "showInCenter"] = function(cm) {
	    var pos = cm.cursorCoords(null, "local");
	    cm.scrollTo(null, (pos.top + pos.bottom) / 2 - cm.getScrollInfo().clientHeight / 2);
	  };
	
	  cmds[map["Shift-Alt-Up"] = "selectLinesUpward"] = function(cm) {
	    cm.operation(function() {
	      var ranges = cm.listSelections();
	      for (var i = 0; i < ranges.length; i++) {
	        var range = ranges[i];
	        if (range.head.line > cm.firstLine())
	          cm.addSelection(Pos(range.head.line - 1, range.head.ch));
	      }
	    });
	  };
	  cmds[map["Shift-Alt-Down"] = "selectLinesDownward"] = function(cm) {
	    cm.operation(function() {
	      var ranges = cm.listSelections();
	      for (var i = 0; i < ranges.length; i++) {
	        var range = ranges[i];
	        if (range.head.line < cm.lastLine())
	          cm.addSelection(Pos(range.head.line + 1, range.head.ch));
	      }
	    });
	  };
	
	  function getTarget(cm) {
	    var from = cm.getCursor("from"), to = cm.getCursor("to");
	    if (CodeMirror.cmpPos(from, to) == 0) {
	      var word = wordAt(cm, from);
	      if (!word.word) return;
	      from = word.from;
	      to = word.to;
	    }
	    return {from: from, to: to, query: cm.getRange(from, to), word: word};
	  }
	
	  function findAndGoTo(cm, forward) {
	    var target = getTarget(cm);
	    if (!target) return;
	    var query = target.query;
	    var cur = cm.getSearchCursor(query, forward ? target.to : target.from);
	
	    if (forward ? cur.findNext() : cur.findPrevious()) {
	      cm.setSelection(cur.from(), cur.to());
	    } else {
	      cur = cm.getSearchCursor(query, forward ? Pos(cm.firstLine(), 0)
	                                              : cm.clipPos(Pos(cm.lastLine())));
	      if (forward ? cur.findNext() : cur.findPrevious())
	        cm.setSelection(cur.from(), cur.to());
	      else if (target.word)
	        cm.setSelection(target.from, target.to);
	    }
	  };
	  cmds[map[ctrl + "F3"] = "findUnder"] = function(cm) { findAndGoTo(cm, true); };
	  cmds[map["Shift-" + ctrl + "F3"] = "findUnderPrevious"] = function(cm) { findAndGoTo(cm,false); };
	  cmds[map["Alt-F3"] = "findAllUnder"] = function(cm) {
	    var target = getTarget(cm);
	    if (!target) return;
	    var cur = cm.getSearchCursor(target.query);
	    var matches = [];
	    var primaryIndex = -1;
	    while (cur.findNext()) {
	      matches.push({anchor: cur.from(), head: cur.to()});
	      if (cur.from().line <= target.from.line && cur.from().ch <= target.from.ch)
	        primaryIndex++;
	    }
	    cm.setSelections(matches, primaryIndex);
	  };
	
	  map["Shift-" + ctrl + "["] = "fold";
	  map["Shift-" + ctrl + "]"] = "unfold";
	  map[cK + ctrl + "0"] = map[cK + ctrl + "j"] = "unfoldAll";
	
	  map[ctrl + "I"] = "findIncremental";
	  map["Shift-" + ctrl + "I"] = "findIncrementalReverse";
	  map[ctrl + "H"] = "replace";
	  map["F3"] = "findNext";
	  map["Shift-F3"] = "findPrev";
	
	  CodeMirror.normalizeKeyMap(map);
	});


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	// CodeMirror, copyright (c) by Marijn Haverbeke and others
	// Distributed under an MIT license: http://codemirror.net/LICENSE
	
	(function(mod) {
	  if (true) // CommonJS
	    mod(__webpack_require__(8));
	  else if (typeof define == "function" && define.amd) // AMD
	    define(["../../lib/codemirror"], mod);
	  else // Plain browser env
	    mod(CodeMirror);
	})(function(CodeMirror) {
	  "use strict";
	  var Pos = CodeMirror.Pos;
	
	  function SearchCursor(doc, query, pos, caseFold) {
	    this.atOccurrence = false; this.doc = doc;
	    if (caseFold == null && typeof query == "string") caseFold = false;
	
	    pos = pos ? doc.clipPos(pos) : Pos(0, 0);
	    this.pos = {from: pos, to: pos};
	
	    // The matches method is filled in based on the type of query.
	    // It takes a position and a direction, and returns an object
	    // describing the next occurrence of the query, or null if no
	    // more matches were found.
	    if (typeof query != "string") { // Regexp match
	      if (!query.global) query = new RegExp(query.source, query.ignoreCase ? "ig" : "g");
	      this.matches = function(reverse, pos) {
	        if (reverse) {
	          query.lastIndex = 0;
	          var line = doc.getLine(pos.line).slice(0, pos.ch), cutOff = 0, match, start;
	          for (;;) {
	            query.lastIndex = cutOff;
	            var newMatch = query.exec(line);
	            if (!newMatch) break;
	            match = newMatch;
	            start = match.index;
	            cutOff = match.index + (match[0].length || 1);
	            if (cutOff == line.length) break;
	          }
	          var matchLen = (match && match[0].length) || 0;
	          if (!matchLen) {
	            if (start == 0 && line.length == 0) {match = undefined;}
	            else if (start != doc.getLine(pos.line).length) {
	              matchLen++;
	            }
	          }
	        } else {
	          query.lastIndex = pos.ch;
	          var line = doc.getLine(pos.line), match = query.exec(line);
	          var matchLen = (match && match[0].length) || 0;
	          var start = match && match.index;
	          if (start + matchLen != line.length && !matchLen) matchLen = 1;
	        }
	        if (match && matchLen)
	          return {from: Pos(pos.line, start),
	                  to: Pos(pos.line, start + matchLen),
	                  match: match};
	      };
	    } else { // String query
	      var origQuery = query;
	      if (caseFold) query = query.toLowerCase();
	      var fold = caseFold ? function(str){return str.toLowerCase();} : function(str){return str;};
	      var target = query.split("\n");
	      // Different methods for single-line and multi-line queries
	      if (target.length == 1) {
	        if (!query.length) {
	          // Empty string would match anything and never progress, so
	          // we define it to match nothing instead.
	          this.matches = function() {};
	        } else {
	          this.matches = function(reverse, pos) {
	            if (reverse) {
	              var orig = doc.getLine(pos.line).slice(0, pos.ch), line = fold(orig);
	              var match = line.lastIndexOf(query);
	              if (match > -1) {
	                match = adjustPos(orig, line, match);
	                return {from: Pos(pos.line, match), to: Pos(pos.line, match + origQuery.length)};
	              }
	             } else {
	               var orig = doc.getLine(pos.line).slice(pos.ch), line = fold(orig);
	               var match = line.indexOf(query);
	               if (match > -1) {
	                 match = adjustPos(orig, line, match) + pos.ch;
	                 return {from: Pos(pos.line, match), to: Pos(pos.line, match + origQuery.length)};
	               }
	            }
	          };
	        }
	      } else {
	        var origTarget = origQuery.split("\n");
	        this.matches = function(reverse, pos) {
	          var last = target.length - 1;
	          if (reverse) {
	            if (pos.line - (target.length - 1) < doc.firstLine()) return;
	            if (fold(doc.getLine(pos.line).slice(0, origTarget[last].length)) != target[target.length - 1]) return;
	            var to = Pos(pos.line, origTarget[last].length);
	            for (var ln = pos.line - 1, i = last - 1; i >= 1; --i, --ln)
	              if (target[i] != fold(doc.getLine(ln))) return;
	            var line = doc.getLine(ln), cut = line.length - origTarget[0].length;
	            if (fold(line.slice(cut)) != target[0]) return;
	            return {from: Pos(ln, cut), to: to};
	          } else {
	            if (pos.line + (target.length - 1) > doc.lastLine()) return;
	            var line = doc.getLine(pos.line), cut = line.length - origTarget[0].length;
	            if (fold(line.slice(cut)) != target[0]) return;
	            var from = Pos(pos.line, cut);
	            for (var ln = pos.line + 1, i = 1; i < last; ++i, ++ln)
	              if (target[i] != fold(doc.getLine(ln))) return;
	            if (fold(doc.getLine(ln).slice(0, origTarget[last].length)) != target[last]) return;
	            return {from: from, to: Pos(ln, origTarget[last].length)};
	          }
	        };
	      }
	    }
	  }
	
	  SearchCursor.prototype = {
	    findNext: function() {return this.find(false);},
	    findPrevious: function() {return this.find(true);},
	
	    find: function(reverse) {
	      var self = this, pos = this.doc.clipPos(reverse ? this.pos.from : this.pos.to);
	      function savePosAndFail(line) {
	        var pos = Pos(line, 0);
	        self.pos = {from: pos, to: pos};
	        self.atOccurrence = false;
	        return false;
	      }
	
	      for (;;) {
	        if (this.pos = this.matches(reverse, pos)) {
	          this.atOccurrence = true;
	          return this.pos.match || true;
	        }
	        if (reverse) {
	          if (!pos.line) return savePosAndFail(0);
	          pos = Pos(pos.line-1, this.doc.getLine(pos.line-1).length);
	        }
	        else {
	          var maxLine = this.doc.lineCount();
	          if (pos.line == maxLine - 1) return savePosAndFail(maxLine);
	          pos = Pos(pos.line + 1, 0);
	        }
	      }
	    },
	
	    from: function() {if (this.atOccurrence) return this.pos.from;},
	    to: function() {if (this.atOccurrence) return this.pos.to;},
	
	    replace: function(newText, origin) {
	      if (!this.atOccurrence) return;
	      var lines = CodeMirror.splitLines(newText);
	      this.doc.replaceRange(lines, this.pos.from, this.pos.to, origin);
	      this.pos.to = Pos(this.pos.from.line + lines.length - 1,
	                        lines[lines.length - 1].length + (lines.length == 1 ? this.pos.from.ch : 0));
	    }
	  };
	
	  // Maps a position in a case-folded line back to a position in the original line
	  // (compensating for codepoints increasing in number during folding)
	  function adjustPos(orig, folded, pos) {
	    if (orig.length == folded.length) return pos;
	    for (var pos1 = Math.min(pos, orig.length);;) {
	      var len1 = orig.slice(0, pos1).toLowerCase().length;
	      if (len1 < pos) ++pos1;
	      else if (len1 > pos) --pos1;
	      else return pos1;
	    }
	  }
	
	  CodeMirror.defineExtension("getSearchCursor", function(query, pos, caseFold) {
	    return new SearchCursor(this.doc, query, pos, caseFold);
	  });
	  CodeMirror.defineDocExtension("getSearchCursor", function(query, pos, caseFold) {
	    return new SearchCursor(this, query, pos, caseFold);
	  });
	
	  CodeMirror.defineExtension("selectMatches", function(query, caseFold) {
	    var ranges = [];
	    var cur = this.getSearchCursor(query, this.getCursor("from"), caseFold);
	    while (cur.findNext()) {
	      if (CodeMirror.cmpPos(cur.to(), this.getCursor("to")) > 0) break;
	      ranges.push({anchor: cur.from(), head: cur.to()});
	    }
	    if (ranges.length)
	      this.setSelections(ranges, 0);
	  });
	});


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	// CodeMirror, copyright (c) by Marijn Haverbeke and others
	// Distributed under an MIT license: http://codemirror.net/LICENSE
	
	(function(mod) {
	  if (true) // CommonJS
	    mod(__webpack_require__(8));
	  else if (typeof define == "function" && define.amd) // AMD
	    define(["../../lib/codemirror"], mod);
	  else // Plain browser env
	    mod(CodeMirror);
	})(function(CodeMirror) {
	  var ie_lt8 = /MSIE \d/.test(navigator.userAgent) &&
	    (document.documentMode == null || document.documentMode < 8);
	
	  var Pos = CodeMirror.Pos;
	
	  var matching = {"(": ")>", ")": "(<", "[": "]>", "]": "[<", "{": "}>", "}": "{<"};
	
	  function findMatchingBracket(cm, where, strict, config) {
	    var line = cm.getLineHandle(where.line), pos = where.ch - 1;
	    var match = (pos >= 0 && matching[line.text.charAt(pos)]) || matching[line.text.charAt(++pos)];
	    if (!match) return null;
	    var dir = match.charAt(1) == ">" ? 1 : -1;
	    if (strict && (dir > 0) != (pos == where.ch)) return null;
	    var style = cm.getTokenTypeAt(Pos(where.line, pos + 1));
	
	    var found = scanForBracket(cm, Pos(where.line, pos + (dir > 0 ? 1 : 0)), dir, style || null, config);
	    if (found == null) return null;
	    return {from: Pos(where.line, pos), to: found && found.pos,
	            match: found && found.ch == match.charAt(0), forward: dir > 0};
	  }
	
	  // bracketRegex is used to specify which type of bracket to scan
	  // should be a regexp, e.g. /[[\]]/
	  //
	  // Note: If "where" is on an open bracket, then this bracket is ignored.
	  //
	  // Returns false when no bracket was found, null when it reached
	  // maxScanLines and gave up
	  function scanForBracket(cm, where, dir, style, config) {
	    var maxScanLen = (config && config.maxScanLineLength) || 10000;
	    var maxScanLines = (config && config.maxScanLines) || 1000;
	
	    var stack = [];
	    var re = config && config.bracketRegex ? config.bracketRegex : /[(){}[\]]/;
	    var lineEnd = dir > 0 ? Math.min(where.line + maxScanLines, cm.lastLine() + 1)
	                          : Math.max(cm.firstLine() - 1, where.line - maxScanLines);
	    for (var lineNo = where.line; lineNo != lineEnd; lineNo += dir) {
	      var line = cm.getLine(lineNo);
	      if (!line) continue;
	      var pos = dir > 0 ? 0 : line.length - 1, end = dir > 0 ? line.length : -1;
	      if (line.length > maxScanLen) continue;
	      if (lineNo == where.line) pos = where.ch - (dir < 0 ? 1 : 0);
	      for (; pos != end; pos += dir) {
	        var ch = line.charAt(pos);
	        if (re.test(ch) && (style === undefined || cm.getTokenTypeAt(Pos(lineNo, pos + 1)) == style)) {
	          var match = matching[ch];
	          if ((match.charAt(1) == ">") == (dir > 0)) stack.push(ch);
	          else if (!stack.length) return {pos: Pos(lineNo, pos), ch: ch};
	          else stack.pop();
	        }
	      }
	    }
	    return lineNo - dir == (dir > 0 ? cm.lastLine() : cm.firstLine()) ? false : null;
	  }
	
	  function matchBrackets(cm, autoclear, config) {
	    // Disable brace matching in long lines, since it'll cause hugely slow updates
	    var maxHighlightLen = cm.state.matchBrackets.maxHighlightLineLength || 1000;
	    var marks = [], ranges = cm.listSelections();
	    for (var i = 0; i < ranges.length; i++) {
	      var match = ranges[i].empty() && findMatchingBracket(cm, ranges[i].head, false, config);
	      if (match && cm.getLine(match.from.line).length <= maxHighlightLen) {
	        var style = match.match ? "CodeMirror-matchingbracket" : "CodeMirror-nonmatchingbracket";
	        marks.push(cm.markText(match.from, Pos(match.from.line, match.from.ch + 1), {className: style}));
	        if (match.to && cm.getLine(match.to.line).length <= maxHighlightLen)
	          marks.push(cm.markText(match.to, Pos(match.to.line, match.to.ch + 1), {className: style}));
	      }
	    }
	
	    if (marks.length) {
	      // Kludge to work around the IE bug from issue #1193, where text
	      // input stops going to the textare whever this fires.
	      if (ie_lt8 && cm.state.focused) cm.focus();
	
	      var clear = function() {
	        cm.operation(function() {
	          for (var i = 0; i < marks.length; i++) marks[i].clear();
	        });
	      };
	      if (autoclear) setTimeout(clear, 800);
	      else return clear;
	    }
	  }
	
	  var currentlyHighlighted = null;
	  function doMatchBrackets(cm) {
	    cm.operation(function() {
	      if (currentlyHighlighted) {currentlyHighlighted(); currentlyHighlighted = null;}
	      currentlyHighlighted = matchBrackets(cm, false, cm.state.matchBrackets);
	    });
	  }
	
	  CodeMirror.defineOption("matchBrackets", false, function(cm, val, old) {
	    if (old && old != CodeMirror.Init)
	      cm.off("cursorActivity", doMatchBrackets);
	    if (val) {
	      cm.state.matchBrackets = typeof val == "object" ? val : {};
	      cm.on("cursorActivity", doMatchBrackets);
	    }
	  });
	
	  CodeMirror.defineExtension("matchBrackets", function() {matchBrackets(this, true);});
	  CodeMirror.defineExtension("findMatchingBracket", function(pos, strict, config){
	    return findMatchingBracket(this, pos, strict, config);
	  });
	  CodeMirror.defineExtension("scanForBracket", function(pos, dir, style, config){
	    return scanForBracket(this, pos, dir, style, config);
	  });
	});


/***/ }
]);
//# sourceMappingURL=es6-editor.js.map
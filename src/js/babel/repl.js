/**
* Code inspired and taken from https://babeljs.io/scripts/repl.js.
*/

import $ from 'jquery';
import _ from 'underscore';

import 'codemirror/lib/codemirror';
import 'codemirror/addon/comment/comment';
import 'codemirror/keymap/sublime';

// babel is provided in an external script tag
export default class BabelREPL {
  constructor($context) {
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

    this.$toggleFullScreen.click(() => {
      $context.toggleClass('is-full');

      if ($context.hasClass('is-full')) {
        this.$toggleFullScreen.text('Exit Full Screen');
      } else {
        this.$toggleFullScreen.text('Full Screen');
      }

      this.editor.refresh();
      this.editorCompiled.refresh();
    });
  }

  // The following methods are taken from Babel's REPL
  // code, though many of them have been modified to
  // fit our needs.
  refresh() {
    // console.log('refresh');
    this.editor.refresh();
    this.editorCompiled.refresh();
  }

  handleCodeChange(instance, changeObj) {
    this.compile(instance.getValue());
  }

  clear() {
    this.editorCompiled.setValue('');
    this.$output.empty();
    this.$consoleReporter.empty();
  }

  compile(code) {
    let transformed;

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

  evaluate(code) {
    if (typeof this.capturingConsole === 'undefined') {
      // extend console
      this.capturingConsole = Object.create(console);
    }
    let capturingConsole = this.capturingConsole;

    let $consoleReporter = this.$consoleReporter;
    let buffer = [];
    let error;
    let done = false;

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

    capturingConsole.clear = function() {
      buffer = [];
      flush();
    };

    capturingConsole.error = function() {
      error = true;
      capturingConsole.log.apply(capturingConsole, arguments);
    };

    capturingConsole.log =
    capturingConsole.info =
    capturingConsole.debug = function() {
      if (this !== capturingConsole) { return; }

      let args = Array.prototype.slice.call(arguments);
      Function.prototype.apply.call(console.log, console, args);

      let logs = args.reduce(function(logs, log) {
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
          if (typeof log !== 'undefined' &&
            typeof log.outerHTML !== 'undefined') {
            logs.push(log.outerHTML);
          } else {
            try {
              log = JSON.stringify(log);
            } catch(e) {

            }
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
      // we created. It's kind of cool because it gives us control
      // over what to replace in our block of our code.
      new Function('console', '$$', code)(capturingConsole, this.$output);
    } catch (err) {
      //console.log('THERE IS A PROBLEM!!', code);
      error = err;
      buffer.push(err.message);
    }

    done = true;
    flush();

    if (error) {
      throw error;
    }
  }
}
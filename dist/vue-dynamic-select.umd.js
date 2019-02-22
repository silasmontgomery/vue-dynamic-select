(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.DynamicSelect = {})));
}(this, (function (exports) { 'use strict';

    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //

    var script = {
        props: {
            placeholder: {
                type: String, 
                default: 'search',
                required: false
            },
            options: {
                type: Array, 
                default: function() {
                    return []
                },
                required: true
            },
            optionValue: {
                type: String, 
                default: 'id',
                required: true
            },
            optionText: {
                type: String, 
                default: 'name',
                required: true
            },
            value: {
                type: Object,
                default: function() {
                    return null
                },
                required: false
            }
        },
        data: function() {
            return {
                hasFocus: false,
                typing: false,
                search: null,
                savedOption: null,
                selectedResult: 0
            };
        },
        mounted: function mounted() {
            var this$1 = this;

            // Load selected option from prop
            if(this.value) {
                this.options.forEach(function (option) {
                    if(option[this$1.optionValue] == this$1.value[this$1.optionValue]) {
                        this$1.savedOption = option;
                    }
                });
            }
        },
        computed: {
            results: function() {
                var this$1 = this;

                // Filter items on search text (if not empty, case insensitive) and when item isn't already selected (else return all items not selected)
                return this.search ? this.options.filter(function (i) { return i[this$1.optionText].toLowerCase().indexOf(this$1.search.toLowerCase()) > -1; }) : this.options;
            },
            showResultList: function() {
                return this.hasFocus && this.results.length > 0;
            },
            showPlaceholder: function() {
                return !this.hasFocus && !this.savedOption;
            }
        },
        watch: {
            hasFocus: function() {
                // Clear the search box when component loses focus
                if(!this.hasFocus) {
                    this.typing = false;
                    this.search = null;
                }
            },
            savedOption: function() {
                // Provide selected items array to parent
                this.$emit('input', this.savedOption);
            },
            search: function() {
                // Provide search text to parent (for ajax fetching, etc)
                this.$emit('search', this.search);
            }
        },
        methods: {
            selectOption: function(option) {
                this.savedOption = option;
                this.search = null;
                this.$refs.search.blur();
                this.hasFocus = false;
            },
            removeOption: function(event) {
                // Remove selected option if user hits backspace on empty search field
                if(event.keyCode === 8 && (this.search == null || this.search == '')) {
                    this.savedOption = null;
                    this.$refs.search.blur();
                }
            },
            moveToResults: function(event) {
                // Move down to first result if user presses down arrow (from search field)
                if(event.keyCode === 40) {
                    if(this.$refs.result.length > 0) {
                        this.$refs.resultList.children.item(0).focus();
                    }
                }
            },
            navigateResults: function(option, event) {
                // Add option to selected items on enter key
                if(event.keyCode === 13) {
                    this.selectOption(option);
                // Move up or down items in result list with up or down arrow keys
                } else if(event.keyCode === 40 || event.keyCode === 38) {
                    if(event.keyCode === 40) {
                        this.selectedResult++;
                    } else if(event.keyCode === 38) {
                        this.selectedResult--;
                    }
                    var next = this.$refs.resultList.children.item(this.selectedResult);
                    if(next) {
                        next.focus();
                    } else {
                        this.selectedResult = 0;
                        this.$refs.search.focus();
                    }
                }
            },
            highlight: function(value) {
                // Highlights the part of each result that matches the search text
                if(this.search) {
                    var matchPos = value.toLowerCase().indexOf(this.search.toLowerCase());
                    if(matchPos > -1) {
                        var matchStr = value.substr(matchPos, this.search.length);
                        value = value.replace(matchStr, '<span style="font-weight: bold; background-color: #efefef;">'+matchStr+'</span>');
                    }
                }

                return value;
            }
        }
    }

    function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
    /* server only */
    , shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
      } // Vue.extend constructor export interop.


      var options = typeof script === 'function' ? script.options : script; // render functions

      if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true; // functional template

        if (isFunctionalTemplate) {
          options.functional = true;
        }
      } // scopedId


      if (scopeId) {
        options._scopeId = scopeId;
      }

      var hook;

      if (moduleIdentifier) {
        // server build
        hook = function hook(context) {
          // 2.3 injection
          context = context || // cached call
          this.$vnode && this.$vnode.ssrContext || // stateful
          this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
          // 2.2 with runInNewContext: true

          if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
            context = __VUE_SSR_CONTEXT__;
          } // inject component styles


          if (style) {
            style.call(this, createInjectorSSR(context));
          } // register component module identifier for async chunk inference


          if (context && context._registeredComponents) {
            context._registeredComponents.add(moduleIdentifier);
          }
        }; // used by ssr in case component is cached and beforeCreate
        // never gets called


        options._ssrRegister = hook;
      } else if (style) {
        hook = shadowMode ? function () {
          style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
        } : function (context) {
          style.call(this, createInjector(context));
        };
      }

      if (hook) {
        if (options.functional) {
          // register for functional component in vue file
          var originalRender = options.render;

          options.render = function renderWithStyleInjection(h, context) {
            hook.call(context);
            return originalRender(h, context);
          };
        } else {
          // inject component registration as beforeCreate hook
          var existing = options.beforeCreate;
          options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
      }

      return script;
    }

    var normalizeComponent_1 = normalizeComponent;

    var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
    function createInjector(context) {
      return function (id, style) {
        return addStyle(id, style);
      };
    }
    var HEAD = document.head || document.getElementsByTagName('head')[0];
    var styles = {};

    function addStyle(id, css) {
      var group = isOldIE ? css.media || 'default' : id;
      var style = styles[group] || (styles[group] = {
        ids: new Set(),
        styles: []
      });

      if (!style.ids.has(id)) {
        style.ids.add(id);
        var code = css.source;

        if (css.map) {
          // https://developer.chrome.com/devtools/docs/javascript-debugging
          // this makes source maps inside style tags work properly in Chrome
          code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

          code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
        }

        if (!style.element) {
          style.element = document.createElement('style');
          style.element.type = 'text/css';
          if (css.media) { style.element.setAttribute('media', css.media); }
          HEAD.appendChild(style.element);
        }

        if ('styleSheet' in style.element) {
          style.styles.push(code);
          style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
        } else {
          var index = style.ids.size - 1;
          var textNode = document.createTextNode(code);
          var nodes = style.element.childNodes;
          if (nodes[index]) { style.element.removeChild(nodes[index]); }
          if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }else { style.element.appendChild(textNode); }
        }
      }
    }

    var browser = createInjector;

    /* script */
    var __vue_script__ = script;

    /* template */
    var __vue_render__ = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", [
        _c(
          "div",
          {
            staticClass: "vue-dynamic-select",
            on: {
              focusin: function($event) {
                _vm.hasFocus = true;
              },
              focusout: function($event) {
                _vm.hasFocus = false;
              },
              click: function($event) {
                return _vm.$refs.search.focus()
              }
            }
          },
          [
            _vm.showPlaceholder
              ? _c("div", {
                  staticClass: "placeholder",
                  domProps: { textContent: _vm._s(_vm.placeholder) }
                })
              : _vm._e(),
            _vm._v(" "),
            _vm.savedOption && !_vm.typing
              ? _c("div", {
                  staticClass: "saved-option",
                  domProps: { textContent: _vm._s(_vm.savedOption[_vm.optionText]) }
                })
              : _vm._e(),
            _vm._v(" "),
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.search,
                  expression: "search"
                }
              ],
              ref: "search",
              staticClass: "search",
              attrs: { autocomplete: "off" },
              domProps: { value: _vm.search },
              on: {
                focus: function($event) {
                  _vm.typing = true;
                },
                blur: function($event) {
                  _vm.typing = false;
                },
                keyup: _vm.moveToResults,
                keydown: _vm.removeOption,
                input: function($event) {
                  if ($event.target.composing) {
                    return
                  }
                  _vm.search = $event.target.value;
                }
              }
            }),
            _vm._v(" "),
            _c("i", { staticClass: "dropdown" }),
            _vm._v(" "),
            _vm.showResultList
              ? _c(
                  "div",
                  { ref: "resultList", staticClass: "result-list" },
                  _vm._l(_vm.results, function(result) {
                    return _c("div", {
                      key: result[_vm.optionValue],
                      ref: "result",
                      refInFor: true,
                      staticClass: "result",
                      attrs: { tabindex: "0" },
                      domProps: {
                        innerHTML: _vm._s(_vm.highlight(result[_vm.optionText]))
                      },
                      on: {
                        focus: function($event) {
                          _vm.typing = true;
                        },
                        blur: function($event) {
                          _vm.typing = false;
                        },
                        click: function($event) {
                          $event.stopPropagation();
                          return _vm.selectOption(result)
                        },
                        keyup: function($event) {
                          return _vm.navigateResults(result, $event)
                        }
                      }
                    })
                  }),
                  0
                )
              : _vm._e()
          ]
        )
      ])
    };
    var __vue_staticRenderFns__ = [];
    __vue_render__._withStripped = true;

      /* style */
      var __vue_inject_styles__ = function (inject) {
        if (!inject) { return }
        inject("data-v-4ef1b8ca_0", { source: "\n.vue-dynamic-select[data-v-4ef1b8ca] {\n    border: 1px solid #ced4da; \n    position: relative;\n    width: 100%; \n    padding: .375em .5em;\n    border-radius: .25em;\n    cursor: text;\n    display: block;\n}\n.vue-dynamic-select i.dropdown[data-v-4ef1b8ca] {\n    width: 0; \n    height: 0; \n    border-left: 4px solid transparent; \n    border-right: 4px solid transparent; \n    border-top: 4px solid; \n    float: right; \n    top: .75em; \n    opacity: .8; \n    cursor: pointer;\n}\n.vue-dynamic-select .placeholder[data-v-4ef1b8ca] {\n    display: inline-block;\n    color: #ccc;\n}\n.vue-dynamic-select .result-list[data-v-4ef1b8ca] {\n    border: 1px solid #ced4da; \n    margin: calc(.375em - 1px) calc(-.5em - 1px);\n    width: calc(100% + 2px);\n    min-width: calc(100% + 2px);\n    border-radius: 0 0 .25em .25em;\n    cursor: pointer;\n    position: absolute;\n    z-index: 10;\n    background-color: #fff;\n}\n.vue-dynamic-select .result-list .result[data-v-4ef1b8ca] {\n    padding: .375em .75em;\n    color: #333;\n}\n.vue-dynamic-select .result-list .result[data-v-4ef1b8ca]:hover, .vue-dynamic-select .result-list .result[data-v-4ef1b8ca]:focus {\n    background-color: #efefef;\n    outline: none;\n}\n.vue-dynamic-select .saved-option[data-v-4ef1b8ca] {\n    display: inline-block;\n}\n.vue-dynamic-select .search[data-v-4ef1b8ca] {\n    border: none;\n    width: 50px;\n}\n.vue-dynamic-select .search[data-v-4ef1b8ca]:focus {\n    outline: none;\n}\n", map: {"version":3,"sources":["/home/smontgomery/Projects/vue-dynamic-select/src/DynamicSelect.vue"],"names":[],"mappings":";AA0JA;IACA,yBAAA;IACA,kBAAA;IACA,WAAA;IACA,oBAAA;IACA,oBAAA;IACA,YAAA;IACA,cAAA;AACA;AACA;IACA,QAAA;IACA,SAAA;IACA,kCAAA;IACA,mCAAA;IACA,qBAAA;IACA,YAAA;IACA,UAAA;IACA,WAAA;IACA,eAAA;AACA;AACA;IACA,qBAAA;IACA,WAAA;AACA;AACA;IACA,yBAAA;IACA,4CAAA;IACA,uBAAA;IACA,2BAAA;IACA,8BAAA;IACA,eAAA;IACA,kBAAA;IACA,WAAA;IACA,sBAAA;AACA;AACA;IACA,qBAAA;IACA,WAAA;AACA;AACA;IACA,yBAAA;IACA,aAAA;AACA;AACA;IACA,qBAAA;AACA;AACA;IACA,YAAA;IACA,WAAA;AACA;AACA;IACA,aAAA;AACA","file":"DynamicSelect.vue","sourcesContent":["<template>\n    <div>\n        <div class=\"vue-dynamic-select\" @focusin=\"hasFocus=true\" @focusout=\"hasFocus=false\" @click=\"$refs.search.focus()\">\n            <div v-if=\"showPlaceholder\" class=\"placeholder\" v-text=\"placeholder\" />\n            <div class=\"saved-option\" v-text=\"savedOption[optionText]\" v-if=\"savedOption && !typing\" />\n            <input autocomplete=\"off\" class=\"search\" ref=\"search\" v-model=\"search\" @focus=\"typing=true\" @blur=\"typing=false\" @keyup=\"moveToResults\" @keydown=\"removeOption\" />\n            <i class=\"dropdown\" />\n            <div v-if=\"showResultList\" ref=\"resultList\" class=\"result-list\">\n                <div ref=\"result\" class=\"result\" tabindex=\"0\" @focus=\"typing=true\" @blur=\"typing=false\" v-for=\"result in results\" :key=\"result[optionValue]\" v-html=\"highlight(result[optionText])\" @click.stop=\"selectOption(result)\" @keyup=\"navigateResults(result, $event)\" />\n            </div>\n        </div>\n    </div>\n</template>\n\n<script>\n    export default {\n        props: {\n            placeholder: {\n                type: String, \n                default: 'search',\n                required: false\n            },\n            options: {\n                type: Array, \n                default: function() {\n                    return []\n                },\n                required: true\n            },\n            optionValue: {\n                type: String, \n                default: 'id',\n                required: true\n            },\n            optionText: {\n                type: String, \n                default: 'name',\n                required: true\n            },\n            value: {\n                type: Object,\n                default: function() {\n                    return null\n                },\n                required: false\n            }\n        },\n        data: function() {\n            return {\n                hasFocus: false,\n                typing: false,\n                search: null,\n                savedOption: null,\n                selectedResult: 0\n            };\n        },\n        mounted() {\n            // Load selected option from prop\n            if(this.value) {\n                this.options.forEach(option => {\n                    if(option[this.optionValue] == this.value[this.optionValue]) {\n                        this.savedOption = option;\n                    }\n                })\n            }\n        },\n        computed: {\n            results: function() {\n                // Filter items on search text (if not empty, case insensitive) and when item isn't already selected (else return all items not selected)\n                return this.search ? this.options.filter(i => i[this.optionText].toLowerCase().indexOf(this.search.toLowerCase()) > -1) : this.options;\n            },\n            showResultList: function() {\n                return this.hasFocus && this.results.length > 0;\n            },\n            showPlaceholder: function() {\n                return !this.hasFocus && !this.savedOption;\n            }\n        },\n        watch: {\n            hasFocus: function() {\n                // Clear the search box when component loses focus\n                if(!this.hasFocus) {\n                    this.typing = false;\n                    this.search = null;\n                }\n            },\n            savedOption: function() {\n                // Provide selected items array to parent\n                this.$emit('input', this.savedOption);\n            },\n            search: function() {\n                // Provide search text to parent (for ajax fetching, etc)\n                this.$emit('search', this.search);\n            }\n        },\n        methods: {\n            selectOption: function(option) {\n                this.savedOption = option;\n                this.search = null;\n                this.$refs.search.blur();\n                this.hasFocus = false;\n            },\n            removeOption: function(event) {\n                // Remove selected option if user hits backspace on empty search field\n                if(event.keyCode === 8 && (this.search == null || this.search == '')) {\n                    this.savedOption = null;\n                    this.$refs.search.blur();\n                }\n            },\n            moveToResults: function(event) {\n                // Move down to first result if user presses down arrow (from search field)\n                if(event.keyCode === 40) {\n                    if(this.$refs.result.length > 0) {\n                        this.$refs.resultList.children.item(0).focus();\n                    }\n                }\n            },\n            navigateResults: function(option, event) {\n                // Add option to selected items on enter key\n                if(event.keyCode === 13) {\n                    this.selectOption(option);\n                // Move up or down items in result list with up or down arrow keys\n                } else if(event.keyCode === 40 || event.keyCode === 38) {\n                    if(event.keyCode === 40) {\n                        this.selectedResult++;\n                    } else if(event.keyCode === 38) {\n                        this.selectedResult--;\n                    }\n                    let next = this.$refs.resultList.children.item(this.selectedResult);\n                    if(next) {\n                        next.focus();\n                    } else {\n                        this.selectedResult = 0;\n                        this.$refs.search.focus();\n                    }\n                }\n            },\n            highlight: function(value) {\n                // Highlights the part of each result that matches the search text\n                if(this.search) {\n                    let matchPos = value.toLowerCase().indexOf(this.search.toLowerCase());\n                    if(matchPos > -1) {\n                        let matchStr = value.substr(matchPos, this.search.length);\n                        value = value.replace(matchStr, '<span style=\"font-weight: bold; background-color: #efefef;\">'+matchStr+'</span>');\n                    }\n                }\n\n                return value;\n            }\n        }\n    }\n</script>\n\n<style scoped>\n    .vue-dynamic-select {\n        border: 1px solid #ced4da; \n        position: relative;\n        width: 100%; \n        padding: .375em .5em;\n        border-radius: .25em;\n        cursor: text;\n        display: block;\n    }\n    .vue-dynamic-select i.dropdown {\n        width: 0; \n        height: 0; \n        border-left: 4px solid transparent; \n        border-right: 4px solid transparent; \n        border-top: 4px solid; \n        float: right; \n        top: .75em; \n        opacity: .8; \n        cursor: pointer;\n    }\n    .vue-dynamic-select .placeholder {\n        display: inline-block;\n        color: #ccc;\n    }\n    .vue-dynamic-select .result-list {\n        border: 1px solid #ced4da; \n        margin: calc(.375em - 1px) calc(-.5em - 1px);\n        width: calc(100% + 2px);\n        min-width: calc(100% + 2px);\n        border-radius: 0 0 .25em .25em;\n        cursor: pointer;\n        position: absolute;\n        z-index: 10;\n        background-color: #fff;\n    }\n    .vue-dynamic-select .result-list .result {\n        padding: .375em .75em;\n        color: #333;\n    }\n    .vue-dynamic-select .result-list .result:hover, .vue-dynamic-select .result-list .result:focus {\n        background-color: #efefef;\n        outline: none;\n    }\n    .vue-dynamic-select .saved-option {\n        display: inline-block;\n    }\n    .vue-dynamic-select .search {\n        border: none;\n        width: 50px;\n    }\n    .vue-dynamic-select .search:focus {\n        outline: none;\n    }\n</style>\n"]}, media: undefined });

      };
      /* scoped */
      var __vue_scope_id__ = "data-v-4ef1b8ca";
      /* module identifier */
      var __vue_module_identifier__ = undefined;
      /* functional template */
      var __vue_is_functional_template__ = false;
      /* style inject SSR */
      

      
      var DynamicSelect = normalizeComponent_1(
        { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
        __vue_inject_styles__,
        __vue_script__,
        __vue_scope_id__,
        __vue_is_functional_template__,
        __vue_module_identifier__,
        browser,
        undefined
      )

    // Declare install function executed by Vue.use()
    function install(Vue) {
    	if (install.installed) { return; }
    	install.installed = true;
    	Vue.component('DynamicSelect', DynamicSelect);
    }

    // Create module definition for Vue.use()
    var plugin = {
    	install: install,
    };

    // Auto-install when vue is found (eg. in browser via <script> tag)
    var GlobalVue = null;
    if (typeof window !== 'undefined') {
    	GlobalVue = window.Vue;
    } else if (typeof global !== 'undefined') {
    	GlobalVue = global.Vue;
    }
    if (GlobalVue) {
    	GlobalVue.use(plugin);
    }

    exports.install = install;
    exports.default = DynamicSelect;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

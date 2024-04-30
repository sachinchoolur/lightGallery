// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
    /* eslint-disable no-undef */
    var globalObject =
      typeof globalThis !== 'undefined'
        ? globalThis
        : typeof self !== 'undefined'
        ? self
        : typeof window !== 'undefined'
        ? window
        : typeof global !== 'undefined'
        ? global
        : {};
    /* eslint-enable no-undef */
  
    // Save the require from previous bundle to this closure if any
    var previousRequire =
      typeof globalObject[parcelRequireName] === 'function' &&
      globalObject[parcelRequireName];
  
    var cache = previousRequire.cache || {};
    // Do not use `require` to prevent Webpack from trying to bundle this call
    var nodeRequire =
      typeof module !== 'undefined' &&
      typeof module.require === 'function' &&
      module.require.bind(module);
  
    function newRequire(name, jumped) {
      if (!cache[name]) {
        if (!modules[name]) {
          // if we cannot find the module within our internal map or
          // cache jump to the current global require ie. the last bundle
          // that was added to the page.
          var currentRequire =
            typeof globalObject[parcelRequireName] === 'function' &&
            globalObject[parcelRequireName];
          if (!jumped && currentRequire) {
            return currentRequire(name, true);
          }
  
          // If there are other bundles on this page the require from the
          // previous one is saved to 'previousRequire'. Repeat this as
          // many times as there are bundles until the module is found or
          // we exhaust the require chain.
          if (previousRequire) {
            return previousRequire(name, true);
          }
  
          // Try the node require function if it exists.
          if (nodeRequire && typeof name === 'string') {
            return nodeRequire(name);
          }
  
          var err = new Error("Cannot find module '" + name + "'");
          err.code = 'MODULE_NOT_FOUND';
          throw err;
        }
  
        localRequire.resolve = resolve;
        localRequire.cache = {};
  
        var module = (cache[name] = new newRequire.Module(name));
  
        modules[name][0].call(
          module.exports,
          localRequire,
          module,
          module.exports,
          this
        );
      }
  
      return cache[name].exports;
  
      function localRequire(x) {
        var res = localRequire.resolve(x);
        return res === false ? {} : newRequire(res);
      }
  
      function resolve(x) {
        var id = modules[name][1][x];
        return id != null ? id : x;
      }
    }
  
    function Module(moduleName) {
      this.id = moduleName;
      this.bundle = newRequire;
      this.exports = {};
    }
  
    newRequire.isParcelRequire = true;
    newRequire.Module = Module;
    newRequire.modules = modules;
    newRequire.cache = cache;
    newRequire.parent = previousRequire;
    newRequire.register = function (id, exports) {
      modules[id] = [
        function (require, module) {
          module.exports = exports;
        },
        {},
      ];
    };
  
    Object.defineProperty(newRequire, 'root', {
      get: function () {
        return globalObject[parcelRequireName];
      },
    });
  
    globalObject[parcelRequireName] = newRequire;
  
    for (var i = 0; i < entry.length; i++) {
      newRequire(entry[i]);
    }
  
    if (mainEntry) {
      // Expose entry point to Node, AMD or browser globals
      // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
      var mainExports = newRequire(mainEntry);
  
      // CommonJS
      if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = mainExports;
  
        // RequireJS
      } else if (typeof define === 'function' && define.amd) {
        define(function () {
          return mainExports;
        });
  
        // <script>
      } else if (globalName) {
        this[globalName] = mainExports;
      }
    }
  })({"7vr0J":[function(require,module,exports) {
  var _asyncToGenerator = require("@swc/helpers/_/_async_to_generator");
  var _toConsumableArray = require("@swc/helpers/_/_to_consumable_array");
  var _tsGenerator = require("@swc/helpers/_/_ts_generator");
  var global = arguments[3];
  var HMR_HOST = null;
  var HMR_PORT = 1234;
  var HMR_SECURE = false;
  var HMR_ENV_HASH = "1f28e9ceaf633d83";
  var HMR_USE_SSE = false;
  module.bundle.HMR_BUNDLE_ID = "6052fa5dc4cbb7a4";
  "use strict";
  /* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE, HMR_USE_SSE, chrome, browser, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
  import type {
    HMRAsset,
    HMRMessage,
  } from '@parcel/reporter-dev-server/src/HMRServer.js';
  interface ParcelRequire {
    (string): mixed;
    cache: {|[string]: ParcelModule|};
    hotData: {|[string]: mixed|};
    Module: any;
    parent: ?ParcelRequire;
    isParcelRequire: true;
    modules: {|[string]: [Function, {|[string]: string|}]|};
    HMR_BUNDLE_ID: string;
    root: ParcelRequire;
  }
  interface ParcelModule {
    hot: {|
      data: mixed,
      accept(cb: (Function) => void): void,
      dispose(cb: (mixed) => void): void,
      // accept(deps: Array<string> | string, cb: (Function) => void): void,
      // decline(): void,
      _acceptCallbacks: Array<(Function) => void>,
      _disposeCallbacks: Array<(mixed) => void>,
    |};
  }
  interface ExtensionContext {
    runtime: {|
      reload(): void,
      getURL(url: string): string;
      getManifest(): {manifest_version: number, ...};
    |};
  }
  declare var module: {bundle: ParcelRequire, ...};
  declare var HMR_HOST: string;
  declare var HMR_PORT: string;
  declare var HMR_ENV_HASH: string;
  declare var HMR_SECURE: boolean;
  declare var HMR_USE_SSE: boolean;
  declare var chrome: ExtensionContext;
  declare var browser: ExtensionContext;
  declare var __parcel__import__: (string) => Promise<void>;
  declare var __parcel__importScripts__: (string) => Promise<void>;
  declare var globalThis: typeof self;
  declare var ServiceWorkerGlobalScope: Object;
  */ var OVERLAY_ID = "__parcel__error__overlay__";
  var OldModule = module.bundle.Module;
  function Module(moduleName) {
      OldModule.call(this, moduleName);
      this.hot = {
          data: module.bundle.hotData[moduleName],
          _acceptCallbacks: [],
          _disposeCallbacks: [],
          accept: function accept(fn) {
              this._acceptCallbacks.push(fn || function() {});
          },
          dispose: function dispose(fn) {
              this._disposeCallbacks.push(fn);
          }
      };
      module.bundle.hotData[moduleName] = undefined;
  }
  module.bundle.Module = Module;
  module.bundle.hotData = {};
  var checkedAssets /*: {|[string]: boolean|} */ , assetsToDispose /*: Array<[ParcelRequire, string]> */ , assetsToAccept /*: Array<[ParcelRequire, string]> */ ;
  function getHostname() {
      return HMR_HOST || (location.protocol.indexOf("http") === 0 ? location.hostname : "localhost");
  }
  function getPort() {
      return HMR_PORT || location.port;
  }
  // eslint-disable-next-line no-redeclare
  var parent = module.bundle.parent;
  if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== "undefined") {
      var hostname = getHostname();
      var port = getPort();
      var protocol = HMR_SECURE || location.protocol == "https:" && ![
          "localhost",
          "127.0.0.1",
          "0.0.0.0"
      ].includes(hostname) ? "wss" : "ws";
      var ws;
      if (HMR_USE_SSE) ws = new EventSource("/__parcel_hmr");
      else try {
          ws = new WebSocket(protocol + "://" + hostname + (port ? ":" + port : "") + "/");
      } catch (err) {
          if (err.message) console.error(err.message);
          ws = {};
      }
      // Web extension context
      var extCtx = typeof browser === "undefined" ? typeof chrome === "undefined" ? null : chrome : browser;
      // Safari doesn't support sourceURL in error stacks.
      // eval may also be disabled via CSP, so do a quick check.
      var supportsSourceURL = false;
      try {
          (0, eval)('throw new Error("test"); //# sourceURL=test.js');
      } catch (err) {
          supportsSourceURL = err.stack.includes("test.js");
      }
      // $FlowFixMe
      ws.onmessage = function() {
          var _ref = (0, _asyncToGenerator._)(function(event /*: {data: string, ...} */ ) {
              var data /*: HMRMessage */ , assets, handled, processedAssets, i, id, i1, id1, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, ansiDiagnostic, stack, overlay;
              return (0, _tsGenerator._)(this, function(_state) {
                  switch(_state.label){
                      case 0:
                          checkedAssets = {} /*: {|[string]: boolean|} */ ;
                          assetsToAccept = [];
                          assetsToDispose = [];
                          data = JSON.parse(event.data);
                          if (!(data.type === "update")) return [
                              3,
                              3
                          ];
                          // Remove error overlay if there is one
                          if (typeof document !== "undefined") removeErrorOverlay();
                          assets = data.assets.filter(function(asset) {
                              return asset.envHash === HMR_ENV_HASH;
                          });
                          // Handle HMR Update
                          handled = assets.every(function(asset) {
                              return asset.type === "css" || asset.type === "js" && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
                          });
                          if (!handled) return [
                              3,
                              2
                          ];
                          console.clear();
                          // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
                          if (typeof window !== "undefined" && typeof CustomEvent !== "undefined") window.dispatchEvent(new CustomEvent("parcelhmraccept"));
                          return [
                              4,
                              hmrApplyUpdates(assets)
                          ];
                      case 1:
                          _state.sent();
                          // Dispose all old assets.
                          processedAssets = {} /*: {|[string]: boolean|} */ ;
                          for(i = 0; i < assetsToDispose.length; i++){
                              id = assetsToDispose[i][1];
                              if (!processedAssets[id]) {
                                  hmrDispose(assetsToDispose[i][0], id);
                                  processedAssets[id] = true;
                              }
                          }
                          // Run accept callbacks. This will also re-execute other disposed assets in topological order.
                          processedAssets = {};
                          for(i1 = 0; i1 < assetsToAccept.length; i1++){
                              id1 = assetsToAccept[i1][1];
                              if (!processedAssets[id1]) {
                                  hmrAccept(assetsToAccept[i1][0], id1);
                                  processedAssets[id1] = true;
                              }
                          }
                          return [
                              3,
                              3
                          ];
                      case 2:
                          fullReload();
                          _state.label = 3;
                      case 3:
                          if (data.type === "error") {
                              _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                              try {
                                  // Log parcel errors to console
                                  for(_iterator = data.diagnostics.ansi[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                      ansiDiagnostic = _step.value;
                                      stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                                      console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + "\n" + stack + "\n\n" + ansiDiagnostic.hints.join("\n"));
                                  }
                              } catch (err) {
                                  _didIteratorError = true;
                                  _iteratorError = err;
                              } finally{
                                  try {
                                      if (!_iteratorNormalCompletion && _iterator.return != null) {
                                          _iterator.return();
                                      }
                                  } finally{
                                      if (_didIteratorError) {
                                          throw _iteratorError;
                                      }
                                  }
                              }
                              if (typeof document !== "undefined") {
                                  // Render the fancy html overlay
                                  removeErrorOverlay();
                                  overlay = createErrorOverlay(data.diagnostics.html);
                                  // $FlowFixMe
                                  document.body.appendChild(overlay);
                              }
                          }
                          return [
                              2
                          ];
                  }
              });
          });
          return function(event) {
              return _ref.apply(this, arguments);
          };
      }();
      if (ws instanceof WebSocket) {
          ws.onerror = function(e) {
              if (e.message) console.error(e.message);
          };
          ws.onclose = function() {
              console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
          };
      }
  }
  function removeErrorOverlay() {
      var overlay = document.getElementById(OVERLAY_ID);
      if (overlay) {
          overlay.remove();
          console.log("[parcel] \u2728 Error resolved");
      }
  }
  function createErrorOverlay(diagnostics) {
      var overlay = document.createElement("div");
      overlay.id = OVERLAY_ID;
      var errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
      var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
      try {
          for(var _iterator = diagnostics[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
              var diagnostic = _step.value;
              var stack = diagnostic.frames.length ? diagnostic.frames.reduce(function(p, frame) {
                  return "".concat(p, '\n<a href="/__parcel_launch_editor?file=').concat(encodeURIComponent(frame.location), '" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">').concat(frame.location, "</a>\n").concat(frame.code);
              }, "") : diagnostic.stack;
              errorHTML += '\n      <div>\n        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">\n          \uD83D\uDEA8 '.concat(diagnostic.message, "\n        </div>\n        <pre>").concat(stack, "</pre>\n        <div>\n          ").concat(diagnostic.hints.map(function(hint) {
                  return "<div>\uD83D\uDCA1 " + hint + "</div>";
              }).join(""), "\n        </div>\n        ").concat(diagnostic.documentation ? '<div>\uD83D\uDCDD <a style="color: violet" href="'.concat(diagnostic.documentation, '" target="_blank">Learn more</a></div>') : "", "\n      </div>\n    ");
          }
      } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
      } finally{
          try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                  _iterator.return();
              }
          } finally{
              if (_didIteratorError) {
                  throw _iteratorError;
              }
          }
      }
      errorHTML += "</div>";
      overlay.innerHTML = errorHTML;
      return overlay;
  }
  function fullReload() {
      if ("reload" in location) location.reload();
      else if (extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
  }
  function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
      var modules = bundle.modules;
      if (!modules) return [];
      var parents = [];
      var k, d, dep;
      for(k in modules)for(d in modules[k][1]){
          dep = modules[k][1][d];
          if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
              bundle,
              k
          ]);
      }
      if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
      return parents;
  }
  function updateLink(link) {
      var href = link.getAttribute("href");
      if (!href) return;
      var newLink = link.cloneNode();
      newLink.onload = function() {
          if (link.parentNode !== null) // $FlowFixMe
          link.parentNode.removeChild(link);
      };
      newLink.setAttribute("href", // $FlowFixMe
      href.split("?")[0] + "?" + Date.now());
      // $FlowFixMe
      link.parentNode.insertBefore(newLink, link.nextSibling);
  }
  var cssTimeout = null;
  function reloadCSS() {
      if (cssTimeout) return;
      cssTimeout = setTimeout(function() {
          var links = document.querySelectorAll('link[rel="stylesheet"]');
          for(var i = 0; i < links.length; i++){
              // $FlowFixMe[incompatible-type]
              var href /*: string */  = links[i].getAttribute("href");
              var hostname = getHostname();
              var servedFromHMRServer = hostname === "localhost" ? new RegExp("^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):" + getPort()).test(href) : href.indexOf(hostname + ":" + getPort());
              var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
              if (!absolute) updateLink(links[i]);
          }
          cssTimeout = null;
      }, 50);
  }
  function hmrDownload(asset) {
      if (asset.type === "js") {
          if (typeof document !== "undefined") {
              var script = document.createElement("script");
              script.src = asset.url + "?t=" + Date.now();
              if (asset.outputFormat === "esmodule") script.type = "module";
              return new Promise(function(resolve, reject) {
                  var _document$head;
                  script.onload = function() {
                      return resolve(script);
                  };
                  script.onerror = reject;
                  (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
              });
          } else if (typeof importScripts === "function") {
              // Worker scripts
              if (asset.outputFormat === "esmodule") return import(asset.url + "?t=" + Date.now());
              else return new Promise(function(resolve, reject) {
                  try {
                      importScripts(asset.url + "?t=" + Date.now());
                      resolve();
                  } catch (err) {
                      reject(err);
                  }
              });
          }
      }
  }
  function hmrApplyUpdates(assets) {
      return _hmrApplyUpdates.apply(this, arguments);
  }
  function _hmrApplyUpdates() {
      _hmrApplyUpdates = (0, _asyncToGenerator._)(function(assets) {
          var scriptsToRemove, promises;
          return (0, _tsGenerator._)(this, function(_state) {
              switch(_state.label){
                  case 0:
                      global.parcelHotUpdate = Object.create(null);
                      _state.label = 1;
                  case 1:
                      _state.trys.push([
                          1,
                          ,
                          4,
                          5
                      ]);
                      if (!!supportsSourceURL) return [
                          3,
                          3
                      ];
                      promises = assets.map(function(asset) {
                          var _hmrDownload;
                          return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch(function(err) {
                              // Web extension fix
                              if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3 && typeof ServiceWorkerGlobalScope != "undefined" && global instanceof ServiceWorkerGlobalScope) {
                                  extCtx.runtime.reload();
                                  return;
                              }
                              throw err;
                          });
                      });
                      return [
                          4,
                          Promise.all(promises)
                      ];
                  case 2:
                      scriptsToRemove = _state.sent();
                      _state.label = 3;
                  case 3:
                      assets.forEach(function(asset) {
                          hmrApply(module.bundle.root, asset);
                      });
                      return [
                          3,
                          5
                      ];
                  case 4:
                      delete global.parcelHotUpdate;
                      if (scriptsToRemove) scriptsToRemove.forEach(function(script) {
                          if (script) {
                              var _document$head2;
                              (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
                          }
                      });
                      return [
                          7
                      ];
                  case 5:
                      return [
                          2
                      ];
              }
          });
      });
      return _hmrApplyUpdates.apply(this, arguments);
  }
  function hmrApply(bundle /*: ParcelRequire */ , asset /*:  HMRAsset */ ) {
      var modules = bundle.modules;
      if (!modules) return;
      if (asset.type === "css") reloadCSS();
      else if (asset.type === "js") {
          var deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
          if (deps) {
              if (modules[asset.id]) {
                  // Remove dependencies that are removed and will become orphaned.
                  // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                  var oldDeps = modules[asset.id][1];
                  for(var dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                      var id = oldDeps[dep];
                      var parents = getParents(module.bundle.root, id);
                      if (parents.length === 1) hmrDelete(module.bundle.root, id);
                  }
              }
              if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
              // support for source maps is better with eval.
              (0, eval)(asset.output);
              // $FlowFixMe
              var fn = global.parcelHotUpdate[asset.id];
              modules[asset.id] = [
                  fn,
                  deps
              ];
          } else if (bundle.parent) hmrApply(bundle.parent, asset);
      }
  }
  function hmrDelete(bundle, id) {
      var modules = bundle.modules;
      if (!modules) return;
      if (modules[id]) {
          // Collect dependencies that will become orphaned when this module is deleted.
          var deps = modules[id][1];
          var orphans = [];
          for(var dep in deps){
              var parents = getParents(module.bundle.root, deps[dep]);
              if (parents.length === 1) orphans.push(deps[dep]);
          }
          // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
          delete modules[id];
          delete bundle.cache[id];
          // Now delete the orphans.
          orphans.forEach(function(id) {
              hmrDelete(module.bundle.root, id);
          });
      } else if (bundle.parent) hmrDelete(bundle.parent, id);
  }
  function hmrAcceptCheck(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
      if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
      // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
      var parents = getParents(module.bundle.root, id);
      var accepted = false;
      while(parents.length > 0){
          var v = parents.shift();
          var a = hmrAcceptCheckOne(v[0], v[1], null);
          if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
          accepted = true;
          else {
              var _parents;
              // Otherwise, queue the parents in the next level upward.
              var p = getParents(module.bundle.root, v[1]);
              if (p.length === 0) {
                  // If there are no parents, then we've reached an entry without accepting. Reload.
                  accepted = false;
                  break;
              }
              (_parents = parents).push.apply(_parents, (0, _toConsumableArray._)(p));
          }
      }
      return accepted;
  }
  function hmrAcceptCheckOne(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
      var modules = bundle.modules;
      if (!modules) return;
      if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
          // If we reached the root bundle without finding where the asset should go,
          // there's nothing to do. Mark as "accepted" so we don't reload the page.
          if (!bundle.parent) return true;
          return hmrAcceptCheck(bundle.parent, id, depsByBundle);
      }
      if (checkedAssets[id]) return true;
      checkedAssets[id] = true;
      var cached = bundle.cache[id];
      assetsToDispose.push([
          bundle,
          id
      ]);
      if (!cached || cached.hot && cached.hot._acceptCallbacks.length) {
          assetsToAccept.push([
              bundle,
              id
          ]);
          return true;
      }
  }
  function hmrDispose(bundle /*: ParcelRequire */ , id /*: string */ ) {
      var cached = bundle.cache[id];
      bundle.hotData[id] = {};
      if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
      if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
          cb(bundle.hotData[id]);
      });
      delete bundle.cache[id];
  }
  function hmrAccept(bundle /*: ParcelRequire */ , id /*: string */ ) {
      // Execute the module.
      bundle(id);
      // Run the accept callbacks in the new version of the module.
      var cached = bundle.cache[id];
      if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
          var assetsToAlsoAccept = cb(function() {
              return getParents(module.bundle.root, id);
          });
          if (assetsToAlsoAccept && assetsToAccept.length) {
              assetsToAlsoAccept.forEach(function(a) {
                  hmrDispose(a[0], a[1]);
              });
              // $FlowFixMe[method-unbinding]
              assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
          }
      });
  }
  
  },{"@swc/helpers/_/_async_to_generator":"a2tTA","@swc/helpers/_/_to_consumable_array":"4dFHj","@swc/helpers/_/_ts_generator":"e8qPT"}],"a2tTA":[function(require,module,exports) {
  var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
  parcelHelpers.defineInteropFlag(exports);
  parcelHelpers.export(exports, "_async_to_generator", function() {
      return _async_to_generator;
  });
  parcelHelpers.export(exports, "_", function() {
      return _async_to_generator;
  });
  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
      try {
          var info = gen[key](arg);
          var value = info.value;
      } catch (error) {
          reject(error);
          return;
      }
      if (info.done) resolve(value);
      else Promise.resolve(value).then(_next, _throw);
  }
  function _async_to_generator(fn) {
      return function() {
          var self = this, args = arguments;
          return new Promise(function(resolve, reject) {
              var gen = fn.apply(self, args);
              function _next(value) {
                  asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
              }
              function _throw(err) {
                  asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
              }
              _next(undefined);
          });
      };
  }
  
  },{"@parcel/transformer-js/src/esmodule-helpers.js":"2NZKO"}],"2NZKO":[function(require,module,exports) {
  exports.interopDefault = function(a) {
      return a && a.__esModule ? a : {
          default: a
      };
  };
  exports.defineInteropFlag = function(a) {
      Object.defineProperty(a, "__esModule", {
          value: true
      });
  };
  exports.exportAll = function(source, dest) {
      Object.keys(source).forEach(function(key) {
          if (key === "default" || key === "__esModule" || Object.prototype.hasOwnProperty.call(dest, key)) return;
          Object.defineProperty(dest, key, {
              enumerable: true,
              get: function get() {
                  return source[key];
              }
          });
      });
      return dest;
  };
  exports.export = function(dest, destName, get) {
      Object.defineProperty(dest, destName, {
          enumerable: true,
          get: get
      });
  };
  
  },{}],"4dFHj":[function(require,module,exports) {
  var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
  parcelHelpers.defineInteropFlag(exports);
  parcelHelpers.export(exports, "_to_consumable_array", function() {
      return _to_consumable_array;
  });
  parcelHelpers.export(exports, "_", function() {
      return _to_consumable_array;
  });
  var _arrayWithoutHolesJs = require("./_array_without_holes.js");
  var _iterableToArrayJs = require("./_iterable_to_array.js");
  var _nonIterableSpreadJs = require("./_non_iterable_spread.js");
  var _unsupportedIterableToArrayJs = require("./_unsupported_iterable_to_array.js");
  function _to_consumable_array(arr) {
      return (0, _arrayWithoutHolesJs._array_without_holes)(arr) || (0, _iterableToArrayJs._iterable_to_array)(arr) || (0, _unsupportedIterableToArrayJs._unsupported_iterable_to_array)(arr) || (0, _nonIterableSpreadJs._non_iterable_spread)();
  }
  
  },{"./_array_without_holes.js":"7nfXn","./_iterable_to_array.js":"5t3J3","./_non_iterable_spread.js":"gyfCc","./_unsupported_iterable_to_array.js":"gOnc7","@parcel/transformer-js/src/esmodule-helpers.js":"2NZKO"}],"7nfXn":[function(require,module,exports) {
  var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
  parcelHelpers.defineInteropFlag(exports);
  parcelHelpers.export(exports, "_array_without_holes", function() {
      return _array_without_holes;
  });
  parcelHelpers.export(exports, "_", function() {
      return _array_without_holes;
  });
  var _arrayLikeToArrayJs = require("./_array_like_to_array.js");
  function _array_without_holes(arr) {
      if (Array.isArray(arr)) return (0, _arrayLikeToArrayJs._array_like_to_array)(arr);
  }
  
  },{"./_array_like_to_array.js":"auwqJ","@parcel/transformer-js/src/esmodule-helpers.js":"2NZKO"}],"auwqJ":[function(require,module,exports) {
  var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
  parcelHelpers.defineInteropFlag(exports);
  parcelHelpers.export(exports, "_array_like_to_array", function() {
      return _array_like_to_array;
  });
  parcelHelpers.export(exports, "_", function() {
      return _array_like_to_array;
  });
  function _array_like_to_array(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
      for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
      return arr2;
  }
  
  },{"@parcel/transformer-js/src/esmodule-helpers.js":"2NZKO"}],"5t3J3":[function(require,module,exports) {
  var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
  parcelHelpers.defineInteropFlag(exports);
  parcelHelpers.export(exports, "_iterable_to_array", function() {
      return _iterable_to_array;
  });
  parcelHelpers.export(exports, "_", function() {
      return _iterable_to_array;
  });
  function _iterable_to_array(iter) {
      if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }
  
  },{"@parcel/transformer-js/src/esmodule-helpers.js":"2NZKO"}],"gyfCc":[function(require,module,exports) {
  var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
  parcelHelpers.defineInteropFlag(exports);
  parcelHelpers.export(exports, "_non_iterable_spread", function() {
      return _non_iterable_spread;
  });
  parcelHelpers.export(exports, "_", function() {
      return _non_iterable_spread;
  });
  function _non_iterable_spread() {
      throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  
  },{"@parcel/transformer-js/src/esmodule-helpers.js":"2NZKO"}],"gOnc7":[function(require,module,exports) {
  var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
  parcelHelpers.defineInteropFlag(exports);
  parcelHelpers.export(exports, "_unsupported_iterable_to_array", function() {
      return _unsupported_iterable_to_array;
  });
  parcelHelpers.export(exports, "_", function() {
      return _unsupported_iterable_to_array;
  });
  var _arrayLikeToArrayJs = require("./_array_like_to_array.js");
  function _unsupported_iterable_to_array(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return (0, _arrayLikeToArrayJs._array_like_to_array)(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(n);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return (0, _arrayLikeToArrayJs._array_like_to_array)(o, minLen);
  }
  
  },{"./_array_like_to_array.js":"auwqJ","@parcel/transformer-js/src/esmodule-helpers.js":"2NZKO"}],"e8qPT":[function(require,module,exports) {
  var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
  parcelHelpers.defineInteropFlag(exports);
  parcelHelpers.export(exports, "_", function() {
      return 0, _tslib.__generator;
  });
  parcelHelpers.export(exports, "_ts_generator", function() {
      return 0, _tslib.__generator;
  });
  var _tslib = require("tslib");
  
  },{"tslib":"1XoWm","@parcel/transformer-js/src/esmodule-helpers.js":"2NZKO"}],"1XoWm":[function(require,module,exports) {
  /******************************************************************************
  Copyright (c) Microsoft Corporation.
  
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */ /* global Reflect, Promise, SuppressedError, Symbol */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
  parcelHelpers.defineInteropFlag(exports);
  parcelHelpers.export(exports, "__extends", function() {
      return __extends;
  });
  parcelHelpers.export(exports, "__assign", function() {
      return __assign;
  });
  parcelHelpers.export(exports, "__rest", function() {
      return __rest;
  });
  parcelHelpers.export(exports, "__decorate", function() {
      return __decorate;
  });
  parcelHelpers.export(exports, "__param", function() {
      return __param;
  });
  parcelHelpers.export(exports, "__esDecorate", function() {
      return __esDecorate;
  });
  parcelHelpers.export(exports, "__runInitializers", function() {
      return __runInitializers;
  });
  parcelHelpers.export(exports, "__propKey", function() {
      return __propKey;
  });
  parcelHelpers.export(exports, "__setFunctionName", function() {
      return __setFunctionName;
  });
  parcelHelpers.export(exports, "__metadata", function() {
      return __metadata;
  });
  parcelHelpers.export(exports, "__awaiter", function() {
      return __awaiter;
  });
  parcelHelpers.export(exports, "__generator", function() {
      return __generator;
  });
  parcelHelpers.export(exports, "__createBinding", function() {
      return __createBinding;
  });
  parcelHelpers.export(exports, "__exportStar", function() {
      return __exportStar;
  });
  parcelHelpers.export(exports, "__values", function() {
      return __values;
  });
  parcelHelpers.export(exports, "__read", function() {
      return __read;
  });
  /** @deprecated */ parcelHelpers.export(exports, "__spread", function() {
      return __spread;
  });
  /** @deprecated */ parcelHelpers.export(exports, "__spreadArrays", function() {
      return __spreadArrays;
  });
  parcelHelpers.export(exports, "__spreadArray", function() {
      return __spreadArray;
  });
  parcelHelpers.export(exports, "__await", function() {
      return __await;
  });
  parcelHelpers.export(exports, "__asyncGenerator", function() {
      return __asyncGenerator;
  });
  parcelHelpers.export(exports, "__asyncDelegator", function() {
      return __asyncDelegator;
  });
  parcelHelpers.export(exports, "__asyncValues", function() {
      return __asyncValues;
  });
  parcelHelpers.export(exports, "__makeTemplateObject", function() {
      return __makeTemplateObject;
  });
  parcelHelpers.export(exports, "__importStar", function() {
      return __importStar;
  });
  parcelHelpers.export(exports, "__importDefault", function() {
      return __importDefault;
  });
  parcelHelpers.export(exports, "__classPrivateFieldGet", function() {
      return __classPrivateFieldGet;
  });
  parcelHelpers.export(exports, "__classPrivateFieldSet", function() {
      return __classPrivateFieldSet;
  });
  parcelHelpers.export(exports, "__classPrivateFieldIn", function() {
      return __classPrivateFieldIn;
  });
  parcelHelpers.export(exports, "__addDisposableResource", function() {
      return __addDisposableResource;
  });
  parcelHelpers.export(exports, "__disposeResources", function() {
      return __disposeResources;
  });
  var _typeOf = require("@swc/helpers/_/_type_of");
  var extendStatics = function extendStatics1(d, b) {
      extendStatics = Object.setPrototypeOf || ({
          __proto__: []
      }) instanceof Array && function(d, b) {
          d.__proto__ = b;
      } || function(d, b) {
          for(var p in b)if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      };
      return extendStatics(d, b);
  };
  function __extends(d, b) {
      if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
          this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }
  var __assign = function __assign1() {
      __assign = Object.assign || function __assign(t) {
          for(var s, i = 1, n = arguments.length; i < n; i++){
              s = arguments[i];
              for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
      };
      return __assign.apply(this, arguments);
  };
  function __rest(s, e) {
      var t = {};
      for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === "function") {
          for(var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++)if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
      }
      return t;
  }
  function __decorate(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
  }
  function __param(paramIndex, decorator) {
      return function(target, key) {
          decorator(target, key, paramIndex);
      };
  }
  function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
      function accept(f) {
          if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
          return f;
      }
      var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
      var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
      var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
      var _, done = false;
      for(var i = decorators.length - 1; i >= 0; i--){
          var context = {};
          for(var p in contextIn)context[p] = p === "access" ? {} : contextIn[p];
          for(var p in contextIn.access)context.access[p] = contextIn.access[p];
          context.addInitializer = function(f) {
              if (done) throw new TypeError("Cannot add initializers after decoration has completed");
              extraInitializers.push(accept(f || null));
          };
          var result = (0, decorators[i])(kind === "accessor" ? {
              get: descriptor.get,
              set: descriptor.set
          } : descriptor[key], context);
          if (kind === "accessor") {
              if (result === void 0) continue;
              if (result === null || typeof result !== "object") throw new TypeError("Object expected");
              if (_ = accept(result.get)) descriptor.get = _;
              if (_ = accept(result.set)) descriptor.set = _;
              if (_ = accept(result.init)) initializers.unshift(_);
          } else if (_ = accept(result)) {
              if (kind === "field") initializers.unshift(_);
              else descriptor[key] = _;
          }
      }
      if (target) Object.defineProperty(target, contextIn.name, descriptor);
      done = true;
  }
  function __runInitializers(thisArg, initializers, value) {
      var useValue = arguments.length > 2;
      for(var i = 0; i < initializers.length; i++)value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
      return useValue ? value : void 0;
  }
  function __propKey(x) {
      return (typeof x === "undefined" ? "undefined" : (0, _typeOf._)(x)) === "symbol" ? x : "".concat(x);
  }
  function __setFunctionName(f, name, prefix) {
      if ((typeof name === "undefined" ? "undefined" : (0, _typeOf._)(name)) === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
      return Object.defineProperty(f, "name", {
          configurable: true,
          value: prefix ? "".concat(prefix, " ", name) : name
      });
  }
  function __metadata(metadataKey, metadataValue) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
  }
  function __awaiter(thisArg, _arguments, P, generator) {
      function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
              resolve(value);
          });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
              try {
                  step(generator.next(value));
              } catch (e) {
                  reject(e);
              }
          }
          function rejected(value) {
              try {
                  step(generator["throw"](value));
              } catch (e) {
                  reject(e);
              }
          }
          function step(result) {
              result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  }
  function __generator(thisArg, body) {
      var _ = {
          label: 0,
          sent: function sent() {
              if (t[0] & 1) throw t[1];
              return t[1];
          },
          trys: [],
          ops: []
      }, f, y, t, g;
      return g = {
          next: verb(0),
          "throw": verb(1),
          "return": verb(2)
      }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
          return this;
      }), g;
      function verb(n) {
          return function(v) {
              return step([
                  n,
                  v
              ]);
          };
      }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while(g && (g = 0, op[0] && (_ = 0)), _)try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [
                  op[0] & 2,
                  t.value
              ];
              switch(op[0]){
                  case 0:
                  case 1:
                      t = op;
                      break;
                  case 4:
                      _.label++;
                      return {
                          value: op[1],
                          done: false
                      };
                  case 5:
                      _.label++;
                      y = op[1];
                      op = [
                          0
                      ];
                      continue;
                  case 7:
                      op = _.ops.pop();
                      _.trys.pop();
                      continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                          _ = 0;
                          continue;
                      }
                      if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                          _.label = op[1];
                          break;
                      }
                      if (op[0] === 6 && _.label < t[1]) {
                          _.label = t[1];
                          t = op;
                          break;
                      }
                      if (t && _.label < t[2]) {
                          _.label = t[2];
                          _.ops.push(op);
                          break;
                      }
                      if (t[2]) _.ops.pop();
                      _.trys.pop();
                      continue;
              }
              op = body.call(thisArg, _);
          } catch (e) {
              op = [
                  6,
                  e
              ];
              y = 0;
          } finally{
              f = t = 0;
          }
          if (op[0] & 5) throw op[1];
          return {
              value: op[0] ? op[1] : void 0,
              done: true
          };
      }
  }
  var __createBinding = Object.create ? function __createBinding(o, m, k, k2) {
      if (k2 === undefined) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
          enumerable: true,
          get: function get() {
              return m[k];
          }
      };
      Object.defineProperty(o, k2, desc);
  } : function(o, m, k, k2) {
      if (k2 === undefined) k2 = k;
      o[k2] = m[k];
  };
  function __exportStar(m, o) {
      for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
  }
  function __values(o) {
      var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
      if (m) return m.call(o);
      if (o && typeof o.length === "number") return {
          next: function next() {
              if (o && i >= o.length) o = void 0;
              return {
                  value: o && o[i++],
                  done: !o
              };
          }
      };
      throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  }
  function __read(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m) return o;
      var i = m.call(o), r, ar = [], e;
      try {
          while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
      } catch (error) {
          e = {
              error: error
          };
      } finally{
          try {
              if (r && !r.done && (m = i["return"])) m.call(i);
          } finally{
              if (e) throw e.error;
          }
      }
      return ar;
  }
  function __spread() {
      for(var ar = [], i = 0; i < arguments.length; i++)ar = ar.concat(__read(arguments[i]));
      return ar;
  }
  function __spreadArrays() {
      for(var s = 0, i = 0, il = arguments.length; i < il; i++)s += arguments[i].length;
      for(var r = Array(s), k = 0, i = 0; i < il; i++)for(var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)r[k] = a[j];
      return r;
  }
  function __spreadArray(to, from, pack) {
      if (pack || arguments.length === 2) {
          for(var i = 0, l = from.length, ar; i < l; i++)if (ar || !(i in from)) {
              if (!ar) ar = Array.prototype.slice.call(from, 0, i);
              ar[i] = from[i];
          }
      }
      return to.concat(ar || Array.prototype.slice.call(from));
  }
  function __await(v) {
      return this instanceof __await ? (this.v = v, this) : new __await(v);
  }
  function __asyncGenerator(thisArg, _arguments, generator) {
      if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
      var g = generator.apply(thisArg, _arguments || []), i, q = [];
      return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
          return this;
      }, i;
      function verb(n) {
          if (g[n]) i[n] = function(v) {
              return new Promise(function(a, b) {
                  q.push([
                      n,
                      v,
                      a,
                      b
                  ]) > 1 || resume(n, v);
              });
          };
      }
      function resume(n, v) {
          try {
              step(g[n](v));
          } catch (e) {
              settle(q[0][3], e);
          }
      }
      function step(r) {
          r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
      }
      function fulfill(value) {
          resume("next", value);
      }
      function reject(value) {
          resume("throw", value);
      }
      function settle(f, v) {
          if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
      }
  }
  function __asyncDelegator(o) {
      var i, p;
      return i = {}, verb("next"), verb("throw", function(e) {
          throw e;
      }), verb("return"), i[Symbol.iterator] = function() {
          return this;
      }, i;
      function verb(n, f) {
          i[n] = o[n] ? function(v) {
              return (p = !p) ? {
                  value: __await(o[n](v)),
                  done: false
              } : f ? f(v) : v;
          } : f;
      }
  }
  function __asyncValues(o) {
      if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
      var m = o[Symbol.asyncIterator], i;
      return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
          return this;
      }, i);
      function verb(n) {
          i[n] = o[n] && function(v) {
              return new Promise(function(resolve, reject) {
                  v = o[n](v), settle(resolve, reject, v.done, v.value);
              });
          };
      }
      function settle(resolve, reject, d, v) {
          Promise.resolve(v).then(function(v) {
              resolve({
                  value: v,
                  done: d
              });
          }, reject);
      }
  }
  function __makeTemplateObject(cooked, raw) {
      if (Object.defineProperty) Object.defineProperty(cooked, "raw", {
          value: raw
      });
      else cooked.raw = raw;
      return cooked;
  }
  var __setModuleDefault = Object.create ? function __setModuleDefault(o, v) {
      Object.defineProperty(o, "default", {
          enumerable: true,
          value: v
      });
  } : function(o, v) {
      o["default"] = v;
  };
  function __importStar(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
          for(var k in mod)if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
  }
  function __importDefault(mod) {
      return mod && mod.__esModule ? mod : {
          default: mod
      };
  }
  function __classPrivateFieldGet(receiver, state, kind, f) {
      if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
  }
  function __classPrivateFieldSet(receiver, state, value, kind, f) {
      if (kind === "m") throw new TypeError("Private method is not writable");
      if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
      return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
  }
  function __classPrivateFieldIn(state, receiver) {
      if (receiver === null || typeof receiver !== "object" && typeof receiver !== "function") throw new TypeError("Cannot use 'in' operator on non-object");
      return typeof state === "function" ? receiver === state : state.has(receiver);
  }
  function __addDisposableResource(env, value, async) {
      if (value !== null && value !== void 0) {
          if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
          var dispose;
          if (async) {
              if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
              dispose = value[Symbol.asyncDispose];
          }
          if (dispose === void 0) {
              if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
              dispose = value[Symbol.dispose];
          }
          if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
          env.stack.push({
              value: value,
              dispose: dispose,
              async: async
          });
      } else if (async) env.stack.push({
          async: true
      });
      return value;
  }
  var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function _SuppressedError(error, suppressed, message) {
      var e = new Error(message);
      return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
  };
  function __disposeResources(env) {
      function fail(e) {
          env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
          env.hasError = true;
      }
      function next() {
          while(env.stack.length){
              var rec = env.stack.pop();
              try {
                  var result = rec.dispose && rec.dispose.call(rec.value);
                  if (rec.async) return Promise.resolve(result).then(next, function(e) {
                      fail(e);
                      return next();
                  });
              } catch (e) {
                  fail(e);
              }
          }
          if (env.hasError) throw env.error;
      }
      return next();
  }
  exports.default = {
      __extends: __extends,
      __assign: __assign,
      __rest: __rest,
      __decorate: __decorate,
      __param: __param,
      __metadata: __metadata,
      __awaiter: __awaiter,
      __generator: __generator,
      __createBinding: __createBinding,
      __exportStar: __exportStar,
      __values: __values,
      __read: __read,
      __spread: __spread,
      __spreadArrays: __spreadArrays,
      __spreadArray: __spreadArray,
      __await: __await,
      __asyncGenerator: __asyncGenerator,
      __asyncDelegator: __asyncDelegator,
      __asyncValues: __asyncValues,
      __makeTemplateObject: __makeTemplateObject,
      __importStar: __importStar,
      __importDefault: __importDefault,
      __classPrivateFieldGet: __classPrivateFieldGet,
      __classPrivateFieldSet: __classPrivateFieldSet,
      __classPrivateFieldIn: __classPrivateFieldIn,
      __addDisposableResource: __addDisposableResource,
      __disposeResources: __disposeResources
  };
  
  },{"@swc/helpers/_/_type_of":"3Q4xq","@parcel/transformer-js/src/esmodule-helpers.js":"2NZKO"}],"3Q4xq":[function(require,module,exports) {
  var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
  parcelHelpers.defineInteropFlag(exports);
  parcelHelpers.export(exports, "_type_of", function() {
      return _type_of;
  });
  parcelHelpers.export(exports, "_", function() {
      return _type_of;
  });
  function _type_of(obj) {
      "@swc/helpers - typeof";
      return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  }
  
  },{"@parcel/transformer-js/src/esmodule-helpers.js":"2NZKO"}],"6yA8v":[function(require,module,exports) {
  var _asyncToGenerator = require("@swc/helpers/_/_async_to_generator");
  var _tsGenerator = require("@swc/helpers/_/_ts_generator");
  "use strict";
  var _vanillaJsMethods = _interopRequireDefault(require("6ba0c6d66fd65522"));
  function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
          default: obj
      };
  }
  var utils = require("a4845971b20edc77");
  function plugin(source) {
      return _plugin.apply(this, arguments);
  }
  function _plugin() {
      _plugin = (0, _asyncToGenerator._)(function(source) {
          var methods, generatedMethods, formattedOutput;
          return (0, _tsGenerator._)(this, function(_state) {
              switch(_state.label){
                  case 0:
                      console.log("alljQueryMethods", source);
                      return [
                          4,
                          utils.getJQueryMethodsFromSource(source)
                      ];
                  case 1:
                      methods = _state.sent();
                      console.log("methods", methods);
                      console.log("methodsFilesssssData", _vanillaJsMethods.default);
                      return [
                          4,
                          utils.generateAlternativeMethods(methods, _vanillaJsMethods.default)
                      ];
                  case 2:
                      generatedMethods = _state.sent();
                      console.log("generatedMethods", generatedMethods);
                      return [
                          4,
                          prettier.format(generatedMethods.data, {
                              parser: "babel",
                              tabWidth: 4,
                              plugins: prettierPlugins,
                              singleQuote: true
                          })
                      ];
                  case 3:
                      formattedOutput = _state.sent();
                      return [
                          2,
                          formattedOutput
                      ];
              }
          });
      });
      return _plugin.apply(this, arguments);
  }
  window.ReplaceJquery = plugin;
  
  },{"a4845971b20edc77":"8cFoE","@swc/helpers/_/_async_to_generator":"a2tTA","@swc/helpers/_/_ts_generator":"e8qPT","6ba0c6d66fd65522":"96IJQ"}],"8cFoE":[function(require,module,exports) {
  var _asyncToGenerator = require("@swc/helpers/_/_async_to_generator");
  var _toConsumableArray = require("@swc/helpers/_/_to_consumable_array");
  var _tsGenerator = require("@swc/helpers/_/_ts_generator");
  "use strict";
  var espree = require("57432a276380c1da");
  var estraverse = require("786c66cdf4aad6d6");
  var alljQueryMethods = require("ed9256de0610716");
  function traverse(node) {
      while(node)switch(node.type){
          case "CallExpression":
              node = node.callee;
              break;
          case "MemberExpression":
              if (node.object.type === "ThisExpression") return node.property;
              node = node.object;
              break;
          case "Identifier":
              return node;
          default:
              return null;
      }
  } // Detect jQuery methods
  // @tod Add an option to pass regex for finding jQuery methods
  function isjQuery(node) {
      var id = traverse(node);
      return id && new RegExp("^\\$.").test(id && id.name) || [
          "$",
          "jQuery"
      ].includes(id && id.name);
  }
  function getAST(data) {
      return espree.parse(data, {
          ecmaVersion: 2021,
          sourceType: "module",
          comment: true
      });
  }
  function getDependedMethods(methodsFileData, baseMethods, generatedMethods, lineRef, outputStart, outputEnd) {
      return _getDependedMethods.apply(this, arguments);
  }
  function _getDependedMethods() {
      _getDependedMethods = (0, _asyncToGenerator._)(function(methodsFileData, baseMethods, generatedMethods, lineRef, outputStart, outputEnd) {
          var outputAst, dependedMethods, uniqueDependedMethods, methodsData, allMethods, remainingMethodData;
          return (0, _tsGenerator._)(this, function(_state) {
              switch(_state.label){
                  case 0:
                      outputAst = getAST(outputStart + baseMethods + outputEnd);
                      dependedMethods = [];
                      estraverse.traverse(outputAst, {
                          enter: function(node) {
                              if (node.callee && node.callee.type === "MemberExpression") {
                                  var methodName = node.callee.property.name;
                                  if ((node.callee.object.type === "ThisExpression" || node.callee.object.type === "Identifier") && generatedMethods.indexOf(methodName) < 0) dependedMethods.push(node.callee.property.name);
                              }
                          }
                      });
                      uniqueDependedMethods = (0, _toConsumableArray._)(new Set(dependedMethods));
                      methodsData = "";
                      uniqueDependedMethods.forEach(function(method) {
                          if (lineRef[method] && lineRef[method].range) methodsData += methodsFileData.substring(lineRef[method].range.start, lineRef[method].range.end);
                      });
                      allMethods = (0, _toConsumableArray._)(generatedMethods).concat((0, _toConsumableArray._)(uniqueDependedMethods));
                      if (!uniqueDependedMethods.length) return [
                          3,
                          2
                      ];
                      return [
                          4,
                          getDependedMethods(methodsFileData, baseMethods + methodsData, allMethods, lineRef, outputStart, outputEnd)
                      ];
                  case 1:
                      remainingMethodData = _state.sent();
                      methodsData += remainingMethodData.methodsData;
                      allMethods = (0, _toConsumableArray._)(allMethods).concat([
                          remainingMethodData.allMethods
                      ]);
                      _state.label = 2;
                  case 2:
                      return [
                          2,
                          {
                              methodsData: methodsData,
                              allMethods: allMethods
                          }
                      ];
              }
          });
      });
      return _getDependedMethods.apply(this, arguments);
  }
  var getTemplateData = function(data, astMethods) {
      var templateLines = {
          start: 0,
          end: 0
      };
      astMethods.comments.forEach(function(comment) {
          if (comment.type === "Block") {
              if (comment.value.includes("$$ Template START $$")) templateLines.start = comment.start;
              else if (comment.value.includes("$$ Template END $$")) templateLines.end = comment.end;
          }
      });
      var outputStart = data.substring(0, templateLines.start);
      var outputEnd = data.substring(templateLines.end, data.length);
      return {
          outputStart: outputStart,
          outputEnd: outputEnd
      };
  };
  function generateAlternativeMethods(methodsToGenerate, methodsFileData) {
      return _generateAlternativeMethods.apply(this, arguments);
  }
  function _generateAlternativeMethods() {
      _generateAlternativeMethods = (0, _asyncToGenerator._)(function(methodsToGenerate, methodsFileData) {
          var lineRef, astMethods, remainingMethods, baseMethods, _getTemplateData, outputStart, outputEnd, remainingMethodData;
          return (0, _tsGenerator._)(this, function(_state) {
              switch(_state.label){
                  case 0:
                      lineRef = {};
                      astMethods = getAST(methodsFileData);
                      estraverse.traverse(astMethods, {
                          enter: function(node) {
                              if (node.type === "MethodDefinition") {
                                  lineRef[node.key.name] = {
                                      name: node.key.name,
                                      range: {
                                          start: node.start,
                                          end: node.end
                                      }
                                  };
                                  return estraverse.VisitorOption.Skip;
                              }
                          }
                      });
                      remainingMethods = [];
                      baseMethods = "";
                      methodsToGenerate.forEach(function(method) {
                          if (lineRef[method]) baseMethods += methodsFileData.substring(lineRef[method].range.start, lineRef[method].range.end);
                          else remainingMethods.push(method);
                      });
                      _getTemplateData = getTemplateData(methodsFileData, astMethods), outputStart = _getTemplateData.outputStart, outputEnd = _getTemplateData.outputEnd;
                      return [
                          4,
                          getDependedMethods(methodsFileData, baseMethods, methodsToGenerate, lineRef, outputStart, outputEnd)
                      ];
                  case 1:
                      remainingMethodData = _state.sent();
                      return [
                          2,
                          {
                              data: outputStart + baseMethods + remainingMethodData.methodsData + outputEnd,
                              remainingMethods: remainingMethods
                          }
                      ];
              }
          });
      });
      return _generateAlternativeMethods.apply(this, arguments);
  }
  function getJQueryMethodsFromSource(data) {
      return _getJQueryMethodsFromSource.apply(this, arguments);
  }
  function _getJQueryMethodsFromSource() {
      _getJQueryMethodsFromSource = (0, _asyncToGenerator._)(function(data) {
          var ast, jQFns, jQFnsSet, alljQMethodsSet, intersection;
          return (0, _tsGenerator._)(this, function(_state) {
              ast = getAST(data);
              jQFns = [];
              estraverse.traverse(ast, {
                  enter: function(node) {
                      if (node.callee && node.callee.type === "MemberExpression") {
                          if (isjQuery(node)) jQFns.push(node.callee.property.name);
                      }
                  }
              });
              jQFnsSet = new Set(jQFns);
              alljQMethodsSet = new Set(alljQueryMethods);
              intersection = new Set((0, _toConsumableArray._)(jQFnsSet).filter(function(method) {
                  return alljQMethodsSet.has(method);
              }));
              return [
                  2,
                  (0, _toConsumableArray._)(intersection)
              ];
          });
      });
      return _getJQueryMethodsFromSource.apply(this, arguments);
  }
  module.exports = {
      traverse: traverse,
      isjQuery: isjQuery,
      getAST: getAST,
      generateAlternativeMethods: generateAlternativeMethods,
      getJQueryMethodsFromSource: getJQueryMethodsFromSource
  };
  
  },{"@swc/helpers/_/_async_to_generator":"a2tTA","@swc/helpers/_/_to_consumable_array":"4dFHj","@swc/helpers/_/_ts_generator":"e8qPT","57432a276380c1da":"7sdWN","786c66cdf4aad6d6":"iLUIn","ed9256de0610716":"fWcW3"}],"7sdWN":[function(require,module,exports) {
  /**
   * @fileoverview Main Espree file that converts Acorn into Esprima output.
   *
   * This file contains code from the following MIT-licensed projects:
   * 1. Acorn
   * 2. Babylon
   * 3. Babel-ESLint
   *
   * This file also contains code from Esprima, which is BSD licensed.
   *
   * Acorn is Copyright 2012-2015 Acorn Contributors (https://github.com/marijnh/acorn/blob/master/AUTHORS)
   * Babylon is Copyright 2014-2015 various contributors (https://github.com/babel/babel/blob/master/packages/babylon/AUTHORS)
   * Babel-ESLint is Copyright 2014-2015 Sebastian McKenzie <sebmck@gmail.com>
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * * Redistributions of source code must retain the above copyright
   *   notice, this list of conditions and the following disclaimer.
   * * Redistributions in binary form must reproduce the above copyright
   *   notice, this list of conditions and the following disclaimer in the
   *   documentation and/or other materials provided with the distribution.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
   * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
   * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
   * ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
   * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
   * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
   * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
   * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
   * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
   * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   *
   * Esprima is Copyright (c) jQuery Foundation, Inc. and Contributors, All Rights Reserved.
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   *   * Redistributions of source code must retain the above copyright
   *     notice, this list of conditions and the following disclaimer.
   *   * Redistributions in binary form must reproduce the above copyright
   *     notice, this list of conditions and the following disclaimer in the
   *     documentation and/or other materials provided with the distribution.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
   * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
   * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
   * ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
   * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
   * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
   * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
   * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
   * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
   * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   */ /* eslint no-undefined:0, no-use-before-define: 0 */ "use strict";
  var acorn = require("ea6ee5d1a0f14e7e");
  var jsx = require("c62e28cb7422a475");
  var astNodeTypes = require("b1031b644f70c479");
  var espree = require("dd3b73d1e7f1ed00");
  var _require = require("ed6cdd35d5780d51"), getLatestEcmaVersion = _require.getLatestEcmaVersion, getSupportedEcmaVersions = _require.getSupportedEcmaVersions;
  // To initialize lazily.
  var parsers = {
      _regular: null,
      _jsx: null,
      get regular () {
          if (this._regular === null) this._regular = acorn.Parser.extend(espree());
          return this._regular;
      },
      get jsx () {
          if (this._jsx === null) this._jsx = acorn.Parser.extend(jsx(), espree());
          return this._jsx;
      },
      get: function(options) {
          var useJsx = Boolean(options && options.ecmaFeatures && options.ecmaFeatures.jsx);
          return useJsx ? this.jsx : this.regular;
      }
  };
  //------------------------------------------------------------------------------
  // Tokenizer
  //------------------------------------------------------------------------------
  /**
   * Tokenizes the given code.
   * @param {string} code The code to tokenize.
   * @param {Object} options Options defining how to tokenize.
   * @returns {Token[]} An array of tokens.
   * @throws {SyntaxError} If the input code is invalid.
   * @private
   */ function tokenize(code, options) {
      var Parser = parsers.get(options);
      // Ensure to collect tokens.
      if (!options || options.tokens !== true) options = Object.assign({}, options, {
          tokens: true
      }); // eslint-disable-line no-param-reassign
      return new Parser(options, code).tokenize();
  }
  //------------------------------------------------------------------------------
  // Parser
  //------------------------------------------------------------------------------
  /**
   * Parses the given code.
   * @param {string} code The code to tokenize.
   * @param {Object} options Options defining how to tokenize.
   * @returns {ASTNode} The "Program" AST node.
   * @throws {SyntaxError} If the input code is invalid.
   */ function parse(code, options) {
      var Parser = parsers.get(options);
      return new Parser(options, code).parse();
  }
  //------------------------------------------------------------------------------
  // Public
  //------------------------------------------------------------------------------
  exports.version = require("69ce72a2d973f852").version;
  exports.tokenize = tokenize;
  exports.parse = parse;
  // Deep copy.
  /* istanbul ignore next */ exports.Syntax = function() {
      var name, types = {};
      if (typeof Object.create === "function") types = Object.create(null);
      for(name in astNodeTypes)if (Object.hasOwnProperty.call(astNodeTypes, name)) types[name] = astNodeTypes[name];
      if (typeof Object.freeze === "function") Object.freeze(types);
      return types;
  }();
  /* istanbul ignore next */ exports.VisitorKeys = function() {
      return require("690369a35d7b4487").KEYS;
  }();
  exports.latestEcmaVersion = getLatestEcmaVersion();
  exports.supportedEcmaVersions = getSupportedEcmaVersions();
  
  },{"ea6ee5d1a0f14e7e":"kCa01","c62e28cb7422a475":"ln0Qa","b1031b644f70c479":"6rSHM","dd3b73d1e7f1ed00":"8NQUn","ed6cdd35d5780d51":"72rsS","69ce72a2d973f852":"fjwje","690369a35d7b4487":"eUMfR"}],"kCa01":[function(require,module,exports) {
  // Reserved word lists for various dialects of the language
  var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
  parcelHelpers.defineInteropFlag(exports);
  parcelHelpers.export(exports, "Node", function() {
      return Node;
  });
  parcelHelpers.export(exports, "Parser", function() {
      return Parser;
  });
  parcelHelpers.export(exports, "Position", function() {
      return Position;
  });
  parcelHelpers.export(exports, "SourceLocation", function() {
      return SourceLocation;
  });
  parcelHelpers.export(exports, "TokContext", function() {
      return TokContext;
  });
  parcelHelpers.export(exports, "Token", function() {
      return Token;
  });
  parcelHelpers.export(exports, "TokenType", function() {
      return TokenType;
  });
  parcelHelpers.export(exports, "defaultOptions", function() {
      return defaultOptions;
  });
  parcelHelpers.export(exports, "getLineInfo", function() {
      return getLineInfo;
  });
  parcelHelpers.export(exports, "isIdentifierChar", function() {
      return isIdentifierChar;
  });
  parcelHelpers.export(exports, "isIdentifierStart", function() {
      return isIdentifierStart;
  });
  parcelHelpers.export(exports, "isNewLine", function() {
      return isNewLine;
  });
  parcelHelpers.export(exports, "keywordTypes", function() {
      return keywords$1;
  });
  parcelHelpers.export(exports, "lineBreak", function() {
      return lineBreak;
  });
  parcelHelpers.export(exports, "lineBreakG", function() {
      return lineBreakG;
  });
  parcelHelpers.export(exports, "nonASCIIwhitespace", function() {
      return nonASCIIwhitespace;
  });
  parcelHelpers.export(exports, "parse", function() {
      return parse;
  });
  parcelHelpers.export(exports, "parseExpressionAt", function() {
      return parseExpressionAt;
  });
  parcelHelpers.export(exports, "tokContexts", function() {
      return types$1;
  });
  parcelHelpers.export(exports, "tokTypes", function() {
      return types;
  });
  parcelHelpers.export(exports, "tokenizer", function() {
      return tokenizer;
  });
  parcelHelpers.export(exports, "version", function() {
      return version;
  });
  var reservedWords = {
      3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",
      5: "class enum extends super const export import",
      6: "enum",
      strict: "implements interface let package private protected public static yield",
      strictBind: "eval arguments"
  };
  // And the keywords
  var ecma5AndLessKeywords = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this";
  var keywords = {
      5: ecma5AndLessKeywords,
      "5module": ecma5AndLessKeywords + " export import",
      6: ecma5AndLessKeywords + " const class extends export import super"
  };
  var keywordRelationalOperator = /^in(stanceof)?$/;
  // ## Character categories
  // Big ugly regular expressions that match characters in the
  // whitespace, identifier, and identifier-start categories. These
  // are only applied when a character is found to actually have a
  // code point above 128.
  // Generated by `bin/generate-identifier-regex.js`.
  var nonASCIIidentifierStartChars = "\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08C7\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\u9FFC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7BF\uA7C2-\uA7CA\uA7F5-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC";
  var nonASCIIidentifierChars = "\u200C\u200D\xb7\u0300-\u036F\u0387\u0483-\u0487\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u0669\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u06F0-\u06F9\u0711\u0730-\u074A\u07A6-\u07B0\u07C0-\u07C9\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D3-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0966-\u096F\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09E6-\u09EF\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A66-\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AE6-\u0AEF\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B55-\u0B57\u0B62\u0B63\u0B66-\u0B6F\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0BE6-\u0BEF\u0C00-\u0C04\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0CE6-\u0CEF\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D66-\u0D6F\u0D81-\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0E50-\u0E59\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECD\u0ED0-\u0ED9\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1040-\u1049\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F-\u109D\u135D-\u135F\u1369-\u1371\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u18A9\u1920-\u192B\u1930-\u193B\u1946-\u194F\u19D0-\u19DA\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AB0-\u1ABD\u1ABF\u1AC0\u1B00-\u1B04\u1B34-\u1B44\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BB0-\u1BB9\u1BE6-\u1BF3\u1C24-\u1C37\u1C40-\u1C49\u1C50-\u1C59\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DF9\u1DFB-\u1DFF\u203F\u2040\u2054\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA620-\uA629\uA66F\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA82C\uA880\uA881\uA8B4-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F1\uA8FF-\uA909\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9D0-\uA9D9\uA9E5\uA9F0-\uA9F9\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA50-\uAA59\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uABF0-\uABF9\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFF10-\uFF19\uFF3F";
  var nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
  var nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");
  nonASCIIidentifierStartChars = nonASCIIidentifierChars = null;
  // These are a run-length and offset encoded representation of the
  // >0xffff code points that are a valid part of identifiers. The
  // offset starts at 0x10000, and each pair of numbers represents an
  // offset to the next range, and then a size of the range. They were
  // generated by bin/generate-identifier-regex.js
  // eslint-disable-next-line comma-spacing
  var astralIdentifierStartCodes = [
      0,
      11,
      2,
      25,
      2,
      18,
      2,
      1,
      2,
      14,
      3,
      13,
      35,
      122,
      70,
      52,
      268,
      28,
      4,
      48,
      48,
      31,
      14,
      29,
      6,
      37,
      11,
      29,
      3,
      35,
      5,
      7,
      2,
      4,
      43,
      157,
      19,
      35,
      5,
      35,
      5,
      39,
      9,
      51,
      157,
      310,
      10,
      21,
      11,
      7,
      153,
      5,
      3,
      0,
      2,
      43,
      2,
      1,
      4,
      0,
      3,
      22,
      11,
      22,
      10,
      30,
      66,
      18,
      2,
      1,
      11,
      21,
      11,
      25,
      71,
      55,
      7,
      1,
      65,
      0,
      16,
      3,
      2,
      2,
      2,
      28,
      43,
      28,
      4,
      28,
      36,
      7,
      2,
      27,
      28,
      53,
      11,
      21,
      11,
      18,
      14,
      17,
      111,
      72,
      56,
      50,
      14,
      50,
      14,
      35,
      349,
      41,
      7,
      1,
      79,
      28,
      11,
      0,
      9,
      21,
      107,
      20,
      28,
      22,
      13,
      52,
      76,
      44,
      33,
      24,
      27,
      35,
      30,
      0,
      3,
      0,
      9,
      34,
      4,
      0,
      13,
      47,
      15,
      3,
      22,
      0,
      2,
      0,
      36,
      17,
      2,
      24,
      85,
      6,
      2,
      0,
      2,
      3,
      2,
      14,
      2,
      9,
      8,
      46,
      39,
      7,
      3,
      1,
      3,
      21,
      2,
      6,
      2,
      1,
      2,
      4,
      4,
      0,
      19,
      0,
      13,
      4,
      159,
      52,
      19,
      3,
      21,
      2,
      31,
      47,
      21,
      1,
      2,
      0,
      185,
      46,
      42,
      3,
      37,
      47,
      21,
      0,
      60,
      42,
      14,
      0,
      72,
      26,
      230,
      43,
      117,
      63,
      32,
      7,
      3,
      0,
      3,
      7,
      2,
      1,
      2,
      23,
      16,
      0,
      2,
      0,
      95,
      7,
      3,
      38,
      17,
      0,
      2,
      0,
      29,
      0,
      11,
      39,
      8,
      0,
      22,
      0,
      12,
      45,
      20,
      0,
      35,
      56,
      264,
      8,
      2,
      36,
      18,
      0,
      50,
      29,
      113,
      6,
      2,
      1,
      2,
      37,
      22,
      0,
      26,
      5,
      2,
      1,
      2,
      31,
      15,
      0,
      328,
      18,
      190,
      0,
      80,
      921,
      103,
      110,
      18,
      195,
      2749,
      1070,
      4050,
      582,
      8634,
      568,
      8,
      30,
      114,
      29,
      19,
      47,
      17,
      3,
      32,
      20,
      6,
      18,
      689,
      63,
      129,
      74,
      6,
      0,
      67,
      12,
      65,
      1,
      2,
      0,
      29,
      6135,
      9,
      1237,
      43,
      8,
      8952,
      286,
      50,
      2,
      18,
      3,
      9,
      395,
      2309,
      106,
      6,
      12,
      4,
      8,
      8,
      9,
      5991,
      84,
      2,
      70,
      2,
      1,
      3,
      0,
      3,
      1,
      3,
      3,
      2,
      11,
      2,
      0,
      2,
      6,
      2,
      64,
      2,
      3,
      3,
      7,
      2,
      6,
      2,
      27,
      2,
      3,
      2,
      4,
      2,
      0,
      4,
      6,
      2,
      339,
      3,
      24,
      2,
      24,
      2,
      30,
      2,
      24,
      2,
      30,
      2,
      24,
      2,
      30,
      2,
      24,
      2,
      30,
      2,
      24,
      2,
      7,
      2357,
      44,
      11,
      6,
      17,
      0,
      370,
      43,
      1301,
      196,
      60,
      67,
      8,
      0,
      1205,
      3,
      2,
      26,
      2,
      1,
      2,
      0,
      3,
      0,
      2,
      9,
      2,
      3,
      2,
      0,
      2,
      0,
      7,
      0,
      5,
      0,
      2,
      0,
      2,
      0,
      2,
      2,
      2,
      1,
      2,
      0,
      3,
      0,
      2,
      0,
      2,
      0,
      2,
      0,
      2,
      0,
      2,
      1,
      2,
      0,
      3,
      3,
      2,
      6,
      2,
      3,
      2,
      3,
      2,
      0,
      2,
      9,
      2,
      16,
      6,
      2,
      2,
      4,
      2,
      16,
      4421,
      42717,
      35,
      4148,
      12,
      221,
      3,
      5761,
      15,
      7472,
      3104,
      541,
      1507,
      4938
  ];
  // eslint-disable-next-line comma-spacing
  var astralIdentifierCodes = [
      509,
      0,
      227,
      0,
      150,
      4,
      294,
      9,
      1368,
      2,
      2,
      1,
      6,
      3,
      41,
      2,
      5,
      0,
      166,
      1,
      574,
      3,
      9,
      9,
      370,
      1,
      154,
      10,
      176,
      2,
      54,
      14,
      32,
      9,
      16,
      3,
      46,
      10,
      54,
      9,
      7,
      2,
      37,
      13,
      2,
      9,
      6,
      1,
      45,
      0,
      13,
      2,
      49,
      13,
      9,
      3,
      2,
      11,
      83,
      11,
      7,
      0,
      161,
      11,
      6,
      9,
      7,
      3,
      56,
      1,
      2,
      6,
      3,
      1,
      3,
      2,
      10,
      0,
      11,
      1,
      3,
      6,
      4,
      4,
      193,
      17,
      10,
      9,
      5,
      0,
      82,
      19,
      13,
      9,
      214,
      6,
      3,
      8,
      28,
      1,
      83,
      16,
      16,
      9,
      82,
      12,
      9,
      9,
      84,
      14,
      5,
      9,
      243,
      14,
      166,
      9,
      71,
      5,
      2,
      1,
      3,
      3,
      2,
      0,
      2,
      1,
      13,
      9,
      120,
      6,
      3,
      6,
      4,
      0,
      29,
      9,
      41,
      6,
      2,
      3,
      9,
      0,
      10,
      10,
      47,
      15,
      406,
      7,
      2,
      7,
      17,
      9,
      57,
      21,
      2,
      13,
      123,
      5,
      4,
      0,
      2,
      1,
      2,
      6,
      2,
      0,
      9,
      9,
      49,
      4,
      2,
      1,
      2,
      4,
      9,
      9,
      330,
      3,
      19306,
      9,
      135,
      4,
      60,
      6,
      26,
      9,
      1014,
      0,
      2,
      54,
      8,
      3,
      82,
      0,
      12,
      1,
      19628,
      1,
      5319,
      4,
      4,
      5,
      9,
      7,
      3,
      6,
      31,
      3,
      149,
      2,
      1418,
      49,
      513,
      54,
      5,
      49,
      9,
      0,
      15,
      0,
      23,
      4,
      2,
      14,
      1361,
      6,
      2,
      16,
      3,
      6,
      2,
      1,
      2,
      4,
      262,
      6,
      10,
      9,
      419,
      13,
      1495,
      6,
      110,
      6,
      6,
      9,
      4759,
      9,
      787719,
      239
  ];
  // This has a complexity linear to the value of the code. The
  // assumption is that looking up astral identifier characters is
  // rare.
  function isInAstralSet(code, set) {
      var pos = 0x10000;
      for(var i = 0; i < set.length; i += 2){
          pos += set[i];
          if (pos > code) return false;
          pos += set[i + 1];
          if (pos >= code) return true;
      }
  }
  // Test whether a given character code starts an identifier.
  function isIdentifierStart(code, astral) {
      if (code < 65) return code === 36;
      if (code < 91) return true;
      if (code < 97) return code === 95;
      if (code < 123) return true;
      if (code <= 0xffff) return code >= 0xaa && nonASCIIidentifierStart.test(String.fromCharCode(code));
      if (astral === false) return false;
      return isInAstralSet(code, astralIdentifierStartCodes);
  }
  // Test whether a given character is part of an identifier.
  function isIdentifierChar(code, astral) {
      if (code < 48) return code === 36;
      if (code < 58) return true;
      if (code < 65) return false;
      if (code < 91) return true;
      if (code < 97) return code === 95;
      if (code < 123) return true;
      if (code <= 0xffff) return code >= 0xaa && nonASCIIidentifier.test(String.fromCharCode(code));
      if (astral === false) return false;
      return isInAstralSet(code, astralIdentifierStartCodes) || isInAstralSet(code, astralIdentifierCodes);
  }
  // ## Token types
  // The assignment of fine-grained, information-carrying type objects
  // allows the tokenizer to store the information it has about a
  // token in a way that is very cheap for the parser to look up.
  // All token type variables start with an underscore, to make them
  // easy to recognize.
  // The `beforeExpr` property is used to disambiguate between regular
  // expressions and divisions. It is set on all token types that can
  // be followed by an expression (thus, a slash after them would be a
  // regular expression).
  //
  // The `startsExpr` property is used to check if the token ends a
  // `yield` expression. It is set on all token types that either can
  // directly start an expression (like a quotation mark) or can
  // continue an expression (like the body of a string).
  //
  // `isLoop` marks a keyword as starting a loop, which is important
  // to know when parsing a label, in order to allow or disallow
  // continue jumps to that label.
  var TokenType = function TokenType(label, conf) {
      if (conf === void 0) conf = {};
      this.label = label;
      this.keyword = conf.keyword;
      this.beforeExpr = !!conf.beforeExpr;
      this.startsExpr = !!conf.startsExpr;
      this.isLoop = !!conf.isLoop;
      this.isAssign = !!conf.isAssign;
      this.prefix = !!conf.prefix;
      this.postfix = !!conf.postfix;
      this.binop = conf.binop || null;
      this.updateContext = null;
  };
  function binop(name, prec) {
      return new TokenType(name, {
          beforeExpr: true,
          binop: prec
      });
  }
  var beforeExpr = {
      beforeExpr: true
  }, startsExpr = {
      startsExpr: true
  };
  // Map keyword names to token types.
  var keywords$1 = {};
  // Succinct definitions of keyword token types
  function kw(name, options) {
      if (options === void 0) options = {};
      options.keyword = name;
      return keywords$1[name] = new TokenType(name, options);
  }
  var types = {
      num: new TokenType("num", startsExpr),
      regexp: new TokenType("regexp", startsExpr),
      string: new TokenType("string", startsExpr),
      name: new TokenType("name", startsExpr),
      eof: new TokenType("eof"),
      // Punctuation token types.
      bracketL: new TokenType("[", {
          beforeExpr: true,
          startsExpr: true
      }),
      bracketR: new TokenType("]"),
      braceL: new TokenType("{", {
          beforeExpr: true,
          startsExpr: true
      }),
      braceR: new TokenType("}"),
      parenL: new TokenType("(", {
          beforeExpr: true,
          startsExpr: true
      }),
      parenR: new TokenType(")"),
      comma: new TokenType(",", beforeExpr),
      semi: new TokenType(";", beforeExpr),
      colon: new TokenType(":", beforeExpr),
      dot: new TokenType("."),
      question: new TokenType("?", beforeExpr),
      questionDot: new TokenType("?."),
      arrow: new TokenType("=>", beforeExpr),
      template: new TokenType("template"),
      invalidTemplate: new TokenType("invalidTemplate"),
      ellipsis: new TokenType("...", beforeExpr),
      backQuote: new TokenType("`", startsExpr),
      dollarBraceL: new TokenType("${", {
          beforeExpr: true,
          startsExpr: true
      }),
      // Operators. These carry several kinds of properties to help the
      // parser use them properly (the presence of these properties is
      // what categorizes them as operators).
      //
      // `binop`, when present, specifies that this operator is a binary
      // operator, and will refer to its precedence.
      //
      // `prefix` and `postfix` mark the operator as a prefix or postfix
      // unary operator.
      //
      // `isAssign` marks all of `=`, `+=`, `-=` etcetera, which act as
      // binary operators with a very low precedence, that should result
      // in AssignmentExpression nodes.
      eq: new TokenType("=", {
          beforeExpr: true,
          isAssign: true
      }),
      assign: new TokenType("_=", {
          beforeExpr: true,
          isAssign: true
      }),
      incDec: new TokenType("++/--", {
          prefix: true,
          postfix: true,
          startsExpr: true
      }),
      prefix: new TokenType("!/~", {
          beforeExpr: true,
          prefix: true,
          startsExpr: true
      }),
      logicalOR: binop("||", 1),
      logicalAND: binop("&&", 2),
      bitwiseOR: binop("|", 3),
      bitwiseXOR: binop("^", 4),
      bitwiseAND: binop("&", 5),
      equality: binop("==/!=/===/!==", 6),
      relational: binop("</>/<=/>=", 7),
      bitShift: binop("<</>>/>>>", 8),
      plusMin: new TokenType("+/-", {
          beforeExpr: true,
          binop: 9,
          prefix: true,
          startsExpr: true
      }),
      modulo: binop("%", 10),
      star: binop("*", 10),
      slash: binop("/", 10),
      starstar: new TokenType("**", {
          beforeExpr: true
      }),
      coalesce: binop("??", 1),
      // Keyword token types.
      _break: kw("break"),
      _case: kw("case", beforeExpr),
      _catch: kw("catch"),
      _continue: kw("continue"),
      _debugger: kw("debugger"),
      _default: kw("default", beforeExpr),
      _do: kw("do", {
          isLoop: true,
          beforeExpr: true
      }),
      _else: kw("else", beforeExpr),
      _finally: kw("finally"),
      _for: kw("for", {
          isLoop: true
      }),
      _function: kw("function", startsExpr),
      _if: kw("if"),
      _return: kw("return", beforeExpr),
      _switch: kw("switch"),
      _throw: kw("throw", beforeExpr),
      _try: kw("try"),
      _var: kw("var"),
      _const: kw("const"),
      _while: kw("while", {
          isLoop: true
      }),
      _with: kw("with"),
      _new: kw("new", {
          beforeExpr: true,
          startsExpr: true
      }),
      _this: kw("this", startsExpr),
      _super: kw("super", startsExpr),
      _class: kw("class", startsExpr),
      _extends: kw("extends", beforeExpr),
      _export: kw("export"),
      _import: kw("import", startsExpr),
      _null: kw("null", startsExpr),
      _true: kw("true", startsExpr),
      _false: kw("false", startsExpr),
      _in: kw("in", {
          beforeExpr: true,
          binop: 7
      }),
      _instanceof: kw("instanceof", {
          beforeExpr: true,
          binop: 7
      }),
      _typeof: kw("typeof", {
          beforeExpr: true,
          prefix: true,
          startsExpr: true
      }),
      _void: kw("void", {
          beforeExpr: true,
          prefix: true,
          startsExpr: true
      }),
      _delete: kw("delete", {
          beforeExpr: true,
          prefix: true,
          startsExpr: true
      })
  };
  // Matches a whole line break (where CRLF is considered a single
  // line break). Used to count lines.
  var lineBreak = /\r\n?|\n|\u2028|\u2029/;
  var lineBreakG = new RegExp(lineBreak.source, "g");
  function isNewLine(code, ecma2019String) {
      return code === 10 || code === 13 || !ecma2019String && (code === 0x2028 || code === 0x2029);
  }
  var nonASCIIwhitespace = /[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/;
  var skipWhiteSpace = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g;
  var ref = Object.prototype;
  var hasOwnProperty = ref.hasOwnProperty;
  var toString = ref.toString;
  // Checks if an object has a property.
  function has(obj, propName) {
      return hasOwnProperty.call(obj, propName);
  }
  var isArray = Array.isArray || function(obj) {
      return toString.call(obj) === "[object Array]";
  };
  function wordsRegexp(words) {
      return new RegExp("^(?:" + words.replace(/ /g, "|") + ")$");
  }
  // These are used when `options.locations` is on, for the
  // `startLoc` and `endLoc` properties.
  var Position = function Position(line, col) {
      this.line = line;
      this.column = col;
  };
  Position.prototype.offset = function offset(n) {
      return new Position(this.line, this.column + n);
  };
  var SourceLocation = function SourceLocation(p, start, end) {
      this.start = start;
      this.end = end;
      if (p.sourceFile !== null) this.source = p.sourceFile;
  };
  // The `getLineInfo` function is mostly useful when the
  // `locations` option is off (for performance reasons) and you
  // want to find the line/column position for a given character
  // offset. `input` should be the code string that the offset refers
  // into.
  function getLineInfo(input, offset) {
      for(var line = 1, cur = 0;;){
          lineBreakG.lastIndex = cur;
          var match = lineBreakG.exec(input);
          if (match && match.index < offset) {
              ++line;
              cur = match.index + match[0].length;
          } else return new Position(line, offset - cur);
      }
  }
  // A second optional argument can be given to further configure
  // the parser process. These options are recognized:
  var defaultOptions = {
      // `ecmaVersion` indicates the ECMAScript version to parse. Must be
      // either 3, 5, 6 (2015), 7 (2016), 8 (2017), 9 (2018), or 10
      // (2019). This influences support for strict mode, the set of
      // reserved words, and support for new syntax features. The default
      // is 10.
      ecmaVersion: 10,
      // `sourceType` indicates the mode the code should be parsed in.
      // Can be either `"script"` or `"module"`. This influences global
      // strict mode and parsing of `import` and `export` declarations.
      sourceType: "script",
      // `onInsertedSemicolon` can be a callback that will be called
      // when a semicolon is automatically inserted. It will be passed
      // the position of the comma as an offset, and if `locations` is
      // enabled, it is given the location as a `{line, column}` object
      // as second argument.
      onInsertedSemicolon: null,
      // `onTrailingComma` is similar to `onInsertedSemicolon`, but for
      // trailing commas.
      onTrailingComma: null,
      // By default, reserved words are only enforced if ecmaVersion >= 5.
      // Set `allowReserved` to a boolean value to explicitly turn this on
      // an off. When this option has the value "never", reserved words
      // and keywords can also not be used as property names.
      allowReserved: null,
      // When enabled, a return at the top level is not considered an
      // error.
      allowReturnOutsideFunction: false,
      // When enabled, import/export statements are not constrained to
      // appearing at the top of the program.
      allowImportExportEverywhere: false,
      // When enabled, await identifiers are allowed to appear at the top-level scope,
      // but they are still not allowed in non-async functions.
      allowAwaitOutsideFunction: false,
      // When enabled, hashbang directive in the beginning of file
      // is allowed and treated as a line comment.
      allowHashBang: false,
      // When `locations` is on, `loc` properties holding objects with
      // `start` and `end` properties in `{line, column}` form (with
      // line being 1-based and column 0-based) will be attached to the
      // nodes.
      locations: false,
      // A function can be passed as `onToken` option, which will
      // cause Acorn to call that function with object in the same
      // format as tokens returned from `tokenizer().getToken()`. Note
      // that you are not allowed to call the parser from the
      // callback—that will corrupt its internal state.
      onToken: null,
      // A function can be passed as `onComment` option, which will
      // cause Acorn to call that function with `(block, text, start,
      // end)` parameters whenever a comment is skipped. `block` is a
      // boolean indicating whether this is a block (`/* */`) comment,
      // `text` is the content of the comment, and `start` and `end` are
      // character offsets that denote the start and end of the comment.
      // When the `locations` option is on, two more parameters are
      // passed, the full `{line, column}` locations of the start and
      // end of the comments. Note that you are not allowed to call the
      // parser from the callback—that will corrupt its internal state.
      onComment: null,
      // Nodes have their start and end characters offsets recorded in
      // `start` and `end` properties (directly on the node, rather than
      // the `loc` object, which holds line/column data. To also add a
      // [semi-standardized][range] `range` property holding a `[start,
      // end]` array with the same numbers, set the `ranges` option to
      // `true`.
      //
      // [range]: https://bugzilla.mozilla.org/show_bug.cgi?id=745678
      ranges: false,
      // It is possible to parse multiple files into a single AST by
      // passing the tree produced by parsing the first file as
      // `program` option in subsequent parses. This will add the
      // toplevel forms of the parsed file to the `Program` (top) node
      // of an existing parse tree.
      program: null,
      // When `locations` is on, you can pass this to record the source
      // file in every node's `loc` object.
      sourceFile: null,
      // This value, if given, is stored in every node, whether
      // `locations` is on or off.
      directSourceFile: null,
      // When enabled, parenthesized expressions are represented by
      // (non-standard) ParenthesizedExpression nodes
      preserveParens: false
  };
  // Interpret and default an options object
  function getOptions(opts) {
      var options = {};
      for(var opt in defaultOptions)options[opt] = opts && has(opts, opt) ? opts[opt] : defaultOptions[opt];
      if (options.ecmaVersion >= 2015) options.ecmaVersion -= 2009;
      if (options.allowReserved == null) options.allowReserved = options.ecmaVersion < 5;
      if (isArray(options.onToken)) {
          var tokens = options.onToken;
          options.onToken = function(token) {
              return tokens.push(token);
          };
      }
      if (isArray(options.onComment)) options.onComment = pushComment(options, options.onComment);
      return options;
  }
  function pushComment(options, array) {
      return function(block, text, start, end, startLoc, endLoc) {
          var comment = {
              type: block ? "Block" : "Line",
              value: text,
              start: start,
              end: end
          };
          if (options.locations) comment.loc = new SourceLocation(this, startLoc, endLoc);
          if (options.ranges) comment.range = [
              start,
              end
          ];
          array.push(comment);
      };
  }
  // Each scope gets a bitset that may contain these flags
  var SCOPE_TOP = 1, SCOPE_FUNCTION = 2, SCOPE_VAR = SCOPE_TOP | SCOPE_FUNCTION, SCOPE_ASYNC = 4, SCOPE_GENERATOR = 8, SCOPE_ARROW = 16, SCOPE_SIMPLE_CATCH = 32, SCOPE_SUPER = 64, SCOPE_DIRECT_SUPER = 128;
  function functionFlags(async, generator) {
      return SCOPE_FUNCTION | (async ? SCOPE_ASYNC : 0) | (generator ? SCOPE_GENERATOR : 0);
  }
  // Used in checkLVal and declareName to determine the type of a binding
  var BIND_NONE = 0, BIND_VAR = 1, BIND_LEXICAL = 2, BIND_FUNCTION = 3, BIND_SIMPLE_CATCH = 4, BIND_OUTSIDE = 5; // Special case for function names as bound inside the function
  var Parser = function Parser(options, input, startPos) {
      this.options = options = getOptions(options);
      this.sourceFile = options.sourceFile;
      this.keywords = wordsRegexp(keywords[options.ecmaVersion >= 6 ? 6 : options.sourceType === "module" ? "5module" : 5]);
      var reserved = "";
      if (options.allowReserved !== true) {
          for(var v = options.ecmaVersion;; v--){
              if (reserved = reservedWords[v]) break;
          }
          if (options.sourceType === "module") reserved += " await";
      }
      this.reservedWords = wordsRegexp(reserved);
      var reservedStrict = (reserved ? reserved + " " : "") + reservedWords.strict;
      this.reservedWordsStrict = wordsRegexp(reservedStrict);
      this.reservedWordsStrictBind = wordsRegexp(reservedStrict + " " + reservedWords.strictBind);
      this.input = String(input);
      // Used to signal to callers of `readWord1` whether the word
      // contained any escape sequences. This is needed because words with
      // escape sequences must not be interpreted as keywords.
      this.containsEsc = false;
      // Set up token state
      // The current position of the tokenizer in the input.
      if (startPos) {
          this.pos = startPos;
          this.lineStart = this.input.lastIndexOf("\n", startPos - 1) + 1;
          this.curLine = this.input.slice(0, this.lineStart).split(lineBreak).length;
      } else {
          this.pos = this.lineStart = 0;
          this.curLine = 1;
      }
      // Properties of the current token:
      // Its type
      this.type = types.eof;
      // For tokens that include more information than their type, the value
      this.value = null;
      // Its start and end offset
      this.start = this.end = this.pos;
      // And, if locations are used, the {line, column} object
      // corresponding to those offsets
      this.startLoc = this.endLoc = this.curPosition();
      // Position information for the previous token
      this.lastTokEndLoc = this.lastTokStartLoc = null;
      this.lastTokStart = this.lastTokEnd = this.pos;
      // The context stack is used to superficially track syntactic
      // context to predict whether a regular expression is allowed in a
      // given position.
      this.context = this.initialContext();
      this.exprAllowed = true;
      // Figure out if it's a module code.
      this.inModule = options.sourceType === "module";
      this.strict = this.inModule || this.strictDirective(this.pos);
      // Used to signify the start of a potential arrow function
      this.potentialArrowAt = -1;
      // Positions to delayed-check that yield/await does not exist in default parameters.
      this.yieldPos = this.awaitPos = this.awaitIdentPos = 0;
      // Labels in scope.
      this.labels = [];
      // Thus-far undefined exports.
      this.undefinedExports = {};
      // If enabled, skip leading hashbang line.
      if (this.pos === 0 && options.allowHashBang && this.input.slice(0, 2) === "#!") this.skipLineComment(2);
      // Scope tracking for duplicate variable names (see scope.js)
      this.scopeStack = [];
      this.enterScope(SCOPE_TOP);
      // For RegExp validation
      this.regexpState = null;
  };
  var prototypeAccessors = {
      inFunction: {
          configurable: true
      },
      inGenerator: {
          configurable: true
      },
      inAsync: {
          configurable: true
      },
      allowSuper: {
          configurable: true
      },
      allowDirectSuper: {
          configurable: true
      },
      treatFunctionsAsVar: {
          configurable: true
      }
  };
  Parser.prototype.parse = function parse() {
      var node = this.options.program || this.startNode();
      this.nextToken();
      return this.parseTopLevel(node);
  };
  prototypeAccessors.inFunction.get = function() {
      return (this.currentVarScope().flags & SCOPE_FUNCTION) > 0;
  };
  prototypeAccessors.inGenerator.get = function() {
      return (this.currentVarScope().flags & SCOPE_GENERATOR) > 0;
  };
  prototypeAccessors.inAsync.get = function() {
      return (this.currentVarScope().flags & SCOPE_ASYNC) > 0;
  };
  prototypeAccessors.allowSuper.get = function() {
      return (this.currentThisScope().flags & SCOPE_SUPER) > 0;
  };
  prototypeAccessors.allowDirectSuper.get = function() {
      return (this.currentThisScope().flags & SCOPE_DIRECT_SUPER) > 0;
  };
  prototypeAccessors.treatFunctionsAsVar.get = function() {
      return this.treatFunctionsAsVarInScope(this.currentScope());
  };
  // Switch to a getter for 7.0.0.
  Parser.prototype.inNonArrowFunction = function inNonArrowFunction() {
      return (this.currentThisScope().flags & SCOPE_FUNCTION) > 0;
  };
  Parser.extend = function extend() {
      var plugins = [], len = arguments.length;
      while(len--)plugins[len] = arguments[len];
      var cls = this;
      for(var i = 0; i < plugins.length; i++)cls = plugins[i](cls);
      return cls;
  };
  Parser.parse = function parse(input, options) {
      return new this(options, input).parse();
  };
  Parser.parseExpressionAt = function parseExpressionAt(input, pos, options) {
      var parser = new this(options, input, pos);
      parser.nextToken();
      return parser.parseExpression();
  };
  Parser.tokenizer = function tokenizer(input, options) {
      return new this(options, input);
  };
  Object.defineProperties(Parser.prototype, prototypeAccessors);
  var pp = Parser.prototype;
  // ## Parser utilities
  var literal = /^(?:'((?:\\.|[^'\\])*?)'|"((?:\\.|[^"\\])*?)")/;
  pp.strictDirective = function(start) {
      for(;;){
          // Try to find string literal.
          skipWhiteSpace.lastIndex = start;
          start += skipWhiteSpace.exec(this.input)[0].length;
          var match = literal.exec(this.input.slice(start));
          if (!match) return false;
          if ((match[1] || match[2]) === "use strict") {
              skipWhiteSpace.lastIndex = start + match[0].length;
              var spaceAfter = skipWhiteSpace.exec(this.input), end = spaceAfter.index + spaceAfter[0].length;
              var next = this.input.charAt(end);
              return next === ";" || next === "}" || lineBreak.test(spaceAfter[0]) && !(/[(`.[+\-/*%<>=,?^&]/.test(next) || next === "!" && this.input.charAt(end + 1) === "=");
          }
          start += match[0].length;
          // Skip semicolon, if any.
          skipWhiteSpace.lastIndex = start;
          start += skipWhiteSpace.exec(this.input)[0].length;
          if (this.input[start] === ";") start++;
      }
  };
  // Predicate that tests whether the next token is of the given
  // type, and if yes, consumes it as a side effect.
  pp.eat = function(type) {
      if (this.type === type) {
          this.next();
          return true;
      } else return false;
  };
  // Tests whether parsed token is a contextual keyword.
  pp.isContextual = function(name) {
      return this.type === types.name && this.value === name && !this.containsEsc;
  };
  // Consumes contextual keyword if possible.
  pp.eatContextual = function(name) {
      if (!this.isContextual(name)) return false;
      this.next();
      return true;
  };
  // Asserts that following token is given contextual keyword.
  pp.expectContextual = function(name) {
      if (!this.eatContextual(name)) this.unexpected();
  };
  // Test whether a semicolon can be inserted at the current position.
  pp.canInsertSemicolon = function() {
      return this.type === types.eof || this.type === types.braceR || lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
  };
  pp.insertSemicolon = function() {
      if (this.canInsertSemicolon()) {
          if (this.options.onInsertedSemicolon) this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc);
          return true;
      }
  };
  // Consume a semicolon, or, failing that, see if we are allowed to
  // pretend that there is a semicolon at this position.
  pp.semicolon = function() {
      if (!this.eat(types.semi) && !this.insertSemicolon()) this.unexpected();
  };
  pp.afterTrailingComma = function(tokType, notNext) {
      if (this.type === tokType) {
          if (this.options.onTrailingComma) this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc);
          if (!notNext) this.next();
          return true;
      }
  };
  // Expect a token of a given type. If found, consume it, otherwise,
  // raise an unexpected token error.
  pp.expect = function(type) {
      this.eat(type) || this.unexpected();
  };
  // Raise an unexpected token error.
  pp.unexpected = function(pos) {
      this.raise(pos != null ? pos : this.start, "Unexpected token");
  };
  function DestructuringErrors() {
      this.shorthandAssign = this.trailingComma = this.parenthesizedAssign = this.parenthesizedBind = this.doubleProto = -1;
  }
  pp.checkPatternErrors = function(refDestructuringErrors, isAssign) {
      if (!refDestructuringErrors) return;
      if (refDestructuringErrors.trailingComma > -1) this.raiseRecoverable(refDestructuringErrors.trailingComma, "Comma is not permitted after the rest element");
      var parens = isAssign ? refDestructuringErrors.parenthesizedAssign : refDestructuringErrors.parenthesizedBind;
      if (parens > -1) this.raiseRecoverable(parens, "Parenthesized pattern");
  };
  pp.checkExpressionErrors = function(refDestructuringErrors, andThrow) {
      if (!refDestructuringErrors) return false;
      var shorthandAssign = refDestructuringErrors.shorthandAssign;
      var doubleProto = refDestructuringErrors.doubleProto;
      if (!andThrow) return shorthandAssign >= 0 || doubleProto >= 0;
      if (shorthandAssign >= 0) this.raise(shorthandAssign, "Shorthand property assignments are valid only in destructuring patterns");
      if (doubleProto >= 0) this.raiseRecoverable(doubleProto, "Redefinition of __proto__ property");
  };
  pp.checkYieldAwaitInDefaultParams = function() {
      if (this.yieldPos && (!this.awaitPos || this.yieldPos < this.awaitPos)) this.raise(this.yieldPos, "Yield expression cannot be a default value");
      if (this.awaitPos) this.raise(this.awaitPos, "Await expression cannot be a default value");
  };
  pp.isSimpleAssignTarget = function(expr) {
      if (expr.type === "ParenthesizedExpression") return this.isSimpleAssignTarget(expr.expression);
      return expr.type === "Identifier" || expr.type === "MemberExpression";
  };
  var pp$1 = Parser.prototype;
  // ### Statement parsing
  // Parse a program. Initializes the parser, reads any number of
  // statements, and wraps them in a Program node.  Optionally takes a
  // `program` argument.  If present, the statements will be appended
  // to its body instead of creating a new node.
  pp$1.parseTopLevel = function(node) {
      var exports = {};
      if (!node.body) node.body = [];
      while(this.type !== types.eof){
          var stmt = this.parseStatement(null, true, exports);
          node.body.push(stmt);
      }
      if (this.inModule) for(var i = 0, list = Object.keys(this.undefinedExports); i < list.length; i += 1){
          var name = list[i];
          this.raiseRecoverable(this.undefinedExports[name].start, "Export '" + name + "' is not defined");
      }
      this.adaptDirectivePrologue(node.body);
      this.next();
      node.sourceType = this.options.sourceType;
      return this.finishNode(node, "Program");
  };
  var loopLabel = {
      kind: "loop"
  }, switchLabel = {
      kind: "switch"
  };
  pp$1.isLet = function(context) {
      if (this.options.ecmaVersion < 6 || !this.isContextual("let")) return false;
      skipWhiteSpace.lastIndex = this.pos;
      var skip = skipWhiteSpace.exec(this.input);
      var next = this.pos + skip[0].length, nextCh = this.input.charCodeAt(next);
      // For ambiguous cases, determine if a LexicalDeclaration (or only a
      // Statement) is allowed here. If context is not empty then only a Statement
      // is allowed. However, `let [` is an explicit negative lookahead for
      // ExpressionStatement, so special-case it first.
      if (nextCh === 91) return true;
       // '['
      if (context) return false;
      if (nextCh === 123) return true;
       // '{'
      if (isIdentifierStart(nextCh, true)) {
          var pos = next + 1;
          while(isIdentifierChar(this.input.charCodeAt(pos), true))++pos;
          var ident = this.input.slice(next, pos);
          if (!keywordRelationalOperator.test(ident)) return true;
      }
      return false;
  };
  // check 'async [no LineTerminator here] function'
  // - 'async /*foo*/ function' is OK.
  // - 'async /*\n*/ function' is invalid.
  pp$1.isAsyncFunction = function() {
      if (this.options.ecmaVersion < 8 || !this.isContextual("async")) return false;
      skipWhiteSpace.lastIndex = this.pos;
      var skip = skipWhiteSpace.exec(this.input);
      var next = this.pos + skip[0].length;
      return !lineBreak.test(this.input.slice(this.pos, next)) && this.input.slice(next, next + 8) === "function" && (next + 8 === this.input.length || !isIdentifierChar(this.input.charAt(next + 8)));
  };
  // Parse a single statement.
  //
  // If expecting a statement and finding a slash operator, parse a
  // regular expression literal. This is to handle cases like
  // `if (foo) /blah/.exec(foo)`, where looking at the previous token
  // does not help.
  pp$1.parseStatement = function(context, topLevel, exports) {
      var starttype = this.type, node = this.startNode(), kind;
      if (this.isLet(context)) {
          starttype = types._var;
          kind = "let";
      }
      // Most types of statements are recognized by the keyword they
      // start with. Many are trivial to parse, some require a bit of
      // complexity.
      switch(starttype){
          case types._break:
          case types._continue:
              return this.parseBreakContinueStatement(node, starttype.keyword);
          case types._debugger:
              return this.parseDebuggerStatement(node);
          case types._do:
              return this.parseDoStatement(node);
          case types._for:
              return this.parseForStatement(node);
          case types._function:
              // Function as sole body of either an if statement or a labeled statement
              // works, but not when it is part of a labeled statement that is the sole
              // body of an if statement.
              if (context && (this.strict || context !== "if" && context !== "label") && this.options.ecmaVersion >= 6) this.unexpected();
              return this.parseFunctionStatement(node, false, !context);
          case types._class:
              if (context) this.unexpected();
              return this.parseClass(node, true);
          case types._if:
              return this.parseIfStatement(node);
          case types._return:
              return this.parseReturnStatement(node);
          case types._switch:
              return this.parseSwitchStatement(node);
          case types._throw:
              return this.parseThrowStatement(node);
          case types._try:
              return this.parseTryStatement(node);
          case types._const:
          case types._var:
              kind = kind || this.value;
              if (context && kind !== "var") this.unexpected();
              return this.parseVarStatement(node, kind);
          case types._while:
              return this.parseWhileStatement(node);
          case types._with:
              return this.parseWithStatement(node);
          case types.braceL:
              return this.parseBlock(true, node);
          case types.semi:
              return this.parseEmptyStatement(node);
          case types._export:
          case types._import:
              if (this.options.ecmaVersion > 10 && starttype === types._import) {
                  skipWhiteSpace.lastIndex = this.pos;
                  var skip = skipWhiteSpace.exec(this.input);
                  var next = this.pos + skip[0].length, nextCh = this.input.charCodeAt(next);
                  if (nextCh === 40 || nextCh === 46) return this.parseExpressionStatement(node, this.parseExpression());
              }
              if (!this.options.allowImportExportEverywhere) {
                  if (!topLevel) this.raise(this.start, "'import' and 'export' may only appear at the top level");
                  if (!this.inModule) this.raise(this.start, "'import' and 'export' may appear only with 'sourceType: module'");
              }
              return starttype === types._import ? this.parseImport(node) : this.parseExport(node, exports);
          // If the statement does not start with a statement keyword or a
          // brace, it's an ExpressionStatement or LabeledStatement. We
          // simply start parsing an expression, and afterwards, if the
          // next token is a colon and the expression was a simple
          // Identifier node, we switch to interpreting it as a label.
          default:
              if (this.isAsyncFunction()) {
                  if (context) this.unexpected();
                  this.next();
                  return this.parseFunctionStatement(node, true, !context);
              }
              var maybeName = this.value, expr = this.parseExpression();
              if (starttype === types.name && expr.type === "Identifier" && this.eat(types.colon)) return this.parseLabeledStatement(node, maybeName, expr, context);
              else return this.parseExpressionStatement(node, expr);
      }
  };
  pp$1.parseBreakContinueStatement = function(node, keyword) {
      var isBreak = keyword === "break";
      this.next();
      if (this.eat(types.semi) || this.insertSemicolon()) node.label = null;
      else if (this.type !== types.name) this.unexpected();
      else {
          node.label = this.parseIdent();
          this.semicolon();
      }
      // Verify that there is an actual destination to break or
      // continue to.
      var i = 0;
      for(; i < this.labels.length; ++i){
          var lab = this.labels[i];
          if (node.label == null || lab.name === node.label.name) {
              if (lab.kind != null && (isBreak || lab.kind === "loop")) break;
              if (node.label && isBreak) break;
          }
      }
      if (i === this.labels.length) this.raise(node.start, "Unsyntactic " + keyword);
      return this.finishNode(node, isBreak ? "BreakStatement" : "ContinueStatement");
  };
  pp$1.parseDebuggerStatement = function(node) {
      this.next();
      this.semicolon();
      return this.finishNode(node, "DebuggerStatement");
  };
  pp$1.parseDoStatement = function(node) {
      this.next();
      this.labels.push(loopLabel);
      node.body = this.parseStatement("do");
      this.labels.pop();
      this.expect(types._while);
      node.test = this.parseParenExpression();
      if (this.options.ecmaVersion >= 6) this.eat(types.semi);
      else this.semicolon();
      return this.finishNode(node, "DoWhileStatement");
  };
  // Disambiguating between a `for` and a `for`/`in` or `for`/`of`
  // loop is non-trivial. Basically, we have to parse the init `var`
  // statement or expression, disallowing the `in` operator (see
  // the second parameter to `parseExpression`), and then check
  // whether the next token is `in` or `of`. When there is no init
  // part (semicolon immediately after the opening parenthesis), it
  // is a regular `for` loop.
  pp$1.parseForStatement = function(node) {
      this.next();
      var awaitAt = this.options.ecmaVersion >= 9 && (this.inAsync || !this.inFunction && this.options.allowAwaitOutsideFunction) && this.eatContextual("await") ? this.lastTokStart : -1;
      this.labels.push(loopLabel);
      this.enterScope(0);
      this.expect(types.parenL);
      if (this.type === types.semi) {
          if (awaitAt > -1) this.unexpected(awaitAt);
          return this.parseFor(node, null);
      }
      var isLet = this.isLet();
      if (this.type === types._var || this.type === types._const || isLet) {
          var init$1 = this.startNode(), kind = isLet ? "let" : this.value;
          this.next();
          this.parseVar(init$1, true, kind);
          this.finishNode(init$1, "VariableDeclaration");
          if ((this.type === types._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) && init$1.declarations.length === 1) {
              if (this.options.ecmaVersion >= 9) {
                  if (this.type === types._in) {
                      if (awaitAt > -1) this.unexpected(awaitAt);
                  } else node.await = awaitAt > -1;
              }
              return this.parseForIn(node, init$1);
          }
          if (awaitAt > -1) this.unexpected(awaitAt);
          return this.parseFor(node, init$1);
      }
      var refDestructuringErrors = new DestructuringErrors;
      var init = this.parseExpression(true, refDestructuringErrors);
      if (this.type === types._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) {
          if (this.options.ecmaVersion >= 9) {
              if (this.type === types._in) {
                  if (awaitAt > -1) this.unexpected(awaitAt);
              } else node.await = awaitAt > -1;
          }
          this.toAssignable(init, false, refDestructuringErrors);
          this.checkLVal(init);
          return this.parseForIn(node, init);
      } else this.checkExpressionErrors(refDestructuringErrors, true);
      if (awaitAt > -1) this.unexpected(awaitAt);
      return this.parseFor(node, init);
  };
  pp$1.parseFunctionStatement = function(node, isAsync, declarationPosition) {
      this.next();
      return this.parseFunction(node, FUNC_STATEMENT | (declarationPosition ? 0 : FUNC_HANGING_STATEMENT), false, isAsync);
  };
  pp$1.parseIfStatement = function(node) {
      this.next();
      node.test = this.parseParenExpression();
      // allow function declarations in branches, but only in non-strict mode
      node.consequent = this.parseStatement("if");
      node.alternate = this.eat(types._else) ? this.parseStatement("if") : null;
      return this.finishNode(node, "IfStatement");
  };
  pp$1.parseReturnStatement = function(node) {
      if (!this.inFunction && !this.options.allowReturnOutsideFunction) this.raise(this.start, "'return' outside of function");
      this.next();
      // In `return` (and `break`/`continue`), the keywords with
      // optional arguments, we eagerly look for a semicolon or the
      // possibility to insert one.
      if (this.eat(types.semi) || this.insertSemicolon()) node.argument = null;
      else {
          node.argument = this.parseExpression();
          this.semicolon();
      }
      return this.finishNode(node, "ReturnStatement");
  };
  pp$1.parseSwitchStatement = function(node) {
      this.next();
      node.discriminant = this.parseParenExpression();
      node.cases = [];
      this.expect(types.braceL);
      this.labels.push(switchLabel);
      this.enterScope(0);
      // Statements under must be grouped (by label) in SwitchCase
      // nodes. `cur` is used to keep the node that we are currently
      // adding statements to.
      var cur;
      for(var sawDefault = false; this.type !== types.braceR;)if (this.type === types._case || this.type === types._default) {
          var isCase = this.type === types._case;
          if (cur) this.finishNode(cur, "SwitchCase");
          node.cases.push(cur = this.startNode());
          cur.consequent = [];
          this.next();
          if (isCase) cur.test = this.parseExpression();
          else {
              if (sawDefault) this.raiseRecoverable(this.lastTokStart, "Multiple default clauses");
              sawDefault = true;
              cur.test = null;
          }
          this.expect(types.colon);
      } else {
          if (!cur) this.unexpected();
          cur.consequent.push(this.parseStatement(null));
      }
      this.exitScope();
      if (cur) this.finishNode(cur, "SwitchCase");
      this.next(); // Closing brace
      this.labels.pop();
      return this.finishNode(node, "SwitchStatement");
  };
  pp$1.parseThrowStatement = function(node) {
      this.next();
      if (lineBreak.test(this.input.slice(this.lastTokEnd, this.start))) this.raise(this.lastTokEnd, "Illegal newline after throw");
      node.argument = this.parseExpression();
      this.semicolon();
      return this.finishNode(node, "ThrowStatement");
  };
  // Reused empty array added for node fields that are always empty.
  var empty = [];
  pp$1.parseTryStatement = function(node) {
      this.next();
      node.block = this.parseBlock();
      node.handler = null;
      if (this.type === types._catch) {
          var clause = this.startNode();
          this.next();
          if (this.eat(types.parenL)) {
              clause.param = this.parseBindingAtom();
              var simple = clause.param.type === "Identifier";
              this.enterScope(simple ? SCOPE_SIMPLE_CATCH : 0);
              this.checkLVal(clause.param, simple ? BIND_SIMPLE_CATCH : BIND_LEXICAL);
              this.expect(types.parenR);
          } else {
              if (this.options.ecmaVersion < 10) this.unexpected();
              clause.param = null;
              this.enterScope(0);
          }
          clause.body = this.parseBlock(false);
          this.exitScope();
          node.handler = this.finishNode(clause, "CatchClause");
      }
      node.finalizer = this.eat(types._finally) ? this.parseBlock() : null;
      if (!node.handler && !node.finalizer) this.raise(node.start, "Missing catch or finally clause");
      return this.finishNode(node, "TryStatement");
  };
  pp$1.parseVarStatement = function(node, kind) {
      this.next();
      this.parseVar(node, false, kind);
      this.semicolon();
      return this.finishNode(node, "VariableDeclaration");
  };
  pp$1.parseWhileStatement = function(node) {
      this.next();
      node.test = this.parseParenExpression();
      this.labels.push(loopLabel);
      node.body = this.parseStatement("while");
      this.labels.pop();
      return this.finishNode(node, "WhileStatement");
  };
  pp$1.parseWithStatement = function(node) {
      if (this.strict) this.raise(this.start, "'with' in strict mode");
      this.next();
      node.object = this.parseParenExpression();
      node.body = this.parseStatement("with");
      return this.finishNode(node, "WithStatement");
  };
  pp$1.parseEmptyStatement = function(node) {
      this.next();
      return this.finishNode(node, "EmptyStatement");
  };
  pp$1.parseLabeledStatement = function(node, maybeName, expr, context) {
      for(var i$1 = 0, list = this.labels; i$1 < list.length; i$1 += 1){
          var label = list[i$1];
          if (label.name === maybeName) this.raise(expr.start, "Label '" + maybeName + "' is already declared");
      }
      var kind = this.type.isLoop ? "loop" : this.type === types._switch ? "switch" : null;
      for(var i = this.labels.length - 1; i >= 0; i--){
          var label$1 = this.labels[i];
          if (label$1.statementStart === node.start) {
              // Update information about previous labels on this node
              label$1.statementStart = this.start;
              label$1.kind = kind;
          } else break;
      }
      this.labels.push({
          name: maybeName,
          kind: kind,
          statementStart: this.start
      });
      node.body = this.parseStatement(context ? context.indexOf("label") === -1 ? context + "label" : context : "label");
      this.labels.pop();
      node.label = expr;
      return this.finishNode(node, "LabeledStatement");
  };
  pp$1.parseExpressionStatement = function(node, expr) {
      node.expression = expr;
      this.semicolon();
      return this.finishNode(node, "ExpressionStatement");
  };
  // Parse a semicolon-enclosed block of statements, handling `"use
  // strict"` declarations when `allowStrict` is true (used for
  // function bodies).
  pp$1.parseBlock = function(createNewLexicalScope, node, exitStrict) {
      if (createNewLexicalScope === void 0) createNewLexicalScope = true;
      if (node === void 0) node = this.startNode();
      node.body = [];
      this.expect(types.braceL);
      if (createNewLexicalScope) this.enterScope(0);
      while(this.type !== types.braceR){
          var stmt = this.parseStatement(null);
          node.body.push(stmt);
      }
      if (exitStrict) this.strict = false;
      this.next();
      if (createNewLexicalScope) this.exitScope();
      return this.finishNode(node, "BlockStatement");
  };
  // Parse a regular `for` loop. The disambiguation code in
  // `parseStatement` will already have parsed the init statement or
  // expression.
  pp$1.parseFor = function(node, init) {
      node.init = init;
      this.expect(types.semi);
      node.test = this.type === types.semi ? null : this.parseExpression();
      this.expect(types.semi);
      node.update = this.type === types.parenR ? null : this.parseExpression();
      this.expect(types.parenR);
      node.body = this.parseStatement("for");
      this.exitScope();
      this.labels.pop();
      return this.finishNode(node, "ForStatement");
  };
  // Parse a `for`/`in` and `for`/`of` loop, which are almost
  // same from parser's perspective.
  pp$1.parseForIn = function(node, init) {
      var isForIn = this.type === types._in;
      this.next();
      if (init.type === "VariableDeclaration" && init.declarations[0].init != null && (!isForIn || this.options.ecmaVersion < 8 || this.strict || init.kind !== "var" || init.declarations[0].id.type !== "Identifier")) this.raise(init.start, (isForIn ? "for-in" : "for-of") + " loop variable declaration may not have an initializer");
      else if (init.type === "AssignmentPattern") this.raise(init.start, "Invalid left-hand side in for-loop");
      node.left = init;
      node.right = isForIn ? this.parseExpression() : this.parseMaybeAssign();
      this.expect(types.parenR);
      node.body = this.parseStatement("for");
      this.exitScope();
      this.labels.pop();
      return this.finishNode(node, isForIn ? "ForInStatement" : "ForOfStatement");
  };
  // Parse a list of variable declarations.
  pp$1.parseVar = function(node, isFor, kind) {
      node.declarations = [];
      node.kind = kind;
      for(;;){
          var decl = this.startNode();
          this.parseVarId(decl, kind);
          if (this.eat(types.eq)) decl.init = this.parseMaybeAssign(isFor);
          else if (kind === "const" && !(this.type === types._in || this.options.ecmaVersion >= 6 && this.isContextual("of"))) this.unexpected();
          else if (decl.id.type !== "Identifier" && !(isFor && (this.type === types._in || this.isContextual("of")))) this.raise(this.lastTokEnd, "Complex binding patterns require an initialization value");
          else decl.init = null;
          node.declarations.push(this.finishNode(decl, "VariableDeclarator"));
          if (!this.eat(types.comma)) break;
      }
      return node;
  };
  pp$1.parseVarId = function(decl, kind) {
      decl.id = this.parseBindingAtom();
      this.checkLVal(decl.id, kind === "var" ? BIND_VAR : BIND_LEXICAL, false);
  };
  var FUNC_STATEMENT = 1, FUNC_HANGING_STATEMENT = 2, FUNC_NULLABLE_ID = 4;
  // Parse a function declaration or literal (depending on the
  // `statement & FUNC_STATEMENT`).
  // Remove `allowExpressionBody` for 7.0.0, as it is only called with false
  pp$1.parseFunction = function(node, statement, allowExpressionBody, isAsync) {
      this.initFunction(node);
      if (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !isAsync) {
          if (this.type === types.star && statement & FUNC_HANGING_STATEMENT) this.unexpected();
          node.generator = this.eat(types.star);
      }
      if (this.options.ecmaVersion >= 8) node.async = !!isAsync;
      if (statement & FUNC_STATEMENT) {
          node.id = statement & FUNC_NULLABLE_ID && this.type !== types.name ? null : this.parseIdent();
          if (node.id && !(statement & FUNC_HANGING_STATEMENT)) this.checkLVal(node.id, this.strict || node.generator || node.async ? this.treatFunctionsAsVar ? BIND_VAR : BIND_LEXICAL : BIND_FUNCTION);
      }
      var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
      this.yieldPos = 0;
      this.awaitPos = 0;
      this.awaitIdentPos = 0;
      this.enterScope(functionFlags(node.async, node.generator));
      if (!(statement & FUNC_STATEMENT)) node.id = this.type === types.name ? this.parseIdent() : null;
      this.parseFunctionParams(node);
      this.parseFunctionBody(node, allowExpressionBody, false);
      this.yieldPos = oldYieldPos;
      this.awaitPos = oldAwaitPos;
      this.awaitIdentPos = oldAwaitIdentPos;
      return this.finishNode(node, statement & FUNC_STATEMENT ? "FunctionDeclaration" : "FunctionExpression");
  };
  pp$1.parseFunctionParams = function(node) {
      this.expect(types.parenL);
      node.params = this.parseBindingList(types.parenR, false, this.options.ecmaVersion >= 8);
      this.checkYieldAwaitInDefaultParams();
  };
  // Parse a class declaration or literal (depending on the
  // `isStatement` parameter).
  pp$1.parseClass = function(node, isStatement) {
      this.next();
      // ecma-262 14.6 Class Definitions
      // A class definition is always strict mode code.
      var oldStrict = this.strict;
      this.strict = true;
      this.parseClassId(node, isStatement);
      this.parseClassSuper(node);
      var classBody = this.startNode();
      var hadConstructor = false;
      classBody.body = [];
      this.expect(types.braceL);
      while(this.type !== types.braceR){
          var element = this.parseClassElement(node.superClass !== null);
          if (element) {
              classBody.body.push(element);
              if (element.type === "MethodDefinition" && element.kind === "constructor") {
                  if (hadConstructor) this.raise(element.start, "Duplicate constructor in the same class");
                  hadConstructor = true;
              }
          }
      }
      this.strict = oldStrict;
      this.next();
      node.body = this.finishNode(classBody, "ClassBody");
      return this.finishNode(node, isStatement ? "ClassDeclaration" : "ClassExpression");
  };
  pp$1.parseClassElement = function(constructorAllowsSuper) {
      var this$1 = this;
      if (this.eat(types.semi)) return null;
      var method = this.startNode();
      var tryContextual = function tryContextual(k, noLineBreak) {
          if (noLineBreak === void 0) noLineBreak = false;
          var start = this$1.start, startLoc = this$1.startLoc;
          if (!this$1.eatContextual(k)) return false;
          if (this$1.type !== types.parenL && (!noLineBreak || !this$1.canInsertSemicolon())) return true;
          if (method.key) this$1.unexpected();
          method.computed = false;
          method.key = this$1.startNodeAt(start, startLoc);
          method.key.name = k;
          this$1.finishNode(method.key, "Identifier");
          return false;
      };
      method.kind = "method";
      method.static = tryContextual("static");
      var isGenerator = this.eat(types.star);
      var isAsync = false;
      if (!isGenerator) {
          if (this.options.ecmaVersion >= 8 && tryContextual("async", true)) {
              isAsync = true;
              isGenerator = this.options.ecmaVersion >= 9 && this.eat(types.star);
          } else if (tryContextual("get")) method.kind = "get";
          else if (tryContextual("set")) method.kind = "set";
      }
      if (!method.key) this.parsePropertyName(method);
      var key = method.key;
      var allowsDirectSuper = false;
      if (!method.computed && !method.static && (key.type === "Identifier" && key.name === "constructor" || key.type === "Literal" && key.value === "constructor")) {
          if (method.kind !== "method") this.raise(key.start, "Constructor can't have get/set modifier");
          if (isGenerator) this.raise(key.start, "Constructor can't be a generator");
          if (isAsync) this.raise(key.start, "Constructor can't be an async method");
          method.kind = "constructor";
          allowsDirectSuper = constructorAllowsSuper;
      } else if (method.static && key.type === "Identifier" && key.name === "prototype") this.raise(key.start, "Classes may not have a static property named prototype");
      this.parseClassMethod(method, isGenerator, isAsync, allowsDirectSuper);
      if (method.kind === "get" && method.value.params.length !== 0) this.raiseRecoverable(method.value.start, "getter should have no params");
      if (method.kind === "set" && method.value.params.length !== 1) this.raiseRecoverable(method.value.start, "setter should have exactly one param");
      if (method.kind === "set" && method.value.params[0].type === "RestElement") this.raiseRecoverable(method.value.params[0].start, "Setter cannot use rest params");
      return method;
  };
  pp$1.parseClassMethod = function(method, isGenerator, isAsync, allowsDirectSuper) {
      method.value = this.parseMethod(isGenerator, isAsync, allowsDirectSuper);
      return this.finishNode(method, "MethodDefinition");
  };
  pp$1.parseClassId = function(node, isStatement) {
      if (this.type === types.name) {
          node.id = this.parseIdent();
          if (isStatement) this.checkLVal(node.id, BIND_LEXICAL, false);
      } else {
          if (isStatement === true) this.unexpected();
          node.id = null;
      }
  };
  pp$1.parseClassSuper = function(node) {
      node.superClass = this.eat(types._extends) ? this.parseExprSubscripts() : null;
  };
  // Parses module export declaration.
  pp$1.parseExport = function(node, exports) {
      this.next();
      // export * from '...'
      if (this.eat(types.star)) {
          if (this.options.ecmaVersion >= 11) {
              if (this.eatContextual("as")) {
                  node.exported = this.parseIdent(true);
                  this.checkExport(exports, node.exported.name, this.lastTokStart);
              } else node.exported = null;
          }
          this.expectContextual("from");
          if (this.type !== types.string) this.unexpected();
          node.source = this.parseExprAtom();
          this.semicolon();
          return this.finishNode(node, "ExportAllDeclaration");
      }
      if (this.eat(types._default)) {
          this.checkExport(exports, "default", this.lastTokStart);
          var isAsync;
          if (this.type === types._function || (isAsync = this.isAsyncFunction())) {
              var fNode = this.startNode();
              this.next();
              if (isAsync) this.next();
              node.declaration = this.parseFunction(fNode, FUNC_STATEMENT | FUNC_NULLABLE_ID, false, isAsync);
          } else if (this.type === types._class) {
              var cNode = this.startNode();
              node.declaration = this.parseClass(cNode, "nullableID");
          } else {
              node.declaration = this.parseMaybeAssign();
              this.semicolon();
          }
          return this.finishNode(node, "ExportDefaultDeclaration");
      }
      // export var|const|let|function|class ...
      if (this.shouldParseExportStatement()) {
          node.declaration = this.parseStatement(null);
          if (node.declaration.type === "VariableDeclaration") this.checkVariableExport(exports, node.declaration.declarations);
          else this.checkExport(exports, node.declaration.id.name, node.declaration.id.start);
          node.specifiers = [];
          node.source = null;
      } else {
          node.declaration = null;
          node.specifiers = this.parseExportSpecifiers(exports);
          if (this.eatContextual("from")) {
              if (this.type !== types.string) this.unexpected();
              node.source = this.parseExprAtom();
          } else {
              for(var i = 0, list = node.specifiers; i < list.length; i += 1){
                  // check for keywords used as local names
                  var spec = list[i];
                  this.checkUnreserved(spec.local);
                  // check if export is defined
                  this.checkLocalExport(spec.local);
              }
              node.source = null;
          }
          this.semicolon();
      }
      return this.finishNode(node, "ExportNamedDeclaration");
  };
  pp$1.checkExport = function(exports, name, pos) {
      if (!exports) return;
      if (has(exports, name)) this.raiseRecoverable(pos, "Duplicate export '" + name + "'");
      exports[name] = true;
  };
  pp$1.checkPatternExport = function(exports, pat) {
      var type = pat.type;
      if (type === "Identifier") this.checkExport(exports, pat.name, pat.start);
      else if (type === "ObjectPattern") for(var i = 0, list = pat.properties; i < list.length; i += 1){
          var prop = list[i];
          this.checkPatternExport(exports, prop);
      }
      else if (type === "ArrayPattern") for(var i$1 = 0, list$1 = pat.elements; i$1 < list$1.length; i$1 += 1){
          var elt = list$1[i$1];
          if (elt) this.checkPatternExport(exports, elt);
      }
      else if (type === "Property") this.checkPatternExport(exports, pat.value);
      else if (type === "AssignmentPattern") this.checkPatternExport(exports, pat.left);
      else if (type === "RestElement") this.checkPatternExport(exports, pat.argument);
      else if (type === "ParenthesizedExpression") this.checkPatternExport(exports, pat.expression);
  };
  pp$1.checkVariableExport = function(exports, decls) {
      if (!exports) return;
      for(var i = 0, list = decls; i < list.length; i += 1){
          var decl = list[i];
          this.checkPatternExport(exports, decl.id);
      }
  };
  pp$1.shouldParseExportStatement = function() {
      return this.type.keyword === "var" || this.type.keyword === "const" || this.type.keyword === "class" || this.type.keyword === "function" || this.isLet() || this.isAsyncFunction();
  };
  // Parses a comma-separated list of module exports.
  pp$1.parseExportSpecifiers = function(exports) {
      var nodes = [], first = true;
      // export { x, y as z } [from '...']
      this.expect(types.braceL);
      while(!this.eat(types.braceR)){
          if (!first) {
              this.expect(types.comma);
              if (this.afterTrailingComma(types.braceR)) break;
          } else first = false;
          var node = this.startNode();
          node.local = this.parseIdent(true);
          node.exported = this.eatContextual("as") ? this.parseIdent(true) : node.local;
          this.checkExport(exports, node.exported.name, node.exported.start);
          nodes.push(this.finishNode(node, "ExportSpecifier"));
      }
      return nodes;
  };
  // Parses import declaration.
  pp$1.parseImport = function(node) {
      this.next();
      // import '...'
      if (this.type === types.string) {
          node.specifiers = empty;
          node.source = this.parseExprAtom();
      } else {
          node.specifiers = this.parseImportSpecifiers();
          this.expectContextual("from");
          node.source = this.type === types.string ? this.parseExprAtom() : this.unexpected();
      }
      this.semicolon();
      return this.finishNode(node, "ImportDeclaration");
  };
  // Parses a comma-separated list of module imports.
  pp$1.parseImportSpecifiers = function() {
      var nodes = [], first = true;
      if (this.type === types.name) {
          // import defaultObj, { x, y as z } from '...'
          var node = this.startNode();
          node.local = this.parseIdent();
          this.checkLVal(node.local, BIND_LEXICAL);
          nodes.push(this.finishNode(node, "ImportDefaultSpecifier"));
          if (!this.eat(types.comma)) return nodes;
      }
      if (this.type === types.star) {
          var node$1 = this.startNode();
          this.next();
          this.expectContextual("as");
          node$1.local = this.parseIdent();
          this.checkLVal(node$1.local, BIND_LEXICAL);
          nodes.push(this.finishNode(node$1, "ImportNamespaceSpecifier"));
          return nodes;
      }
      this.expect(types.braceL);
      while(!this.eat(types.braceR)){
          if (!first) {
              this.expect(types.comma);
              if (this.afterTrailingComma(types.braceR)) break;
          } else first = false;
          var node$2 = this.startNode();
          node$2.imported = this.parseIdent(true);
          if (this.eatContextual("as")) node$2.local = this.parseIdent();
          else {
              this.checkUnreserved(node$2.imported);
              node$2.local = node$2.imported;
          }
          this.checkLVal(node$2.local, BIND_LEXICAL);
          nodes.push(this.finishNode(node$2, "ImportSpecifier"));
      }
      return nodes;
  };
  // Set `ExpressionStatement#directive` property for directive prologues.
  pp$1.adaptDirectivePrologue = function(statements) {
      for(var i = 0; i < statements.length && this.isDirectiveCandidate(statements[i]); ++i)statements[i].directive = statements[i].expression.raw.slice(1, -1);
  };
  pp$1.isDirectiveCandidate = function(statement) {
      return statement.type === "ExpressionStatement" && statement.expression.type === "Literal" && typeof statement.expression.value === "string" && // Reject parenthesized strings.
      (this.input[statement.start] === '"' || this.input[statement.start] === "'");
  };
  var pp$2 = Parser.prototype;
  // Convert existing expression atom to assignable pattern
  // if possible.
  pp$2.toAssignable = function(node, isBinding, refDestructuringErrors) {
      if (this.options.ecmaVersion >= 6 && node) switch(node.type){
          case "Identifier":
              if (this.inAsync && node.name === "await") this.raise(node.start, "Cannot use 'await' as identifier inside an async function");
              break;
          case "ObjectPattern":
          case "ArrayPattern":
          case "RestElement":
              break;
          case "ObjectExpression":
              node.type = "ObjectPattern";
              if (refDestructuringErrors) this.checkPatternErrors(refDestructuringErrors, true);
              for(var i = 0, list = node.properties; i < list.length; i += 1){
                  var prop = list[i];
                  this.toAssignable(prop, isBinding);
                  // Early error:
                  //   AssignmentRestProperty[Yield, Await] :
                  //     `...` DestructuringAssignmentTarget[Yield, Await]
                  //
                  //   It is a Syntax Error if |DestructuringAssignmentTarget| is an |ArrayLiteral| or an |ObjectLiteral|.
                  if (prop.type === "RestElement" && (prop.argument.type === "ArrayPattern" || prop.argument.type === "ObjectPattern")) this.raise(prop.argument.start, "Unexpected token");
              }
              break;
          case "Property":
              // AssignmentProperty has type === "Property"
              if (node.kind !== "init") this.raise(node.key.start, "Object pattern can't contain getter or setter");
              this.toAssignable(node.value, isBinding);
              break;
          case "ArrayExpression":
              node.type = "ArrayPattern";
              if (refDestructuringErrors) this.checkPatternErrors(refDestructuringErrors, true);
              this.toAssignableList(node.elements, isBinding);
              break;
          case "SpreadElement":
              node.type = "RestElement";
              this.toAssignable(node.argument, isBinding);
              if (node.argument.type === "AssignmentPattern") this.raise(node.argument.start, "Rest elements cannot have a default value");
              break;
          case "AssignmentExpression":
              if (node.operator !== "=") this.raise(node.left.end, "Only '=' operator can be used for specifying default value.");
              node.type = "AssignmentPattern";
              delete node.operator;
              this.toAssignable(node.left, isBinding);
          // falls through to AssignmentPattern
          case "AssignmentPattern":
              break;
          case "ParenthesizedExpression":
              this.toAssignable(node.expression, isBinding, refDestructuringErrors);
              break;
          case "ChainExpression":
              this.raiseRecoverable(node.start, "Optional chaining cannot appear in left-hand side");
              break;
          case "MemberExpression":
              if (!isBinding) break;
          default:
              this.raise(node.start, "Assigning to rvalue");
      }
      else if (refDestructuringErrors) this.checkPatternErrors(refDestructuringErrors, true);
      return node;
  };
  // Convert list of expression atoms to binding list.
  pp$2.toAssignableList = function(exprList, isBinding) {
      var end = exprList.length;
      for(var i = 0; i < end; i++){
          var elt = exprList[i];
          if (elt) this.toAssignable(elt, isBinding);
      }
      if (end) {
          var last = exprList[end - 1];
          if (this.options.ecmaVersion === 6 && isBinding && last && last.type === "RestElement" && last.argument.type !== "Identifier") this.unexpected(last.argument.start);
      }
      return exprList;
  };
  // Parses spread element.
  pp$2.parseSpread = function(refDestructuringErrors) {
      var node = this.startNode();
      this.next();
      node.argument = this.parseMaybeAssign(false, refDestructuringErrors);
      return this.finishNode(node, "SpreadElement");
  };
  pp$2.parseRestBinding = function() {
      var node = this.startNode();
      this.next();
      // RestElement inside of a function parameter must be an identifier
      if (this.options.ecmaVersion === 6 && this.type !== types.name) this.unexpected();
      node.argument = this.parseBindingAtom();
      return this.finishNode(node, "RestElement");
  };
  // Parses lvalue (assignable) atom.
  pp$2.parseBindingAtom = function() {
      if (this.options.ecmaVersion >= 6) switch(this.type){
          case types.bracketL:
              var node = this.startNode();
              this.next();
              node.elements = this.parseBindingList(types.bracketR, true, true);
              return this.finishNode(node, "ArrayPattern");
          case types.braceL:
              return this.parseObj(true);
      }
      return this.parseIdent();
  };
  pp$2.parseBindingList = function(close, allowEmpty, allowTrailingComma) {
      var elts = [], first = true;
      while(!this.eat(close)){
          if (first) first = false;
          else this.expect(types.comma);
          if (allowEmpty && this.type === types.comma) elts.push(null);
          else if (allowTrailingComma && this.afterTrailingComma(close)) break;
          else if (this.type === types.ellipsis) {
              var rest = this.parseRestBinding();
              this.parseBindingListItem(rest);
              elts.push(rest);
              if (this.type === types.comma) this.raise(this.start, "Comma is not permitted after the rest element");
              this.expect(close);
              break;
          } else {
              var elem = this.parseMaybeDefault(this.start, this.startLoc);
              this.parseBindingListItem(elem);
              elts.push(elem);
          }
      }
      return elts;
  };
  pp$2.parseBindingListItem = function(param) {
      return param;
  };
  // Parses assignment pattern around given atom if possible.
  pp$2.parseMaybeDefault = function(startPos, startLoc, left) {
      left = left || this.parseBindingAtom();
      if (this.options.ecmaVersion < 6 || !this.eat(types.eq)) return left;
      var node = this.startNodeAt(startPos, startLoc);
      node.left = left;
      node.right = this.parseMaybeAssign();
      return this.finishNode(node, "AssignmentPattern");
  };
  // Verify that a node is an lval — something that can be assigned
  // to.
  // bindingType can be either:
  // 'var' indicating that the lval creates a 'var' binding
  // 'let' indicating that the lval creates a lexical ('let' or 'const') binding
  // 'none' indicating that the binding should be checked for illegal identifiers, but not for duplicate references
  pp$2.checkLVal = function(expr, bindingType, checkClashes) {
      if (bindingType === void 0) bindingType = BIND_NONE;
      switch(expr.type){
          case "Identifier":
              if (bindingType === BIND_LEXICAL && expr.name === "let") this.raiseRecoverable(expr.start, "let is disallowed as a lexically bound name");
              if (this.strict && this.reservedWordsStrictBind.test(expr.name)) this.raiseRecoverable(expr.start, (bindingType ? "Binding " : "Assigning to ") + expr.name + " in strict mode");
              if (checkClashes) {
                  if (has(checkClashes, expr.name)) this.raiseRecoverable(expr.start, "Argument name clash");
                  checkClashes[expr.name] = true;
              }
              if (bindingType !== BIND_NONE && bindingType !== BIND_OUTSIDE) this.declareName(expr.name, bindingType, expr.start);
              break;
          case "ChainExpression":
              this.raiseRecoverable(expr.start, "Optional chaining cannot appear in left-hand side");
              break;
          case "MemberExpression":
              if (bindingType) this.raiseRecoverable(expr.start, "Binding member expression");
              break;
          case "ObjectPattern":
              for(var i = 0, list = expr.properties; i < list.length; i += 1){
                  var prop = list[i];
                  this.checkLVal(prop, bindingType, checkClashes);
              }
              break;
          case "Property":
              // AssignmentProperty has type === "Property"
              this.checkLVal(expr.value, bindingType, checkClashes);
              break;
          case "ArrayPattern":
              for(var i$1 = 0, list$1 = expr.elements; i$1 < list$1.length; i$1 += 1){
                  var elem = list$1[i$1];
                  if (elem) this.checkLVal(elem, bindingType, checkClashes);
              }
              break;
          case "AssignmentPattern":
              this.checkLVal(expr.left, bindingType, checkClashes);
              break;
          case "RestElement":
              this.checkLVal(expr.argument, bindingType, checkClashes);
              break;
          case "ParenthesizedExpression":
              this.checkLVal(expr.expression, bindingType, checkClashes);
              break;
          default:
              this.raise(expr.start, (bindingType ? "Binding" : "Assigning to") + " rvalue");
      }
  };
  // A recursive descent parser operates by defining functions for all
  var pp$3 = Parser.prototype;
  // Check if property name clashes with already added.
  // Object/class getters and setters are not allowed to clash —
  // either with each other or with an init property — and in
  // strict mode, init properties are also not allowed to be repeated.
  pp$3.checkPropClash = function(prop, propHash, refDestructuringErrors) {
      if (this.options.ecmaVersion >= 9 && prop.type === "SpreadElement") return;
      if (this.options.ecmaVersion >= 6 && (prop.computed || prop.method || prop.shorthand)) return;
      var key = prop.key;
      var name;
      switch(key.type){
          case "Identifier":
              name = key.name;
              break;
          case "Literal":
              name = String(key.value);
              break;
          default:
              return;
      }
      var kind = prop.kind;
      if (this.options.ecmaVersion >= 6) {
          if (name === "__proto__" && kind === "init") {
              if (propHash.proto) {
                  if (refDestructuringErrors) {
                      if (refDestructuringErrors.doubleProto < 0) refDestructuringErrors.doubleProto = key.start;
                  } else this.raiseRecoverable(key.start, "Redefinition of __proto__ property");
              }
              propHash.proto = true;
          }
          return;
      }
      name = "$" + name;
      var other = propHash[name];
      if (other) {
          var redefinition;
          if (kind === "init") redefinition = this.strict && other.init || other.get || other.set;
          else redefinition = other.init || other[kind];
          if (redefinition) this.raiseRecoverable(key.start, "Redefinition of property");
      } else other = propHash[name] = {
          init: false,
          get: false,
          set: false
      };
      other[kind] = true;
  };
  // ### Expression parsing
  // These nest, from the most general expression type at the top to
  // 'atomic', nondivisible expression types at the bottom. Most of
  // the functions will simply let the function(s) below them parse,
  // and, *if* the syntactic construct they handle is present, wrap
  // the AST node that the inner parser gave them in another node.
  // Parse a full expression. The optional arguments are used to
  // forbid the `in` operator (in for loops initalization expressions)
  // and provide reference for storing '=' operator inside shorthand
  // property assignment in contexts where both object expression
  // and object pattern might appear (so it's possible to raise
  // delayed syntax error at correct position).
  pp$3.parseExpression = function(noIn, refDestructuringErrors) {
      var startPos = this.start, startLoc = this.startLoc;
      var expr = this.parseMaybeAssign(noIn, refDestructuringErrors);
      if (this.type === types.comma) {
          var node = this.startNodeAt(startPos, startLoc);
          node.expressions = [
              expr
          ];
          while(this.eat(types.comma))node.expressions.push(this.parseMaybeAssign(noIn, refDestructuringErrors));
          return this.finishNode(node, "SequenceExpression");
      }
      return expr;
  };
  // Parse an assignment expression. This includes applications of
  // operators like `+=`.
  pp$3.parseMaybeAssign = function(noIn, refDestructuringErrors, afterLeftParse) {
      if (this.isContextual("yield")) {
          if (this.inGenerator) return this.parseYield(noIn);
          else this.exprAllowed = false;
      }
      var ownDestructuringErrors = false, oldParenAssign = -1, oldTrailingComma = -1;
      if (refDestructuringErrors) {
          oldParenAssign = refDestructuringErrors.parenthesizedAssign;
          oldTrailingComma = refDestructuringErrors.trailingComma;
          refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = -1;
      } else {
          refDestructuringErrors = new DestructuringErrors;
          ownDestructuringErrors = true;
      }
      var startPos = this.start, startLoc = this.startLoc;
      if (this.type === types.parenL || this.type === types.name) this.potentialArrowAt = this.start;
      var left = this.parseMaybeConditional(noIn, refDestructuringErrors);
      if (afterLeftParse) left = afterLeftParse.call(this, left, startPos, startLoc);
      if (this.type.isAssign) {
          var node = this.startNodeAt(startPos, startLoc);
          node.operator = this.value;
          node.left = this.type === types.eq ? this.toAssignable(left, false, refDestructuringErrors) : left;
          if (!ownDestructuringErrors) refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = refDestructuringErrors.doubleProto = -1;
          if (refDestructuringErrors.shorthandAssign >= node.left.start) refDestructuringErrors.shorthandAssign = -1;
           // reset because shorthand default was used correctly
          this.checkLVal(left);
          this.next();
          node.right = this.parseMaybeAssign(noIn);
          return this.finishNode(node, "AssignmentExpression");
      } else if (ownDestructuringErrors) this.checkExpressionErrors(refDestructuringErrors, true);
      if (oldParenAssign > -1) refDestructuringErrors.parenthesizedAssign = oldParenAssign;
      if (oldTrailingComma > -1) refDestructuringErrors.trailingComma = oldTrailingComma;
      return left;
  };
  // Parse a ternary conditional (`?:`) operator.
  pp$3.parseMaybeConditional = function(noIn, refDestructuringErrors) {
      var startPos = this.start, startLoc = this.startLoc;
      var expr = this.parseExprOps(noIn, refDestructuringErrors);
      if (this.checkExpressionErrors(refDestructuringErrors)) return expr;
      if (this.eat(types.question)) {
          var node = this.startNodeAt(startPos, startLoc);
          node.test = expr;
          node.consequent = this.parseMaybeAssign();
          this.expect(types.colon);
          node.alternate = this.parseMaybeAssign(noIn);
          return this.finishNode(node, "ConditionalExpression");
      }
      return expr;
  };
  // Start the precedence parser.
  pp$3.parseExprOps = function(noIn, refDestructuringErrors) {
      var startPos = this.start, startLoc = this.startLoc;
      var expr = this.parseMaybeUnary(refDestructuringErrors, false);
      if (this.checkExpressionErrors(refDestructuringErrors)) return expr;
      return expr.start === startPos && expr.type === "ArrowFunctionExpression" ? expr : this.parseExprOp(expr, startPos, startLoc, -1, noIn);
  };
  // Parse binary operators with the operator precedence parsing
  // algorithm. `left` is the left-hand side of the operator.
  // `minPrec` provides context that allows the function to stop and
  // defer further parser to one of its callers when it encounters an
  // operator that has a lower precedence than the set it is parsing.
  pp$3.parseExprOp = function(left, leftStartPos, leftStartLoc, minPrec, noIn) {
      var prec = this.type.binop;
      if (prec != null && (!noIn || this.type !== types._in)) {
          if (prec > minPrec) {
              var logical = this.type === types.logicalOR || this.type === types.logicalAND;
              var coalesce = this.type === types.coalesce;
              if (coalesce) // Handle the precedence of `tt.coalesce` as equal to the range of logical expressions.
              // In other words, `node.right` shouldn't contain logical expressions in order to check the mixed error.
              prec = types.logicalAND.binop;
              var op = this.value;
              this.next();
              var startPos = this.start, startLoc = this.startLoc;
              var right = this.parseExprOp(this.parseMaybeUnary(null, false), startPos, startLoc, prec, noIn);
              var node = this.buildBinary(leftStartPos, leftStartLoc, left, right, op, logical || coalesce);
              if (logical && this.type === types.coalesce || coalesce && (this.type === types.logicalOR || this.type === types.logicalAND)) this.raiseRecoverable(this.start, "Logical expressions and coalesce expressions cannot be mixed. Wrap either by parentheses");
              return this.parseExprOp(node, leftStartPos, leftStartLoc, minPrec, noIn);
          }
      }
      return left;
  };
  pp$3.buildBinary = function(startPos, startLoc, left, right, op, logical) {
      var node = this.startNodeAt(startPos, startLoc);
      node.left = left;
      node.operator = op;
      node.right = right;
      return this.finishNode(node, logical ? "LogicalExpression" : "BinaryExpression");
  };
  // Parse unary operators, both prefix and postfix.
  pp$3.parseMaybeUnary = function(refDestructuringErrors, sawUnary) {
      var startPos = this.start, startLoc = this.startLoc, expr;
      if (this.isContextual("await") && (this.inAsync || !this.inFunction && this.options.allowAwaitOutsideFunction)) {
          expr = this.parseAwait();
          sawUnary = true;
      } else if (this.type.prefix) {
          var node = this.startNode(), update = this.type === types.incDec;
          node.operator = this.value;
          node.prefix = true;
          this.next();
          node.argument = this.parseMaybeUnary(null, true);
          this.checkExpressionErrors(refDestructuringErrors, true);
          if (update) this.checkLVal(node.argument);
          else if (this.strict && node.operator === "delete" && node.argument.type === "Identifier") this.raiseRecoverable(node.start, "Deleting local variable in strict mode");
          else sawUnary = true;
          expr = this.finishNode(node, update ? "UpdateExpression" : "UnaryExpression");
      } else {
          expr = this.parseExprSubscripts(refDestructuringErrors);
          if (this.checkExpressionErrors(refDestructuringErrors)) return expr;
          while(this.type.postfix && !this.canInsertSemicolon()){
              var node$1 = this.startNodeAt(startPos, startLoc);
              node$1.operator = this.value;
              node$1.prefix = false;
              node$1.argument = expr;
              this.checkLVal(expr);
              this.next();
              expr = this.finishNode(node$1, "UpdateExpression");
          }
      }
      if (!sawUnary && this.eat(types.starstar)) return this.buildBinary(startPos, startLoc, expr, this.parseMaybeUnary(null, false), "**", false);
      else return expr;
  };
  // Parse call, dot, and `[]`-subscript expressions.
  pp$3.parseExprSubscripts = function(refDestructuringErrors) {
      var startPos = this.start, startLoc = this.startLoc;
      var expr = this.parseExprAtom(refDestructuringErrors);
      if (expr.type === "ArrowFunctionExpression" && this.input.slice(this.lastTokStart, this.lastTokEnd) !== ")") return expr;
      var result = this.parseSubscripts(expr, startPos, startLoc);
      if (refDestructuringErrors && result.type === "MemberExpression") {
          if (refDestructuringErrors.parenthesizedAssign >= result.start) refDestructuringErrors.parenthesizedAssign = -1;
          if (refDestructuringErrors.parenthesizedBind >= result.start) refDestructuringErrors.parenthesizedBind = -1;
      }
      return result;
  };
  pp$3.parseSubscripts = function(base, startPos, startLoc, noCalls) {
      var maybeAsyncArrow = this.options.ecmaVersion >= 8 && base.type === "Identifier" && base.name === "async" && this.lastTokEnd === base.end && !this.canInsertSemicolon() && base.end - base.start === 5 && this.potentialArrowAt === base.start;
      var optionalChained = false;
      while(true){
          var element = this.parseSubscript(base, startPos, startLoc, noCalls, maybeAsyncArrow, optionalChained);
          if (element.optional) optionalChained = true;
          if (element === base || element.type === "ArrowFunctionExpression") {
              if (optionalChained) {
                  var chainNode = this.startNodeAt(startPos, startLoc);
                  chainNode.expression = element;
                  element = this.finishNode(chainNode, "ChainExpression");
              }
              return element;
          }
          base = element;
      }
  };
  pp$3.parseSubscript = function(base, startPos, startLoc, noCalls, maybeAsyncArrow, optionalChained) {
      var optionalSupported = this.options.ecmaVersion >= 11;
      var optional = optionalSupported && this.eat(types.questionDot);
      if (noCalls && optional) this.raise(this.lastTokStart, "Optional chaining cannot appear in the callee of new expressions");
      var computed = this.eat(types.bracketL);
      if (computed || optional && this.type !== types.parenL && this.type !== types.backQuote || this.eat(types.dot)) {
          var node = this.startNodeAt(startPos, startLoc);
          node.object = base;
          node.property = computed ? this.parseExpression() : this.parseIdent(this.options.allowReserved !== "never");
          node.computed = !!computed;
          if (computed) this.expect(types.bracketR);
          if (optionalSupported) node.optional = optional;
          base = this.finishNode(node, "MemberExpression");
      } else if (!noCalls && this.eat(types.parenL)) {
          var refDestructuringErrors = new DestructuringErrors, oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
          this.yieldPos = 0;
          this.awaitPos = 0;
          this.awaitIdentPos = 0;
          var exprList = this.parseExprList(types.parenR, this.options.ecmaVersion >= 8, false, refDestructuringErrors);
          if (maybeAsyncArrow && !optional && !this.canInsertSemicolon() && this.eat(types.arrow)) {
              this.checkPatternErrors(refDestructuringErrors, false);
              this.checkYieldAwaitInDefaultParams();
              if (this.awaitIdentPos > 0) this.raise(this.awaitIdentPos, "Cannot use 'await' as identifier inside an async function");
              this.yieldPos = oldYieldPos;
              this.awaitPos = oldAwaitPos;
              this.awaitIdentPos = oldAwaitIdentPos;
              return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList, true);
          }
          this.checkExpressionErrors(refDestructuringErrors, true);
          this.yieldPos = oldYieldPos || this.yieldPos;
          this.awaitPos = oldAwaitPos || this.awaitPos;
          this.awaitIdentPos = oldAwaitIdentPos || this.awaitIdentPos;
          var node$1 = this.startNodeAt(startPos, startLoc);
          node$1.callee = base;
          node$1.arguments = exprList;
          if (optionalSupported) node$1.optional = optional;
          base = this.finishNode(node$1, "CallExpression");
      } else if (this.type === types.backQuote) {
          if (optional || optionalChained) this.raise(this.start, "Optional chaining cannot appear in the tag of tagged template expressions");
          var node$2 = this.startNodeAt(startPos, startLoc);
          node$2.tag = base;
          node$2.quasi = this.parseTemplate({
              isTagged: true
          });
          base = this.finishNode(node$2, "TaggedTemplateExpression");
      }
      return base;
  };
  // Parse an atomic expression — either a single token that is an
  // expression, an expression started by a keyword like `function` or
  // `new`, or an expression wrapped in punctuation like `()`, `[]`,
  // or `{}`.
  pp$3.parseExprAtom = function(refDestructuringErrors) {
      // If a division operator appears in an expression position, the
      // tokenizer got confused, and we force it to read a regexp instead.
      if (this.type === types.slash) this.readRegexp();
      var node, canBeArrow = this.potentialArrowAt === this.start;
      switch(this.type){
          case types._super:
              if (!this.allowSuper) this.raise(this.start, "'super' keyword outside a method");
              node = this.startNode();
              this.next();
              if (this.type === types.parenL && !this.allowDirectSuper) this.raise(node.start, "super() call outside constructor of a subclass");
              // The `super` keyword can appear at below:
              // SuperProperty:
              //     super [ Expression ]
              //     super . IdentifierName
              // SuperCall:
              //     super ( Arguments )
              if (this.type !== types.dot && this.type !== types.bracketL && this.type !== types.parenL) this.unexpected();
              return this.finishNode(node, "Super");
          case types._this:
              node = this.startNode();
              this.next();
              return this.finishNode(node, "ThisExpression");
          case types.name:
              var startPos = this.start, startLoc = this.startLoc, containsEsc = this.containsEsc;
              var id = this.parseIdent(false);
              if (this.options.ecmaVersion >= 8 && !containsEsc && id.name === "async" && !this.canInsertSemicolon() && this.eat(types._function)) return this.parseFunction(this.startNodeAt(startPos, startLoc), 0, false, true);
              if (canBeArrow && !this.canInsertSemicolon()) {
                  if (this.eat(types.arrow)) return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [
                      id
                  ], false);
                  if (this.options.ecmaVersion >= 8 && id.name === "async" && this.type === types.name && !containsEsc) {
                      id = this.parseIdent(false);
                      if (this.canInsertSemicolon() || !this.eat(types.arrow)) this.unexpected();
                      return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [
                          id
                      ], true);
                  }
              }
              return id;
          case types.regexp:
              var value = this.value;
              node = this.parseLiteral(value.value);
              node.regex = {
                  pattern: value.pattern,
                  flags: value.flags
              };
              return node;
          case types.num:
          case types.string:
              return this.parseLiteral(this.value);
          case types._null:
          case types._true:
          case types._false:
              node = this.startNode();
              node.value = this.type === types._null ? null : this.type === types._true;
              node.raw = this.type.keyword;
              this.next();
              return this.finishNode(node, "Literal");
          case types.parenL:
              var start = this.start, expr = this.parseParenAndDistinguishExpression(canBeArrow);
              if (refDestructuringErrors) {
                  if (refDestructuringErrors.parenthesizedAssign < 0 && !this.isSimpleAssignTarget(expr)) refDestructuringErrors.parenthesizedAssign = start;
                  if (refDestructuringErrors.parenthesizedBind < 0) refDestructuringErrors.parenthesizedBind = start;
              }
              return expr;
          case types.bracketL:
              node = this.startNode();
              this.next();
              node.elements = this.parseExprList(types.bracketR, true, true, refDestructuringErrors);
              return this.finishNode(node, "ArrayExpression");
          case types.braceL:
              return this.parseObj(false, refDestructuringErrors);
          case types._function:
              node = this.startNode();
              this.next();
              return this.parseFunction(node, 0);
          case types._class:
              return this.parseClass(this.startNode(), false);
          case types._new:
              return this.parseNew();
          case types.backQuote:
              return this.parseTemplate();
          case types._import:
              if (this.options.ecmaVersion >= 11) return this.parseExprImport();
              else return this.unexpected();
          default:
              this.unexpected();
      }
  };
  pp$3.parseExprImport = function() {
      var node = this.startNode();
      // Consume `import` as an identifier for `import.meta`.
      // Because `this.parseIdent(true)` doesn't check escape sequences, it needs the check of `this.containsEsc`.
      if (this.containsEsc) this.raiseRecoverable(this.start, "Escape sequence in keyword import");
      var meta = this.parseIdent(true);
      switch(this.type){
          case types.parenL:
              return this.parseDynamicImport(node);
          case types.dot:
              node.meta = meta;
              return this.parseImportMeta(node);
          default:
              this.unexpected();
      }
  };
  pp$3.parseDynamicImport = function(node) {
      this.next(); // skip `(`
      // Parse node.source.
      node.source = this.parseMaybeAssign();
      // Verify ending.
      if (!this.eat(types.parenR)) {
          var errorPos = this.start;
          if (this.eat(types.comma) && this.eat(types.parenR)) this.raiseRecoverable(errorPos, "Trailing comma is not allowed in import()");
          else this.unexpected(errorPos);
      }
      return this.finishNode(node, "ImportExpression");
  };
  pp$3.parseImportMeta = function(node) {
      this.next(); // skip `.`
      var containsEsc = this.containsEsc;
      node.property = this.parseIdent(true);
      if (node.property.name !== "meta") this.raiseRecoverable(node.property.start, "The only valid meta property for import is 'import.meta'");
      if (containsEsc) this.raiseRecoverable(node.start, "'import.meta' must not contain escaped characters");
      if (this.options.sourceType !== "module") this.raiseRecoverable(node.start, "Cannot use 'import.meta' outside a module");
      return this.finishNode(node, "MetaProperty");
  };
  pp$3.parseLiteral = function(value) {
      var node = this.startNode();
      node.value = value;
      node.raw = this.input.slice(this.start, this.end);
      if (node.raw.charCodeAt(node.raw.length - 1) === 110) node.bigint = node.raw.slice(0, -1).replace(/_/g, "");
      this.next();
      return this.finishNode(node, "Literal");
  };
  pp$3.parseParenExpression = function() {
      this.expect(types.parenL);
      var val = this.parseExpression();
      this.expect(types.parenR);
      return val;
  };
  pp$3.parseParenAndDistinguishExpression = function(canBeArrow) {
      var startPos = this.start, startLoc = this.startLoc, val, allowTrailingComma = this.options.ecmaVersion >= 8;
      if (this.options.ecmaVersion >= 6) {
          this.next();
          var innerStartPos = this.start, innerStartLoc = this.startLoc;
          var exprList = [], first = true, lastIsComma = false;
          var refDestructuringErrors = new DestructuringErrors, oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, spreadStart;
          this.yieldPos = 0;
          this.awaitPos = 0;
          // Do not save awaitIdentPos to allow checking awaits nested in parameters
          while(this.type !== types.parenR){
              first ? first = false : this.expect(types.comma);
              if (allowTrailingComma && this.afterTrailingComma(types.parenR, true)) {
                  lastIsComma = true;
                  break;
              } else if (this.type === types.ellipsis) {
                  spreadStart = this.start;
                  exprList.push(this.parseParenItem(this.parseRestBinding()));
                  if (this.type === types.comma) this.raise(this.start, "Comma is not permitted after the rest element");
                  break;
              } else exprList.push(this.parseMaybeAssign(false, refDestructuringErrors, this.parseParenItem));
          }
          var innerEndPos = this.start, innerEndLoc = this.startLoc;
          this.expect(types.parenR);
          if (canBeArrow && !this.canInsertSemicolon() && this.eat(types.arrow)) {
              this.checkPatternErrors(refDestructuringErrors, false);
              this.checkYieldAwaitInDefaultParams();
              this.yieldPos = oldYieldPos;
              this.awaitPos = oldAwaitPos;
              return this.parseParenArrowList(startPos, startLoc, exprList);
          }
          if (!exprList.length || lastIsComma) this.unexpected(this.lastTokStart);
          if (spreadStart) this.unexpected(spreadStart);
          this.checkExpressionErrors(refDestructuringErrors, true);
          this.yieldPos = oldYieldPos || this.yieldPos;
          this.awaitPos = oldAwaitPos || this.awaitPos;
          if (exprList.length > 1) {
              val = this.startNodeAt(innerStartPos, innerStartLoc);
              val.expressions = exprList;
              this.finishNodeAt(val, "SequenceExpression", innerEndPos, innerEndLoc);
          } else val = exprList[0];
      } else val = this.parseParenExpression();
      if (this.options.preserveParens) {
          var par = this.startNodeAt(startPos, startLoc);
          par.expression = val;
          return this.finishNode(par, "ParenthesizedExpression");
      } else return val;
  };
  pp$3.parseParenItem = function(item) {
      return item;
  };
  pp$3.parseParenArrowList = function(startPos, startLoc, exprList) {
      return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList);
  };
  // New's precedence is slightly tricky. It must allow its argument to
  // be a `[]` or dot subscript expression, but not a call — at least,
  // not without wrapping it in parentheses. Thus, it uses the noCalls
  // argument to parseSubscripts to prevent it from consuming the
  // argument list.
  var empty$1 = [];
  pp$3.parseNew = function() {
      if (this.containsEsc) this.raiseRecoverable(this.start, "Escape sequence in keyword new");
      var node = this.startNode();
      var meta = this.parseIdent(true);
      if (this.options.ecmaVersion >= 6 && this.eat(types.dot)) {
          node.meta = meta;
          var containsEsc = this.containsEsc;
          node.property = this.parseIdent(true);
          if (node.property.name !== "target") this.raiseRecoverable(node.property.start, "The only valid meta property for new is 'new.target'");
          if (containsEsc) this.raiseRecoverable(node.start, "'new.target' must not contain escaped characters");
          if (!this.inNonArrowFunction()) this.raiseRecoverable(node.start, "'new.target' can only be used in functions");
          return this.finishNode(node, "MetaProperty");
      }
      var startPos = this.start, startLoc = this.startLoc, isImport = this.type === types._import;
      node.callee = this.parseSubscripts(this.parseExprAtom(), startPos, startLoc, true);
      if (isImport && node.callee.type === "ImportExpression") this.raise(startPos, "Cannot use new with import()");
      if (this.eat(types.parenL)) node.arguments = this.parseExprList(types.parenR, this.options.ecmaVersion >= 8, false);
      else node.arguments = empty$1;
      return this.finishNode(node, "NewExpression");
  };
  // Parse template expression.
  pp$3.parseTemplateElement = function(ref) {
      var isTagged = ref.isTagged;
      var elem = this.startNode();
      if (this.type === types.invalidTemplate) {
          if (!isTagged) this.raiseRecoverable(this.start, "Bad escape sequence in untagged template literal");
          elem.value = {
              raw: this.value,
              cooked: null
          };
      } else elem.value = {
          raw: this.input.slice(this.start, this.end).replace(/\r\n?/g, "\n"),
          cooked: this.value
      };
      this.next();
      elem.tail = this.type === types.backQuote;
      return this.finishNode(elem, "TemplateElement");
  };
  pp$3.parseTemplate = function(ref) {
      if (ref === void 0) ref = {};
      var isTagged = ref.isTagged;
      if (isTagged === void 0) isTagged = false;
      var node = this.startNode();
      this.next();
      node.expressions = [];
      var curElt = this.parseTemplateElement({
          isTagged: isTagged
      });
      node.quasis = [
          curElt
      ];
      while(!curElt.tail){
          if (this.type === types.eof) this.raise(this.pos, "Unterminated template literal");
          this.expect(types.dollarBraceL);
          node.expressions.push(this.parseExpression());
          this.expect(types.braceR);
          node.quasis.push(curElt = this.parseTemplateElement({
              isTagged: isTagged
          }));
      }
      this.next();
      return this.finishNode(node, "TemplateLiteral");
  };
  pp$3.isAsyncProp = function(prop) {
      return !prop.computed && prop.key.type === "Identifier" && prop.key.name === "async" && (this.type === types.name || this.type === types.num || this.type === types.string || this.type === types.bracketL || this.type.keyword || this.options.ecmaVersion >= 9 && this.type === types.star) && !lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
  };
  // Parse an object literal or binding pattern.
  pp$3.parseObj = function(isPattern, refDestructuringErrors) {
      var node = this.startNode(), first = true, propHash = {};
      node.properties = [];
      this.next();
      while(!this.eat(types.braceR)){
          if (!first) {
              this.expect(types.comma);
              if (this.options.ecmaVersion >= 5 && this.afterTrailingComma(types.braceR)) break;
          } else first = false;
          var prop = this.parseProperty(isPattern, refDestructuringErrors);
          if (!isPattern) this.checkPropClash(prop, propHash, refDestructuringErrors);
          node.properties.push(prop);
      }
      return this.finishNode(node, isPattern ? "ObjectPattern" : "ObjectExpression");
  };
  pp$3.parseProperty = function(isPattern, refDestructuringErrors) {
      var prop = this.startNode(), isGenerator, isAsync, startPos, startLoc;
      if (this.options.ecmaVersion >= 9 && this.eat(types.ellipsis)) {
          if (isPattern) {
              prop.argument = this.parseIdent(false);
              if (this.type === types.comma) this.raise(this.start, "Comma is not permitted after the rest element");
              return this.finishNode(prop, "RestElement");
          }
          // To disallow parenthesized identifier via `this.toAssignable()`.
          if (this.type === types.parenL && refDestructuringErrors) {
              if (refDestructuringErrors.parenthesizedAssign < 0) refDestructuringErrors.parenthesizedAssign = this.start;
              if (refDestructuringErrors.parenthesizedBind < 0) refDestructuringErrors.parenthesizedBind = this.start;
          }
          // Parse argument.
          prop.argument = this.parseMaybeAssign(false, refDestructuringErrors);
          // To disallow trailing comma via `this.toAssignable()`.
          if (this.type === types.comma && refDestructuringErrors && refDestructuringErrors.trailingComma < 0) refDestructuringErrors.trailingComma = this.start;
          // Finish
          return this.finishNode(prop, "SpreadElement");
      }
      if (this.options.ecmaVersion >= 6) {
          prop.method = false;
          prop.shorthand = false;
          if (isPattern || refDestructuringErrors) {
              startPos = this.start;
              startLoc = this.startLoc;
          }
          if (!isPattern) isGenerator = this.eat(types.star);
      }
      var containsEsc = this.containsEsc;
      this.parsePropertyName(prop);
      if (!isPattern && !containsEsc && this.options.ecmaVersion >= 8 && !isGenerator && this.isAsyncProp(prop)) {
          isAsync = true;
          isGenerator = this.options.ecmaVersion >= 9 && this.eat(types.star);
          this.parsePropertyName(prop, refDestructuringErrors);
      } else isAsync = false;
      this.parsePropertyValue(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc);
      return this.finishNode(prop, "Property");
  };
  pp$3.parsePropertyValue = function(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc) {
      if ((isGenerator || isAsync) && this.type === types.colon) this.unexpected();
      if (this.eat(types.colon)) {
          prop.value = isPattern ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(false, refDestructuringErrors);
          prop.kind = "init";
      } else if (this.options.ecmaVersion >= 6 && this.type === types.parenL) {
          if (isPattern) this.unexpected();
          prop.kind = "init";
          prop.method = true;
          prop.value = this.parseMethod(isGenerator, isAsync);
      } else if (!isPattern && !containsEsc && this.options.ecmaVersion >= 5 && !prop.computed && prop.key.type === "Identifier" && (prop.key.name === "get" || prop.key.name === "set") && this.type !== types.comma && this.type !== types.braceR && this.type !== types.eq) {
          if (isGenerator || isAsync) this.unexpected();
          prop.kind = prop.key.name;
          this.parsePropertyName(prop);
          prop.value = this.parseMethod(false);
          var paramCount = prop.kind === "get" ? 0 : 1;
          if (prop.value.params.length !== paramCount) {
              var start = prop.value.start;
              if (prop.kind === "get") this.raiseRecoverable(start, "getter should have no params");
              else this.raiseRecoverable(start, "setter should have exactly one param");
          } else if (prop.kind === "set" && prop.value.params[0].type === "RestElement") this.raiseRecoverable(prop.value.params[0].start, "Setter cannot use rest params");
      } else if (this.options.ecmaVersion >= 6 && !prop.computed && prop.key.type === "Identifier") {
          if (isGenerator || isAsync) this.unexpected();
          this.checkUnreserved(prop.key);
          if (prop.key.name === "await" && !this.awaitIdentPos) this.awaitIdentPos = startPos;
          prop.kind = "init";
          if (isPattern) prop.value = this.parseMaybeDefault(startPos, startLoc, prop.key);
          else if (this.type === types.eq && refDestructuringErrors) {
              if (refDestructuringErrors.shorthandAssign < 0) refDestructuringErrors.shorthandAssign = this.start;
              prop.value = this.parseMaybeDefault(startPos, startLoc, prop.key);
          } else prop.value = prop.key;
          prop.shorthand = true;
      } else this.unexpected();
  };
  pp$3.parsePropertyName = function(prop) {
      if (this.options.ecmaVersion >= 6) {
          if (this.eat(types.bracketL)) {
              prop.computed = true;
              prop.key = this.parseMaybeAssign();
              this.expect(types.bracketR);
              return prop.key;
          } else prop.computed = false;
      }
      return prop.key = this.type === types.num || this.type === types.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never");
  };
  // Initialize empty function node.
  pp$3.initFunction = function(node) {
      node.id = null;
      if (this.options.ecmaVersion >= 6) node.generator = node.expression = false;
      if (this.options.ecmaVersion >= 8) node.async = false;
  };
  // Parse object or class method.
  pp$3.parseMethod = function(isGenerator, isAsync, allowDirectSuper) {
      var node = this.startNode(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
      this.initFunction(node);
      if (this.options.ecmaVersion >= 6) node.generator = isGenerator;
      if (this.options.ecmaVersion >= 8) node.async = !!isAsync;
      this.yieldPos = 0;
      this.awaitPos = 0;
      this.awaitIdentPos = 0;
      this.enterScope(functionFlags(isAsync, node.generator) | SCOPE_SUPER | (allowDirectSuper ? SCOPE_DIRECT_SUPER : 0));
      this.expect(types.parenL);
      node.params = this.parseBindingList(types.parenR, false, this.options.ecmaVersion >= 8);
      this.checkYieldAwaitInDefaultParams();
      this.parseFunctionBody(node, false, true);
      this.yieldPos = oldYieldPos;
      this.awaitPos = oldAwaitPos;
      this.awaitIdentPos = oldAwaitIdentPos;
      return this.finishNode(node, "FunctionExpression");
  };
  // Parse arrow function expression with given parameters.
  pp$3.parseArrowExpression = function(node, params, isAsync) {
      var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
      this.enterScope(functionFlags(isAsync, false) | SCOPE_ARROW);
      this.initFunction(node);
      if (this.options.ecmaVersion >= 8) node.async = !!isAsync;
      this.yieldPos = 0;
      this.awaitPos = 0;
      this.awaitIdentPos = 0;
      node.params = this.toAssignableList(params, true);
      this.parseFunctionBody(node, true, false);
      this.yieldPos = oldYieldPos;
      this.awaitPos = oldAwaitPos;
      this.awaitIdentPos = oldAwaitIdentPos;
      return this.finishNode(node, "ArrowFunctionExpression");
  };
  // Parse function body and check parameters.
  pp$3.parseFunctionBody = function(node, isArrowFunction, isMethod) {
      var isExpression = isArrowFunction && this.type !== types.braceL;
      var oldStrict = this.strict, useStrict = false;
      if (isExpression) {
          node.body = this.parseMaybeAssign();
          node.expression = true;
          this.checkParams(node, false);
      } else {
          var nonSimple = this.options.ecmaVersion >= 7 && !this.isSimpleParamList(node.params);
          if (!oldStrict || nonSimple) {
              useStrict = this.strictDirective(this.end);
              // If this is a strict mode function, verify that argument names
              // are not repeated, and it does not try to bind the words `eval`
              // or `arguments`.
              if (useStrict && nonSimple) this.raiseRecoverable(node.start, "Illegal 'use strict' directive in function with non-simple parameter list");
          }
          // Start a new scope with regard to labels and the `inFunction`
          // flag (restore them to their old value afterwards).
          var oldLabels = this.labels;
          this.labels = [];
          if (useStrict) this.strict = true;
          // Add the params to varDeclaredNames to ensure that an error is thrown
          // if a let/const declaration in the function clashes with one of the params.
          this.checkParams(node, !oldStrict && !useStrict && !isArrowFunction && !isMethod && this.isSimpleParamList(node.params));
          // Ensure the function name isn't a forbidden identifier in strict mode, e.g. 'eval'
          if (this.strict && node.id) this.checkLVal(node.id, BIND_OUTSIDE);
          node.body = this.parseBlock(false, undefined, useStrict && !oldStrict);
          node.expression = false;
          this.adaptDirectivePrologue(node.body.body);
          this.labels = oldLabels;
      }
      this.exitScope();
  };
  pp$3.isSimpleParamList = function(params) {
      for(var i = 0, list = params; i < list.length; i += 1){
          var param = list[i];
          if (param.type !== "Identifier") return false;
      }
      return true;
  };
  // Checks function params for various disallowed patterns such as using "eval"
  // or "arguments" and duplicate parameters.
  pp$3.checkParams = function(node, allowDuplicates) {
      var nameHash = {};
      for(var i = 0, list = node.params; i < list.length; i += 1){
          var param = list[i];
          this.checkLVal(param, BIND_VAR, allowDuplicates ? null : nameHash);
      }
  };
  // Parses a comma-separated list of expressions, and returns them as
  // an array. `close` is the token type that ends the list, and
  // `allowEmpty` can be turned on to allow subsequent commas with
  // nothing in between them to be parsed as `null` (which is needed
  // for array literals).
  pp$3.parseExprList = function(close, allowTrailingComma, allowEmpty, refDestructuringErrors) {
      var elts = [], first = true;
      while(!this.eat(close)){
          if (!first) {
              this.expect(types.comma);
              if (allowTrailingComma && this.afterTrailingComma(close)) break;
          } else first = false;
          var elt = void 0;
          if (allowEmpty && this.type === types.comma) elt = null;
          else if (this.type === types.ellipsis) {
              elt = this.parseSpread(refDestructuringErrors);
              if (refDestructuringErrors && this.type === types.comma && refDestructuringErrors.trailingComma < 0) refDestructuringErrors.trailingComma = this.start;
          } else elt = this.parseMaybeAssign(false, refDestructuringErrors);
          elts.push(elt);
      }
      return elts;
  };
  pp$3.checkUnreserved = function(ref) {
      var start = ref.start;
      var end = ref.end;
      var name = ref.name;
      if (this.inGenerator && name === "yield") this.raiseRecoverable(start, "Cannot use 'yield' as identifier inside a generator");
      if (this.inAsync && name === "await") this.raiseRecoverable(start, "Cannot use 'await' as identifier inside an async function");
      if (this.keywords.test(name)) this.raise(start, "Unexpected keyword '" + name + "'");
      if (this.options.ecmaVersion < 6 && this.input.slice(start, end).indexOf("\\") !== -1) return;
      var re = this.strict ? this.reservedWordsStrict : this.reservedWords;
      if (re.test(name)) {
          if (!this.inAsync && name === "await") this.raiseRecoverable(start, "Cannot use keyword 'await' outside an async function");
          this.raiseRecoverable(start, "The keyword '" + name + "' is reserved");
      }
  };
  // Parse the next token as an identifier. If `liberal` is true (used
  // when parsing properties), it will also convert keywords into
  // identifiers.
  pp$3.parseIdent = function(liberal, isBinding) {
      var node = this.startNode();
      if (this.type === types.name) node.name = this.value;
      else if (this.type.keyword) {
          node.name = this.type.keyword;
          // To fix https://github.com/acornjs/acorn/issues/575
          // `class` and `function` keywords push new context into this.context.
          // But there is no chance to pop the context if the keyword is consumed as an identifier such as a property name.
          // If the previous token is a dot, this does not apply because the context-managing code already ignored the keyword
          if ((node.name === "class" || node.name === "function") && (this.lastTokEnd !== this.lastTokStart + 1 || this.input.charCodeAt(this.lastTokStart) !== 46)) this.context.pop();
      } else this.unexpected();
      this.next(!!liberal);
      this.finishNode(node, "Identifier");
      if (!liberal) {
          this.checkUnreserved(node);
          if (node.name === "await" && !this.awaitIdentPos) this.awaitIdentPos = node.start;
      }
      return node;
  };
  // Parses yield expression inside generator.
  pp$3.parseYield = function(noIn) {
      if (!this.yieldPos) this.yieldPos = this.start;
      var node = this.startNode();
      this.next();
      if (this.type === types.semi || this.canInsertSemicolon() || this.type !== types.star && !this.type.startsExpr) {
          node.delegate = false;
          node.argument = null;
      } else {
          node.delegate = this.eat(types.star);
          node.argument = this.parseMaybeAssign(noIn);
      }
      return this.finishNode(node, "YieldExpression");
  };
  pp$3.parseAwait = function() {
      if (!this.awaitPos) this.awaitPos = this.start;
      var node = this.startNode();
      this.next();
      node.argument = this.parseMaybeUnary(null, false);
      return this.finishNode(node, "AwaitExpression");
  };
  var pp$4 = Parser.prototype;
  // This function is used to raise exceptions on parse errors. It
  // takes an offset integer (into the current `input`) to indicate
  // the location of the error, attaches the position to the end
  // of the error message, and then raises a `SyntaxError` with that
  // message.
  pp$4.raise = function(pos, message) {
      var loc = getLineInfo(this.input, pos);
      message += " (" + loc.line + ":" + loc.column + ")";
      var err = new SyntaxError(message);
      err.pos = pos;
      err.loc = loc;
      err.raisedAt = this.pos;
      throw err;
  };
  pp$4.raiseRecoverable = pp$4.raise;
  pp$4.curPosition = function() {
      if (this.options.locations) return new Position(this.curLine, this.pos - this.lineStart);
  };
  var pp$5 = Parser.prototype;
  var Scope = function Scope(flags) {
      this.flags = flags;
      // A list of var-declared names in the current lexical scope
      this.var = [];
      // A list of lexically-declared names in the current lexical scope
      this.lexical = [];
      // A list of lexically-declared FunctionDeclaration names in the current lexical scope
      this.functions = [];
  };
  // The functions in this module keep track of declared variables in the current scope in order to detect duplicate variable names.
  pp$5.enterScope = function(flags) {
      this.scopeStack.push(new Scope(flags));
  };
  pp$5.exitScope = function() {
      this.scopeStack.pop();
  };
  // The spec says:
  // > At the top level of a function, or script, function declarations are
  // > treated like var declarations rather than like lexical declarations.
  pp$5.treatFunctionsAsVarInScope = function(scope) {
      return scope.flags & SCOPE_FUNCTION || !this.inModule && scope.flags & SCOPE_TOP;
  };
  pp$5.declareName = function(name, bindingType, pos) {
      var redeclared = false;
      if (bindingType === BIND_LEXICAL) {
          var scope = this.currentScope();
          redeclared = scope.lexical.indexOf(name) > -1 || scope.functions.indexOf(name) > -1 || scope.var.indexOf(name) > -1;
          scope.lexical.push(name);
          if (this.inModule && scope.flags & SCOPE_TOP) delete this.undefinedExports[name];
      } else if (bindingType === BIND_SIMPLE_CATCH) {
          var scope$1 = this.currentScope();
          scope$1.lexical.push(name);
      } else if (bindingType === BIND_FUNCTION) {
          var scope$2 = this.currentScope();
          if (this.treatFunctionsAsVar) redeclared = scope$2.lexical.indexOf(name) > -1;
          else redeclared = scope$2.lexical.indexOf(name) > -1 || scope$2.var.indexOf(name) > -1;
          scope$2.functions.push(name);
      } else for(var i = this.scopeStack.length - 1; i >= 0; --i){
          var scope$3 = this.scopeStack[i];
          if (scope$3.lexical.indexOf(name) > -1 && !(scope$3.flags & SCOPE_SIMPLE_CATCH && scope$3.lexical[0] === name) || !this.treatFunctionsAsVarInScope(scope$3) && scope$3.functions.indexOf(name) > -1) {
              redeclared = true;
              break;
          }
          scope$3.var.push(name);
          if (this.inModule && scope$3.flags & SCOPE_TOP) delete this.undefinedExports[name];
          if (scope$3.flags & SCOPE_VAR) break;
      }
      if (redeclared) this.raiseRecoverable(pos, "Identifier '" + name + "' has already been declared");
  };
  pp$5.checkLocalExport = function(id) {
      // scope.functions must be empty as Module code is always strict.
      if (this.scopeStack[0].lexical.indexOf(id.name) === -1 && this.scopeStack[0].var.indexOf(id.name) === -1) this.undefinedExports[id.name] = id;
  };
  pp$5.currentScope = function() {
      return this.scopeStack[this.scopeStack.length - 1];
  };
  pp$5.currentVarScope = function() {
      for(var i = this.scopeStack.length - 1;; i--){
          var scope = this.scopeStack[i];
          if (scope.flags & SCOPE_VAR) return scope;
      }
  };
  // Could be useful for `this`, `new.target`, `super()`, `super.property`, and `super[property]`.
  pp$5.currentThisScope = function() {
      for(var i = this.scopeStack.length - 1;; i--){
          var scope = this.scopeStack[i];
          if (scope.flags & SCOPE_VAR && !(scope.flags & SCOPE_ARROW)) return scope;
      }
  };
  var Node = function Node(parser, pos, loc) {
      this.type = "";
      this.start = pos;
      this.end = 0;
      if (parser.options.locations) this.loc = new SourceLocation(parser, loc);
      if (parser.options.directSourceFile) this.sourceFile = parser.options.directSourceFile;
      if (parser.options.ranges) this.range = [
          pos,
          0
      ];
  };
  // Start an AST node, attaching a start offset.
  var pp$6 = Parser.prototype;
  pp$6.startNode = function() {
      return new Node(this, this.start, this.startLoc);
  };
  pp$6.startNodeAt = function(pos, loc) {
      return new Node(this, pos, loc);
  };
  // Finish an AST node, adding `type` and `end` properties.
  function finishNodeAt(node, type, pos, loc) {
      node.type = type;
      node.end = pos;
      if (this.options.locations) node.loc.end = loc;
      if (this.options.ranges) node.range[1] = pos;
      return node;
  }
  pp$6.finishNode = function(node, type) {
      return finishNodeAt.call(this, node, type, this.lastTokEnd, this.lastTokEndLoc);
  };
  // Finish node at given position
  pp$6.finishNodeAt = function(node, type, pos, loc) {
      return finishNodeAt.call(this, node, type, pos, loc);
  };
  // The algorithm used to determine whether a regexp can appear at a
  var TokContext = function TokContext(token, isExpr, preserveSpace, override, generator) {
      this.token = token;
      this.isExpr = !!isExpr;
      this.preserveSpace = !!preserveSpace;
      this.override = override;
      this.generator = !!generator;
  };
  var types$1 = {
      b_stat: new TokContext("{", false),
      b_expr: new TokContext("{", true),
      b_tmpl: new TokContext("${", false),
      p_stat: new TokContext("(", false),
      p_expr: new TokContext("(", true),
      q_tmpl: new TokContext("`", true, true, function(p) {
          return p.tryReadTemplateToken();
      }),
      f_stat: new TokContext("function", false),
      f_expr: new TokContext("function", true),
      f_expr_gen: new TokContext("function", true, false, null, true),
      f_gen: new TokContext("function", false, false, null, true)
  };
  var pp$7 = Parser.prototype;
  pp$7.initialContext = function() {
      return [
          types$1.b_stat
      ];
  };
  pp$7.braceIsBlock = function(prevType) {
      var parent = this.curContext();
      if (parent === types$1.f_expr || parent === types$1.f_stat) return true;
      if (prevType === types.colon && (parent === types$1.b_stat || parent === types$1.b_expr)) return !parent.isExpr;
      // The check for `tt.name && exprAllowed` detects whether we are
      // after a `yield` or `of` construct. See the `updateContext` for
      // `tt.name`.
      if (prevType === types._return || prevType === types.name && this.exprAllowed) return lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
      if (prevType === types._else || prevType === types.semi || prevType === types.eof || prevType === types.parenR || prevType === types.arrow) return true;
      if (prevType === types.braceL) return parent === types$1.b_stat;
      if (prevType === types._var || prevType === types._const || prevType === types.name) return false;
      return !this.exprAllowed;
  };
  pp$7.inGeneratorContext = function() {
      for(var i = this.context.length - 1; i >= 1; i--){
          var context = this.context[i];
          if (context.token === "function") return context.generator;
      }
      return false;
  };
  pp$7.updateContext = function(prevType) {
      var update, type = this.type;
      if (type.keyword && prevType === types.dot) this.exprAllowed = false;
      else if (update = type.updateContext) update.call(this, prevType);
      else this.exprAllowed = type.beforeExpr;
  };
  // Token-specific context update code
  types.parenR.updateContext = types.braceR.updateContext = function() {
      if (this.context.length === 1) {
          this.exprAllowed = true;
          return;
      }
      var out = this.context.pop();
      if (out === types$1.b_stat && this.curContext().token === "function") out = this.context.pop();
      this.exprAllowed = !out.isExpr;
  };
  types.braceL.updateContext = function(prevType) {
      this.context.push(this.braceIsBlock(prevType) ? types$1.b_stat : types$1.b_expr);
      this.exprAllowed = true;
  };
  types.dollarBraceL.updateContext = function() {
      this.context.push(types$1.b_tmpl);
      this.exprAllowed = true;
  };
  types.parenL.updateContext = function(prevType) {
      var statementParens = prevType === types._if || prevType === types._for || prevType === types._with || prevType === types._while;
      this.context.push(statementParens ? types$1.p_stat : types$1.p_expr);
      this.exprAllowed = true;
  };
  types.incDec.updateContext = function() {
  // tokExprAllowed stays unchanged
  };
  types._function.updateContext = types._class.updateContext = function(prevType) {
      if (prevType.beforeExpr && prevType !== types.semi && prevType !== types._else && !(prevType === types._return && lineBreak.test(this.input.slice(this.lastTokEnd, this.start))) && !((prevType === types.colon || prevType === types.braceL) && this.curContext() === types$1.b_stat)) this.context.push(types$1.f_expr);
      else this.context.push(types$1.f_stat);
      this.exprAllowed = false;
  };
  types.backQuote.updateContext = function() {
      if (this.curContext() === types$1.q_tmpl) this.context.pop();
      else this.context.push(types$1.q_tmpl);
      this.exprAllowed = false;
  };
  types.star.updateContext = function(prevType) {
      if (prevType === types._function) {
          var index = this.context.length - 1;
          if (this.context[index] === types$1.f_expr) this.context[index] = types$1.f_expr_gen;
          else this.context[index] = types$1.f_gen;
      }
      this.exprAllowed = true;
  };
  types.name.updateContext = function(prevType) {
      var allowed = false;
      if (this.options.ecmaVersion >= 6 && prevType !== types.dot) {
          if (this.value === "of" && !this.exprAllowed || this.value === "yield" && this.inGeneratorContext()) allowed = true;
      }
      this.exprAllowed = allowed;
  };
  // This file contains Unicode properties extracted from the ECMAScript
  // specification. The lists are extracted like so:
  // $$('#table-binary-unicode-properties > figure > table > tbody > tr > td:nth-child(1) code').map(el => el.innerText)
  // #table-binary-unicode-properties
  var ecma9BinaryProperties = "ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS";
  var ecma10BinaryProperties = ecma9BinaryProperties + " Extended_Pictographic";
  var ecma11BinaryProperties = ecma10BinaryProperties;
  var unicodeBinaryProperties = {
      9: ecma9BinaryProperties,
      10: ecma10BinaryProperties,
      11: ecma11BinaryProperties
  };
  // #table-unicode-general-category-values
  var unicodeGeneralCategoryValues = "Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu";
  // #table-unicode-script-values
  var ecma9ScriptValues = "Adlam Adlm Ahom Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb";
  var ecma10ScriptValues = ecma9ScriptValues + " Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd";
  var ecma11ScriptValues = ecma10ScriptValues + " Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho";
  var unicodeScriptValues = {
      9: ecma9ScriptValues,
      10: ecma10ScriptValues,
      11: ecma11ScriptValues
  };
  var data = {};
  function buildUnicodeData(ecmaVersion) {
      var d = data[ecmaVersion] = {
          binary: wordsRegexp(unicodeBinaryProperties[ecmaVersion] + " " + unicodeGeneralCategoryValues),
          nonBinary: {
              General_Category: wordsRegexp(unicodeGeneralCategoryValues),
              Script: wordsRegexp(unicodeScriptValues[ecmaVersion])
          }
      };
      d.nonBinary.Script_Extensions = d.nonBinary.Script;
      d.nonBinary.gc = d.nonBinary.General_Category;
      d.nonBinary.sc = d.nonBinary.Script;
      d.nonBinary.scx = d.nonBinary.Script_Extensions;
  }
  buildUnicodeData(9);
  buildUnicodeData(10);
  buildUnicodeData(11);
  var pp$8 = Parser.prototype;
  var RegExpValidationState = function RegExpValidationState(parser) {
      this.parser = parser;
      this.validFlags = "gim" + (parser.options.ecmaVersion >= 6 ? "uy" : "") + (parser.options.ecmaVersion >= 9 ? "s" : "");
      this.unicodeProperties = data[parser.options.ecmaVersion >= 11 ? 11 : parser.options.ecmaVersion];
      this.source = "";
      this.flags = "";
      this.start = 0;
      this.switchU = false;
      this.switchN = false;
      this.pos = 0;
      this.lastIntValue = 0;
      this.lastStringValue = "";
      this.lastAssertionIsQuantifiable = false;
      this.numCapturingParens = 0;
      this.maxBackReference = 0;
      this.groupNames = [];
      this.backReferenceNames = [];
  };
  RegExpValidationState.prototype.reset = function reset(start, pattern, flags) {
      var unicode = flags.indexOf("u") !== -1;
      this.start = start | 0;
      this.source = pattern + "";
      this.flags = flags;
      this.switchU = unicode && this.parser.options.ecmaVersion >= 6;
      this.switchN = unicode && this.parser.options.ecmaVersion >= 9;
  };
  RegExpValidationState.prototype.raise = function raise(message) {
      this.parser.raiseRecoverable(this.start, "Invalid regular expression: /" + this.source + "/: " + message);
  };
  // If u flag is given, this returns the code point at the index (it combines a surrogate pair).
  // Otherwise, this returns the code unit of the index (can be a part of a surrogate pair).
  RegExpValidationState.prototype.at = function at(i, forceU) {
      if (forceU === void 0) forceU = false;
      var s = this.source;
      var l = s.length;
      if (i >= l) return -1;
      var c = s.charCodeAt(i);
      if (!(forceU || this.switchU) || c <= 0xD7FF || c >= 0xE000 || i + 1 >= l) return c;
      var next = s.charCodeAt(i + 1);
      return next >= 0xDC00 && next <= 0xDFFF ? (c << 10) + next - 0x35FDC00 : c;
  };
  RegExpValidationState.prototype.nextIndex = function nextIndex(i, forceU) {
      if (forceU === void 0) forceU = false;
      var s = this.source;
      var l = s.length;
      if (i >= l) return l;
      var c = s.charCodeAt(i), next;
      if (!(forceU || this.switchU) || c <= 0xD7FF || c >= 0xE000 || i + 1 >= l || (next = s.charCodeAt(i + 1)) < 0xDC00 || next > 0xDFFF) return i + 1;
      return i + 2;
  };
  RegExpValidationState.prototype.current = function current(forceU) {
      if (forceU === void 0) forceU = false;
      return this.at(this.pos, forceU);
  };
  RegExpValidationState.prototype.lookahead = function lookahead(forceU) {
      if (forceU === void 0) forceU = false;
      return this.at(this.nextIndex(this.pos, forceU), forceU);
  };
  RegExpValidationState.prototype.advance = function advance(forceU) {
      if (forceU === void 0) forceU = false;
      this.pos = this.nextIndex(this.pos, forceU);
  };
  RegExpValidationState.prototype.eat = function eat(ch, forceU) {
      if (forceU === void 0) forceU = false;
      if (this.current(forceU) === ch) {
          this.advance(forceU);
          return true;
      }
      return false;
  };
  function codePointToString(ch) {
      if (ch <= 0xFFFF) return String.fromCharCode(ch);
      ch -= 0x10000;
      return String.fromCharCode((ch >> 10) + 0xD800, (ch & 0x03FF) + 0xDC00);
  }
  /**
   * Validate the flags part of a given RegExpLiteral.
   *
   * @param {RegExpValidationState} state The state to validate RegExp.
   * @returns {void}
   */ pp$8.validateRegExpFlags = function(state) {
      var validFlags = state.validFlags;
      var flags = state.flags;
      for(var i = 0; i < flags.length; i++){
          var flag = flags.charAt(i);
          if (validFlags.indexOf(flag) === -1) this.raise(state.start, "Invalid regular expression flag");
          if (flags.indexOf(flag, i + 1) > -1) this.raise(state.start, "Duplicate regular expression flag");
      }
  };
  /**
   * Validate the pattern part of a given RegExpLiteral.
   *
   * @param {RegExpValidationState} state The state to validate RegExp.
   * @returns {void}
   */ pp$8.validateRegExpPattern = function(state) {
      this.regexp_pattern(state);
      // The goal symbol for the parse is |Pattern[~U, ~N]|. If the result of
      // parsing contains a |GroupName|, reparse with the goal symbol
      // |Pattern[~U, +N]| and use this result instead. Throw a *SyntaxError*
      // exception if _P_ did not conform to the grammar, if any elements of _P_
      // were not matched by the parse, or if any Early Error conditions exist.
      if (!state.switchN && this.options.ecmaVersion >= 9 && state.groupNames.length > 0) {
          state.switchN = true;
          this.regexp_pattern(state);
      }
  };
  // https://www.ecma-international.org/ecma-262/8.0/#prod-Pattern
  pp$8.regexp_pattern = function(state) {
      state.pos = 0;
      state.lastIntValue = 0;
      state.lastStringValue = "";
      state.lastAssertionIsQuantifiable = false;
      state.numCapturingParens = 0;
      state.maxBackReference = 0;
      state.groupNames.length = 0;
      state.backReferenceNames.length = 0;
      this.regexp_disjunction(state);
      if (state.pos !== state.source.length) {
          // Make the same messages as V8.
          if (state.eat(0x29 /* ) */ )) state.raise("Unmatched ')'");
          if (state.eat(0x5D /* ] */ ) || state.eat(0x7D /* } */ )) state.raise("Lone quantifier brackets");
      }
      if (state.maxBackReference > state.numCapturingParens) state.raise("Invalid escape");
      for(var i = 0, list = state.backReferenceNames; i < list.length; i += 1){
          var name = list[i];
          if (state.groupNames.indexOf(name) === -1) state.raise("Invalid named capture referenced");
      }
  };
  // https://www.ecma-international.org/ecma-262/8.0/#prod-Disjunction
  pp$8.regexp_disjunction = function(state) {
      this.regexp_alternative(state);
      while(state.eat(0x7C /* | */ ))this.regexp_alternative(state);
      // Make the same message as V8.
      if (this.regexp_eatQuantifier(state, true)) state.raise("Nothing to repeat");
      if (state.eat(0x7B /* { */ )) state.raise("Lone quantifier brackets");
  };
  // https://www.ecma-international.org/ecma-262/8.0/#prod-Alternative
  pp$8.regexp_alternative = function(state) {
      while(state.pos < state.source.length && this.regexp_eatTerm(state));
  };
  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-Term
  pp$8.regexp_eatTerm = function(state) {
      if (this.regexp_eatAssertion(state)) {
          // Handle `QuantifiableAssertion Quantifier` alternative.
          // `state.lastAssertionIsQuantifiable` is true if the last eaten Assertion
          // is a QuantifiableAssertion.
          if (state.lastAssertionIsQuantifiable && this.regexp_eatQuantifier(state)) // Make the same message as V8.
          {
              if (state.switchU) state.raise("Invalid quantifier");
          }
          return true;
      }
      if (state.switchU ? this.regexp_eatAtom(state) : this.regexp_eatExtendedAtom(state)) {
          this.regexp_eatQuantifier(state);
          return true;
      }
      return false;
  };
  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-Assertion
  pp$8.regexp_eatAssertion = function(state) {
      var start = state.pos;
      state.lastAssertionIsQuantifiable = false;
      // ^, $
      if (state.eat(0x5E /* ^ */ ) || state.eat(0x24 /* $ */ )) return true;
      // \b \B
      if (state.eat(0x5C /* \ */ )) {
          if (state.eat(0x42 /* B */ ) || state.eat(0x62 /* b */ )) return true;
          state.pos = start;
      }
      // Lookahead / Lookbehind
      if (state.eat(0x28 /* ( */ ) && state.eat(0x3F /* ? */ )) {
          var lookbehind = false;
          if (this.options.ecmaVersion >= 9) lookbehind = state.eat(0x3C /* < */ );
          if (state.eat(0x3D /* = */ ) || state.eat(0x21 /* ! */ )) {
              this.regexp_disjunction(state);
              if (!state.eat(0x29 /* ) */ )) state.raise("Unterminated group");
              state.lastAssertionIsQuantifiable = !lookbehind;
              return true;
          }
      }
      state.pos = start;
      return false;
  };
  // https://www.ecma-international.org/ecma-262/8.0/#prod-Quantifier
  pp$8.regexp_eatQuantifier = function(state, noError) {
      if (noError === void 0) noError = false;
      if (this.regexp_eatQuantifierPrefix(state, noError)) {
          state.eat(0x3F /* ? */ );
          return true;
      }
      return false;
  };
  // https://www.ecma-international.org/ecma-262/8.0/#prod-QuantifierPrefix
  pp$8.regexp_eatQuantifierPrefix = function(state, noError) {
      return state.eat(0x2A /* * */ ) || state.eat(0x2B /* + */ ) || state.eat(0x3F /* ? */ ) || this.regexp_eatBracedQuantifier(state, noError);
  };
  pp$8.regexp_eatBracedQuantifier = function(state, noError) {
      var start = state.pos;
      if (state.eat(0x7B /* { */ )) {
          var min = 0, max = -1;
          if (this.regexp_eatDecimalDigits(state)) {
              min = state.lastIntValue;
              if (state.eat(0x2C /* , */ ) && this.regexp_eatDecimalDigits(state)) max = state.lastIntValue;
              if (state.eat(0x7D /* } */ )) {
                  // SyntaxError in https://www.ecma-international.org/ecma-262/8.0/#sec-term
                  if (max !== -1 && max < min && !noError) state.raise("numbers out of order in {} quantifier");
                  return true;
              }
          }
          if (state.switchU && !noError) state.raise("Incomplete quantifier");
          state.pos = start;
      }
      return false;
  };
  // https://www.ecma-international.org/ecma-262/8.0/#prod-Atom
  pp$8.regexp_eatAtom = function(state) {
      return this.regexp_eatPatternCharacters(state) || state.eat(0x2E /* . */ ) || this.regexp_eatReverseSolidusAtomEscape(state) || this.regexp_eatCharacterClass(state) || this.regexp_eatUncapturingGroup(state) || this.regexp_eatCapturingGroup(state);
  };
  pp$8.regexp_eatReverseSolidusAtomEscape = function(state) {
      var start = state.pos;
      if (state.eat(0x5C /* \ */ )) {
          if (this.regexp_eatAtomEscape(state)) return true;
          state.pos = start;
      }
      return false;
  };
  pp$8.regexp_eatUncapturingGroup = function(state) {
      var start = state.pos;
      if (state.eat(0x28 /* ( */ )) {
          if (state.eat(0x3F /* ? */ ) && state.eat(0x3A /* : */ )) {
              this.regexp_disjunction(state);
              if (state.eat(0x29 /* ) */ )) return true;
              state.raise("Unterminated group");
          }
          state.pos = start;
      }
      return false;
  };
  pp$8.regexp_eatCapturingGroup = function(state) {
      if (state.eat(0x28 /* ( */ )) {
          if (this.options.ecmaVersion >= 9) this.regexp_groupSpecifier(state);
          else if (state.current() === 0x3F /* ? */ ) state.raise("Invalid group");
          this.regexp_disjunction(state);
          if (state.eat(0x29 /* ) */ )) {
              state.numCapturingParens += 1;
              return true;
          }
          state.raise("Unterminated group");
      }
      return false;
  };
  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-ExtendedAtom
  pp$8.regexp_eatExtendedAtom = function(state) {
      return state.eat(0x2E /* . */ ) || this.regexp_eatReverseSolidusAtomEscape(state) || this.regexp_eatCharacterClass(state) || this.regexp_eatUncapturingGroup(state) || this.regexp_eatCapturingGroup(state) || this.regexp_eatInvalidBracedQuantifier(state) || this.regexp_eatExtendedPatternCharacter(state);
  };
  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-InvalidBracedQuantifier
  pp$8.regexp_eatInvalidBracedQuantifier = function(state) {
      if (this.regexp_eatBracedQuantifier(state, true)) state.raise("Nothing to repeat");
      return false;
  };
  // https://www.ecma-international.org/ecma-262/8.0/#prod-SyntaxCharacter
  pp$8.regexp_eatSyntaxCharacter = function(state) {
      var ch = state.current();
      if (isSyntaxCharacter(ch)) {
          state.lastIntValue = ch;
          state.advance();
          return true;
      }
      return false;
  };
  function isSyntaxCharacter(ch) {
      return ch === 0x24 /* $ */  || ch >= 0x28 /* ( */  && ch <= 0x2B /* + */  || ch === 0x2E /* . */  || ch === 0x3F /* ? */  || ch >= 0x5B /* [ */  && ch <= 0x5E /* ^ */  || ch >= 0x7B /* { */  && ch <= 0x7D /* } */ ;
  }
  // https://www.ecma-international.org/ecma-262/8.0/#prod-PatternCharacter
  // But eat eager.
  pp$8.regexp_eatPatternCharacters = function(state) {
      var start = state.pos;
      var ch = 0;
      while((ch = state.current()) !== -1 && !isSyntaxCharacter(ch))state.advance();
      return state.pos !== start;
  };
  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-ExtendedPatternCharacter
  pp$8.regexp_eatExtendedPatternCharacter = function(state) {
      var ch = state.current();
      if (ch !== -1 && ch !== 0x24 /* $ */  && !(ch >= 0x28 /* ( */  && ch <= 0x2B /* + */ ) && ch !== 0x2E /* . */  && ch !== 0x3F /* ? */  && ch !== 0x5B /* [ */  && ch !== 0x5E /* ^ */  && ch !== 0x7C /* | */ ) {
          state.advance();
          return true;
      }
      return false;
  };
  // GroupSpecifier ::
  //   [empty]
  //   `?` GroupName
  pp$8.regexp_groupSpecifier = function(state) {
      if (state.eat(0x3F /* ? */ )) {
          if (this.regexp_eatGroupName(state)) {
              if (state.groupNames.indexOf(state.lastStringValue) !== -1) state.raise("Duplicate capture group name");
              state.groupNames.push(state.lastStringValue);
              return;
          }
          state.raise("Invalid group");
      }
  };
  // GroupName ::
  //   `<` RegExpIdentifierName `>`
  // Note: this updates `state.lastStringValue` property with the eaten name.
  pp$8.regexp_eatGroupName = function(state) {
      state.lastStringValue = "";
      if (state.eat(0x3C /* < */ )) {
          if (this.regexp_eatRegExpIdentifierName(state) && state.eat(0x3E /* > */ )) return true;
          state.raise("Invalid capture group name");
      }
      return false;
  };
  // RegExpIdentifierName ::
  //   RegExpIdentifierStart
  //   RegExpIdentifierName RegExpIdentifierPart
  // Note: this updates `state.lastStringValue` property with the eaten name.
  pp$8.regexp_eatRegExpIdentifierName = function(state) {
      state.lastStringValue = "";
      if (this.regexp_eatRegExpIdentifierStart(state)) {
          state.lastStringValue += codePointToString(state.lastIntValue);
          while(this.regexp_eatRegExpIdentifierPart(state))state.lastStringValue += codePointToString(state.lastIntValue);
          return true;
      }
      return false;
  };
  // RegExpIdentifierStart ::
  //   UnicodeIDStart
  //   `$`
  //   `_`
  //   `\` RegExpUnicodeEscapeSequence[+U]
  pp$8.regexp_eatRegExpIdentifierStart = function(state) {
      var start = state.pos;
      var forceU = this.options.ecmaVersion >= 11;
      var ch = state.current(forceU);
      state.advance(forceU);
      if (ch === 0x5C /* \ */  && this.regexp_eatRegExpUnicodeEscapeSequence(state, forceU)) ch = state.lastIntValue;
      if (isRegExpIdentifierStart(ch)) {
          state.lastIntValue = ch;
          return true;
      }
      state.pos = start;
      return false;
  };
  function isRegExpIdentifierStart(ch) {
      return isIdentifierStart(ch, true) || ch === 0x24 /* $ */  || ch === 0x5F /* _ */ ;
  }
  // RegExpIdentifierPart ::
  //   UnicodeIDContinue
  //   `$`
  //   `_`
  //   `\` RegExpUnicodeEscapeSequence[+U]
  //   <ZWNJ>
  //   <ZWJ>
  pp$8.regexp_eatRegExpIdentifierPart = function(state) {
      var start = state.pos;
      var forceU = this.options.ecmaVersion >= 11;
      var ch = state.current(forceU);
      state.advance(forceU);
      if (ch === 0x5C /* \ */  && this.regexp_eatRegExpUnicodeEscapeSequence(state, forceU)) ch = state.lastIntValue;
      if (isRegExpIdentifierPart(ch)) {
          state.lastIntValue = ch;
          return true;
      }
      state.pos = start;
      return false;
  };
  function isRegExpIdentifierPart(ch) {
      return isIdentifierChar(ch, true) || ch === 0x24 /* $ */  || ch === 0x5F /* _ */  || ch === 0x200C /* <ZWNJ> */  || ch === 0x200D /* <ZWJ> */ ;
  }
  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-AtomEscape
  pp$8.regexp_eatAtomEscape = function(state) {
      if (this.regexp_eatBackReference(state) || this.regexp_eatCharacterClassEscape(state) || this.regexp_eatCharacterEscape(state) || state.switchN && this.regexp_eatKGroupName(state)) return true;
      if (state.switchU) {
          // Make the same message as V8.
          if (state.current() === 0x63 /* c */ ) state.raise("Invalid unicode escape");
          state.raise("Invalid escape");
      }
      return false;
  };
  pp$8.regexp_eatBackReference = function(state) {
      var start = state.pos;
      if (this.regexp_eatDecimalEscape(state)) {
          var n = state.lastIntValue;
          if (state.switchU) {
              // For SyntaxError in https://www.ecma-international.org/ecma-262/8.0/#sec-atomescape
              if (n > state.maxBackReference) state.maxBackReference = n;
              return true;
          }
          if (n <= state.numCapturingParens) return true;
          state.pos = start;
      }
      return false;
  };
  pp$8.regexp_eatKGroupName = function(state) {
      if (state.eat(0x6B /* k */ )) {
          if (this.regexp_eatGroupName(state)) {
              state.backReferenceNames.push(state.lastStringValue);
              return true;
          }
          state.raise("Invalid named reference");
      }
      return false;
  };
  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-CharacterEscape
  pp$8.regexp_eatCharacterEscape = function(state) {
      return this.regexp_eatControlEscape(state) || this.regexp_eatCControlLetter(state) || this.regexp_eatZero(state) || this.regexp_eatHexEscapeSequence(state) || this.regexp_eatRegExpUnicodeEscapeSequence(state, false) || !state.switchU && this.regexp_eatLegacyOctalEscapeSequence(state) || this.regexp_eatIdentityEscape(state);
  };
  pp$8.regexp_eatCControlLetter = function(state) {
      var start = state.pos;
      if (state.eat(0x63 /* c */ )) {
          if (this.regexp_eatControlLetter(state)) return true;
          state.pos = start;
      }
      return false;
  };
  pp$8.regexp_eatZero = function(state) {
      if (state.current() === 0x30 /* 0 */  && !isDecimalDigit(state.lookahead())) {
          state.lastIntValue = 0;
          state.advance();
          return true;
      }
      return false;
  };
  // https://www.ecma-international.org/ecma-262/8.0/#prod-ControlEscape
  pp$8.regexp_eatControlEscape = function(state) {
      var ch = state.current();
      if (ch === 0x74 /* t */ ) {
          state.lastIntValue = 0x09; /* \t */ 
          state.advance();
          return true;
      }
      if (ch === 0x6E /* n */ ) {
          state.lastIntValue = 0x0A; /* \n */ 
          state.advance();
          return true;
      }
      if (ch === 0x76 /* v */ ) {
          state.lastIntValue = 0x0B; /* \v */ 
          state.advance();
          return true;
      }
      if (ch === 0x66 /* f */ ) {
          state.lastIntValue = 0x0C; /* \f */ 
          state.advance();
          return true;
      }
      if (ch === 0x72 /* r */ ) {
          state.lastIntValue = 0x0D; /* \r */ 
          state.advance();
          return true;
      }
      return false;
  };
  // https://www.ecma-international.org/ecma-262/8.0/#prod-ControlLetter
  pp$8.regexp_eatControlLetter = function(state) {
      var ch = state.current();
      if (isControlLetter(ch)) {
          state.lastIntValue = ch % 0x20;
          state.advance();
          return true;
      }
      return false;
  };
  function isControlLetter(ch) {
      return ch >= 0x41 /* A */  && ch <= 0x5A /* Z */  || ch >= 0x61 /* a */  && ch <= 0x7A /* z */ ;
  }
  // https://www.ecma-international.org/ecma-262/8.0/#prod-RegExpUnicodeEscapeSequence
  pp$8.regexp_eatRegExpUnicodeEscapeSequence = function(state, forceU) {
      if (forceU === void 0) forceU = false;
      var start = state.pos;
      var switchU = forceU || state.switchU;
      if (state.eat(0x75 /* u */ )) {
          if (this.regexp_eatFixedHexDigits(state, 4)) {
              var lead = state.lastIntValue;
              if (switchU && lead >= 0xD800 && lead <= 0xDBFF) {
                  var leadSurrogateEnd = state.pos;
                  if (state.eat(0x5C /* \ */ ) && state.eat(0x75 /* u */ ) && this.regexp_eatFixedHexDigits(state, 4)) {
                      var trail = state.lastIntValue;
                      if (trail >= 0xDC00 && trail <= 0xDFFF) {
                          state.lastIntValue = (lead - 0xD800) * 0x400 + (trail - 0xDC00) + 0x10000;
                          return true;
                      }
                  }
                  state.pos = leadSurrogateEnd;
                  state.lastIntValue = lead;
              }
              return true;
          }
          if (switchU && state.eat(0x7B /* { */ ) && this.regexp_eatHexDigits(state) && state.eat(0x7D /* } */ ) && isValidUnicode(state.lastIntValue)) return true;
          if (switchU) state.raise("Invalid unicode escape");
          state.pos = start;
      }
      return false;
  };
  function isValidUnicode(ch) {
      return ch >= 0 && ch <= 0x10FFFF;
  }
  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-IdentityEscape
  pp$8.regexp_eatIdentityEscape = function(state) {
      if (state.switchU) {
          if (this.regexp_eatSyntaxCharacter(state)) return true;
          if (state.eat(0x2F /* / */ )) {
              state.lastIntValue = 0x2F; /* / */ 
              return true;
          }
          return false;
      }
      var ch = state.current();
      if (ch !== 0x63 /* c */  && (!state.switchN || ch !== 0x6B /* k */ )) {
          state.lastIntValue = ch;
          state.advance();
          return true;
      }
      return false;
  };
  // https://www.ecma-international.org/ecma-262/8.0/#prod-DecimalEscape
  pp$8.regexp_eatDecimalEscape = function(state) {
      state.lastIntValue = 0;
      var ch = state.current();
      if (ch >= 0x31 /* 1 */  && ch <= 0x39 /* 9 */ ) {
          do {
              state.lastIntValue = 10 * state.lastIntValue + (ch - 0x30 /* 0 */ );
              state.advance();
          }while ((ch = state.current()) >= 0x30 /* 0 */  && ch <= 0x39 /* 9 */ );
          return true;
      }
      return false;
  };
  // https://www.ecma-international.org/ecma-262/8.0/#prod-CharacterClassEscape
  pp$8.regexp_eatCharacterClassEscape = function(state) {
      var ch = state.current();
      if (isCharacterClassEscape(ch)) {
          state.lastIntValue = -1;
          state.advance();
          return true;
      }
      if (state.switchU && this.options.ecmaVersion >= 9 && (ch === 0x50 /* P */  || ch === 0x70 /* p */ )) {
          state.lastIntValue = -1;
          state.advance();
          if (state.eat(0x7B /* { */ ) && this.regexp_eatUnicodePropertyValueExpression(state) && state.eat(0x7D /* } */ )) return true;
          state.raise("Invalid property name");
      }
      return false;
  };
  function isCharacterClassEscape(ch) {
      return ch === 0x64 /* d */  || ch === 0x44 /* D */  || ch === 0x73 /* s */  || ch === 0x53 /* S */  || ch === 0x77 /* w */  || ch === 0x57 /* W */ ;
  }
  // UnicodePropertyValueExpression ::
  //   UnicodePropertyName `=` UnicodePropertyValue
  //   LoneUnicodePropertyNameOrValue
  pp$8.regexp_eatUnicodePropertyValueExpression = function(state) {
      var start = state.pos;
      // UnicodePropertyName `=` UnicodePropertyValue
      if (this.regexp_eatUnicodePropertyName(state) && state.eat(0x3D /* = */ )) {
          var name = state.lastStringValue;
          if (this.regexp_eatUnicodePropertyValue(state)) {
              var value = state.lastStringValue;
              this.regexp_validateUnicodePropertyNameAndValue(state, name, value);
              return true;
          }
      }
      state.pos = start;
      // LoneUnicodePropertyNameOrValue
      if (this.regexp_eatLoneUnicodePropertyNameOrValue(state)) {
          var nameOrValue = state.lastStringValue;
          this.regexp_validateUnicodePropertyNameOrValue(state, nameOrValue);
          return true;
      }
      return false;
  };
  pp$8.regexp_validateUnicodePropertyNameAndValue = function(state, name, value) {
      if (!has(state.unicodeProperties.nonBinary, name)) state.raise("Invalid property name");
      if (!state.unicodeProperties.nonBinary[name].test(value)) state.raise("Invalid property value");
  };
  pp$8.regexp_validateUnicodePropertyNameOrValue = function(state, nameOrValue) {
      if (!state.unicodeProperties.binary.test(nameOrValue)) state.raise("Invalid property name");
  };
  // UnicodePropertyName ::
  //   UnicodePropertyNameCharacters
  pp$8.regexp_eatUnicodePropertyName = function(state) {
      var ch = 0;
      state.lastStringValue = "";
      while(isUnicodePropertyNameCharacter(ch = state.current())){
          state.lastStringValue += codePointToString(ch);
          state.advance();
      }
      return state.lastStringValue !== "";
  };
  function isUnicodePropertyNameCharacter(ch) {
      return isControlLetter(ch) || ch === 0x5F /* _ */ ;
  }
  // UnicodePropertyValue ::
  //   UnicodePropertyValueCharacters
  pp$8.regexp_eatUnicodePropertyValue = function(state) {
      var ch = 0;
      state.lastStringValue = "";
      while(isUnicodePropertyValueCharacter(ch = state.current())){
          state.lastStringValue += codePointToString(ch);
          state.advance();
      }
      return state.lastStringValue !== "";
  };
  function isUnicodePropertyValueCharacter(ch) {
      return isUnicodePropertyNameCharacter(ch) || isDecimalDigit(ch);
  }
  // LoneUnicodePropertyNameOrValue ::
  //   UnicodePropertyValueCharacters
  pp$8.regexp_eatLoneUnicodePropertyNameOrValue = function(state) {
      return this.regexp_eatUnicodePropertyValue(state);
  };
  // https://www.ecma-international.org/ecma-262/8.0/#prod-CharacterClass
  pp$8.regexp_eatCharacterClass = function(state) {
      if (state.eat(0x5B /* [ */ )) {
          state.eat(0x5E /* ^ */ );
          this.regexp_classRanges(state);
          if (state.eat(0x5D /* ] */ )) return true;
          // Unreachable since it threw "unterminated regular expression" error before.
          state.raise("Unterminated character class");
      }
      return false;
  };
  // https://www.ecma-international.org/ecma-262/8.0/#prod-ClassRanges
  // https://www.ecma-international.org/ecma-262/8.0/#prod-NonemptyClassRanges
  // https://www.ecma-international.org/ecma-262/8.0/#prod-NonemptyClassRangesNoDash
  pp$8.regexp_classRanges = function(state) {
      while(this.regexp_eatClassAtom(state)){
          var left = state.lastIntValue;
          if (state.eat(0x2D /* - */ ) && this.regexp_eatClassAtom(state)) {
              var right = state.lastIntValue;
              if (state.switchU && (left === -1 || right === -1)) state.raise("Invalid character class");
              if (left !== -1 && right !== -1 && left > right) state.raise("Range out of order in character class");
          }
      }
  };
  // https://www.ecma-international.org/ecma-262/8.0/#prod-ClassAtom
  // https://www.ecma-international.org/ecma-262/8.0/#prod-ClassAtomNoDash
  pp$8.regexp_eatClassAtom = function(state) {
      var start = state.pos;
      if (state.eat(0x5C /* \ */ )) {
          if (this.regexp_eatClassEscape(state)) return true;
          if (state.switchU) {
              // Make the same message as V8.
              var ch$1 = state.current();
              if (ch$1 === 0x63 /* c */  || isOctalDigit(ch$1)) state.raise("Invalid class escape");
              state.raise("Invalid escape");
          }
          state.pos = start;
      }
      var ch = state.current();
      if (ch !== 0x5D /* ] */ ) {
          state.lastIntValue = ch;
          state.advance();
          return true;
      }
      return false;
  };
  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-ClassEscape
  pp$8.regexp_eatClassEscape = function(state) {
      var start = state.pos;
      if (state.eat(0x62 /* b */ )) {
          state.lastIntValue = 0x08; /* <BS> */ 
          return true;
      }
      if (state.switchU && state.eat(0x2D /* - */ )) {
          state.lastIntValue = 0x2D; /* - */ 
          return true;
      }
      if (!state.switchU && state.eat(0x63 /* c */ )) {
          if (this.regexp_eatClassControlLetter(state)) return true;
          state.pos = start;
      }
      return this.regexp_eatCharacterClassEscape(state) || this.regexp_eatCharacterEscape(state);
  };
  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-ClassControlLetter
  pp$8.regexp_eatClassControlLetter = function(state) {
      var ch = state.current();
      if (isDecimalDigit(ch) || ch === 0x5F /* _ */ ) {
          state.lastIntValue = ch % 0x20;
          state.advance();
          return true;
      }
      return false;
  };
  // https://www.ecma-international.org/ecma-262/8.0/#prod-HexEscapeSequence
  pp$8.regexp_eatHexEscapeSequence = function(state) {
      var start = state.pos;
      if (state.eat(0x78 /* x */ )) {
          if (this.regexp_eatFixedHexDigits(state, 2)) return true;
          if (state.switchU) state.raise("Invalid escape");
          state.pos = start;
      }
      return false;
  };
  // https://www.ecma-international.org/ecma-262/8.0/#prod-DecimalDigits
  pp$8.regexp_eatDecimalDigits = function(state) {
      var start = state.pos;
      var ch = 0;
      state.lastIntValue = 0;
      while(isDecimalDigit(ch = state.current())){
          state.lastIntValue = 10 * state.lastIntValue + (ch - 0x30 /* 0 */ );
          state.advance();
      }
      return state.pos !== start;
  };
  function isDecimalDigit(ch) {
      return ch >= 0x30 /* 0 */  && ch <= 0x39 /* 9 */ ;
  }
  // https://www.ecma-international.org/ecma-262/8.0/#prod-HexDigits
  pp$8.regexp_eatHexDigits = function(state) {
      var start = state.pos;
      var ch = 0;
      state.lastIntValue = 0;
      while(isHexDigit(ch = state.current())){
          state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
          state.advance();
      }
      return state.pos !== start;
  };
  function isHexDigit(ch) {
      return ch >= 0x30 /* 0 */  && ch <= 0x39 /* 9 */  || ch >= 0x41 /* A */  && ch <= 0x46 /* F */  || ch >= 0x61 /* a */  && ch <= 0x66 /* f */ ;
  }
  function hexToInt(ch) {
      if (ch >= 0x41 /* A */  && ch <= 0x46 /* F */ ) return 10 + (ch - 0x41 /* A */ );
      if (ch >= 0x61 /* a */  && ch <= 0x66 /* f */ ) return 10 + (ch - 0x61 /* a */ );
      return ch - 0x30 /* 0 */ ;
  }
  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-LegacyOctalEscapeSequence
  // Allows only 0-377(octal) i.e. 0-255(decimal).
  pp$8.regexp_eatLegacyOctalEscapeSequence = function(state) {
      if (this.regexp_eatOctalDigit(state)) {
          var n1 = state.lastIntValue;
          if (this.regexp_eatOctalDigit(state)) {
              var n2 = state.lastIntValue;
              if (n1 <= 3 && this.regexp_eatOctalDigit(state)) state.lastIntValue = n1 * 64 + n2 * 8 + state.lastIntValue;
              else state.lastIntValue = n1 * 8 + n2;
          } else state.lastIntValue = n1;
          return true;
      }
      return false;
  };
  // https://www.ecma-international.org/ecma-262/8.0/#prod-OctalDigit
  pp$8.regexp_eatOctalDigit = function(state) {
      var ch = state.current();
      if (isOctalDigit(ch)) {
          state.lastIntValue = ch - 0x30; /* 0 */ 
          state.advance();
          return true;
      }
      state.lastIntValue = 0;
      return false;
  };
  function isOctalDigit(ch) {
      return ch >= 0x30 /* 0 */  && ch <= 0x37 /* 7 */ ;
  }
  // https://www.ecma-international.org/ecma-262/8.0/#prod-Hex4Digits
  // https://www.ecma-international.org/ecma-262/8.0/#prod-HexDigit
  // And HexDigit HexDigit in https://www.ecma-international.org/ecma-262/8.0/#prod-HexEscapeSequence
  pp$8.regexp_eatFixedHexDigits = function(state, length) {
      var start = state.pos;
      state.lastIntValue = 0;
      for(var i = 0; i < length; ++i){
          var ch = state.current();
          if (!isHexDigit(ch)) {
              state.pos = start;
              return false;
          }
          state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
          state.advance();
      }
      return true;
  };
  // Object type used to represent tokens. Note that normally, tokens
  // simply exist as properties on the parser object. This is only
  // used for the onToken callback and the external tokenizer.
  var Token = function Token(p) {
      this.type = p.type;
      this.value = p.value;
      this.start = p.start;
      this.end = p.end;
      if (p.options.locations) this.loc = new SourceLocation(p, p.startLoc, p.endLoc);
      if (p.options.ranges) this.range = [
          p.start,
          p.end
      ];
  };
  // ## Tokenizer
  var pp$9 = Parser.prototype;
  // Move to the next token
  pp$9.next = function(ignoreEscapeSequenceInKeyword) {
      if (!ignoreEscapeSequenceInKeyword && this.type.keyword && this.containsEsc) this.raiseRecoverable(this.start, "Escape sequence in keyword " + this.type.keyword);
      if (this.options.onToken) this.options.onToken(new Token(this));
      this.lastTokEnd = this.end;
      this.lastTokStart = this.start;
      this.lastTokEndLoc = this.endLoc;
      this.lastTokStartLoc = this.startLoc;
      this.nextToken();
  };
  pp$9.getToken = function() {
      this.next();
      return new Token(this);
  };
  // If we're in an ES6 environment, make parsers iterable
  if (typeof Symbol !== "undefined") pp$9[Symbol.iterator] = function() {
      var this$1 = this;
      return {
          next: function next() {
              var token = this$1.getToken();
              return {
                  done: token.type === types.eof,
                  value: token
              };
          }
      };
  };
  // Toggle strict mode. Re-reads the next number or string to please
  // pedantic tests (`"use strict"; 010;` should fail).
  pp$9.curContext = function() {
      return this.context[this.context.length - 1];
  };
  // Read a single token, updating the parser object's token-related
  // properties.
  pp$9.nextToken = function() {
      var curContext = this.curContext();
      if (!curContext || !curContext.preserveSpace) this.skipSpace();
      this.start = this.pos;
      if (this.options.locations) this.startLoc = this.curPosition();
      if (this.pos >= this.input.length) return this.finishToken(types.eof);
      if (curContext.override) return curContext.override(this);
      else this.readToken(this.fullCharCodeAtPos());
  };
  pp$9.readToken = function(code) {
      // Identifier or keyword. '\uXXXX' sequences are allowed in
      // identifiers, so '\' also dispatches to that.
      if (isIdentifierStart(code, this.options.ecmaVersion >= 6) || code === 92 /* '\' */ ) return this.readWord();
      return this.getTokenFromCode(code);
  };
  pp$9.fullCharCodeAtPos = function() {
      var code = this.input.charCodeAt(this.pos);
      if (code <= 0xd7ff || code >= 0xe000) return code;
      var next = this.input.charCodeAt(this.pos + 1);
      return (code << 10) + next - 0x35fdc00;
  };
  pp$9.skipBlockComment = function() {
      var startLoc = this.options.onComment && this.curPosition();
      var start = this.pos, end = this.input.indexOf("*/", this.pos += 2);
      if (end === -1) this.raise(this.pos - 2, "Unterminated comment");
      this.pos = end + 2;
      if (this.options.locations) {
          lineBreakG.lastIndex = start;
          var match;
          while((match = lineBreakG.exec(this.input)) && match.index < this.pos){
              ++this.curLine;
              this.lineStart = match.index + match[0].length;
          }
      }
      if (this.options.onComment) this.options.onComment(true, this.input.slice(start + 2, end), start, this.pos, startLoc, this.curPosition());
  };
  pp$9.skipLineComment = function(startSkip) {
      var start = this.pos;
      var startLoc = this.options.onComment && this.curPosition();
      var ch = this.input.charCodeAt(this.pos += startSkip);
      while(this.pos < this.input.length && !isNewLine(ch))ch = this.input.charCodeAt(++this.pos);
      if (this.options.onComment) this.options.onComment(false, this.input.slice(start + startSkip, this.pos), start, this.pos, startLoc, this.curPosition());
  };
  // Called at the start of the parse and after every token. Skips
  // whitespace and comments, and.
  pp$9.skipSpace = function() {
      loop: while(this.pos < this.input.length){
          var ch = this.input.charCodeAt(this.pos);
          switch(ch){
              case 32:
              case 160:
                  ++this.pos;
                  break;
              case 13:
                  if (this.input.charCodeAt(this.pos + 1) === 10) ++this.pos;
              case 10:
              case 8232:
              case 8233:
                  ++this.pos;
                  if (this.options.locations) {
                      ++this.curLine;
                      this.lineStart = this.pos;
                  }
                  break;
              case 47:
                  switch(this.input.charCodeAt(this.pos + 1)){
                      case 42:
                          this.skipBlockComment();
                          break;
                      case 47:
                          this.skipLineComment(2);
                          break;
                      default:
                          break loop;
                  }
                  break;
              default:
                  if (ch > 8 && ch < 14 || ch >= 5760 && nonASCIIwhitespace.test(String.fromCharCode(ch))) ++this.pos;
                  else break loop;
          }
      }
  };
  // Called at the end of every token. Sets `end`, `val`, and
  // maintains `context` and `exprAllowed`, and skips the space after
  // the token, so that the next one's `start` will point at the
  // right position.
  pp$9.finishToken = function(type, val) {
      this.end = this.pos;
      if (this.options.locations) this.endLoc = this.curPosition();
      var prevType = this.type;
      this.type = type;
      this.value = val;
      this.updateContext(prevType);
  };
  // ### Token reading
  // This is the function that is called to fetch the next token. It
  // is somewhat obscure, because it works in character codes rather
  // than characters, and because operator parsing has been inlined
  // into it.
  //
  // All in the name of speed.
  //
  pp$9.readToken_dot = function() {
      var next = this.input.charCodeAt(this.pos + 1);
      if (next >= 48 && next <= 57) return this.readNumber(true);
      var next2 = this.input.charCodeAt(this.pos + 2);
      if (this.options.ecmaVersion >= 6 && next === 46 && next2 === 46) {
          this.pos += 3;
          return this.finishToken(types.ellipsis);
      } else {
          ++this.pos;
          return this.finishToken(types.dot);
      }
  };
  pp$9.readToken_slash = function() {
      var next = this.input.charCodeAt(this.pos + 1);
      if (this.exprAllowed) {
          ++this.pos;
          return this.readRegexp();
      }
      if (next === 61) return this.finishOp(types.assign, 2);
      return this.finishOp(types.slash, 1);
  };
  pp$9.readToken_mult_modulo_exp = function(code) {
      var next = this.input.charCodeAt(this.pos + 1);
      var size = 1;
      var tokentype = code === 42 ? types.star : types.modulo;
      // exponentiation operator ** and **=
      if (this.options.ecmaVersion >= 7 && code === 42 && next === 42) {
          ++size;
          tokentype = types.starstar;
          next = this.input.charCodeAt(this.pos + 2);
      }
      if (next === 61) return this.finishOp(types.assign, size + 1);
      return this.finishOp(tokentype, size);
  };
  pp$9.readToken_pipe_amp = function(code) {
      var next = this.input.charCodeAt(this.pos + 1);
      if (next === code) {
          if (this.options.ecmaVersion >= 12) {
              var next2 = this.input.charCodeAt(this.pos + 2);
              if (next2 === 61) return this.finishOp(types.assign, 3);
          }
          return this.finishOp(code === 124 ? types.logicalOR : types.logicalAND, 2);
      }
      if (next === 61) return this.finishOp(types.assign, 2);
      return this.finishOp(code === 124 ? types.bitwiseOR : types.bitwiseAND, 1);
  };
  pp$9.readToken_caret = function() {
      var next = this.input.charCodeAt(this.pos + 1);
      if (next === 61) return this.finishOp(types.assign, 2);
      return this.finishOp(types.bitwiseXOR, 1);
  };
  pp$9.readToken_plus_min = function(code) {
      var next = this.input.charCodeAt(this.pos + 1);
      if (next === code) {
          if (next === 45 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 62 && (this.lastTokEnd === 0 || lineBreak.test(this.input.slice(this.lastTokEnd, this.pos)))) {
              // A `-->` line comment
              this.skipLineComment(3);
              this.skipSpace();
              return this.nextToken();
          }
          return this.finishOp(types.incDec, 2);
      }
      if (next === 61) return this.finishOp(types.assign, 2);
      return this.finishOp(types.plusMin, 1);
  };
  pp$9.readToken_lt_gt = function(code) {
      var next = this.input.charCodeAt(this.pos + 1);
      var size = 1;
      if (next === code) {
          size = code === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2;
          if (this.input.charCodeAt(this.pos + size) === 61) return this.finishOp(types.assign, size + 1);
          return this.finishOp(types.bitShift, size);
      }
      if (next === 33 && code === 60 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 45 && this.input.charCodeAt(this.pos + 3) === 45) {
          // `<!--`, an XML-style comment that should be interpreted as a line comment
          this.skipLineComment(4);
          this.skipSpace();
          return this.nextToken();
      }
      if (next === 61) size = 2;
      return this.finishOp(types.relational, size);
  };
  pp$9.readToken_eq_excl = function(code) {
      var next = this.input.charCodeAt(this.pos + 1);
      if (next === 61) return this.finishOp(types.equality, this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2);
      if (code === 61 && next === 62 && this.options.ecmaVersion >= 6) {
          this.pos += 2;
          return this.finishToken(types.arrow);
      }
      return this.finishOp(code === 61 ? types.eq : types.prefix, 1);
  };
  pp$9.readToken_question = function() {
      var ecmaVersion = this.options.ecmaVersion;
      if (ecmaVersion >= 11) {
          var next = this.input.charCodeAt(this.pos + 1);
          if (next === 46) {
              var next2 = this.input.charCodeAt(this.pos + 2);
              if (next2 < 48 || next2 > 57) return this.finishOp(types.questionDot, 2);
          }
          if (next === 63) {
              if (ecmaVersion >= 12) {
                  var next2$1 = this.input.charCodeAt(this.pos + 2);
                  if (next2$1 === 61) return this.finishOp(types.assign, 3);
              }
              return this.finishOp(types.coalesce, 2);
          }
      }
      return this.finishOp(types.question, 1);
  };
  pp$9.getTokenFromCode = function(code) {
      switch(code){
          // The interpretation of a dot depends on whether it is followed
          // by a digit or another two dots.
          case 46:
              return this.readToken_dot();
          // Punctuation tokens.
          case 40:
              ++this.pos;
              return this.finishToken(types.parenL);
          case 41:
              ++this.pos;
              return this.finishToken(types.parenR);
          case 59:
              ++this.pos;
              return this.finishToken(types.semi);
          case 44:
              ++this.pos;
              return this.finishToken(types.comma);
          case 91:
              ++this.pos;
              return this.finishToken(types.bracketL);
          case 93:
              ++this.pos;
              return this.finishToken(types.bracketR);
          case 123:
              ++this.pos;
              return this.finishToken(types.braceL);
          case 125:
              ++this.pos;
              return this.finishToken(types.braceR);
          case 58:
              ++this.pos;
              return this.finishToken(types.colon);
          case 96:
              if (this.options.ecmaVersion < 6) break;
              ++this.pos;
              return this.finishToken(types.backQuote);
          case 48:
              var next = this.input.charCodeAt(this.pos + 1);
              if (next === 120 || next === 88) return this.readRadixNumber(16);
               // '0x', '0X' - hex number
              if (this.options.ecmaVersion >= 6) {
                  if (next === 111 || next === 79) return this.readRadixNumber(8);
                   // '0o', '0O' - octal number
                  if (next === 98 || next === 66) return this.readRadixNumber(2);
                   // '0b', '0B' - binary number
              }
          // Anything else beginning with a digit is an integer, octal
          // number, or float.
          case 49:
          case 50:
          case 51:
          case 52:
          case 53:
          case 54:
          case 55:
          case 56:
          case 57:
              return this.readNumber(false);
          // Quotes produce strings.
          case 34:
          case 39:
              return this.readString(code);
          // Operators are parsed inline in tiny state machines. '=' (61) is
          // often referred to. `finishOp` simply skips the amount of
          // characters it is given as second argument, and returns a token
          // of the type given by its first argument.
          case 47:
              return this.readToken_slash();
          case 37:
          case 42:
              return this.readToken_mult_modulo_exp(code);
          case 124:
          case 38:
              return this.readToken_pipe_amp(code);
          case 94:
              return this.readToken_caret();
          case 43:
          case 45:
              return this.readToken_plus_min(code);
          case 60:
          case 62:
              return this.readToken_lt_gt(code);
          case 61:
          case 33:
              return this.readToken_eq_excl(code);
          case 63:
              return this.readToken_question();
          case 126:
              return this.finishOp(types.prefix, 1);
      }
      this.raise(this.pos, "Unexpected character '" + codePointToString$1(code) + "'");
  };
  pp$9.finishOp = function(type, size) {
      var str = this.input.slice(this.pos, this.pos + size);
      this.pos += size;
      return this.finishToken(type, str);
  };
  pp$9.readRegexp = function() {
      var escaped, inClass, start = this.pos;
      for(;;){
          if (this.pos >= this.input.length) this.raise(start, "Unterminated regular expression");
          var ch = this.input.charAt(this.pos);
          if (lineBreak.test(ch)) this.raise(start, "Unterminated regular expression");
          if (!escaped) {
              if (ch === "[") inClass = true;
              else if (ch === "]" && inClass) inClass = false;
              else if (ch === "/" && !inClass) break;
              escaped = ch === "\\";
          } else escaped = false;
          ++this.pos;
      }
      var pattern = this.input.slice(start, this.pos);
      ++this.pos;
      var flagsStart = this.pos;
      var flags = this.readWord1();
      if (this.containsEsc) this.unexpected(flagsStart);
      // Validate pattern
      var state = this.regexpState || (this.regexpState = new RegExpValidationState(this));
      state.reset(start, pattern, flags);
      this.validateRegExpFlags(state);
      this.validateRegExpPattern(state);
      // Create Literal#value property value.
      var value = null;
      try {
          value = new RegExp(pattern, flags);
      } catch (e) {
      // ESTree requires null if it failed to instantiate RegExp object.
      // https://github.com/estree/estree/blob/a27003adf4fd7bfad44de9cef372a2eacd527b1c/es5.md#regexpliteral
      }
      return this.finishToken(types.regexp, {
          pattern: pattern,
          flags: flags,
          value: value
      });
  };
  // Read an integer in the given radix. Return null if zero digits
  // were read, the integer value otherwise. When `len` is given, this
  // will return `null` unless the integer has exactly `len` digits.
  pp$9.readInt = function(radix, len, maybeLegacyOctalNumericLiteral) {
      // `len` is used for character escape sequences. In that case, disallow separators.
      var allowSeparators = this.options.ecmaVersion >= 12 && len === undefined;
      // `maybeLegacyOctalNumericLiteral` is true if it doesn't have prefix (0x,0o,0b)
      // and isn't fraction part nor exponent part. In that case, if the first digit
      // is zero then disallow separators.
      var isLegacyOctalNumericLiteral = maybeLegacyOctalNumericLiteral && this.input.charCodeAt(this.pos) === 48;
      var start = this.pos, total = 0, lastCode = 0;
      for(var i = 0, e = len == null ? Infinity : len; i < e; ++i, ++this.pos){
          var code = this.input.charCodeAt(this.pos), val = void 0;
          if (allowSeparators && code === 95) {
              if (isLegacyOctalNumericLiteral) this.raiseRecoverable(this.pos, "Numeric separator is not allowed in legacy octal numeric literals");
              if (lastCode === 95) this.raiseRecoverable(this.pos, "Numeric separator must be exactly one underscore");
              if (i === 0) this.raiseRecoverable(this.pos, "Numeric separator is not allowed at the first of digits");
              lastCode = code;
              continue;
          }
          if (code >= 97) val = code - 97 + 10;
          else if (code >= 65) val = code - 65 + 10;
          else if (code >= 48 && code <= 57) val = code - 48;
          else val = Infinity;
          if (val >= radix) break;
          lastCode = code;
          total = total * radix + val;
      }
      if (allowSeparators && lastCode === 95) this.raiseRecoverable(this.pos - 1, "Numeric separator is not allowed at the last of digits");
      if (this.pos === start || len != null && this.pos - start !== len) return null;
      return total;
  };
  function stringToNumber(str, isLegacyOctalNumericLiteral) {
      if (isLegacyOctalNumericLiteral) return parseInt(str, 8);
      // `parseFloat(value)` stops parsing at the first numeric separator then returns a wrong value.
      return parseFloat(str.replace(/_/g, ""));
  }
  function stringToBigInt(str) {
      if (typeof BigInt !== "function") return null;
      // `BigInt(value)` throws syntax error if the string contains numeric separators.
      return BigInt(str.replace(/_/g, ""));
  }
  pp$9.readRadixNumber = function(radix) {
      var start = this.pos;
      this.pos += 2; // 0x
      var val = this.readInt(radix);
      if (val == null) this.raise(this.start + 2, "Expected number in radix " + radix);
      if (this.options.ecmaVersion >= 11 && this.input.charCodeAt(this.pos) === 110) {
          val = stringToBigInt(this.input.slice(start, this.pos));
          ++this.pos;
      } else if (isIdentifierStart(this.fullCharCodeAtPos())) this.raise(this.pos, "Identifier directly after number");
      return this.finishToken(types.num, val);
  };
  // Read an integer, octal integer, or floating-point number.
  pp$9.readNumber = function(startsWithDot) {
      var start = this.pos;
      if (!startsWithDot && this.readInt(10, undefined, true) === null) this.raise(start, "Invalid number");
      var octal = this.pos - start >= 2 && this.input.charCodeAt(start) === 48;
      if (octal && this.strict) this.raise(start, "Invalid number");
      var next = this.input.charCodeAt(this.pos);
      if (!octal && !startsWithDot && this.options.ecmaVersion >= 11 && next === 110) {
          var val$1 = stringToBigInt(this.input.slice(start, this.pos));
          ++this.pos;
          if (isIdentifierStart(this.fullCharCodeAtPos())) this.raise(this.pos, "Identifier directly after number");
          return this.finishToken(types.num, val$1);
      }
      if (octal && /[89]/.test(this.input.slice(start, this.pos))) octal = false;
      if (next === 46 && !octal) {
          ++this.pos;
          this.readInt(10);
          next = this.input.charCodeAt(this.pos);
      }
      if ((next === 69 || next === 101) && !octal) {
          next = this.input.charCodeAt(++this.pos);
          if (next === 43 || next === 45) ++this.pos;
           // '+-'
          if (this.readInt(10) === null) this.raise(start, "Invalid number");
      }
      if (isIdentifierStart(this.fullCharCodeAtPos())) this.raise(this.pos, "Identifier directly after number");
      var val = stringToNumber(this.input.slice(start, this.pos), octal);
      return this.finishToken(types.num, val);
  };
  // Read a string value, interpreting backslash-escapes.
  pp$9.readCodePoint = function() {
      var ch = this.input.charCodeAt(this.pos), code;
      if (ch === 123) {
          if (this.options.ecmaVersion < 6) this.unexpected();
          var codePos = ++this.pos;
          code = this.readHexChar(this.input.indexOf("}", this.pos) - this.pos);
          ++this.pos;
          if (code > 0x10FFFF) this.invalidStringToken(codePos, "Code point out of bounds");
      } else code = this.readHexChar(4);
      return code;
  };
  function codePointToString$1(code) {
      // UTF-16 Decoding
      if (code <= 0xFFFF) return String.fromCharCode(code);
      code -= 0x10000;
      return String.fromCharCode((code >> 10) + 0xD800, (code & 1023) + 0xDC00);
  }
  pp$9.readString = function(quote) {
      var out = "", chunkStart = ++this.pos;
      for(;;){
          if (this.pos >= this.input.length) this.raise(this.start, "Unterminated string constant");
          var ch = this.input.charCodeAt(this.pos);
          if (ch === quote) break;
          if (ch === 92) {
              out += this.input.slice(chunkStart, this.pos);
              out += this.readEscapedChar(false);
              chunkStart = this.pos;
          } else {
              if (isNewLine(ch, this.options.ecmaVersion >= 10)) this.raise(this.start, "Unterminated string constant");
              ++this.pos;
          }
      }
      out += this.input.slice(chunkStart, this.pos++);
      return this.finishToken(types.string, out);
  };
  // Reads template string tokens.
  var INVALID_TEMPLATE_ESCAPE_ERROR = {};
  pp$9.tryReadTemplateToken = function() {
      this.inTemplateElement = true;
      try {
          this.readTmplToken();
      } catch (err) {
          if (err === INVALID_TEMPLATE_ESCAPE_ERROR) this.readInvalidTemplateToken();
          else throw err;
      }
      this.inTemplateElement = false;
  };
  pp$9.invalidStringToken = function(position, message) {
      if (this.inTemplateElement && this.options.ecmaVersion >= 9) throw INVALID_TEMPLATE_ESCAPE_ERROR;
      else this.raise(position, message);
  };
  pp$9.readTmplToken = function() {
      var out = "", chunkStart = this.pos;
      for(;;){
          if (this.pos >= this.input.length) this.raise(this.start, "Unterminated template");
          var ch = this.input.charCodeAt(this.pos);
          if (ch === 96 || ch === 36 && this.input.charCodeAt(this.pos + 1) === 123) {
              if (this.pos === this.start && (this.type === types.template || this.type === types.invalidTemplate)) {
                  if (ch === 36) {
                      this.pos += 2;
                      return this.finishToken(types.dollarBraceL);
                  } else {
                      ++this.pos;
                      return this.finishToken(types.backQuote);
                  }
              }
              out += this.input.slice(chunkStart, this.pos);
              return this.finishToken(types.template, out);
          }
          if (ch === 92) {
              out += this.input.slice(chunkStart, this.pos);
              out += this.readEscapedChar(true);
              chunkStart = this.pos;
          } else if (isNewLine(ch)) {
              out += this.input.slice(chunkStart, this.pos);
              ++this.pos;
              switch(ch){
                  case 13:
                      if (this.input.charCodeAt(this.pos) === 10) ++this.pos;
                  case 10:
                      out += "\n";
                      break;
                  default:
                      out += String.fromCharCode(ch);
                      break;
              }
              if (this.options.locations) {
                  ++this.curLine;
                  this.lineStart = this.pos;
              }
              chunkStart = this.pos;
          } else ++this.pos;
      }
  };
  // Reads a template token to search for the end, without validating any escape sequences
  pp$9.readInvalidTemplateToken = function() {
      for(; this.pos < this.input.length; this.pos++)switch(this.input[this.pos]){
          case "\\":
              ++this.pos;
              break;
          case "$":
              if (this.input[this.pos + 1] !== "{") break;
          // falls through
          case "`":
              return this.finishToken(types.invalidTemplate, this.input.slice(this.start, this.pos));
      }
      this.raise(this.start, "Unterminated template");
  };
  // Used to read escaped characters
  pp$9.readEscapedChar = function(inTemplate) {
      var ch = this.input.charCodeAt(++this.pos);
      ++this.pos;
      switch(ch){
          case 110:
              return "\n" // 'n' -> '\n'
              ;
          case 114:
              return "\r" // 'r' -> '\r'
              ;
          case 120:
              return String.fromCharCode(this.readHexChar(2)) // 'x'
              ;
          case 117:
              return codePointToString$1(this.readCodePoint()) // 'u'
              ;
          case 116:
              return "	" // 't' -> '\t'
              ;
          case 98:
              return "\b" // 'b' -> '\b'
              ;
          case 118:
              return "\v" // 'v' -> '\u000b'
              ;
          case 102:
              return "\f" // 'f' -> '\f'
              ;
          case 13:
              if (this.input.charCodeAt(this.pos) === 10) ++this.pos;
               // '\r\n'
          case 10:
              if (this.options.locations) {
                  this.lineStart = this.pos;
                  ++this.curLine;
              }
              return "";
          case 56:
          case 57:
              if (inTemplate) {
                  var codePos = this.pos - 1;
                  this.invalidStringToken(codePos, "Invalid escape sequence in template string");
                  return null;
              }
          default:
              if (ch >= 48 && ch <= 55) {
                  var octalStr = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0];
                  var octal = parseInt(octalStr, 8);
                  if (octal > 255) {
                      octalStr = octalStr.slice(0, -1);
                      octal = parseInt(octalStr, 8);
                  }
                  this.pos += octalStr.length - 1;
                  ch = this.input.charCodeAt(this.pos);
                  if ((octalStr !== "0" || ch === 56 || ch === 57) && (this.strict || inTemplate)) this.invalidStringToken(this.pos - 1 - octalStr.length, inTemplate ? "Octal literal in template string" : "Octal literal in strict mode");
                  return String.fromCharCode(octal);
              }
              if (isNewLine(ch)) // Unicode new line characters after \ get removed from output in both
              // template literals and strings
              return "";
              return String.fromCharCode(ch);
      }
  };
  // Used to read character escape sequences ('\x', '\u', '\U').
  pp$9.readHexChar = function(len) {
      var codePos = this.pos;
      var n = this.readInt(16, len);
      if (n === null) this.invalidStringToken(codePos, "Bad character escape sequence");
      return n;
  };
  // Read an identifier, and return it as a string. Sets `this.containsEsc`
  // to whether the word contained a '\u' escape.
  //
  // Incrementally adds only escaped chars, adding other chunks as-is
  // as a micro-optimization.
  pp$9.readWord1 = function() {
      this.containsEsc = false;
      var word = "", first = true, chunkStart = this.pos;
      var astral = this.options.ecmaVersion >= 6;
      while(this.pos < this.input.length){
          var ch = this.fullCharCodeAtPos();
          if (isIdentifierChar(ch, astral)) this.pos += ch <= 0xffff ? 1 : 2;
          else if (ch === 92) {
              this.containsEsc = true;
              word += this.input.slice(chunkStart, this.pos);
              var escStart = this.pos;
              if (this.input.charCodeAt(++this.pos) !== 117) this.invalidStringToken(this.pos, "Expecting Unicode escape sequence \\uXXXX");
              ++this.pos;
              var esc = this.readCodePoint();
              if (!(first ? isIdentifierStart : isIdentifierChar)(esc, astral)) this.invalidStringToken(escStart, "Invalid Unicode escape");
              word += codePointToString$1(esc);
              chunkStart = this.pos;
          } else break;
          first = false;
      }
      return word + this.input.slice(chunkStart, this.pos);
  };
  // Read an identifier or keyword token. Will check for reserved
  // words when necessary.
  pp$9.readWord = function() {
      var word = this.readWord1();
      var type = types.name;
      if (this.keywords.test(word)) type = keywords$1[word];
      return this.finishToken(type, word);
  };
  // Acorn is a tiny, fast JavaScript parser written in JavaScript.
  var version = "7.4.1";
  Parser.acorn = {
      Parser: Parser,
      version: version,
      defaultOptions: defaultOptions,
      Position: Position,
      SourceLocation: SourceLocation,
      getLineInfo: getLineInfo,
      Node: Node,
      TokenType: TokenType,
      tokTypes: types,
      keywordTypes: keywords$1,
      TokContext: TokContext,
      tokContexts: types$1,
      isIdentifierChar: isIdentifierChar,
      isIdentifierStart: isIdentifierStart,
      Token: Token,
      isNewLine: isNewLine,
      lineBreak: lineBreak,
      lineBreakG: lineBreakG,
      nonASCIIwhitespace: nonASCIIwhitespace
  };
  // The main exported interface (under `self.acorn` when in the
  // browser) is a `parse` function that takes a code string and
  // returns an abstract syntax tree as specified by [Mozilla parser
  // API][api].
  //
  // [api]: https://developer.mozilla.org/en-US/docs/SpiderMonkey/Parser_API
  function parse(input, options) {
      return Parser.parse(input, options);
  }
  // This function tries to parse a single expression at a given
  // offset in a string. Useful for parsing mixed-language formats
  // that embed JavaScript expressions.
  function parseExpressionAt(input, pos, options) {
      return Parser.parseExpressionAt(input, pos, options);
  }
  // Acorn is organized as a tokenizer and a recursive-descent parser.
  // The `tokenizer` export provides an interface to the tokenizer.
  function tokenizer(input, options) {
      return Parser.tokenizer(input, options);
  }
  
  },{"@parcel/transformer-js/src/esmodule-helpers.js":"2NZKO"}],"ln0Qa":[function(require,module,exports) {
  var _classCallCheck = require("@swc/helpers/_/_class_call_check");
  var _createClass = require("@swc/helpers/_/_create_class");
  var _get = require("@swc/helpers/_/_get");
  var _getPrototypeOf = require("@swc/helpers/_/_get_prototype_of");
  var _inherits = require("@swc/helpers/_/_inherits");
  var _createSuper = require("@swc/helpers/_/_create_super");
  "use strict";
  var XHTMLEntities = require("b4fe035b49712736");
  var hexNumber = /^[\da-fA-F]+$/;
  var decimalNumber = /^\d+$/;
  // The map to `acorn-jsx` tokens from `acorn` namespace objects.
  var acornJsxMap = new WeakMap();
  // Get the original tokens for the given `acorn` namespace object.
  function getJsxTokens(acorn) {
      acorn = acorn.Parser.acorn || acorn;
      var acornJsx = acornJsxMap.get(acorn);
      if (!acornJsx) {
          var tt = acorn.tokTypes;
          var TokContext = acorn.TokContext;
          var TokenType = acorn.TokenType;
          var tc_oTag = new TokContext("<tag", false);
          var tc_cTag = new TokContext("</tag", false);
          var tc_expr = new TokContext("<tag>...</tag>", true, true);
          var tokContexts = {
              tc_oTag: tc_oTag,
              tc_cTag: tc_cTag,
              tc_expr: tc_expr
          };
          var tokTypes = {
              jsxName: new TokenType("jsxName"),
              jsxText: new TokenType("jsxText", {
                  beforeExpr: true
              }),
              jsxTagStart: new TokenType("jsxTagStart", {
                  startsExpr: true
              }),
              jsxTagEnd: new TokenType("jsxTagEnd")
          };
          tokTypes.jsxTagStart.updateContext = function() {
              this.context.push(tc_expr); // treat as beginning of JSX expression
              this.context.push(tc_oTag); // start opening tag context
              this.exprAllowed = false;
          };
          tokTypes.jsxTagEnd.updateContext = function(prevType) {
              var out = this.context.pop();
              if (out === tc_oTag && prevType === tt.slash || out === tc_cTag) {
                  this.context.pop();
                  this.exprAllowed = this.curContext() === tc_expr;
              } else this.exprAllowed = true;
          };
          acornJsx = {
              tokContexts: tokContexts,
              tokTypes: tokTypes
          };
          acornJsxMap.set(acorn, acornJsx);
      }
      return acornJsx;
  }
  // Transforms JSX element name to string.
  function getQualifiedJSXName(object) {
      if (!object) return object;
      if (object.type === "JSXIdentifier") return object.name;
      if (object.type === "JSXNamespacedName") return object.namespace.name + ":" + object.name.name;
      if (object.type === "JSXMemberExpression") return getQualifiedJSXName(object.object) + "." + getQualifiedJSXName(object.property);
  }
  module.exports = function(options) {
      options = options || {};
      return function(Parser) {
          return plugin({
              allowNamespaces: options.allowNamespaces !== false,
              allowNamespacedObjects: !!options.allowNamespacedObjects
          }, Parser);
      };
  };
  // This is `tokTypes` of the peer dep.
  // This can be different instances from the actual `tokTypes` this plugin uses.
  Object.defineProperty(module.exports, "tokTypes", {
      get: function get_tokTypes() {
          return getJsxTokens(require("441cb38ec329228d")).tokTypes;
      },
      configurable: true,
      enumerable: true
  });
  function plugin(options, Parser) {
      var acorn = Parser.acorn || require("441cb38ec329228d");
      var acornJsx = getJsxTokens(acorn);
      var tt = acorn.tokTypes;
      var tok = acornJsx.tokTypes;
      var tokContexts = acorn.tokContexts;
      var tc_oTag = acornJsx.tokContexts.tc_oTag;
      var tc_cTag = acornJsx.tokContexts.tc_cTag;
      var tc_expr = acornJsx.tokContexts.tc_expr;
      var isNewLine = acorn.isNewLine;
      var isIdentifierStart = acorn.isIdentifierStart;
      var isIdentifierChar = acorn.isIdentifierChar;
      return /*#__PURE__*/ function(Parser) {
          (0, _inherits._)(_class, Parser);
          var _super = (0, _createSuper._)(_class);
          function _class() {
              (0, _classCallCheck._)(this, _class);
              return _super.apply(this, arguments);
          }
          (0, _createClass._)(_class, [
              {
                  // Reads inline JSX contents token.
                  key: "jsx_readToken",
                  value: function jsx_readToken() {
                      var out = "", chunkStart = this.pos;
                      for(;;){
                          if (this.pos >= this.input.length) this.raise(this.start, "Unterminated JSX contents");
                          var ch = this.input.charCodeAt(this.pos);
                          switch(ch){
                              case 60:
                              case 123:
                                  if (this.pos === this.start) {
                                      if (ch === 60 && this.exprAllowed) {
                                          ++this.pos;
                                          return this.finishToken(tok.jsxTagStart);
                                      }
                                      return this.getTokenFromCode(ch);
                                  }
                                  out += this.input.slice(chunkStart, this.pos);
                                  return this.finishToken(tok.jsxText, out);
                              case 38:
                                  out += this.input.slice(chunkStart, this.pos);
                                  out += this.jsx_readEntity();
                                  chunkStart = this.pos;
                                  break;
                              case 62:
                              case 125:
                                  this.raise(this.pos, "Unexpected token `" + this.input[this.pos] + "`. Did you mean `" + (ch === 62 ? "&gt;" : "&rbrace;") + "` or " + '`{"' + this.input[this.pos] + '"}' + "`?");
                              default:
                                  if (isNewLine(ch)) {
                                      out += this.input.slice(chunkStart, this.pos);
                                      out += this.jsx_readNewLine(true);
                                      chunkStart = this.pos;
                                  } else ++this.pos;
                          }
                      }
                  }
              },
              {
                  key: "jsx_readNewLine",
                  value: function jsx_readNewLine(normalizeCRLF) {
                      var ch = this.input.charCodeAt(this.pos);
                      var out;
                      ++this.pos;
                      if (ch === 13 && this.input.charCodeAt(this.pos) === 10) {
                          ++this.pos;
                          out = normalizeCRLF ? "\n" : "\r\n";
                      } else out = String.fromCharCode(ch);
                      if (this.options.locations) {
                          ++this.curLine;
                          this.lineStart = this.pos;
                      }
                      return out;
                  }
              },
              {
                  key: "jsx_readString",
                  value: function jsx_readString(quote) {
                      var out = "", chunkStart = ++this.pos;
                      for(;;){
                          if (this.pos >= this.input.length) this.raise(this.start, "Unterminated string constant");
                          var ch = this.input.charCodeAt(this.pos);
                          if (ch === quote) break;
                          if (ch === 38) {
                              out += this.input.slice(chunkStart, this.pos);
                              out += this.jsx_readEntity();
                              chunkStart = this.pos;
                          } else if (isNewLine(ch)) {
                              out += this.input.slice(chunkStart, this.pos);
                              out += this.jsx_readNewLine(false);
                              chunkStart = this.pos;
                          } else ++this.pos;
                      }
                      out += this.input.slice(chunkStart, this.pos++);
                      return this.finishToken(tt.string, out);
                  }
              },
              {
                  key: "jsx_readEntity",
                  value: function jsx_readEntity() {
                      var str = "", count = 0, entity;
                      var ch = this.input[this.pos];
                      if (ch !== "&") this.raise(this.pos, "Entity must start with an ampersand");
                      var startPos = ++this.pos;
                      while(this.pos < this.input.length && count++ < 10){
                          ch = this.input[this.pos++];
                          if (ch === ";") {
                              if (str[0] === "#") {
                                  if (str[1] === "x") {
                                      str = str.substr(2);
                                      if (hexNumber.test(str)) entity = String.fromCharCode(parseInt(str, 16));
                                  } else {
                                      str = str.substr(1);
                                      if (decimalNumber.test(str)) entity = String.fromCharCode(parseInt(str, 10));
                                  }
                              } else entity = XHTMLEntities[str];
                              break;
                          }
                          str += ch;
                      }
                      if (!entity) {
                          this.pos = startPos;
                          return "&";
                      }
                      return entity;
                  }
              },
              {
                  // Read a JSX identifier (valid tag or attribute name).
                  //
                  // Optimized version since JSX identifiers can't contain
                  // escape characters and so can be read as single slice.
                  // Also assumes that first character was already checked
                  // by isIdentifierStart in readToken.
                  key: "jsx_readWord",
                  value: function jsx_readWord() {
                      var ch, start = this.pos;
                      do ch = this.input.charCodeAt(++this.pos);
                      while (isIdentifierChar(ch) || ch === 45); // '-'
                      return this.finishToken(tok.jsxName, this.input.slice(start, this.pos));
                  }
              },
              {
                  // Parse next token as JSX identifier
                  key: "jsx_parseIdentifier",
                  value: function jsx_parseIdentifier() {
                      var node = this.startNode();
                      if (this.type === tok.jsxName) node.name = this.value;
                      else if (this.type.keyword) node.name = this.type.keyword;
                      else this.unexpected();
                      this.next();
                      return this.finishNode(node, "JSXIdentifier");
                  }
              },
              {
                  // Parse namespaced identifier.
                  key: "jsx_parseNamespacedName",
                  value: function jsx_parseNamespacedName() {
                      var startPos = this.start, startLoc = this.startLoc;
                      var name = this.jsx_parseIdentifier();
                      if (!options.allowNamespaces || !this.eat(tt.colon)) return name;
                      var node = this.startNodeAt(startPos, startLoc);
                      node.namespace = name;
                      node.name = this.jsx_parseIdentifier();
                      return this.finishNode(node, "JSXNamespacedName");
                  }
              },
              {
                  // Parses element name in any form - namespaced, member
                  // or single identifier.
                  key: "jsx_parseElementName",
                  value: function jsx_parseElementName() {
                      if (this.type === tok.jsxTagEnd) return "";
                      var startPos = this.start, startLoc = this.startLoc;
                      var node = this.jsx_parseNamespacedName();
                      if (this.type === tt.dot && node.type === "JSXNamespacedName" && !options.allowNamespacedObjects) this.unexpected();
                      while(this.eat(tt.dot)){
                          var newNode = this.startNodeAt(startPos, startLoc);
                          newNode.object = node;
                          newNode.property = this.jsx_parseIdentifier();
                          node = this.finishNode(newNode, "JSXMemberExpression");
                      }
                      return node;
                  }
              },
              {
                  // Parses any type of JSX attribute value.
                  key: "jsx_parseAttributeValue",
                  value: function jsx_parseAttributeValue() {
                      switch(this.type){
                          case tt.braceL:
                              var node = this.jsx_parseExpressionContainer();
                              if (node.expression.type === "JSXEmptyExpression") this.raise(node.start, "JSX attributes must only be assigned a non-empty expression");
                              return node;
                          case tok.jsxTagStart:
                          case tt.string:
                              return this.parseExprAtom();
                          default:
                              this.raise(this.start, "JSX value should be either an expression or a quoted JSX text");
                      }
                  }
              },
              {
                  // JSXEmptyExpression is unique type since it doesn't actually parse anything,
                  // and so it should start at the end of last read token (left brace) and finish
                  // at the beginning of the next one (right brace).
                  key: "jsx_parseEmptyExpression",
                  value: function jsx_parseEmptyExpression() {
                      var node = this.startNodeAt(this.lastTokEnd, this.lastTokEndLoc);
                      return this.finishNodeAt(node, "JSXEmptyExpression", this.start, this.startLoc);
                  }
              },
              {
                  // Parses JSX expression enclosed into curly brackets.
                  key: "jsx_parseExpressionContainer",
                  value: function jsx_parseExpressionContainer() {
                      var node = this.startNode();
                      this.next();
                      node.expression = this.type === tt.braceR ? this.jsx_parseEmptyExpression() : this.parseExpression();
                      this.expect(tt.braceR);
                      return this.finishNode(node, "JSXExpressionContainer");
                  }
              },
              {
                  // Parses following JSX attribute name-value pair.
                  key: "jsx_parseAttribute",
                  value: function jsx_parseAttribute() {
                      var node = this.startNode();
                      if (this.eat(tt.braceL)) {
                          this.expect(tt.ellipsis);
                          node.argument = this.parseMaybeAssign();
                          this.expect(tt.braceR);
                          return this.finishNode(node, "JSXSpreadAttribute");
                      }
                      node.name = this.jsx_parseNamespacedName();
                      node.value = this.eat(tt.eq) ? this.jsx_parseAttributeValue() : null;
                      return this.finishNode(node, "JSXAttribute");
                  }
              },
              {
                  // Parses JSX opening tag starting after '<'.
                  key: "jsx_parseOpeningElementAt",
                  value: function jsx_parseOpeningElementAt(startPos, startLoc) {
                      var node = this.startNodeAt(startPos, startLoc);
                      node.attributes = [];
                      var nodeName = this.jsx_parseElementName();
                      if (nodeName) node.name = nodeName;
                      while(this.type !== tt.slash && this.type !== tok.jsxTagEnd)node.attributes.push(this.jsx_parseAttribute());
                      node.selfClosing = this.eat(tt.slash);
                      this.expect(tok.jsxTagEnd);
                      return this.finishNode(node, nodeName ? "JSXOpeningElement" : "JSXOpeningFragment");
                  }
              },
              {
                  // Parses JSX closing tag starting after '</'.
                  key: "jsx_parseClosingElementAt",
                  value: function jsx_parseClosingElementAt(startPos, startLoc) {
                      var node = this.startNodeAt(startPos, startLoc);
                      var nodeName = this.jsx_parseElementName();
                      if (nodeName) node.name = nodeName;
                      this.expect(tok.jsxTagEnd);
                      return this.finishNode(node, nodeName ? "JSXClosingElement" : "JSXClosingFragment");
                  }
              },
              {
                  // Parses entire JSX element, including it's opening tag
                  // (starting after '<'), attributes, contents and closing tag.
                  key: "jsx_parseElementAt",
                  value: function jsx_parseElementAt(startPos, startLoc) {
                      var node = this.startNodeAt(startPos, startLoc);
                      var children = [];
                      var openingElement = this.jsx_parseOpeningElementAt(startPos, startLoc);
                      var closingElement = null;
                      if (!openingElement.selfClosing) {
                          contents: for(;;)switch(this.type){
                              case tok.jsxTagStart:
                                  startPos = this.start;
                                  startLoc = this.startLoc;
                                  this.next();
                                  if (this.eat(tt.slash)) {
                                      closingElement = this.jsx_parseClosingElementAt(startPos, startLoc);
                                      break contents;
                                  }
                                  children.push(this.jsx_parseElementAt(startPos, startLoc));
                                  break;
                              case tok.jsxText:
                                  children.push(this.parseExprAtom());
                                  break;
                              case tt.braceL:
                                  children.push(this.jsx_parseExpressionContainer());
                                  break;
                              default:
                                  this.unexpected();
                          }
                          if (getQualifiedJSXName(closingElement.name) !== getQualifiedJSXName(openingElement.name)) this.raise(closingElement.start, "Expected corresponding JSX closing tag for <" + getQualifiedJSXName(openingElement.name) + ">");
                      }
                      var fragmentOrElement = openingElement.name ? "Element" : "Fragment";
                      node["opening" + fragmentOrElement] = openingElement;
                      node["closing" + fragmentOrElement] = closingElement;
                      node.children = children;
                      if (this.type === tt.relational && this.value === "<") this.raise(this.start, "Adjacent JSX elements must be wrapped in an enclosing tag");
                      return this.finishNode(node, "JSX" + fragmentOrElement);
                  }
              },
              {
                  // Parse JSX text
                  key: "jsx_parseText",
                  value: function jsx_parseText() {
                      var node = this.parseLiteral(this.value);
                      node.type = "JSXText";
                      return node;
                  }
              },
              {
                  // Parses entire JSX element from current position.
                  key: "jsx_parseElement",
                  value: function jsx_parseElement() {
                      var startPos = this.start, startLoc = this.startLoc;
                      this.next();
                      return this.jsx_parseElementAt(startPos, startLoc);
                  }
              },
              {
                  key: "parseExprAtom",
                  value: function parseExprAtom(refShortHandDefaultPos) {
                      if (this.type === tok.jsxText) return this.jsx_parseText();
                      else if (this.type === tok.jsxTagStart) return this.jsx_parseElement();
                      else return (0, _get._)((0, _getPrototypeOf._)(_class.prototype), "parseExprAtom", this).call(this, refShortHandDefaultPos);
                  }
              },
              {
                  key: "readToken",
                  value: function readToken(code) {
                      var context = this.curContext();
                      if (context === tc_expr) return this.jsx_readToken();
                      if (context === tc_oTag || context === tc_cTag) {
                          if (isIdentifierStart(code)) return this.jsx_readWord();
                          if (code == 62) {
                              ++this.pos;
                              return this.finishToken(tok.jsxTagEnd);
                          }
                          if ((code === 34 || code === 39) && context == tc_oTag) return this.jsx_readString(code);
                      }
                      if (code === 60 && this.exprAllowed && this.input.charCodeAt(this.pos + 1) !== 33) {
                          ++this.pos;
                          return this.finishToken(tok.jsxTagStart);
                      }
                      return (0, _get._)((0, _getPrototypeOf._)(_class.prototype), "readToken", this).call(this, code);
                  }
              },
              {
                  key: "updateContext",
                  value: function updateContext(prevType) {
                      if (this.type == tt.braceL) {
                          var curContext = this.curContext();
                          if (curContext == tc_oTag) this.context.push(tokContexts.b_expr);
                          else if (curContext == tc_expr) this.context.push(tokContexts.b_tmpl);
                          else (0, _get._)((0, _getPrototypeOf._)(_class.prototype), "updateContext", this).call(this, prevType);
                          this.exprAllowed = true;
                      } else if (this.type === tt.slash && prevType === tok.jsxTagStart) {
                          this.context.length -= 2; // do not consider JSX expr -> JSX open tag -> ... anymore
                          this.context.push(tc_cTag); // reconsider as closing tag context
                          this.exprAllowed = false;
                      } else return (0, _get._)((0, _getPrototypeOf._)(_class.prototype), "updateContext", this).call(this, prevType);
                  }
              }
          ], [
              {
                  key: "acornJsx",
                  get: // Expose actual `tokTypes` and `tokContexts` to other plugins.
                  function get() {
                      return acornJsx;
                  }
              }
          ]);
          return _class;
      }(Parser);
  }
  
  },{"@swc/helpers/_/_class_call_check":"loozK","@swc/helpers/_/_create_class":"eBTrY","@swc/helpers/_/_get":"lerOj","@swc/helpers/_/_get_prototype_of":"eKsz7","@swc/helpers/_/_inherits":"5u6OM","@swc/helpers/_/_create_super":"kfYok","b4fe035b49712736":"cEd5q","441cb38ec329228d":"kCa01"}],"loozK":[function(require,module,exports) {
  var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
  parcelHelpers.defineInteropFlag(exports);
  parcelHelpers.export(exports, "_class_call_check", function() {
      return _class_call_check;
  });
  parcelHelpers.export(exports, "_", function() {
      return _class_call_check;
  });
  function _class_call_check(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
  }
  
  },{"@parcel/transformer-js/src/esmodule-helpers.js":"2NZKO"}],"eBTrY":[function(require,module,exports) {
  var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
  parcelHelpers.defineInteropFlag(exports);
  parcelHelpers.export(exports, "_create_class", function() {
      return _create_class;
  });
  parcelHelpers.export(exports, "_", function() {
      return _create_class;
  });
  function _defineProperties(target, props) {
      for(var i = 0; i < props.length; i++){
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
      }
  }
  function _create_class(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      return Constructor;
  }
  
  },{"@parcel/transformer-js/src/esmodule-helpers.js":"2NZKO"}],"lerOj":[function(require,module,exports) {
  var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
  parcelHelpers.defineInteropFlag(exports);
  parcelHelpers.export(exports, "_get", function() {
      return _get;
  });
  parcelHelpers.export(exports, "_", function() {
      return _get;
  });
  var _superPropBaseJs = require("./_super_prop_base.js");
  function _get(target, property, receiver) {
      if (typeof Reflect !== "undefined" && Reflect.get) _get = Reflect.get;
      else _get = function get(target, property, receiver) {
          var base = (0, _superPropBaseJs._super_prop_base)(target, property);
          if (!base) return;
          var desc = Object.getOwnPropertyDescriptor(base, property);
          if (desc.get) return desc.get.call(receiver || target);
          return desc.value;
      };
      return _get(target, property, receiver || target);
  }
  
  },{"./_super_prop_base.js":"jPIRL","@parcel/transformer-js/src/esmodule-helpers.js":"2NZKO"}],"jPIRL":[function(require,module,exports) {
  var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
  parcelHelpers.defineInteropFlag(exports);
  parcelHelpers.export(exports, "_super_prop_base", function() {
      return _super_prop_base;
  });
  parcelHelpers.export(exports, "_", function() {
      return _super_prop_base;
  });
  var _getPrototypeOfJs = require("./_get_prototype_of.js");
  function _super_prop_base(object, property) {
      while(!Object.prototype.hasOwnProperty.call(object, property)){
          object = (0, _getPrototypeOfJs._get_prototype_of)(object);
          if (object === null) break;
      }
      return object;
  }
  
  },{"./_get_prototype_of.js":"eKsz7","@parcel/transformer-js/src/esmodule-helpers.js":"2NZKO"}],"eKsz7":[function(require,module,exports) {
  var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
  parcelHelpers.defineInteropFlag(exports);
  parcelHelpers.export(exports, "_get_prototype_of", function() {
      return _get_prototype_of;
  });
  parcelHelpers.export(exports, "_", function() {
      return _get_prototype_of;
  });
  function _get_prototype_of(o) {
      _get_prototype_of = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
          return o.__proto__ || Object.getPrototypeOf(o);
      };
      return _get_prototype_of(o);
  }
  
  },{"@parcel/transformer-js/src/esmodule-helpers.js":"2NZKO"}],"5u6OM":[function(require,module,exports) {
  var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
  parcelHelpers.defineInteropFlag(exports);
  parcelHelpers.export(exports, "_inherits", function() {
      return _inherits;
  });
  parcelHelpers.export(exports, "_", function() {
      return _inherits;
  });
  var _setPrototypeOfJs = require("./_set_prototype_of.js");
  function _inherits(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function");
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) (0, _setPrototypeOfJs._set_prototype_of)(subClass, superClass);
  }
  
  },{"./_set_prototype_of.js":"4aWpQ","@parcel/transformer-js/src/esmodule-helpers.js":"2NZKO"}],"4aWpQ":[function(require,module,exports) {
  var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
  parcelHelpers.defineInteropFlag(exports);
  parcelHelpers.export(exports, "_set_prototype_of", function() {
      return _set_prototype_of;
  });
  parcelHelpers.export(exports, "_", function() {
      return _set_prototype_of;
  });
  function _set_prototype_of(o, p) {
      _set_prototype_of = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of(o, p);
  }
  
  },{"@parcel/transformer-js/src/esmodule-helpers.js":"2NZKO"}],"kfYok":[function(require,module,exports) {
  var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
  parcelHelpers.defineInteropFlag(exports);
  parcelHelpers.export(exports, "_create_super", function() {
      return _create_super;
  });
  parcelHelpers.export(exports, "_", function() {
      return _create_super;
  });
  var _getPrototypeOfJs = require("./_get_prototype_of.js");
  var _isNativeReflectConstructJs = require("./_is_native_reflect_construct.js");
  var _possibleConstructorReturnJs = require("./_possible_constructor_return.js");
  function _create_super(Derived) {
      var hasNativeReflectConstruct = (0, _isNativeReflectConstructJs._is_native_reflect_construct)();
      return function _createSuperInternal() {
          var Super = (0, _getPrototypeOfJs._get_prototype_of)(Derived), result;
          if (hasNativeReflectConstruct) {
              var NewTarget = (0, _getPrototypeOfJs._get_prototype_of)(this).constructor;
              result = Reflect.construct(Super, arguments, NewTarget);
          } else result = Super.apply(this, arguments);
          return (0, _possibleConstructorReturnJs._possible_constructor_return)(this, result);
      };
  }
  
  },{"./_get_prototype_of.js":"eKsz7","./_is_native_reflect_construct.js":"j6vEs","./_possible_constructor_return.js":"f0C1z","@parcel/transformer-js/src/esmodule-helpers.js":"2NZKO"}],"j6vEs":[function(require,module,exports) {
  var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
  parcelHelpers.defineInteropFlag(exports);
  parcelHelpers.export(exports, "_is_native_reflect_construct", function() {
      return _is_native_reflect_construct;
  });
  parcelHelpers.export(exports, "_", function() {
      return _is_native_reflect_construct;
  });
  function _is_native_reflect_construct() {
      if (typeof Reflect === "undefined" || !Reflect.construct) return false;
      if (Reflect.construct.sham) return false;
      if (typeof Proxy === "function") return true;
      try {
          Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
          return true;
      } catch (e) {
          return false;
      }
  }
  
  },{"@parcel/transformer-js/src/esmodule-helpers.js":"2NZKO"}],"f0C1z":[function(require,module,exports) {
  var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
  parcelHelpers.defineInteropFlag(exports);
  parcelHelpers.export(exports, "_possible_constructor_return", function() {
      return _possible_constructor_return;
  });
  parcelHelpers.export(exports, "_", function() {
      return _possible_constructor_return;
  });
  var _assertThisInitializedJs = require("./_assert_this_initialized.js");
  var _typeOfJs = require("./_type_of.js");
  function _possible_constructor_return(self, call) {
      if (call && ((0, _typeOfJs._type_of)(call) === "object" || typeof call === "function")) return call;
      return (0, _assertThisInitializedJs._assert_this_initialized)(self);
  }
  
  },{"./_assert_this_initialized.js":"gWHo6","./_type_of.js":"3Q4xq","@parcel/transformer-js/src/esmodule-helpers.js":"2NZKO"}],"gWHo6":[function(require,module,exports) {
  var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
  parcelHelpers.defineInteropFlag(exports);
  parcelHelpers.export(exports, "_assert_this_initialized", function() {
      return _assert_this_initialized;
  });
  parcelHelpers.export(exports, "_", function() {
      return _assert_this_initialized;
  });
  function _assert_this_initialized(self) {
      if (self === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      return self;
  }
  
  },{"@parcel/transformer-js/src/esmodule-helpers.js":"2NZKO"}],"cEd5q":[function(require,module,exports) {
  module.exports = {
      quot: '"',
      amp: "&",
      apos: "'",
      lt: "<",
      gt: ">",
      nbsp: "\xa0",
      iexcl: "\xa1",
      cent: "\xa2",
      pound: "\xa3",
      curren: "\xa4",
      yen: "\xa5",
      brvbar: "\xa6",
      sect: "\xa7",
      uml: "\xa8",
      copy: "\xa9",
      ordf: "\xaa",
      laquo: "\xab",
      not: "\xac",
      shy: "\xad",
      reg: "\xae",
      macr: "\xaf",
      deg: "\xb0",
      plusmn: "\xb1",
      sup2: "\xb2",
      sup3: "\xb3",
      acute: "\xb4",
      micro: "\xb5",
      para: "\xb6",
      middot: "\xb7",
      cedil: "\xb8",
      sup1: "\xb9",
      ordm: "\xba",
      raquo: "\xbb",
      frac14: "\xbc",
      frac12: "\xbd",
      frac34: "\xbe",
      iquest: "\xbf",
      Agrave: "\xc0",
      Aacute: "\xc1",
      Acirc: "\xc2",
      Atilde: "\xc3",
      Auml: "\xc4",
      Aring: "\xc5",
      AElig: "\xc6",
      Ccedil: "\xc7",
      Egrave: "\xc8",
      Eacute: "\xc9",
      Ecirc: "\xca",
      Euml: "\xcb",
      Igrave: "\xcc",
      Iacute: "\xcd",
      Icirc: "\xce",
      Iuml: "\xcf",
      ETH: "\xd0",
      Ntilde: "\xd1",
      Ograve: "\xd2",
      Oacute: "\xd3",
      Ocirc: "\xd4",
      Otilde: "\xd5",
      Ouml: "\xd6",
      times: "\xd7",
      Oslash: "\xd8",
      Ugrave: "\xd9",
      Uacute: "\xda",
      Ucirc: "\xdb",
      Uuml: "\xdc",
      Yacute: "\xdd",
      THORN: "\xde",
      szlig: "\xdf",
      agrave: "\xe0",
      aacute: "\xe1",
      acirc: "\xe2",
      atilde: "\xe3",
      auml: "\xe4",
      aring: "\xe5",
      aelig: "\xe6",
      ccedil: "\xe7",
      egrave: "\xe8",
      eacute: "\xe9",
      ecirc: "\xea",
      euml: "\xeb",
      igrave: "\xec",
      iacute: "\xed",
      icirc: "\xee",
      iuml: "\xef",
      eth: "\xf0",
      ntilde: "\xf1",
      ograve: "\xf2",
      oacute: "\xf3",
      ocirc: "\xf4",
      otilde: "\xf5",
      ouml: "\xf6",
      divide: "\xf7",
      oslash: "\xf8",
      ugrave: "\xf9",
      uacute: "\xfa",
      ucirc: "\xfb",
      uuml: "\xfc",
      yacute: "\xfd",
      thorn: "\xfe",
      yuml: "\xff",
      OElig: "\u0152",
      oelig: "\u0153",
      Scaron: "\u0160",
      scaron: "\u0161",
      Yuml: "\u0178",
      fnof: "\u0192",
      circ: "\u02C6",
      tilde: "\u02DC",
      Alpha: "\u0391",
      Beta: "\u0392",
      Gamma: "\u0393",
      Delta: "\u0394",
      Epsilon: "\u0395",
      Zeta: "\u0396",
      Eta: "\u0397",
      Theta: "\u0398",
      Iota: "\u0399",
      Kappa: "\u039A",
      Lambda: "\u039B",
      Mu: "\u039C",
      Nu: "\u039D",
      Xi: "\u039E",
      Omicron: "\u039F",
      Pi: "\u03A0",
      Rho: "\u03A1",
      Sigma: "\u03A3",
      Tau: "\u03A4",
      Upsilon: "\u03A5",
      Phi: "\u03A6",
      Chi: "\u03A7",
      Psi: "\u03A8",
      Omega: "\u03A9",
      alpha: "\u03B1",
      beta: "\u03B2",
      gamma: "\u03B3",
      delta: "\u03B4",
      epsilon: "\u03B5",
      zeta: "\u03B6",
      eta: "\u03B7",
      theta: "\u03B8",
      iota: "\u03B9",
      kappa: "\u03BA",
      lambda: "\u03BB",
      mu: "\u03BC",
      nu: "\u03BD",
      xi: "\u03BE",
      omicron: "\u03BF",
      pi: "\u03C0",
      rho: "\u03C1",
      sigmaf: "\u03C2",
      sigma: "\u03C3",
      tau: "\u03C4",
      upsilon: "\u03C5",
      phi: "\u03C6",
      chi: "\u03C7",
      psi: "\u03C8",
      omega: "\u03C9",
      thetasym: "\u03D1",
      upsih: "\u03D2",
      piv: "\u03D6",
      ensp: "\u2002",
      emsp: "\u2003",
      thinsp: "\u2009",
      zwnj: "\u200C",
      zwj: "\u200D",
      lrm: "\u200E",
      rlm: "\u200F",
      ndash: "\u2013",
      mdash: "\u2014",
      lsquo: "\u2018",
      rsquo: "\u2019",
      sbquo: "\u201A",
      ldquo: "\u201C",
      rdquo: "\u201D",
      bdquo: "\u201E",
      dagger: "\u2020",
      Dagger: "\u2021",
      bull: "\u2022",
      hellip: "\u2026",
      permil: "\u2030",
      prime: "\u2032",
      Prime: "\u2033",
      lsaquo: "\u2039",
      rsaquo: "\u203A",
      oline: "\u203E",
      frasl: "\u2044",
      euro: "\u20AC",
      image: "\u2111",
      weierp: "\u2118",
      real: "\u211C",
      trade: "\u2122",
      alefsym: "\u2135",
      larr: "\u2190",
      uarr: "\u2191",
      rarr: "\u2192",
      darr: "\u2193",
      harr: "\u2194",
      crarr: "\u21B5",
      lArr: "\u21D0",
      uArr: "\u21D1",
      rArr: "\u21D2",
      dArr: "\u21D3",
      hArr: "\u21D4",
      forall: "\u2200",
      part: "\u2202",
      exist: "\u2203",
      empty: "\u2205",
      nabla: "\u2207",
      isin: "\u2208",
      notin: "\u2209",
      ni: "\u220B",
      prod: "\u220F",
      sum: "\u2211",
      minus: "\u2212",
      lowast: "\u2217",
      radic: "\u221A",
      prop: "\u221D",
      infin: "\u221E",
      ang: "\u2220",
      and: "\u2227",
      or: "\u2228",
      cap: "\u2229",
      cup: "\u222A",
      "int": "\u222B",
      there4: "\u2234",
      sim: "\u223C",
      cong: "\u2245",
      asymp: "\u2248",
      ne: "\u2260",
      equiv: "\u2261",
      le: "\u2264",
      ge: "\u2265",
      sub: "\u2282",
      sup: "\u2283",
      nsub: "\u2284",
      sube: "\u2286",
      supe: "\u2287",
      oplus: "\u2295",
      otimes: "\u2297",
      perp: "\u22A5",
      sdot: "\u22C5",
      lceil: "\u2308",
      rceil: "\u2309",
      lfloor: "\u230A",
      rfloor: "\u230B",
      lang: "\u2329",
      rang: "\u232A",
      loz: "\u25CA",
      spades: "\u2660",
      clubs: "\u2663",
      hearts: "\u2665",
      diams: "\u2666"
  };
  
  },{}],"6rSHM":[function(require,module,exports) {
  /**
   * @fileoverview The AST node types produced by the parser.
   * @author Nicholas C. Zakas
   */ "use strict";
  //------------------------------------------------------------------------------
  // Requirements
  //------------------------------------------------------------------------------
  // None!
  //------------------------------------------------------------------------------
  // Public
  //------------------------------------------------------------------------------
  module.exports = {
      AssignmentExpression: "AssignmentExpression",
      AssignmentPattern: "AssignmentPattern",
      ArrayExpression: "ArrayExpression",
      ArrayPattern: "ArrayPattern",
      ArrowFunctionExpression: "ArrowFunctionExpression",
      AwaitExpression: "AwaitExpression",
      BlockStatement: "BlockStatement",
      BinaryExpression: "BinaryExpression",
      BreakStatement: "BreakStatement",
      CallExpression: "CallExpression",
      CatchClause: "CatchClause",
      ClassBody: "ClassBody",
      ClassDeclaration: "ClassDeclaration",
      ClassExpression: "ClassExpression",
      ConditionalExpression: "ConditionalExpression",
      ContinueStatement: "ContinueStatement",
      DoWhileStatement: "DoWhileStatement",
      DebuggerStatement: "DebuggerStatement",
      EmptyStatement: "EmptyStatement",
      ExpressionStatement: "ExpressionStatement",
      ForStatement: "ForStatement",
      ForInStatement: "ForInStatement",
      ForOfStatement: "ForOfStatement",
      FunctionDeclaration: "FunctionDeclaration",
      FunctionExpression: "FunctionExpression",
      Identifier: "Identifier",
      IfStatement: "IfStatement",
      Literal: "Literal",
      LabeledStatement: "LabeledStatement",
      LogicalExpression: "LogicalExpression",
      MemberExpression: "MemberExpression",
      MetaProperty: "MetaProperty",
      MethodDefinition: "MethodDefinition",
      NewExpression: "NewExpression",
      ObjectExpression: "ObjectExpression",
      ObjectPattern: "ObjectPattern",
      Program: "Program",
      Property: "Property",
      RestElement: "RestElement",
      ReturnStatement: "ReturnStatement",
      SequenceExpression: "SequenceExpression",
      SpreadElement: "SpreadElement",
      Super: "Super",
      SwitchCase: "SwitchCase",
      SwitchStatement: "SwitchStatement",
      TaggedTemplateExpression: "TaggedTemplateExpression",
      TemplateElement: "TemplateElement",
      TemplateLiteral: "TemplateLiteral",
      ThisExpression: "ThisExpression",
      ThrowStatement: "ThrowStatement",
      TryStatement: "TryStatement",
      UnaryExpression: "UnaryExpression",
      UpdateExpression: "UpdateExpression",
      VariableDeclaration: "VariableDeclaration",
      VariableDeclarator: "VariableDeclarator",
      WhileStatement: "WhileStatement",
      WithStatement: "WithStatement",
      YieldExpression: "YieldExpression",
      JSXIdentifier: "JSXIdentifier",
      JSXNamespacedName: "JSXNamespacedName",
      JSXMemberExpression: "JSXMemberExpression",
      JSXEmptyExpression: "JSXEmptyExpression",
      JSXExpressionContainer: "JSXExpressionContainer",
      JSXElement: "JSXElement",
      JSXClosingElement: "JSXClosingElement",
      JSXOpeningElement: "JSXOpeningElement",
      JSXAttribute: "JSXAttribute",
      JSXSpreadAttribute: "JSXSpreadAttribute",
      JSXText: "JSXText",
      ExportDefaultDeclaration: "ExportDefaultDeclaration",
      ExportNamedDeclaration: "ExportNamedDeclaration",
      ExportAllDeclaration: "ExportAllDeclaration",
      ExportSpecifier: "ExportSpecifier",
      ImportDeclaration: "ImportDeclaration",
      ImportSpecifier: "ImportSpecifier",
      ImportDefaultSpecifier: "ImportDefaultSpecifier",
      ImportNamespaceSpecifier: "ImportNamespaceSpecifier"
  };
  
  },{}],"8NQUn":[function(require,module,exports) {
  var _classCallCheck = require("@swc/helpers/_/_class_call_check");
  var _createClass = require("@swc/helpers/_/_create_class");
  var _get = require("@swc/helpers/_/_get");
  var _getPrototypeOf = require("@swc/helpers/_/_get_prototype_of");
  var _inherits = require("@swc/helpers/_/_inherits");
  var _toConsumableArray = require("@swc/helpers/_/_to_consumable_array");
  var _createSuper = require("@swc/helpers/_/_create_super");
  "use strict";
  /* eslint-disable no-param-reassign*/ var TokenTranslator = require("c7cea78df50664e6");
  var normalizeOptions = require("7ebddb95a25ca48b").normalizeOptions;
  var STATE = Symbol("espree's internal state");
  var ESPRIMA_FINISH_NODE = Symbol("espree's esprimaFinishNode");
  /**
   * Converts an Acorn comment to a Esprima comment.
   * @param {boolean} block True if it's a block comment, false if not.
   * @param {string} text The text of the comment.
   * @param {int} start The index at which the comment starts.
   * @param {int} end The index at which the comment ends.
   * @param {Location} startLoc The location at which the comment starts.
   * @param {Location} endLoc The location at which the comment ends.
   * @returns {Object} The comment object.
   * @private
   */ function convertAcornCommentToEsprimaComment(block, text, start, end, startLoc, endLoc) {
      var comment = {
          type: block ? "Block" : "Line",
          value: text
      };
      if (typeof start === "number") {
          comment.start = start;
          comment.end = end;
          comment.range = [
              start,
              end
          ];
      }
      if (typeof startLoc === "object") comment.loc = {
          start: startLoc,
          end: endLoc
      };
      return comment;
  }
  module.exports = function() {
      return function(Parser) {
          var tokTypes = Object.assign({}, Parser.acorn.tokTypes);
          if (Parser.acornJsx) Object.assign(tokTypes, Parser.acornJsx.tokTypes);
          return /*#__PURE__*/ function(Parser1) {
              (0, _inherits._)(Espree, Parser1);
              var _super = (0, _createSuper._)(Espree);
              function Espree(opts, code) {
                  (0, _classCallCheck._)(this, Espree);
                  var _this;
                  if (typeof opts !== "object" || opts === null) opts = {};
                  if (typeof code !== "string" && !(code instanceof String)) code = String(code);
                  var options = normalizeOptions(opts);
                  var ecmaFeatures = options.ecmaFeatures || {};
                  var tokenTranslator = options.tokens === true ? new TokenTranslator(tokTypes, code) : null;
                  // Initialize acorn parser.
                  _this = _super.call(this, {
                      // TODO: use {...options} when spread is supported(Node.js >= 8.3.0).
                      ecmaVersion: options.ecmaVersion,
                      sourceType: options.sourceType,
                      ranges: options.ranges,
                      locations: options.locations,
                      // Truthy value is true for backward compatibility.
                      allowReturnOutsideFunction: Boolean(ecmaFeatures.globalReturn),
                      // Collect tokens
                      onToken: function(token) {
                          if (tokenTranslator) // Use `tokens`, `ecmaVersion`, and `jsxAttrValueToken` in the state.
                          tokenTranslator.onToken(token, _this[STATE]);
                          if (token.type !== tokTypes.eof) _this[STATE].lastToken = token;
                      },
                      // Collect comments
                      onComment: function(block, text, start, end, startLoc, endLoc) {
                          if (_this[STATE].comments) {
                              var comment = convertAcornCommentToEsprimaComment(block, text, start, end, startLoc, endLoc);
                              _this[STATE].comments.push(comment);
                          }
                      }
                  }, code);
                  // Initialize internal state.
                  _this[STATE] = {
                      tokens: tokenTranslator ? [] : null,
                      comments: options.comment === true ? [] : null,
                      impliedStrict: ecmaFeatures.impliedStrict === true && _this.options.ecmaVersion >= 5,
                      ecmaVersion: _this.options.ecmaVersion,
                      jsxAttrValueToken: false,
                      lastToken: null
                  };
                  return _this;
              }
              (0, _createClass._)(Espree, [
                  {
                      key: "tokenize",
                      value: function tokenize() {
                          do this.next();
                          while (this.type !== tokTypes.eof);
                          // Consume the final eof token
                          this.next();
                          var extra = this[STATE];
                          var tokens = extra.tokens;
                          if (extra.comments) tokens.comments = extra.comments;
                          return tokens;
                      }
                  },
                  {
                      key: "finishNode",
                      value: function finishNode() {
                          for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                              args[_key] = arguments[_key];
                          }
                          var _$_get;
                          var result = (_$_get = (0, _get._)((0, _getPrototypeOf._)(Espree.prototype), "finishNode", this)).call.apply(_$_get, [
                              this
                          ].concat((0, _toConsumableArray._)(args)));
                          return this[ESPRIMA_FINISH_NODE](result);
                      }
                  },
                  {
                      key: "finishNodeAt",
                      value: function finishNodeAt() {
                          for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                              args[_key] = arguments[_key];
                          }
                          var _$_get;
                          var result = (_$_get = (0, _get._)((0, _getPrototypeOf._)(Espree.prototype), "finishNodeAt", this)).call.apply(_$_get, [
                              this
                          ].concat((0, _toConsumableArray._)(args)));
                          return this[ESPRIMA_FINISH_NODE](result);
                      }
                  },
                  {
                      key: "parse",
                      value: function parse() {
                          var extra = this[STATE];
                          var program = (0, _get._)((0, _getPrototypeOf._)(Espree.prototype), "parse", this).call(this);
                          program.sourceType = this.options.sourceType;
                          if (extra.comments) program.comments = extra.comments;
                          if (extra.tokens) program.tokens = extra.tokens;
                          /*
               * Adjust opening and closing position of program to match Esprima.
               * Acorn always starts programs at range 0 whereas Esprima starts at the
               * first AST node's start (the only real difference is when there's leading
               * whitespace or leading comments). Acorn also counts trailing whitespace
               * as part of the program whereas Esprima only counts up to the last token.
               */ if (program.range) {
                              program.range[0] = program.body.length ? program.body[0].range[0] : program.range[0];
                              program.range[1] = extra.lastToken ? extra.lastToken.range[1] : program.range[1];
                          }
                          if (program.loc) {
                              program.loc.start = program.body.length ? program.body[0].loc.start : program.loc.start;
                              program.loc.end = extra.lastToken ? extra.lastToken.loc.end : program.loc.end;
                          }
                          return program;
                      }
                  },
                  {
                      key: "parseTopLevel",
                      value: function parseTopLevel(node) {
                          if (this[STATE].impliedStrict) this.strict = true;
                          return (0, _get._)((0, _getPrototypeOf._)(Espree.prototype), "parseTopLevel", this).call(this, node);
                      }
                  },
                  {
                      /**
           * Overwrites the default raise method to throw Esprima-style errors.
           * @param {int} pos The position of the error.
           * @param {string} message The error message.
           * @throws {SyntaxError} A syntax error.
           * @returns {void}
           */ key: "raise",
                      value: function raise(pos, message) {
                          var loc = Parser.acorn.getLineInfo(this.input, pos);
                          var err = new SyntaxError(message);
                          err.index = pos;
                          err.lineNumber = loc.line;
                          err.column = loc.column + 1; // acorn uses 0-based columns
                          throw err;
                      }
                  },
                  {
                      /**
           * Overwrites the default raise method to throw Esprima-style errors.
           * @param {int} pos The position of the error.
           * @param {string} message The error message.
           * @throws {SyntaxError} A syntax error.
           * @returns {void}
           */ key: "raiseRecoverable",
                      value: function raiseRecoverable(pos, message) {
                          this.raise(pos, message);
                      }
                  },
                  {
                      /**
           * Overwrites the default unexpected method to throw Esprima-style errors.
           * @param {int} pos The position of the error.
           * @throws {SyntaxError} A syntax error.
           * @returns {void}
           */ key: "unexpected",
                      value: function unexpected(pos) {
                          var message = "Unexpected token";
                          if (pos !== null && pos !== void 0) {
                              this.pos = pos;
                              if (this.options.locations) while(this.pos < this.lineStart){
                                  this.lineStart = this.input.lastIndexOf("\n", this.lineStart - 2) + 1;
                                  --this.curLine;
                              }
                              this.nextToken();
                          }
                          if (this.end > this.start) message += " ".concat(this.input.slice(this.start, this.end));
                          this.raise(this.start, message);
                      }
                  },
                  {
                      /*
          * Esprima-FB represents JSX strings as tokens called "JSXText", but Acorn-JSX
          * uses regular tt.string without any distinction between this and regular JS
          * strings. As such, we intercept an attempt to read a JSX string and set a flag
          * on extra so that when tokens are converted, the next token will be switched
          * to JSXText via onToken.
          */ key: "jsx_readString",
                      value: function jsx_readString(quote) {
                          var result = (0, _get._)((0, _getPrototypeOf._)(Espree.prototype), "jsx_readString", this).call(this, quote);
                          if (this.type === tokTypes.string) this[STATE].jsxAttrValueToken = true;
                          return result;
                      }
                  },
                  {
                      /**
           * Performs last-minute Esprima-specific compatibility checks and fixes.
           * @param {ASTNode} result The node to check.
           * @returns {ASTNode} The finished node.
           */ key: ESPRIMA_FINISH_NODE,
                      value: function value(result) {
                          // Acorn doesn't count the opening and closing backticks as part of templates
                          // so we have to adjust ranges/locations appropriately.
                          if (result.type === "TemplateElement") {
                              // additional adjustment needed if ${ is the last token
                              var terminalDollarBraceL = this.input.slice(result.end, result.end + 2) === "${";
                              if (result.range) {
                                  result.range[0]--;
                                  result.range[1] += terminalDollarBraceL ? 2 : 1;
                              }
                              if (result.loc) {
                                  result.loc.start.column--;
                                  result.loc.end.column += terminalDollarBraceL ? 2 : 1;
                              }
                          }
                          if (result.type.indexOf("Function") > -1 && !result.generator) result.generator = false;
                          return result;
                      }
                  }
              ]);
              return Espree;
          }(Parser);
      };
  };
  
  },{"@swc/helpers/_/_class_call_check":"loozK","@swc/helpers/_/_create_class":"eBTrY","@swc/helpers/_/_get":"lerOj","@swc/helpers/_/_get_prototype_of":"eKsz7","@swc/helpers/_/_inherits":"5u6OM","@swc/helpers/_/_to_consumable_array":"4dFHj","@swc/helpers/_/_create_super":"kfYok","c7cea78df50664e6":"aREjK","7ebddb95a25ca48b":"72rsS"}],"aREjK":[function(require,module,exports) {
  /**
   * @fileoverview Translates tokens between Acorn format and Esprima format.
   * @author Nicholas C. Zakas
   */ /* eslint no-underscore-dangle: 0 */ "use strict";
  //------------------------------------------------------------------------------
  // Requirements
  //------------------------------------------------------------------------------
  // none!
  //------------------------------------------------------------------------------
  // Private
  //------------------------------------------------------------------------------
  // Esprima Token Types
  var Token = {
      Boolean: "Boolean",
      EOF: "<end>",
      Identifier: "Identifier",
      Keyword: "Keyword",
      Null: "Null",
      Numeric: "Numeric",
      Punctuator: "Punctuator",
      String: "String",
      RegularExpression: "RegularExpression",
      Template: "Template",
      JSXIdentifier: "JSXIdentifier",
      JSXText: "JSXText"
  };
  /**
   * Converts part of a template into an Esprima token.
   * @param {AcornToken[]} tokens The Acorn tokens representing the template.
   * @param {string} code The source code.
   * @returns {EsprimaToken} The Esprima equivalent of the template token.
   * @private
   */ function convertTemplatePart(tokens, code) {
      var firstToken = tokens[0], lastTemplateToken = tokens[tokens.length - 1];
      var token = {
          type: Token.Template,
          value: code.slice(firstToken.start, lastTemplateToken.end)
      };
      if (firstToken.loc) token.loc = {
          start: firstToken.loc.start,
          end: lastTemplateToken.loc.end
      };
      if (firstToken.range) {
          token.start = firstToken.range[0];
          token.end = lastTemplateToken.range[1];
          token.range = [
              token.start,
              token.end
          ];
      }
      return token;
  }
  /**
   * Contains logic to translate Acorn tokens into Esprima tokens.
   * @param {Object} acornTokTypes The Acorn token types.
   * @param {string} code The source code Acorn is parsing. This is necessary
   *      to correct the "value" property of some tokens.
   * @constructor
   */ function TokenTranslator(acornTokTypes, code) {
      // token types
      this._acornTokTypes = acornTokTypes;
      // token buffer for templates
      this._tokens = [];
      // track the last curly brace
      this._curlyBrace = null;
      // the source code
      this._code = code;
  }
  TokenTranslator.prototype = {
      constructor: TokenTranslator,
      /**
       * Translates a single Esprima token to a single Acorn token. This may be
       * inaccurate due to how templates are handled differently in Esprima and
       * Acorn, but should be accurate for all other tokens.
       * @param {AcornToken} token The Acorn token to translate.
       * @param {Object} extra Espree extra object.
       * @returns {EsprimaToken} The Esprima version of the token.
       */ translate: function(token, extra) {
          var type = token.type, tt = this._acornTokTypes;
          if (type === tt.name) {
              token.type = Token.Identifier;
              // TODO: See if this is an Acorn bug
              if (token.value === "static") token.type = Token.Keyword;
              if (extra.ecmaVersion > 5 && (token.value === "yield" || token.value === "let")) token.type = Token.Keyword;
          } else if (type === tt.semi || type === tt.comma || type === tt.parenL || type === tt.parenR || type === tt.braceL || type === tt.braceR || type === tt.dot || type === tt.bracketL || type === tt.colon || type === tt.question || type === tt.bracketR || type === tt.ellipsis || type === tt.arrow || type === tt.jsxTagStart || type === tt.incDec || type === tt.starstar || type === tt.jsxTagEnd || type === tt.prefix || type === tt.questionDot || type.binop && !type.keyword || type.isAssign) {
              token.type = Token.Punctuator;
              token.value = this._code.slice(token.start, token.end);
          } else if (type === tt.jsxName) token.type = Token.JSXIdentifier;
          else if (type.label === "jsxText" || type === tt.jsxAttrValueToken) token.type = Token.JSXText;
          else if (type.keyword) {
              if (type.keyword === "true" || type.keyword === "false") token.type = Token.Boolean;
              else if (type.keyword === "null") token.type = Token.Null;
              else token.type = Token.Keyword;
          } else if (type === tt.num) {
              token.type = Token.Numeric;
              token.value = this._code.slice(token.start, token.end);
          } else if (type === tt.string) {
              if (extra.jsxAttrValueToken) {
                  extra.jsxAttrValueToken = false;
                  token.type = Token.JSXText;
              } else token.type = Token.String;
              token.value = this._code.slice(token.start, token.end);
          } else if (type === tt.regexp) {
              token.type = Token.RegularExpression;
              var value = token.value;
              token.regex = {
                  flags: value.flags,
                  pattern: value.pattern
              };
              token.value = "/".concat(value.pattern, "/").concat(value.flags);
          }
          return token;
      },
      /**
       * Function to call during Acorn's onToken handler.
       * @param {AcornToken} token The Acorn token.
       * @param {Object} extra The Espree extra object.
       * @returns {void}
       */ onToken: function(token, extra) {
          var that = this, tt = this._acornTokTypes, tokens = extra.tokens, templateTokens = this._tokens;
          /**
           * Flushes the buffered template tokens and resets the template
           * tracking.
           * @returns {void}
           * @private
           */ function translateTemplateTokens() {
              tokens.push(convertTemplatePart(that._tokens, that._code));
              that._tokens = [];
          }
          if (token.type === tt.eof) {
              // might be one last curlyBrace
              if (this._curlyBrace) tokens.push(this.translate(this._curlyBrace, extra));
              return;
          }
          if (token.type === tt.backQuote) {
              // if there's already a curly, it's not part of the template
              if (this._curlyBrace) {
                  tokens.push(this.translate(this._curlyBrace, extra));
                  this._curlyBrace = null;
              }
              templateTokens.push(token);
              // it's the end
              if (templateTokens.length > 1) translateTemplateTokens();
              return;
          }
          if (token.type === tt.dollarBraceL) {
              templateTokens.push(token);
              translateTemplateTokens();
              return;
          }
          if (token.type === tt.braceR) {
              // if there's already a curly, it's not part of the template
              if (this._curlyBrace) tokens.push(this.translate(this._curlyBrace, extra));
              // store new curly for later
              this._curlyBrace = token;
              return;
          }
          if (token.type === tt.template || token.type === tt.invalidTemplate) {
              if (this._curlyBrace) {
                  templateTokens.push(this._curlyBrace);
                  this._curlyBrace = null;
              }
              templateTokens.push(token);
              return;
          }
          if (this._curlyBrace) {
              tokens.push(this.translate(this._curlyBrace, extra));
              this._curlyBrace = null;
          }
          tokens.push(this.translate(token, extra));
      }
  };
  //------------------------------------------------------------------------------
  // Public
  //------------------------------------------------------------------------------
  module.exports = TokenTranslator;
  
  },{}],"72rsS":[function(require,module,exports) {
  /**
   * @fileoverview A collection of methods for processing Espree's options.
   * @author Kai Cataldo
   */ var _toConsumableArray = require("@swc/helpers/_/_to_consumable_array");
  var _typeOf = require("@swc/helpers/_/_type_of");
  "use strict";
  //------------------------------------------------------------------------------
  // Helpers
  //------------------------------------------------------------------------------
  var DEFAULT_ECMA_VERSION = 5;
  var SUPPORTED_VERSIONS = [
      3,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12
  ];
  /**
   * Normalize ECMAScript version from the initial config
   * @param {number} ecmaVersion ECMAScript version from the initial config
   * @throws {Error} throws an error if the ecmaVersion is invalid.
   * @returns {number} normalized ECMAScript version
   */ function normalizeEcmaVersion() {
      var ecmaVersion = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : DEFAULT_ECMA_VERSION;
      if (typeof ecmaVersion !== "number") throw new Error("ecmaVersion must be a number. Received value of type ".concat(typeof ecmaVersion === "undefined" ? "undefined" : (0, _typeOf._)(ecmaVersion), " instead."));
      var version = ecmaVersion;
      // Calculate ECMAScript edition number from official year version starting with
      // ES2015, which corresponds with ES6 (or a difference of 2009).
      if (version >= 2015) version -= 2009;
      if (!SUPPORTED_VERSIONS.includes(version)) throw new Error("Invalid ecmaVersion.");
      return version;
  }
  /**
   * Normalize sourceType from the initial config
   * @param {string} sourceType to normalize
   * @throws {Error} throw an error if sourceType is invalid
   * @returns {string} normalized sourceType
   */ function normalizeSourceType() {
      var sourceType = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "script";
      if (sourceType === "script" || sourceType === "module") return sourceType;
      throw new Error("Invalid sourceType.");
  }
  /**
   * Normalize parserOptions
   * @param {Object} options the parser options to normalize
   * @throws {Error} throw an error if found invalid option.
   * @returns {Object} normalized options
   */ function normalizeOptions(options) {
      var ecmaVersion = normalizeEcmaVersion(options.ecmaVersion);
      var sourceType = normalizeSourceType(options.sourceType);
      var ranges = options.range === true;
      var locations = options.loc === true;
      if (sourceType === "module" && ecmaVersion < 6) throw new Error("sourceType 'module' is not supported when ecmaVersion < 2015. Consider adding `{ ecmaVersion: 2015 }` to the parser options.");
      return Object.assign({}, options, {
          ecmaVersion: ecmaVersion,
          sourceType: sourceType,
          ranges: ranges,
          locations: locations
      });
  }
  /**
   * Get the latest ECMAScript version supported by Espree.
   * @returns {number} The latest ECMAScript version.
   */ function getLatestEcmaVersion() {
      return SUPPORTED_VERSIONS[SUPPORTED_VERSIONS.length - 1];
  }
  /**
   * Get the list of ECMAScript versions supported by Espree.
   * @returns {number[]} An array containing the supported ECMAScript versions.
   */ function getSupportedEcmaVersions() {
      return (0, _toConsumableArray._)(SUPPORTED_VERSIONS);
  }
  //------------------------------------------------------------------------------
  // Public
  //------------------------------------------------------------------------------
  module.exports = {
      normalizeOptions: normalizeOptions,
      getLatestEcmaVersion: getLatestEcmaVersion,
      getSupportedEcmaVersions: getSupportedEcmaVersions
  };
  
  },{"@swc/helpers/_/_to_consumable_array":"4dFHj","@swc/helpers/_/_type_of":"3Q4xq"}],"fjwje":[function(require,module,exports) {
  module.exports = JSON.parse('{"name":"espree","description":"An Esprima-compatible JavaScript parser built on Acorn","author":"Nicholas C. Zakas <nicholas+npm@nczconsulting.com>","homepage":"https://github.com/eslint/espree","main":"espree.js","version":"7.3.1","files":["lib","espree.js"],"engines":{"node":"^10.12.0 || >=12.0.0"},"repository":"eslint/espree","bugs":{"url":"http://github.com/eslint/espree.git"},"license":"BSD-2-Clause","dependencies":{"acorn":"^7.4.0","acorn-jsx":"^5.3.1","eslint-visitor-keys":"^1.3.0"},"devDependencies":{"browserify":"^16.5.0","chai":"^4.2.0","eslint":"^6.0.1","eslint-config-eslint":"^5.0.1","eslint-plugin-node":"^9.1.0","eslint-release":"^1.0.0","esprima":"latest","esprima-fb":"^8001.2001.0-dev-harmony-fb","json-diff":"^0.5.4","leche":"^2.3.0","mocha":"^6.2.0","nyc":"^14.1.1","regenerate":"^1.4.0","shelljs":"^0.3.0","shelljs-nodecli":"^0.1.1","unicode-6.3.0":"^0.7.5"},"keywords":["ast","ecmascript","javascript","parser","syntax","acorn"],"scripts":{"generate-regex":"node tools/generate-identifier-regex.js","test":"npm run-script lint && node Makefile.js test","lint":"node Makefile.js lint","fixlint":"node Makefile.js lint --fix","sync-docs":"node Makefile.js docs","browserify":"node Makefile.js browserify","generate-release":"eslint-generate-release","generate-alpharelease":"eslint-generate-prerelease alpha","generate-betarelease":"eslint-generate-prerelease beta","generate-rcrelease":"eslint-generate-prerelease rc","publish-release":"eslint-publish-release"}}');
  
  },{}],"eUMfR":[function(require,module,exports) {
  /**
   * @author Toru Nagashima <https://github.com/mysticatea>
   * See LICENSE file in root directory for full license.
   */ "use strict";
  var KEYS = require("5cef2eed29c56686");
  // Types.
  var NODE_TYPES = Object.freeze(Object.keys(KEYS));
  var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
  try {
      // Freeze the keys.
      for(var _iterator = NODE_TYPES[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
          var type = _step.value;
          Object.freeze(KEYS[type]);
      }
  } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
  } finally{
      try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
          }
      } finally{
          if (_didIteratorError) {
              throw _iteratorError;
          }
      }
  }
  Object.freeze(KEYS);
  // List to ignore keys.
  var KEY_BLACKLIST = new Set([
      "parent",
      "leadingComments",
      "trailingComments"
  ]);
  /**
   * Check whether a given key should be used or not.
   * @param {string} key The key to check.
   * @returns {boolean} `true` if the key should be used.
   */ function filterKey(key) {
      return !KEY_BLACKLIST.has(key) && key[0] !== "_";
  }
  //------------------------------------------------------------------------------
  // Public interfaces
  //------------------------------------------------------------------------------
  module.exports = Object.freeze({
      /**
       * Visitor keys.
       * @type {{ [type: string]: string[] | undefined }}
       */ KEYS: KEYS,
      /**
       * Get visitor keys of a given node.
       * @param {Object} node The AST node to get keys.
       * @returns {string[]} Visitor keys of the node.
       */ getKeys: function(node) {
          return Object.keys(node).filter(filterKey);
      },
      // Disable valid-jsdoc rule because it reports syntax error on the type of @returns.
      // eslint-disable-next-line valid-jsdoc
      /**
       * Make the union set with `KEYS` and given keys.
       * @param {Object} additionalKeys The additional keys.
       * @returns {{ [type: string]: string[] | undefined }} The union set.
       */ unionWith: function(additionalKeys) {
          var retv = Object.assign({}, KEYS);
          var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
          try {
              for(var _iterator = Object.keys(additionalKeys)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                  var type = _step.value;
                  if (retv.hasOwnProperty(type)) {
                      var keys = new Set(additionalKeys[type]);
                      var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                      try {
                          for(var _iterator1 = retv[type][Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                              var key = _step1.value;
                              keys.add(key);
                          }
                      } catch (err) {
                          _didIteratorError1 = true;
                          _iteratorError1 = err;
                      } finally{
                          try {
                              if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                                  _iterator1.return();
                              }
                          } finally{
                              if (_didIteratorError1) {
                                  throw _iteratorError1;
                              }
                          }
                      }
                      retv[type] = Object.freeze(Array.from(keys));
                  } else retv[type] = Object.freeze(Array.from(additionalKeys[type]));
              }
          } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
          } finally{
              try {
                  if (!_iteratorNormalCompletion && _iterator.return != null) {
                      _iterator.return();
                  }
              } finally{
                  if (_didIteratorError) {
                      throw _iteratorError;
                  }
              }
          }
          return Object.freeze(retv);
      }
  });
  
  },{"5cef2eed29c56686":"jzkyB"}],"jzkyB":[function(require,module,exports) {
  module.exports = JSON.parse('{"AssignmentExpression":["left","right"],"AssignmentPattern":["left","right"],"ArrayExpression":["elements"],"ArrayPattern":["elements"],"ArrowFunctionExpression":["params","body"],"AwaitExpression":["argument"],"BlockStatement":["body"],"BinaryExpression":["left","right"],"BreakStatement":["label"],"CallExpression":["callee","arguments"],"CatchClause":["param","body"],"ChainExpression":["expression"],"ClassBody":["body"],"ClassDeclaration":["id","superClass","body"],"ClassExpression":["id","superClass","body"],"ConditionalExpression":["test","consequent","alternate"],"ContinueStatement":["label"],"DebuggerStatement":[],"DoWhileStatement":["body","test"],"EmptyStatement":[],"ExportAllDeclaration":["exported","source"],"ExportDefaultDeclaration":["declaration"],"ExportNamedDeclaration":["declaration","specifiers","source"],"ExportSpecifier":["exported","local"],"ExpressionStatement":["expression"],"ExperimentalRestProperty":["argument"],"ExperimentalSpreadProperty":["argument"],"ForStatement":["init","test","update","body"],"ForInStatement":["left","right","body"],"ForOfStatement":["left","right","body"],"FunctionDeclaration":["id","params","body"],"FunctionExpression":["id","params","body"],"Identifier":[],"IfStatement":["test","consequent","alternate"],"ImportDeclaration":["specifiers","source"],"ImportDefaultSpecifier":["local"],"ImportExpression":["source"],"ImportNamespaceSpecifier":["local"],"ImportSpecifier":["imported","local"],"JSXAttribute":["name","value"],"JSXClosingElement":["name"],"JSXElement":["openingElement","children","closingElement"],"JSXEmptyExpression":[],"JSXExpressionContainer":["expression"],"JSXIdentifier":[],"JSXMemberExpression":["object","property"],"JSXNamespacedName":["namespace","name"],"JSXOpeningElement":["name","attributes"],"JSXSpreadAttribute":["argument"],"JSXText":[],"JSXFragment":["openingFragment","children","closingFragment"],"Literal":[],"LabeledStatement":["label","body"],"LogicalExpression":["left","right"],"MemberExpression":["object","property"],"MetaProperty":["meta","property"],"MethodDefinition":["key","value"],"NewExpression":["callee","arguments"],"ObjectExpression":["properties"],"ObjectPattern":["properties"],"Program":["body"],"Property":["key","value"],"RestElement":["argument"],"ReturnStatement":["argument"],"SequenceExpression":["expressions"],"SpreadElement":["argument"],"Super":[],"SwitchStatement":["discriminant","cases"],"SwitchCase":["test","consequent"],"TaggedTemplateExpression":["tag","quasi"],"TemplateElement":[],"TemplateLiteral":["quasis","expressions"],"ThisExpression":[],"ThrowStatement":["argument"],"TryStatement":["block","handler","finalizer"],"UnaryExpression":["argument"],"UpdateExpression":["argument"],"VariableDeclaration":["declarations"],"VariableDeclarator":["id","init"],"WhileStatement":["test","body"],"WithStatement":["object","body"],"YieldExpression":["argument"]}');
  
  },{}],"iLUIn":[function(require,module,exports) {
  /*
    Copyright (C) 2012-2013 Yusuke Suzuki <utatane.tea@gmail.com>
    Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>
  
    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:
  
      * Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.
      * Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.
  
    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
    AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
    ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
    DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
    (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
    LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
    ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
    (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
    THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  */ /*jslint vars:false, bitwise:true*/ /*jshint indent:4*/ /*global exports:true*/ (function clone(exports1) {
      "use strict";
      var Syntax, VisitorOption, VisitorKeys, BREAK, SKIP, REMOVE;
      function deepCopy(obj) {
          var ret = {}, key, val;
          for(key in obj)if (obj.hasOwnProperty(key)) {
              val = obj[key];
              if (typeof val === "object" && val !== null) ret[key] = deepCopy(val);
              else ret[key] = val;
          }
          return ret;
      }
      // based on LLVM libc++ upper_bound / lower_bound
      // MIT License
      function upperBound(array, func) {
          var diff, len, i, current;
          len = array.length;
          i = 0;
          while(len){
              diff = len >>> 1;
              current = i + diff;
              if (func(array[current])) len = diff;
              else {
                  i = current + 1;
                  len -= diff + 1;
              }
          }
          return i;
      }
      Syntax = {
          AssignmentExpression: "AssignmentExpression",
          AssignmentPattern: "AssignmentPattern",
          ArrayExpression: "ArrayExpression",
          ArrayPattern: "ArrayPattern",
          ArrowFunctionExpression: "ArrowFunctionExpression",
          AwaitExpression: "AwaitExpression",
          BlockStatement: "BlockStatement",
          BinaryExpression: "BinaryExpression",
          BreakStatement: "BreakStatement",
          CallExpression: "CallExpression",
          CatchClause: "CatchClause",
          ClassBody: "ClassBody",
          ClassDeclaration: "ClassDeclaration",
          ClassExpression: "ClassExpression",
          ComprehensionBlock: "ComprehensionBlock",
          ComprehensionExpression: "ComprehensionExpression",
          ConditionalExpression: "ConditionalExpression",
          ContinueStatement: "ContinueStatement",
          DebuggerStatement: "DebuggerStatement",
          DirectiveStatement: "DirectiveStatement",
          DoWhileStatement: "DoWhileStatement",
          EmptyStatement: "EmptyStatement",
          ExportAllDeclaration: "ExportAllDeclaration",
          ExportDefaultDeclaration: "ExportDefaultDeclaration",
          ExportNamedDeclaration: "ExportNamedDeclaration",
          ExportSpecifier: "ExportSpecifier",
          ExpressionStatement: "ExpressionStatement",
          ForStatement: "ForStatement",
          ForInStatement: "ForInStatement",
          ForOfStatement: "ForOfStatement",
          FunctionDeclaration: "FunctionDeclaration",
          FunctionExpression: "FunctionExpression",
          GeneratorExpression: "GeneratorExpression",
          Identifier: "Identifier",
          IfStatement: "IfStatement",
          ImportExpression: "ImportExpression",
          ImportDeclaration: "ImportDeclaration",
          ImportDefaultSpecifier: "ImportDefaultSpecifier",
          ImportNamespaceSpecifier: "ImportNamespaceSpecifier",
          ImportSpecifier: "ImportSpecifier",
          Literal: "Literal",
          LabeledStatement: "LabeledStatement",
          LogicalExpression: "LogicalExpression",
          MemberExpression: "MemberExpression",
          MetaProperty: "MetaProperty",
          MethodDefinition: "MethodDefinition",
          ModuleSpecifier: "ModuleSpecifier",
          NewExpression: "NewExpression",
          ObjectExpression: "ObjectExpression",
          ObjectPattern: "ObjectPattern",
          Program: "Program",
          Property: "Property",
          RestElement: "RestElement",
          ReturnStatement: "ReturnStatement",
          SequenceExpression: "SequenceExpression",
          SpreadElement: "SpreadElement",
          Super: "Super",
          SwitchStatement: "SwitchStatement",
          SwitchCase: "SwitchCase",
          TaggedTemplateExpression: "TaggedTemplateExpression",
          TemplateElement: "TemplateElement",
          TemplateLiteral: "TemplateLiteral",
          ThisExpression: "ThisExpression",
          ThrowStatement: "ThrowStatement",
          TryStatement: "TryStatement",
          UnaryExpression: "UnaryExpression",
          UpdateExpression: "UpdateExpression",
          VariableDeclaration: "VariableDeclaration",
          VariableDeclarator: "VariableDeclarator",
          WhileStatement: "WhileStatement",
          WithStatement: "WithStatement",
          YieldExpression: "YieldExpression"
      };
      VisitorKeys = {
          AssignmentExpression: [
              "left",
              "right"
          ],
          AssignmentPattern: [
              "left",
              "right"
          ],
          ArrayExpression: [
              "elements"
          ],
          ArrayPattern: [
              "elements"
          ],
          ArrowFunctionExpression: [
              "params",
              "body"
          ],
          AwaitExpression: [
              "argument"
          ],
          BlockStatement: [
              "body"
          ],
          BinaryExpression: [
              "left",
              "right"
          ],
          BreakStatement: [
              "label"
          ],
          CallExpression: [
              "callee",
              "arguments"
          ],
          CatchClause: [
              "param",
              "body"
          ],
          ClassBody: [
              "body"
          ],
          ClassDeclaration: [
              "id",
              "superClass",
              "body"
          ],
          ClassExpression: [
              "id",
              "superClass",
              "body"
          ],
          ComprehensionBlock: [
              "left",
              "right"
          ],
          ComprehensionExpression: [
              "blocks",
              "filter",
              "body"
          ],
          ConditionalExpression: [
              "test",
              "consequent",
              "alternate"
          ],
          ContinueStatement: [
              "label"
          ],
          DebuggerStatement: [],
          DirectiveStatement: [],
          DoWhileStatement: [
              "body",
              "test"
          ],
          EmptyStatement: [],
          ExportAllDeclaration: [
              "source"
          ],
          ExportDefaultDeclaration: [
              "declaration"
          ],
          ExportNamedDeclaration: [
              "declaration",
              "specifiers",
              "source"
          ],
          ExportSpecifier: [
              "exported",
              "local"
          ],
          ExpressionStatement: [
              "expression"
          ],
          ForStatement: [
              "init",
              "test",
              "update",
              "body"
          ],
          ForInStatement: [
              "left",
              "right",
              "body"
          ],
          ForOfStatement: [
              "left",
              "right",
              "body"
          ],
          FunctionDeclaration: [
              "id",
              "params",
              "body"
          ],
          FunctionExpression: [
              "id",
              "params",
              "body"
          ],
          GeneratorExpression: [
              "blocks",
              "filter",
              "body"
          ],
          Identifier: [],
          IfStatement: [
              "test",
              "consequent",
              "alternate"
          ],
          ImportExpression: [
              "source"
          ],
          ImportDeclaration: [
              "specifiers",
              "source"
          ],
          ImportDefaultSpecifier: [
              "local"
          ],
          ImportNamespaceSpecifier: [
              "local"
          ],
          ImportSpecifier: [
              "imported",
              "local"
          ],
          Literal: [],
          LabeledStatement: [
              "label",
              "body"
          ],
          LogicalExpression: [
              "left",
              "right"
          ],
          MemberExpression: [
              "object",
              "property"
          ],
          MetaProperty: [
              "meta",
              "property"
          ],
          MethodDefinition: [
              "key",
              "value"
          ],
          ModuleSpecifier: [],
          NewExpression: [
              "callee",
              "arguments"
          ],
          ObjectExpression: [
              "properties"
          ],
          ObjectPattern: [
              "properties"
          ],
          Program: [
              "body"
          ],
          Property: [
              "key",
              "value"
          ],
          RestElement: [
              "argument"
          ],
          ReturnStatement: [
              "argument"
          ],
          SequenceExpression: [
              "expressions"
          ],
          SpreadElement: [
              "argument"
          ],
          Super: [],
          SwitchStatement: [
              "discriminant",
              "cases"
          ],
          SwitchCase: [
              "test",
              "consequent"
          ],
          TaggedTemplateExpression: [
              "tag",
              "quasi"
          ],
          TemplateElement: [],
          TemplateLiteral: [
              "quasis",
              "expressions"
          ],
          ThisExpression: [],
          ThrowStatement: [
              "argument"
          ],
          TryStatement: [
              "block",
              "handler",
              "finalizer"
          ],
          UnaryExpression: [
              "argument"
          ],
          UpdateExpression: [
              "argument"
          ],
          VariableDeclaration: [
              "declarations"
          ],
          VariableDeclarator: [
              "id",
              "init"
          ],
          WhileStatement: [
              "test",
              "body"
          ],
          WithStatement: [
              "object",
              "body"
          ],
          YieldExpression: [
              "argument"
          ]
      };
      // unique id
      BREAK = {};
      SKIP = {};
      REMOVE = {};
      VisitorOption = {
          Break: BREAK,
          Skip: SKIP,
          Remove: REMOVE
      };
      function Reference(parent, key) {
          this.parent = parent;
          this.key = key;
      }
      Reference.prototype.replace = function replace(node) {
          this.parent[this.key] = node;
      };
      Reference.prototype.remove = function remove() {
          if (Array.isArray(this.parent)) {
              this.parent.splice(this.key, 1);
              return true;
          } else {
              this.replace(null);
              return false;
          }
      };
      function Element(node, path, wrap, ref) {
          this.node = node;
          this.path = path;
          this.wrap = wrap;
          this.ref = ref;
      }
      function Controller() {}
      // API:
      // return property path array from root to current node
      Controller.prototype.path = function path() {
          var i, iz, j, jz, result, element;
          function addToPath(result, path) {
              if (Array.isArray(path)) for(j = 0, jz = path.length; j < jz; ++j)result.push(path[j]);
              else result.push(path);
          }
          // root node
          if (!this.__current.path) return null;
          // first node is sentinel, second node is root element
          result = [];
          for(i = 2, iz = this.__leavelist.length; i < iz; ++i){
              element = this.__leavelist[i];
              addToPath(result, element.path);
          }
          addToPath(result, this.__current.path);
          return result;
      };
      // API:
      // return type of current node
      Controller.prototype.type = function() {
          var node = this.current();
          return node.type || this.__current.wrap;
      };
      // API:
      // return array of parent elements
      Controller.prototype.parents = function parents() {
          var i, iz, result;
          // first node is sentinel
          result = [];
          for(i = 1, iz = this.__leavelist.length; i < iz; ++i)result.push(this.__leavelist[i].node);
          return result;
      };
      // API:
      // return current node
      Controller.prototype.current = function current() {
          return this.__current.node;
      };
      Controller.prototype.__execute = function __execute(callback, element) {
          var previous, result;
          result = undefined;
          previous = this.__current;
          this.__current = element;
          this.__state = null;
          if (callback) result = callback.call(this, element.node, this.__leavelist[this.__leavelist.length - 1].node);
          this.__current = previous;
          return result;
      };
      // API:
      // notify control skip / break
      Controller.prototype.notify = function notify(flag) {
          this.__state = flag;
      };
      // API:
      // skip child nodes of current node
      Controller.prototype.skip = function() {
          this.notify(SKIP);
      };
      // API:
      // break traversals
      Controller.prototype["break"] = function() {
          this.notify(BREAK);
      };
      // API:
      // remove node
      Controller.prototype.remove = function() {
          this.notify(REMOVE);
      };
      Controller.prototype.__initialize = function(root, visitor) {
          this.visitor = visitor;
          this.root = root;
          this.__worklist = [];
          this.__leavelist = [];
          this.__current = null;
          this.__state = null;
          this.__fallback = null;
          if (visitor.fallback === "iteration") this.__fallback = Object.keys;
          else if (typeof visitor.fallback === "function") this.__fallback = visitor.fallback;
          this.__keys = VisitorKeys;
          if (visitor.keys) this.__keys = Object.assign(Object.create(this.__keys), visitor.keys);
      };
      function isNode(node) {
          if (node == null) return false;
          return typeof node === "object" && typeof node.type === "string";
      }
      function isProperty(nodeType, key) {
          return (nodeType === Syntax.ObjectExpression || nodeType === Syntax.ObjectPattern) && "properties" === key;
      }
      Controller.prototype.traverse = function traverse(root, visitor) {
          var worklist, leavelist, element, node, nodeType, ret, key, current, current2, candidates, candidate, sentinel;
          this.__initialize(root, visitor);
          sentinel = {};
          // reference
          worklist = this.__worklist;
          leavelist = this.__leavelist;
          // initialize
          worklist.push(new Element(root, null, null, null));
          leavelist.push(new Element(null, null, null, null));
          while(worklist.length){
              element = worklist.pop();
              if (element === sentinel) {
                  element = leavelist.pop();
                  ret = this.__execute(visitor.leave, element);
                  if (this.__state === BREAK || ret === BREAK) return;
                  continue;
              }
              if (element.node) {
                  ret = this.__execute(visitor.enter, element);
                  if (this.__state === BREAK || ret === BREAK) return;
                  worklist.push(sentinel);
                  leavelist.push(element);
                  if (this.__state === SKIP || ret === SKIP) continue;
                  node = element.node;
                  nodeType = node.type || element.wrap;
                  candidates = this.__keys[nodeType];
                  if (!candidates) {
                      if (this.__fallback) candidates = this.__fallback(node);
                      else throw new Error("Unknown node type " + nodeType + ".");
                  }
                  current = candidates.length;
                  while((current -= 1) >= 0){
                      key = candidates[current];
                      candidate = node[key];
                      if (!candidate) continue;
                      if (Array.isArray(candidate)) {
                          current2 = candidate.length;
                          while((current2 -= 1) >= 0){
                              if (!candidate[current2]) continue;
                              if (isProperty(nodeType, candidates[current])) element = new Element(candidate[current2], [
                                  key,
                                  current2
                              ], "Property", null);
                              else if (isNode(candidate[current2])) element = new Element(candidate[current2], [
                                  key,
                                  current2
                              ], null, null);
                              else continue;
                              worklist.push(element);
                          }
                      } else if (isNode(candidate)) worklist.push(new Element(candidate, key, null, null));
                  }
              }
          }
      };
      Controller.prototype.replace = function replace(root, visitor) {
          var worklist, leavelist, node, nodeType, target, element, current, current2, candidates, candidate, sentinel, outer, key;
          function removeElem(element) {
              var i, key, nextElem, parent;
              if (element.ref.remove()) {
                  // When the reference is an element of an array.
                  key = element.ref.key;
                  parent = element.ref.parent;
                  // If removed from array, then decrease following items' keys.
                  i = worklist.length;
                  while(i--){
                      nextElem = worklist[i];
                      if (nextElem.ref && nextElem.ref.parent === parent) {
                          if (nextElem.ref.key < key) break;
                          --nextElem.ref.key;
                      }
                  }
              }
          }
          this.__initialize(root, visitor);
          sentinel = {};
          // reference
          worklist = this.__worklist;
          leavelist = this.__leavelist;
          // initialize
          outer = {
              root: root
          };
          element = new Element(root, null, null, new Reference(outer, "root"));
          worklist.push(element);
          leavelist.push(element);
          while(worklist.length){
              element = worklist.pop();
              if (element === sentinel) {
                  element = leavelist.pop();
                  target = this.__execute(visitor.leave, element);
                  // node may be replaced with null,
                  // so distinguish between undefined and null in this place
                  if (target !== undefined && target !== BREAK && target !== SKIP && target !== REMOVE) // replace
                  element.ref.replace(target);
                  if (this.__state === REMOVE || target === REMOVE) removeElem(element);
                  if (this.__state === BREAK || target === BREAK) return outer.root;
                  continue;
              }
              target = this.__execute(visitor.enter, element);
              // node may be replaced with null,
              // so distinguish between undefined and null in this place
              if (target !== undefined && target !== BREAK && target !== SKIP && target !== REMOVE) {
                  // replace
                  element.ref.replace(target);
                  element.node = target;
              }
              if (this.__state === REMOVE || target === REMOVE) {
                  removeElem(element);
                  element.node = null;
              }
              if (this.__state === BREAK || target === BREAK) return outer.root;
              // node may be null
              node = element.node;
              if (!node) continue;
              worklist.push(sentinel);
              leavelist.push(element);
              if (this.__state === SKIP || target === SKIP) continue;
              nodeType = node.type || element.wrap;
              candidates = this.__keys[nodeType];
              if (!candidates) {
                  if (this.__fallback) candidates = this.__fallback(node);
                  else throw new Error("Unknown node type " + nodeType + ".");
              }
              current = candidates.length;
              while((current -= 1) >= 0){
                  key = candidates[current];
                  candidate = node[key];
                  if (!candidate) continue;
                  if (Array.isArray(candidate)) {
                      current2 = candidate.length;
                      while((current2 -= 1) >= 0){
                          if (!candidate[current2]) continue;
                          if (isProperty(nodeType, candidates[current])) element = new Element(candidate[current2], [
                              key,
                              current2
                          ], "Property", new Reference(candidate, current2));
                          else if (isNode(candidate[current2])) element = new Element(candidate[current2], [
                              key,
                              current2
                          ], null, new Reference(candidate, current2));
                          else continue;
                          worklist.push(element);
                      }
                  } else if (isNode(candidate)) worklist.push(new Element(candidate, key, null, new Reference(node, key)));
              }
          }
          return outer.root;
      };
      function traverse(root, visitor) {
          var controller = new Controller();
          return controller.traverse(root, visitor);
      }
      function replace(root, visitor) {
          var controller = new Controller();
          return controller.replace(root, visitor);
      }
      function extendCommentRange(comment, tokens) {
          var target;
          target = upperBound(tokens, function search(token) {
              return token.range[0] > comment.range[0];
          });
          comment.extendedRange = [
              comment.range[0],
              comment.range[1]
          ];
          if (target !== tokens.length) comment.extendedRange[1] = tokens[target].range[0];
          target -= 1;
          if (target >= 0) comment.extendedRange[0] = tokens[target].range[1];
          return comment;
      }
      function attachComments(tree, providedComments, tokens) {
          // At first, we should calculate extended comment ranges.
          var comments = [], comment, len, i, cursor;
          if (!tree.range) throw new Error("attachComments needs range information");
          // tokens array is empty, we attach comments to tree as 'leadingComments'
          if (!tokens.length) {
              if (providedComments.length) {
                  for(i = 0, len = providedComments.length; i < len; i += 1){
                      comment = deepCopy(providedComments[i]);
                      comment.extendedRange = [
                          0,
                          tree.range[0]
                      ];
                      comments.push(comment);
                  }
                  tree.leadingComments = comments;
              }
              return tree;
          }
          for(i = 0, len = providedComments.length; i < len; i += 1)comments.push(extendCommentRange(deepCopy(providedComments[i]), tokens));
          // This is based on John Freeman's implementation.
          cursor = 0;
          traverse(tree, {
              enter: function enter(node) {
                  var comment;
                  while(cursor < comments.length){
                      comment = comments[cursor];
                      if (comment.extendedRange[1] > node.range[0]) break;
                      if (comment.extendedRange[1] === node.range[0]) {
                          if (!node.leadingComments) node.leadingComments = [];
                          node.leadingComments.push(comment);
                          comments.splice(cursor, 1);
                      } else cursor += 1;
                  }
                  // already out of owned node
                  if (cursor === comments.length) return VisitorOption.Break;
                  if (comments[cursor].extendedRange[0] > node.range[1]) return VisitorOption.Skip;
              }
          });
          cursor = 0;
          traverse(tree, {
              leave: function leave(node) {
                  var comment;
                  while(cursor < comments.length){
                      comment = comments[cursor];
                      if (node.range[1] < comment.extendedRange[0]) break;
                      if (node.range[1] === comment.extendedRange[0]) {
                          if (!node.trailingComments) node.trailingComments = [];
                          node.trailingComments.push(comment);
                          comments.splice(cursor, 1);
                      } else cursor += 1;
                  }
                  // already out of owned node
                  if (cursor === comments.length) return VisitorOption.Break;
                  if (comments[cursor].extendedRange[0] > node.range[1]) return VisitorOption.Skip;
              }
          });
          return tree;
      }
      exports1.version = require("43d63817d6a33876").version;
      exports1.Syntax = Syntax;
      exports1.traverse = traverse;
      exports1.replace = replace;
      exports1.attachComments = attachComments;
      exports1.VisitorKeys = VisitorKeys;
      exports1.VisitorOption = VisitorOption;
      exports1.Controller = Controller;
      exports1.cloneEnvironment = function() {
          return clone({});
      };
      return exports1;
  })(exports); /* vim: set sw=4 ts=4 et tw=80 : */ 
  
  },{"43d63817d6a33876":"21MT8"}],"21MT8":[function(require,module,exports) {
  module.exports = JSON.parse('{"name":"estraverse","description":"ECMAScript JS AST traversal functions","homepage":"https://github.com/estools/estraverse","main":"estraverse.js","version":"4.3.0","engines":{"node":">=4.0"},"maintainers":[{"name":"Yusuke Suzuki","email":"utatane.tea@gmail.com","web":"http://github.com/Constellation"}],"repository":{"type":"git","url":"http://github.com/estools/estraverse.git"},"devDependencies":{"babel-preset-env":"^1.6.1","babel-register":"^6.3.13","chai":"^2.1.1","espree":"^1.11.0","gulp":"^3.8.10","gulp-bump":"^0.2.2","gulp-filter":"^2.0.0","gulp-git":"^1.0.1","gulp-tag-version":"^1.3.0","jshint":"^2.5.6","mocha":"^2.1.0"},"license":"BSD-2-Clause","scripts":{"test":"npm run-script lint && npm run-script unit-test","lint":"jshint estraverse.js","unit-test":"mocha --compilers js:babel-register"}}');
  
  },{}],"fWcW3":[function(require,module,exports) {
  "use strict";
  // This file is autogenerated. Do not modify manually
  module.exports = [
      "add",
      "addBack",
      "addClass",
      "after",
      "ajax",
      "ajaxComplete",
      "ajaxError",
      "ajaxPrefilter",
      "ajaxSend",
      "ajaxSetup",
      "ajaxStart",
      "ajaxStop",
      "ajaxSuccess",
      "ajaxTransport",
      "animate",
      "append",
      "appendTo",
      "attr",
      "attr",
      "before",
      "bind",
      "blur",
      "camelCase",
      "change",
      "children",
      "cleanData",
      "clearQueue",
      "click",
      "clone",
      "clone",
      "closest",
      "constructor",
      "contains",
      "contents",
      "contextmenu",
      "css",
      "css",
      "data",
      "data",
      "dblclick",
      "delay",
      "delegate",
      "dequeue",
      "dequeue",
      "detach",
      "each",
      "each",
      "empty",
      "end",
      "eq",
      "error",
      "escapeSelector",
      "even",
      "extend",
      "extend",
      "fadeIn",
      "fadeOut",
      "fadeTo",
      "fadeToggle",
      "filter",
      "filter",
      "find",
      "find",
      "finish",
      "first",
      "focus",
      "focusin",
      "focusout",
      "fx",
      "get",
      "get",
      "getJSON",
      "getScript",
      "globalEval",
      "grep",
      "has",
      "hasClass",
      "hasData",
      "height",
      "hide",
      "holdReady",
      "hover",
      "html",
      "htmlPrefilter",
      "inArray",
      "index",
      "init",
      "innerHeight",
      "innerWidth",
      "insertAfter",
      "insertBefore",
      "is",
      "isArray",
      "isEmptyObject",
      "isFunction",
      "isNumeric",
      "isPlainObject",
      "isWindow",
      "isXMLDoc",
      "keydown",
      "keypress",
      "keyup",
      "last",
      "load",
      "makeArray",
      "map",
      "map",
      "merge",
      "mousedown",
      "mouseenter",
      "mouseleave",
      "mousemove",
      "mouseout",
      "mouseover",
      "mouseup",
      "next",
      "nextAll",
      "nextUntil",
      "noConflict",
      "nodeName",
      "noop",
      "not",
      "now",
      "odd",
      "off",
      "offset",
      "offsetParent",
      "on",
      "one",
      "outerHeight",
      "outerWidth",
      "param",
      "parent",
      "parents",
      "parentsUntil",
      "parseHTML",
      "parseJSON",
      "parseXML",
      "position",
      "post",
      "prepend",
      "prependTo",
      "prev",
      "prevAll",
      "prevUntil",
      "promise",
      "prop",
      "prop",
      "proxy",
      "push",
      "pushStack",
      "queue",
      "queue",
      "ready",
      "ready",
      "readyException",
      "remove",
      "removeAttr",
      "removeAttr",
      "removeClass",
      "removeData",
      "removeData",
      "removeEvent",
      "removeProp",
      "replaceAll",
      "replaceWith",
      "resize",
      "scroll",
      "scrollLeft",
      "scrollTop",
      "select",
      "serialize",
      "serializeArray",
      "show",
      "siblings",
      "slice",
      "slideDown",
      "slideToggle",
      "slideUp",
      "sort",
      "speed",
      "splice",
      "stop",
      "style",
      "submit",
      "text",
      "text",
      "toArray",
      "toggle",
      "toggleClass",
      "trigger",
      "triggerHandler",
      "trim",
      "type",
      "unbind",
      "undelegate",
      "unique",
      "uniqueSort",
      "unwrap",
      "val",
      "when",
      "width",
      "wrap",
      "wrapAll",
      "wrapInner"
  ];
  
  },{}],"96IJQ":[function(require,module,exports) {
  module.exports = "export class Utils {\n    constructor(selector) {\n        this.elements = Utils.getSelector(selector);\n        this.element = this.get(0);\n        return this;\n    }\n\n    /* $$ Template START $$ */\n\n    each(func) {\n        if (!this.elements.length) {\n            return this;\n        }\n        this.elements.forEach((el, index) => {\n            func.call(el, el, index);\n        });\n        return this;\n    }\n\n    prev() {\n        if (!this.element) {\n            return this;\n        }\n        return new Utils(this.element.previousElementSibling);\n    }\n\n    next() {\n        if (!this.element) {\n            return this;\n        }\n        return new Utils(this.element.nextElementSibling);\n    }\n\n    prevAll(filter) {\n        if (!this.element) {\n            return this;\n        }\n        const sibs = [];\n        while ((this.element = this.element.previousSibling)) {\n            if (this.element.nodeType === 3) {\n                continue; // ignore text nodes\n            }\n            if (!filter || filter(this.element)) sibs.push(this.element);\n        }\n        return new Utils(sibs);\n    }\n\n    nextAll(filter) {\n        if (!this.element) {\n            return this;\n        }\n        const sibs = [];\n        let nextElem = this.element.parentNode.firstChild;\n        do {\n            if (nextElem.nodeType === 3) continue; // ignore text nodes\n            if (nextElem === this.element) continue; // ignore this.element of target\n            if (nextElem === this.element.nextElementSibling) {\n                if (!filter || filter(this.element)) {\n                    sibs.push(nextElem);\n                    this.element = nextElem;\n                }\n            }\n        } while ((nextElem = nextElem.nextSibling));\n        return new Utils(sibs);\n    }\n\n    closest(selector) {\n        if (!this.element) {\n            return this;\n        }\n        const matchesSelector =\n            this.element.matches ||\n            this.element.webkitMatchesSelector ||\n            this.element.mozMatchesSelector ||\n            this.element.msMatchesSelector;\n\n        while (this.element) {\n            if (matchesSelector.call(this.element, selector)) {\n                return new Utils(this.element);\n            }\n            this.element = this.element.parentElement;\n        }\n        return this;\n    }\n\n    parentsUntil(selector, filter) {\n        if (!this.element) {\n            return this;\n        }\n        const result = [];\n        const matchesSelector =\n            this.element.matches ||\n            this.element.webkitMatchesSelector ||\n            this.element.mozMatchesSelector ||\n            this.element.msMatchesSelector;\n\n        // match start from parent\n        let el = this.element.parentElement;\n        while (el && !matchesSelector.call(el, selector)) {\n            if (!filter) {\n                result.push(el);\n            } else if (matchesSelector.call(el, filter)) {\n                result.push(el);\n            }\n            el = el.parentElement;\n        }\n        return new Utils(result);\n    }\n\n    val(value) {\n        if (!this.element) {\n            return '';\n        }\n        if (value === undefined) {\n            return this.element.value;\n        }\n        this.element.value = value;\n    }\n\n    attr(name, value) {\n        if (value === undefined) {\n            if (!this.element) {\n                return '';\n            }\n            return this.element.getAttribute(name);\n        }\n        this.each((el) => {\n            el.setAttribute(name, value);\n        });\n        return this;\n    }\n\n    removeAttr(attributes) {\n        const attrs = attributes.split(' ');\n        this.each((el) => {\n            attrs.forEach((attr) => el.removeAttribute(attr));\n        });\n        return this;\n    }\n\n    hasAttribute(attribute) {\n        if (!this.element) {\n            return false;\n        }\n        return this.element.hasAttribute(attribute);\n    }\n\n    data(name, value) {\n        return this.attr('data-'+name, value);\n    }\n\n    css(css, value) {\n        if (value !== undefined) {\n            this.each((el) => {\n                Utils.setCss(el, css, value);\n            });\n            return this;\n        }\n        if (typeof css === 'object') {\n            for (const property in css) {\n                if (Object.prototype.hasOwnProperty.call(css, property)) {\n                    this.each((el) => {\n                        Utils.setCss(el, property, css[property]);\n                    });\n                }\n            }\n            return this;\n        }\n        const cssProp = Utils.camelCase(css);\n        const property = Utils.styleSupport(cssProp);\n        return getComputedStyle(this.element)[property];\n    }\n\n    addClass(classNames = '') {\n        this.each((el) => {\n            // IE doesn't support multiple arguments\n            classNames.split(' ').forEach((className) => {\n                el.classList.add(className);\n            });\n        });\n        return this;\n    }\n\n    removeClass(classNames) {\n        this.each((el) => {\n            // IE doesn't support multiple arguments\n            classNames.split(' ').forEach((className) => {\n                el.classList.remove(className);\n            });\n        });\n        return this;\n    }\n\n    hasClass(className) {\n        if (!this.element) {\n            return false;\n        }\n        return this.element.classList.contains(className);\n    }\n\n    toggleClass(className) {\n        if (!this.element) {\n            return this;\n        }\n        this.element.classList.toggle(className);\n    }\n\n    find(selector) {\n        return new Utils(Utils.getSelector(selector, this.element));\n    }\n\n    first() {\n        return new Utils(this.elements[0]);\n    }\n\n    eq(index) {\n        return new Utils(this.elements[index]);\n    }\n\n    parent() {\n        return new Utils(this.element.parentElement);\n    }\n\n    offsetParent() {\n        if (!this.element) {\n            return this;\n        }\n        return new Utils(this.element.offsetParent);\n    }\n\n    children() {\n        return new Utils(this.element.children);\n    }\n\n    get(index) {\n        if (index !== undefined) {\n            return this.elements[index];\n        }\n        return this.elements;\n    }\n\n    siblings() {\n        if (!this.element) {\n            return this;\n        }\n        const elements = Array.prototype.filter.call(\n            this.element.parentNode.children,\n            (child) => child !== this.element\n        );\n        return new Utils(elements);\n    }\n\n    index() {\n        if (!this.element) return -1;\n        let i = 0;\n        do {\n            i++;\n        } while ((this.element = this.element.previousElementSibling));\n        return i;\n    }\n\n    wrap(className) {\n        this.each((el) => {\n            const wrapper = document.createElement('div');\n            wrapper.className = className;\n            el.parentNode.insertBefore(wrapper, el);\n            wrapper.appendChild(el);\n        });\n        return this;\n    }\n\n    unwrap() {\n        this.each((el) => {\n            const elParentNode = el.parentNode;\n\n            if (elParentNode !== document.body) {\n                elParentNode.parentNode.insertBefore(el, elParentNode);\n                elParentNode.parentNode.removeChild(elParentNode);\n            }\n        });\n        return this;\n    }\n\n    on(events, listener) {\n        events.split(' ').forEach((eventName) => {\n            this.each((el) => {\n                const tNEventName = Utils.setEventName(el, eventName);\n                if (!Array.isArray(Utils.eventListeners[tNEventName])) {\n                    Utils.eventListeners[tNEventName] = [];\n                }\n                Utils.eventListeners[tNEventName].push(listener);\n\n                // https://github.com/microsoft/TypeScript/issues/28357\n                if (el) {\n                    el.addEventListener(eventName.split('.')[0], listener);\n                }\n            });\n        });\n\n        return this;\n    }\n\n    one(event, listener) {\n        this.each((el) => {\n            new Utils(el).on(event, () => {\n                new Utils(el).off(event);\n                listener(event);\n            });\n        });\n        return this;\n    }\n\n    off(eventNames) {\n        Object.keys(Utils.eventListeners).forEach((tNEventName) => {\n            const currentEventName = Utils.getEventNameFromId(tNEventName);\n            eventNames.split(' ').forEach((eventName) => {\n                if (Utils.isEventMatched(eventName, currentEventName)) {\n                    this.each((el) => {\n                        if (\n                            Utils.getElementEventName(el, currentEventName) ===\n                            tNEventName\n                        ) {\n                            Utils.eventListeners[tNEventName].forEach(\n                                (listener) => {\n                                    el.removeEventListener(\n                                        currentEventName.split('.')[0],\n                                        listener\n                                    );\n                                }\n                            );\n                            delete Utils.eventListeners[tNEventName];\n                        }\n                    });\n                }\n            });\n        });\n        return this;\n    }\n\n    trigger(event, detail) {\n        if (!this.element) {\n            return this;\n        }\n        const eventName = event.split('.')[0];\n        const isNativeEvent =\n            typeof document.body['on'+eventName] !== 'undefined';\n        if (isNativeEvent) {\n            this.each((el) => {\n                el.dispatchEvent(new Event(eventName));\n            });\n            return this;\n        }\n        const customEvent = new CustomEvent(eventName, {\n            detail: detail || null,\n        });\n        this.each((el) => {\n            el.dispatchEvent(customEvent);\n        });\n        return this;\n    }\n\n    html(html) {\n        if (html === undefined) {\n            if (!this.element) {\n                return '';\n            }\n            return this.element.innerHTML;\n        }\n        this.each((el) => {\n            el.innerHTML = html;\n        });\n        return this;\n    }\n\n    text(text) {\n        if (text === undefined) {\n            if (!this.element) {\n                return '';\n            }\n            return this.element.textContent;\n        }\n        this.each((el) => {\n            el.textContent = text;\n        });\n        return this;\n    }\n\n    hide() {\n        this.each((el) => {\n            el.style.display = 'none';\n        });\n    }\n\n    show() {\n        this.each((el) => {\n            el.style.display = '';\n        });\n    }\n\n    clone() {\n        return new Utils(this.element.cloneNode(true));\n    }\n\n    append(html) {\n        this.each((el) => {\n            if (typeof html === 'string') {\n                el.insertAdjacentHTML('beforeend', html);\n            } else {\n                el.appendChild(html);\n            }\n        });\n        return this;\n    }\n\n    prepend(html) {\n        this.each((el) => {\n            if (typeof html === 'string') {\n                el.insertAdjacentHTML('afterbegin', html);\n            } else {\n                el.insertBefore(html, el.firstChild);\n            }\n        });\n        return this;\n    }\n\n    remove() {\n        this.each((el) => {\n            el.parentNode.removeChild(el);\n        });\n        return this;\n    }\n\n    empty() {\n        this.each((el) => {\n            el.innerHTML = '';\n        });\n        return this;\n    }\n\n    contains(child) {\n        return this.element !== child && this.element.contains(child);\n    }\n\n    is(el) {\n        if (typeof el === 'string') {\n            return (\n                this.element.matches ||\n                this.element.matchesSelector ||\n                this.element.msMatchesSelector ||\n                this.element.mozMatchesSelector ||\n                this.element.webkitMatchesSelector ||\n                this.element.oMatchesSelector\n            ).call(this.element, el);\n        }\n        return this.element === (el.element || el);\n    }\n\n    width() {\n        if (!this.element) {\n            return 0;\n        }\n        const style = window.getComputedStyle(this.element, null);\n        return parseFloat(style.width.replace('px', ''));\n    }\n\n    // Outer Width With Margin if margin is true\n    outerWidth(margin) {\n        if (!this.element) {\n            return 0;\n        }\n        if (margin !== undefined) {\n            let width = this.element.offsetWidth;\n            const style = window.getComputedStyle(this.element);\n\n            width +=\n                parseInt(style.marginLeft, 10) +\n                parseInt(style.marginRight, 10);\n            return width;\n        }\n        return this.element.offsetWidth;\n    }\n\n    height() {\n        if (!this.element) {\n            return 0;\n        }\n        const style = window.getComputedStyle(this.element, null);\n        return parseFloat(style.height.replace('px', ''));\n    }\n\n    outerHeight(margin) {\n        if (!this.element) {\n            return 0;\n        }\n        if (margin !== undefined) {\n            let height = this.element.offsetHeight;\n            const style = getComputedStyle(this.element);\n\n            height +=\n                parseInt(style.marginTop, 10) +\n                parseInt(style.marginBottom, 10);\n            return height;\n        }\n        return this.element.offsetHeight;\n    }\n\n    offset() {\n        if (!this.element) {\n            return {\n                left: 0,\n                top: 0,\n            };\n        }\n        const box = this.element.getBoundingClientRect();\n        return {\n            top:\n                box.top +\n                window.pageYOffset -\n                document.documentElement.clientTop,\n            left:\n                box.left +\n                window.pageXOffset -\n                document.documentElement.clientLeft,\n        };\n    }\n\n    position() {\n        return {\n            left: this.element.offsetLeft,\n            top: this.element.offsetTop,\n        };\n    }\n\n    static generateUUID() {\n        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {\n            // eslint-disable-next-line no-bitwise\n            const r = (Math.random() * 16) | 0;\n            // eslint-disable-next-line no-bitwise\n            const v = c === 'x' ? r : (r & 0x3) | 0x8;\n            return v.toString(16);\n        });\n    }\n\n    static setEventName(el, eventName) {\n        // Need to verify https://stackoverflow.com/questions/1915341/whats-wrong-with-adding-properties-to-dom-element-objects\n        const elementUUId = el.eventEmitterUUID;\n        const uuid = elementUUId || Utils.generateUUID();\n        // eslint-disable-next-line no-param-reassign\n        el.eventEmitterUUID = uuid;\n        return Utils.getEventName(eventName, uuid);\n    }\n\n    static getElementEventName(el, eventName) {\n        const elementUUId = el.eventEmitterUUID;\n        /* istanbul ignore next */\n        const uuid = elementUUId || Utils.generateUUID();\n        // eslint-disable-next-line no-param-reassign\n        el.eventEmitterUUID = uuid;\n        return Utils.getEventName(eventName, uuid);\n    }\n\n    static getEventName(eventName, uuid) {\n        return eventName+'__EVENT_EMITTER__'+uuid;\n    }\n\n    static getEventNameFromId(eventName) {\n        return eventName.split('__EVENT_EMITTER__')[0];\n    }\n\n    static getSelector(selector, context) {\n        if (selector && typeof selector !== 'string') {\n            if (selector.length !== undefined) {\n                return selector;\n            }\n            return [selector];\n        }\n        context = context || document;\n\n        // For performance reasons, use getElementById\n        // eslint-disable-next-line no-control-regex\n        const idRegex = /^#(?:[\\w-]|\\\\.|[^\\x00-\\xa0])*$/;\n        if (idRegex.test(selector)) {\n            const el = document.getElementById(selector.substring(1));\n            return el ? [el] : [];\n        }\n        return [].slice.call(context.querySelectorAll(selector) || []);\n    }\n\n    static styleSupport(prop) {\n        let vendorProp;\n        let supportedProp;\n        const capProp = prop.charAt(0).toUpperCase() + prop.slice(1);\n        const prefixes = ['Moz', 'Webkit', 'O', 'ms'];\n        let div = document.createElement('div');\n\n        if (prop in div.style) {\n            supportedProp = prop;\n        } else {\n            for (let i = 0; i < prefixes.length; i++) {\n                vendorProp = prefixes[i] + capProp;\n                if (vendorProp in div.style) {\n                    supportedProp = vendorProp;\n                    break;\n                }\n            }\n        }\n\n        div = null;\n        return supportedProp;\n    }\n\n    // https://gist.github.com/cballou/4007063\n    static setCss(el, prop, value) {\n        // prettier-ignore\n        let cssProperty = Utils.camelCase(prop);\n        cssProperty = Utils.styleSupport(cssProperty);\n        el.style[cssProperty] = value;\n    }\n\n    static camelCase(text) {\n        return text.replace(/-([a-z])/gi, (s, group1) => group1.toUpperCase());\n    }\n\n    static isEventMatched(event, eventName) {\n        const eventNamespace = eventName.split('.');\n        return event\n            .split('.')\n            .filter((e) => e)\n            .every((e) => eventNamespace.indexOf(e) !== -1);\n    }\n\n    /* $$ Template END $$ */\n}\n\nUtils.eventListeners = {};\n\nexport default function $utils(selector) {\n    return new Utils(selector);\n}\n";
  
  },{}]},["7vr0J","6yA8v"], "6yA8v", "parcelRequiref6b1")
  
  //# sourceMappingURL=replace-jquery-browser.js.map
  
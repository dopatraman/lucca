/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const VNodeApp_1 = __webpack_require__(1);
window.lucca = new VNodeApp_1.VNodeApp();


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BaseModel_1 = __webpack_require__(2);
const VNodeView_1 = __webpack_require__(3);
const BaseReceiver_1 = __webpack_require__(5);
const ActionDispatcher_1 = __webpack_require__(6);
const ActionQueue_1 = __webpack_require__(7);
const VNodeRenderer_1 = __webpack_require__(8);
class VNodeApp {
    constructor() {
        this.renderer = new VNodeRenderer_1.VNodeRenderer();
        this.actionQueue = new ActionQueue_1.ActionQueue();
        this.actionDispatcher = new ActionDispatcher_1.ActionDispatcher(this.actionQueue.queue);
        this.htmlProvider = this.renderer.getViewableProvider();
        this.viewInjector = this.renderer.getViewInjector(this.views);
    }
    vm(name) {
        let r = new BaseReceiver_1.BaseReceiver(name, this.models, this.views);
        this.recv.set(name, r);
        return r;
    }
    model(name) {
        let m = new BaseModel_1.BaseModel(name);
        this.models.set(name, m);
        return m;
    }
    view(name) {
        let v = new VNodeView_1.VNodeView(name, this.htmlProvider, this.viewInjector, this.actionDispatcher);
        this.views.set(name, v);
        return v;
    }
    tick() {
        window.requestAnimationFrame.call(this, this.tick);
        this.actionTick();
    }
    init(domNode) {
        this.renderer.mount(domNode, this.getAppRenderTree);
    }
    actionTick() {
        let nextAction = this.actionQueue.dequeue();
        if (nextAction) {
            this.recv.forEach((r) => {
                r.triggerStageChange(nextAction);
            });
        }
    }
    getAppRenderTree() {
        let receivers = Array.from(this.recv.values());
        return this.renderer.stitch(() => {
            return receivers.map((r) => {
                return r.getRenderTree();
            });
        });
    }
}
exports.VNodeApp = VNodeApp;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class BaseModel {
    constructor(name) {
        this.name = name;
    }
    define(data) {
        this.data = data;
        return this;
    }
    getData() {
        return this.data;
    }
    handle(stateName, handler) {
        this.handlers.set(stateName, handler);
        return this;
    }
    save() {
        return (() => false);
    }
    refresh() {
    }
    handleStateChange(stateName) {
        let handler = this.handlers.get(stateName);
        if (handler) {
            handler.apply(this, this.data);
            this.refresh();
            return;
        }
        console.error(`state ${stateName} not handled`);
    }
}
exports.BaseModel = BaseModel;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ValueInjector_1 = __webpack_require__(4);
class VNodeView {
    constructor(name, h, v, a) {
        this.name = name;
        this.htmlProvider = h;
        this.viewProvider = v;
        this.actionDispatcher = a;
        this.actionLookup = new Map();
    }
    define(viewConstructor) {
        this.viewConstructor = viewConstructor;
        return this;
    }
    render(data) {
        let valueInjector = new ValueInjector_1.ValueInjector(data);
        return this.viewConstructor(this.htmlProvider, this.viewProvider, valueInjector.inject, this.actionLookup);
    }
    registerActions(...actionNames) {
        for (var i = 0; i < actionNames.length; i++) {
            let actionName = actionNames[i];
            this.actionLookup.set(actionName, this.actionDispatcher.dispatch.bind(this.actionDispatcher, actionName));
        }
        return this;
    }
}
exports.VNodeView = VNodeView;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class ValueInjector {
    constructor(modelData) {
        this.data = modelData;
    }
    inject(modelKey) {
        return this.data.get(modelKey);
    }
}
exports.ValueInjector = ValueInjector;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class BaseReceiver {
    constructor(name, modelLookup, viewLookup) {
        this.name = name;
        this.modelLookup = modelLookup;
        this.viewLookup = viewLookup;
    }
    model(name) {
        this._model = this.modelLookup.get(name);
        return this;
    }
    view(name) {
        this._view = this.viewLookup.get(name);
        return this;
    }
    accept(routes) {
        this.actionStateRoutes = routes;
        return this;
    }
    contains(...dependencies) {
        this.dependencies = dependencies;
        return this;
    }
    triggerStageChange(actionName) {
        if (this.doesAcceptAction(actionName)) {
            this._model.handleStateChange(this.actionStateRoutes.get(actionName));
        }
    }
    getRenderTree() {
        return this._view.render(this._model.getData());
    }
    doesAcceptAction(actionName) {
        return this.actionStateRoutes.has(actionName);
    }
}
exports.BaseReceiver = BaseReceiver;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class ActionDispatcher {
    constructor(queueAction) {
        this.queueAction = queueAction;
    }
    dispatch(actionName) {
        this.queueAction(actionName);
    }
}
exports.ActionDispatcher = ActionDispatcher;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class ActionQueue {
    constructor() { }
    queue(action) {
        this.members.push(action);
        return this.members.length;
    }
    dequeue() {
        if (this.members.length > 0) {
            return this.members.shift();
        }
        console.info('Action Queue is empty');
    }
    peek() {
        return this.members[0];
    }
}
exports.ActionQueue = ActionQueue;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const maquette_1 = __webpack_require__(9);
class VNodeRenderer {
    constructor() {
        this.projector = maquette_1.createProjector();
    }
    stitch(renderChildren) {
        return maquette_1.h('div.appContainer', {}, renderChildren());
    }
    mount(domNode, renderFn) {
        this.projector.append(domNode, renderFn);
    }
    getViewableProvider() {
        return (selector, attr, contents) => {
            return maquette_1.h(selector, attr, contents);
        };
    }
    getViewInjector(lookup) {
        return (name, data) => {
            let view = lookup.get(name);
            if (view) {
                return view.render(data);
            }
        };
    }
}
exports.VNodeRenderer = VNodeRenderer;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) {
    if (true) {
        // AMD. Register as an anonymous module.
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        factory(exports);
    } else {
        // Browser globals
        factory(root.maquette = {});
    }
}(this, function (exports) {
    'use strict';
    // Comment that is displayed in the API documentation for the maquette module:
    /**
 * Welcome to the API documentation of the **maquette** library.
 *
 * [[http://maquettejs.org/|To the maquette homepage]]
 */
    Object.defineProperty(exports, '__esModule', { value: true });
    var NAMESPACE_W3 = 'http://www.w3.org/';
    var NAMESPACE_SVG = NAMESPACE_W3 + '2000/svg';
    var NAMESPACE_XLINK = NAMESPACE_W3 + '1999/xlink';
    // Utilities
    var emptyArray = [];
    var extend = function (base, overrides) {
        var result = {};
        Object.keys(base).forEach(function (key) {
            result[key] = base[key];
        });
        if (overrides) {
            Object.keys(overrides).forEach(function (key) {
                result[key] = overrides[key];
            });
        }
        return result;
    };
    // Hyperscript helper functions
    var same = function (vnode1, vnode2) {
        if (vnode1.vnodeSelector !== vnode2.vnodeSelector) {
            return false;
        }
        if (vnode1.properties && vnode2.properties) {
            if (vnode1.properties.key !== vnode2.properties.key) {
                return false;
            }
            return vnode1.properties.bind === vnode2.properties.bind;
        }
        return !vnode1.properties && !vnode2.properties;
    };
    var toTextVNode = function (data) {
        return {
            vnodeSelector: '',
            properties: undefined,
            children: undefined,
            text: data.toString(),
            domNode: null
        };
    };
    var appendChildren = function (parentSelector, insertions, main) {
        for (var i = 0, length_1 = insertions.length; i < length_1; i++) {
            var item = insertions[i];
            if (Array.isArray(item)) {
                appendChildren(parentSelector, item, main);
            } else {
                if (item !== null && item !== undefined) {
                    if (!item.hasOwnProperty('vnodeSelector')) {
                        item = toTextVNode(item);
                    }
                    main.push(item);
                }
            }
        }
    };
    // Render helper functions
    var missingTransition = function () {
        throw new Error('Provide a transitions object to the projectionOptions to do animations');
    };
    var DEFAULT_PROJECTION_OPTIONS = {
        namespace: undefined,
        eventHandlerInterceptor: undefined,
        styleApplyer: function (domNode, styleName, value) {
            // Provides a hook to add vendor prefixes for browsers that still need it.
            domNode.style[styleName] = value;
        },
        transitions: {
            enter: missingTransition,
            exit: missingTransition
        }
    };
    var applyDefaultProjectionOptions = function (projectorOptions) {
        return extend(DEFAULT_PROJECTION_OPTIONS, projectorOptions);
    };
    var checkStyleValue = function (styleValue) {
        if (typeof styleValue !== 'string') {
            throw new Error('Style values must be strings');
        }
    };
    var setProperties = function (domNode, properties, projectionOptions) {
        if (!properties) {
            return;
        }
        var eventHandlerInterceptor = projectionOptions.eventHandlerInterceptor;
        var propNames = Object.keys(properties);
        var propCount = propNames.length;
        var _loop_1 = function (i) {
            var propName = propNames[i];
            /* tslint:disable:no-var-keyword: edge case */
            var propValue = properties[propName];
            /* tslint:enable:no-var-keyword */
            if (propName === 'className') {
                throw new Error('Property "className" is not supported, use "class".');
            } else if (propName === 'class') {
                propValue.split(/\s+/).forEach(function (token) {
                    return domNode.classList.add(token);
                });
            } else if (propName === 'classes') {
                // object with string keys and boolean values
                var classNames = Object.keys(propValue);
                var classNameCount = classNames.length;
                for (var j = 0; j < classNameCount; j++) {
                    var className = classNames[j];
                    if (propValue[className]) {
                        domNode.classList.add(className);
                    }
                }
            } else if (propName === 'styles') {
                // object with string keys and string (!) values
                var styleNames = Object.keys(propValue);
                var styleCount = styleNames.length;
                for (var j = 0; j < styleCount; j++) {
                    var styleName = styleNames[j];
                    var styleValue = propValue[styleName];
                    if (styleValue) {
                        checkStyleValue(styleValue);
                        projectionOptions.styleApplyer(domNode, styleName, styleValue);
                    }
                }
            } else if (propName !== 'key' && propValue !== null && propValue !== undefined) {
                var type = typeof propValue;
                if (type === 'function') {
                    if (propName.lastIndexOf('on', 0) === 0) {
                        if (eventHandlerInterceptor) {
                            propValue = eventHandlerInterceptor(propName, propValue, domNode, properties);    // intercept eventhandlers
                        }
                        if (propName === 'oninput') {
                            (function () {
                                // record the evt.target.value, because IE and Edge sometimes do a requestAnimationFrame between changing value and running oninput
                                var oldPropValue = propValue;
                                propValue = function (evt) {
                                    oldPropValue.apply(this, [evt]);
                                    evt.target['oninput-value'] = evt.target.value;    // may be HTMLTextAreaElement as well
                                };
                            }());
                        }
                        domNode[propName] = propValue;
                    }
                } else if (type === 'string' && propName !== 'value' && propName !== 'innerHTML') {
                    if (projectionOptions.namespace === NAMESPACE_SVG && propName === 'href') {
                        domNode.setAttributeNS(NAMESPACE_XLINK, propName, propValue);
                    } else {
                        domNode.setAttribute(propName, propValue);
                    }
                } else {
                    domNode[propName] = propValue;
                }
            }
        };
        for (var i = 0; i < propCount; i++) {
            _loop_1(i);
        }
    };
    var updateProperties = function (domNode, previousProperties, properties, projectionOptions) {
        if (!properties) {
            return;
        }
        var propertiesUpdated = false;
        var propNames = Object.keys(properties);
        var propCount = propNames.length;
        for (var i = 0; i < propCount; i++) {
            var propName = propNames[i];
            // assuming that properties will be nullified instead of missing is by design
            var propValue = properties[propName];
            var previousValue = previousProperties[propName];
            if (propName === 'class') {
                if (previousValue !== propValue) {
                    throw new Error('"class" property may not be updated. Use the "classes" property for conditional css classes.');
                }
            } else if (propName === 'classes') {
                var classList = domNode.classList;
                var classNames = Object.keys(propValue);
                var classNameCount = classNames.length;
                for (var j = 0; j < classNameCount; j++) {
                    var className = classNames[j];
                    var on = !!propValue[className];
                    var previousOn = !!previousValue[className];
                    if (on === previousOn) {
                        continue;
                    }
                    propertiesUpdated = true;
                    if (on) {
                        classList.add(className);
                    } else {
                        classList.remove(className);
                    }
                }
            } else if (propName === 'styles') {
                var styleNames = Object.keys(propValue);
                var styleCount = styleNames.length;
                for (var j = 0; j < styleCount; j++) {
                    var styleName = styleNames[j];
                    var newStyleValue = propValue[styleName];
                    var oldStyleValue = previousValue[styleName];
                    if (newStyleValue === oldStyleValue) {
                        continue;
                    }
                    propertiesUpdated = true;
                    if (newStyleValue) {
                        checkStyleValue(newStyleValue);
                        projectionOptions.styleApplyer(domNode, styleName, newStyleValue);
                    } else {
                        projectionOptions.styleApplyer(domNode, styleName, '');
                    }
                }
            } else {
                if (!propValue && typeof previousValue === 'string') {
                    propValue = '';
                }
                if (propName === 'value') {
                    var domValue = domNode[propName];
                    if (domValue !== propValue    // The 'value' in the DOM tree !== newValue
&& (domNode['oninput-value'] ? domValue === domNode['oninput-value']    // If the last reported value to 'oninput' does not match domValue, do nothing and wait for oninput
 : propValue !== previousValue    // Only update the value if the vdom changed
)) {
                        domNode[propName] = propValue;
                        // Reset the value, even if the virtual DOM did not change
                        domNode['oninput-value'] = undefined;
                    }
                    // else do not update the domNode, otherwise the cursor position would be changed
                    if (propValue !== previousValue) {
                        propertiesUpdated = true;
                    }
                } else if (propValue !== previousValue) {
                    var type = typeof propValue;
                    if (type === 'function') {
                        throw new Error('Functions may not be updated on subsequent renders (property: ' + propName + '). Hint: declare event handler functions outside the render() function.');
                    }
                    if (type === 'string' && propName !== 'innerHTML') {
                        if (projectionOptions.namespace === NAMESPACE_SVG && propName === 'href') {
                            domNode.setAttributeNS(NAMESPACE_XLINK, propName, propValue);
                        } else if (propName === 'role' && propValue === '') {
                            domNode.removeAttribute(propName);
                        } else {
                            domNode.setAttribute(propName, propValue);
                        }
                    } else {
                        if (domNode[propName] !== propValue) {
                            domNode[propName] = propValue;
                        }
                    }
                    propertiesUpdated = true;
                }
            }
        }
        return propertiesUpdated;
    };
    var findIndexOfChild = function (children, sameAs, start) {
        if (sameAs.vnodeSelector !== '') {
            // Never scan for text-nodes
            for (var i = start; i < children.length; i++) {
                if (same(children[i], sameAs)) {
                    return i;
                }
            }
        }
        return -1;
    };
    var nodeAdded = function (vNode, transitions) {
        if (vNode.properties) {
            var enterAnimation = vNode.properties.enterAnimation;
            if (enterAnimation) {
                if (typeof enterAnimation === 'function') {
                    enterAnimation(vNode.domNode, vNode.properties);
                } else {
                    transitions.enter(vNode.domNode, vNode.properties, enterAnimation);
                }
            }
        }
    };
    var nodeToRemove = function (vNode, transitions) {
        var domNode = vNode.domNode;
        if (vNode.properties) {
            var exitAnimation = vNode.properties.exitAnimation;
            if (exitAnimation) {
                domNode.style.pointerEvents = 'none';
                var removeDomNode = function () {
                    if (domNode.parentNode) {
                        domNode.parentNode.removeChild(domNode);
                    }
                };
                if (typeof exitAnimation === 'function') {
                    exitAnimation(domNode, removeDomNode, vNode.properties);
                    return;
                } else {
                    transitions.exit(vNode.domNode, vNode.properties, exitAnimation, removeDomNode);
                    return;
                }
            }
        }
        if (domNode.parentNode) {
            domNode.parentNode.removeChild(domNode);
        }
    };
    var checkDistinguishable = function (childNodes, indexToCheck, parentVNode, operation) {
        var childNode = childNodes[indexToCheck];
        if (childNode.vnodeSelector === '') {
            return;    // Text nodes need not be distinguishable
        }
        var properties = childNode.properties;
        var key = properties ? properties.key === undefined ? properties.bind : properties.key : undefined;
        if (!key) {
            for (var i = 0; i < childNodes.length; i++) {
                if (i !== indexToCheck) {
                    var node = childNodes[i];
                    if (same(node, childNode)) {
                        if (operation === 'added') {
                            throw new Error(parentVNode.vnodeSelector + ' had a ' + childNode.vnodeSelector + ' child ' + 'added, but there is now more than one. You must add unique key properties to make them distinguishable.');
                        } else {
                            throw new Error(parentVNode.vnodeSelector + ' had a ' + childNode.vnodeSelector + ' child ' + 'removed, but there were more than one. You must add unique key properties to make them distinguishable.');
                        }
                    }
                }
            }
        }
    };
    var createDom;
    var updateDom;
    var updateChildren = function (vnode, domNode, oldChildren, newChildren, projectionOptions) {
        if (oldChildren === newChildren) {
            return false;
        }
        oldChildren = oldChildren || emptyArray;
        newChildren = newChildren || emptyArray;
        var oldChildrenLength = oldChildren.length;
        var newChildrenLength = newChildren.length;
        var transitions = projectionOptions.transitions;
        var oldIndex = 0;
        var newIndex = 0;
        var i;
        var textUpdated = false;
        while (newIndex < newChildrenLength) {
            var oldChild = oldIndex < oldChildrenLength ? oldChildren[oldIndex] : undefined;
            var newChild = newChildren[newIndex];
            if (oldChild !== undefined && same(oldChild, newChild)) {
                textUpdated = updateDom(oldChild, newChild, projectionOptions) || textUpdated;
                oldIndex++;
            } else {
                var findOldIndex = findIndexOfChild(oldChildren, newChild, oldIndex + 1);
                if (findOldIndex >= 0) {
                    // Remove preceding missing children
                    for (i = oldIndex; i < findOldIndex; i++) {
                        nodeToRemove(oldChildren[i], transitions);
                        checkDistinguishable(oldChildren, i, vnode, 'removed');
                    }
                    textUpdated = updateDom(oldChildren[findOldIndex], newChild, projectionOptions) || textUpdated;
                    oldIndex = findOldIndex + 1;
                } else {
                    // New child
                    createDom(newChild, domNode, oldIndex < oldChildrenLength ? oldChildren[oldIndex].domNode : undefined, projectionOptions);
                    nodeAdded(newChild, transitions);
                    checkDistinguishable(newChildren, newIndex, vnode, 'added');
                }
            }
            newIndex++;
        }
        if (oldChildrenLength > oldIndex) {
            // Remove child fragments
            for (i = oldIndex; i < oldChildrenLength; i++) {
                nodeToRemove(oldChildren[i], transitions);
                checkDistinguishable(oldChildren, i, vnode, 'removed');
            }
        }
        return textUpdated;
    };
    var addChildren = function (domNode, children, projectionOptions) {
        if (!children) {
            return;
        }
        for (var i = 0; i < children.length; i++) {
            createDom(children[i], domNode, undefined, projectionOptions);
        }
    };
    var initPropertiesAndChildren = function (domNode, vnode, projectionOptions) {
        addChildren(domNode, vnode.children, projectionOptions);
        // children before properties, needed for value property of <select>.
        if (vnode.text) {
            domNode.textContent = vnode.text;
        }
        setProperties(domNode, vnode.properties, projectionOptions);
        if (vnode.properties && vnode.properties.afterCreate) {
            vnode.properties.afterCreate.apply(vnode.properties.bind || vnode.properties, [
                domNode,
                projectionOptions,
                vnode.vnodeSelector,
                vnode.properties,
                vnode.children
            ]);
        }
    };
    createDom = function (vnode, parentNode, insertBefore, projectionOptions) {
        var domNode, i, c, start = 0, type, found;
        var vnodeSelector = vnode.vnodeSelector;
        var doc = parentNode.ownerDocument;
        if (vnodeSelector === '') {
            domNode = vnode.domNode = doc.createTextNode(vnode.text);
            if (insertBefore !== undefined) {
                parentNode.insertBefore(domNode, insertBefore);
            } else {
                parentNode.appendChild(domNode);
            }
        } else {
            for (i = 0; i <= vnodeSelector.length; ++i) {
                c = vnodeSelector.charAt(i);
                if (i === vnodeSelector.length || c === '.' || c === '#') {
                    type = vnodeSelector.charAt(start - 1);
                    found = vnodeSelector.slice(start, i);
                    if (type === '.') {
                        domNode.classList.add(found);
                    } else if (type === '#') {
                        domNode.id = found;
                    } else {
                        if (found === 'svg') {
                            projectionOptions = extend(projectionOptions, { namespace: NAMESPACE_SVG });
                        }
                        if (projectionOptions.namespace !== undefined) {
                            domNode = vnode.domNode = doc.createElementNS(projectionOptions.namespace, found);
                        } else {
                            domNode = vnode.domNode = vnode.domNode || doc.createElement(found);
                            if (found === 'input' && vnode.properties && vnode.properties.type !== undefined) {
                                // IE8 and older don't support setting input type after the DOM Node has been added to the document
                                domNode.setAttribute('type', vnode.properties.type);
                            }
                        }
                        if (insertBefore !== undefined) {
                            parentNode.insertBefore(domNode, insertBefore);
                        } else if (domNode.parentNode !== parentNode) {
                            parentNode.appendChild(domNode);
                        }
                    }
                    start = i + 1;
                }
            }
            initPropertiesAndChildren(domNode, vnode, projectionOptions);
        }
    };
    updateDom = function (previous, vnode, projectionOptions) {
        var domNode = previous.domNode;
        var textUpdated = false;
        if (previous === vnode) {
            return false;    // By contract, VNode objects may not be modified anymore after passing them to maquette
        }
        var updated = false;
        if (vnode.vnodeSelector === '') {
            if (vnode.text !== previous.text) {
                var newVNode = domNode.ownerDocument.createTextNode(vnode.text);
                domNode.parentNode.replaceChild(newVNode, domNode);
                vnode.domNode = newVNode;
                textUpdated = true;
                return textUpdated;
            }
        } else {
            if (vnode.vnodeSelector.lastIndexOf('svg', 0) === 0) {
                projectionOptions = extend(projectionOptions, { namespace: NAMESPACE_SVG });
            }
            if (previous.text !== vnode.text) {
                updated = true;
                if (vnode.text === undefined) {
                    domNode.removeChild(domNode.firstChild);    // the only textnode presumably
                } else {
                    domNode.textContent = vnode.text;
                }
            }
            updated = updateChildren(vnode, domNode, previous.children, vnode.children, projectionOptions) || updated;
            updated = updateProperties(domNode, previous.properties, vnode.properties, projectionOptions) || updated;
            if (vnode.properties && vnode.properties.afterUpdate) {
                vnode.properties.afterUpdate.apply(vnode.properties.bind || vnode.properties, [
                    domNode,
                    projectionOptions,
                    vnode.vnodeSelector,
                    vnode.properties,
                    vnode.children
                ]);
            }
        }
        if (updated && vnode.properties && vnode.properties.updateAnimation) {
            vnode.properties.updateAnimation(domNode, vnode.properties, previous.properties);
        }
        vnode.domNode = previous.domNode;
        return textUpdated;
    };
    var createProjection = function (vnode, projectionOptions) {
        return {
            update: function (updatedVnode) {
                if (vnode.vnodeSelector !== updatedVnode.vnodeSelector) {
                    throw new Error('The selector for the root VNode may not be changed. (consider using dom.merge and add one extra level to the virtual DOM)');
                }
                updateDom(vnode, updatedVnode, projectionOptions);
                vnode = updatedVnode;
            },
            domNode: vnode.domNode
        };
    };
    // The other two parameters are not added here, because the Typescript compiler creates surrogate code for destructuring 'children'.
    exports.h = function (selector) {
        var properties = arguments[1];
        if (typeof selector !== 'string') {
            throw new Error();
        }
        var childIndex = 1;
        if (properties && !properties.hasOwnProperty('vnodeSelector') && !Array.isArray(properties) && typeof properties === 'object') {
            childIndex = 2;
        } else {
            // Optional properties argument was omitted
            properties = undefined;
        }
        var text;
        var children;
        var argsLength = arguments.length;
        // Recognize a common special case where there is only a single text node
        if (argsLength === childIndex + 1) {
            var onlyChild = arguments[childIndex];
            if (typeof onlyChild === 'string') {
                text = onlyChild;
            } else if (onlyChild !== undefined && onlyChild !== null && onlyChild.length === 1 && typeof onlyChild[0] === 'string') {
                text = onlyChild[0];
            }
        }
        if (text === undefined) {
            children = [];
            for (; childIndex < argsLength; childIndex++) {
                var child = arguments[childIndex];
                if (child === null || child === undefined) {
                } else if (Array.isArray(child)) {
                    appendChildren(selector, child, children);
                } else if (child.hasOwnProperty('vnodeSelector')) {
                    children.push(child);
                } else {
                    children.push(toTextVNode(child));
                }
            }
        }
        return {
            vnodeSelector: selector,
            properties: properties,
            children: children,
            text: text === '' ? undefined : text,
            domNode: null
        };
    };
    /**
 * Contains simple low-level utility functions to manipulate the real DOM.
 */
    exports.dom = {
        /**
     * Creates a real DOM tree from `vnode`. The [[Projection]] object returned will contain the resulting DOM Node in
     * its [[Projection.domNode|domNode]] property.
     * This is a low-level method. Users will typically use a [[Projector]] instead.
     * @param vnode - The root of the virtual DOM tree that was created using the [[h]] function. NOTE: [[VNode]]
     * objects may only be rendered once.
     * @param projectionOptions - Options to be used to create and update the projection.
     * @returns The [[Projection]] which also contains the DOM Node that was created.
     */
        create: function (vnode, projectionOptions) {
            projectionOptions = applyDefaultProjectionOptions(projectionOptions);
            createDom(vnode, document.createElement('div'), undefined, projectionOptions);
            return createProjection(vnode, projectionOptions);
        },
        /**
     * Appends a new child node to the DOM which is generated from a [[VNode]].
     * This is a low-level method. Users will typically use a [[Projector]] instead.
     * @param parentNode - The parent node for the new child node.
     * @param vnode - The root of the virtual DOM tree that was created using the [[h]] function. NOTE: [[VNode]]
     * objects may only be rendered once.
     * @param projectionOptions - Options to be used to create and update the [[Projection]].
     * @returns The [[Projection]] that was created.
     */
        append: function (parentNode, vnode, projectionOptions) {
            projectionOptions = applyDefaultProjectionOptions(projectionOptions);
            createDom(vnode, parentNode, undefined, projectionOptions);
            return createProjection(vnode, projectionOptions);
        },
        /**
     * Inserts a new DOM node which is generated from a [[VNode]].
     * This is a low-level method. Users wil typically use a [[Projector]] instead.
     * @param beforeNode - The node that the DOM Node is inserted before.
     * @param vnode - The root of the virtual DOM tree that was created using the [[h]] function.
     * NOTE: [[VNode]] objects may only be rendered once.
     * @param projectionOptions - Options to be used to create and update the projection, see [[createProjector]].
     * @returns The [[Projection]] that was created.
     */
        insertBefore: function (beforeNode, vnode, projectionOptions) {
            projectionOptions = applyDefaultProjectionOptions(projectionOptions);
            createDom(vnode, beforeNode.parentNode, beforeNode, projectionOptions);
            return createProjection(vnode, projectionOptions);
        },
        /**
     * Merges a new DOM node which is generated from a [[VNode]] with an existing DOM Node.
     * This means that the virtual DOM and the real DOM will have one overlapping element.
     * Therefore the selector for the root [[VNode]] will be ignored, but its properties and children will be applied to the Element provided.
     * This is a low-level method. Users wil typically use a [[Projector]] instead.
     * @param element - The existing element to adopt as the root of the new virtual DOM. Existing attributes and child nodes are preserved.
     * @param vnode - The root of the virtual DOM tree that was created using the [[h]] function. NOTE: [[VNode]] objects
     * may only be rendered once.
     * @param projectionOptions - Options to be used to create and update the projection, see [[createProjector]].
     * @returns The [[Projection]] that was created.
     */
        merge: function (element, vnode, projectionOptions) {
            projectionOptions = applyDefaultProjectionOptions(projectionOptions);
            vnode.domNode = element;
            initPropertiesAndChildren(element, vnode, projectionOptions);
            return createProjection(vnode, projectionOptions);
        },
        /**
     * Replaces an existing DOM node with a node generated from a [[VNode]].
     * This is a low-level method. Users will typically use a [[Projector]] instead.
     * @param element - The node for the [[VNode]] to replace.
     * @param vnode - The root of the virtual DOM tree that was created using the [[h]] function. NOTE: [[VNode]]
     * objects may only be rendered once.
     * @param projectionOptions - Options to be used to create and update the [[Projection]].
     * @returns The [[Projection]] that was created.
     */
        replace: function (element, vnode, projectionOptions) {
            projectionOptions = applyDefaultProjectionOptions(projectionOptions);
            createDom(vnode, element.parentNode, element, projectionOptions);
            element.parentNode.removeChild(element);
            return createProjection(vnode, projectionOptions);
        }
    };
    /**
 * Creates a [[CalculationCache]] object, useful for caching [[VNode]] trees.
 * In practice, caching of [[VNode]] trees is not needed, because achieving 60 frames per second is almost never a problem.
 * For more information, see [[CalculationCache]].
 *
 * @param <Result> The type of the value that is cached.
 */
    exports.createCache = function () {
        var cachedInputs;
        var cachedOutcome;
        return {
            invalidate: function () {
                cachedOutcome = undefined;
                cachedInputs = undefined;
            },
            result: function (inputs, calculation) {
                if (cachedInputs) {
                    for (var i = 0; i < inputs.length; i++) {
                        if (cachedInputs[i] !== inputs[i]) {
                            cachedOutcome = undefined;
                        }
                    }
                }
                if (!cachedOutcome) {
                    cachedOutcome = calculation();
                    cachedInputs = inputs;
                }
                return cachedOutcome;
            }
        };
    };
    /**
 * Creates a {@link Mapping} instance that keeps an array of result objects synchronized with an array of source objects.
 * See {@link http://maquettejs.org/docs/arrays.html|Working with arrays}.
 *
 * @param <Source>       The type of source items. A database-record for instance.
 * @param <Target>       The type of target items. A [[Component]] for instance.
 * @param getSourceKey   `function(source)` that must return a key to identify each source object. The result must either be a string or a number.
 * @param createResult   `function(source, index)` that must create a new result object from a given source. This function is identical
 *                       to the `callback` argument in `Array.map(callback)`.
 * @param updateResult   `function(source, target, index)` that updates a result to an updated source.
 */
    exports.createMapping = function (getSourceKey, createResult, updateResult) {
        var keys = [];
        var results = [];
        return {
            results: results,
            map: function (newSources) {
                var newKeys = newSources.map(getSourceKey);
                var oldTargets = results.slice();
                var oldIndex = 0;
                for (var i = 0; i < newSources.length; i++) {
                    var source = newSources[i];
                    var sourceKey = newKeys[i];
                    if (sourceKey === keys[oldIndex]) {
                        results[i] = oldTargets[oldIndex];
                        updateResult(source, oldTargets[oldIndex], i);
                        oldIndex++;
                    } else {
                        var found = false;
                        for (var j = 1; j < keys.length + 1; j++) {
                            var searchIndex = (oldIndex + j) % keys.length;
                            if (keys[searchIndex] === sourceKey) {
                                results[i] = oldTargets[searchIndex];
                                updateResult(newSources[i], oldTargets[searchIndex], i);
                                oldIndex = searchIndex + 1;
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            results[i] = createResult(source, i);
                        }
                    }
                }
                results.length = newSources.length;
                keys = newKeys;
            }
        };
    };
    /**
 * Creates a [[Projector]] instance using the provided projectionOptions.
 *
 * For more information, see [[Projector]].
 *
 * @param projectorOptions   Options that influence how the DOM is rendered and updated.
 */
    exports.createProjector = function (projectorOptions) {
        var projector;
        var projectionOptions = applyDefaultProjectionOptions(projectorOptions);
        projectionOptions.eventHandlerInterceptor = function (propertyName, eventHandler, domNode, properties) {
            return function () {
                // intercept function calls (event handlers) to do a render afterwards.
                projector.scheduleRender();
                return eventHandler.apply(properties.bind || this, arguments);
            };
        };
        var renderCompleted = true;
        var scheduled;
        var stopped = false;
        var projections = [];
        var renderFunctions = [];
        // matches the projections array
        var doRender = function () {
            scheduled = undefined;
            if (!renderCompleted) {
                return;    // The last render threw an error, it should be logged in the browser console.
            }
            renderCompleted = false;
            for (var i = 0; i < projections.length; i++) {
                var updatedVnode = renderFunctions[i]();
                projections[i].update(updatedVnode);
            }
            renderCompleted = true;
        };
        projector = {
            renderNow: doRender,
            scheduleRender: function () {
                if (!scheduled && !stopped) {
                    scheduled = requestAnimationFrame(doRender);
                }
            },
            stop: function () {
                if (scheduled) {
                    cancelAnimationFrame(scheduled);
                    scheduled = undefined;
                }
                stopped = true;
            },
            resume: function () {
                stopped = false;
                renderCompleted = true;
                projector.scheduleRender();
            },
            append: function (parentNode, renderMaquetteFunction) {
                projections.push(exports.dom.append(parentNode, renderMaquetteFunction(), projectionOptions));
                renderFunctions.push(renderMaquetteFunction);
            },
            insertBefore: function (beforeNode, renderMaquetteFunction) {
                projections.push(exports.dom.insertBefore(beforeNode, renderMaquetteFunction(), projectionOptions));
                renderFunctions.push(renderMaquetteFunction);
            },
            merge: function (domNode, renderMaquetteFunction) {
                projections.push(exports.dom.merge(domNode, renderMaquetteFunction(), projectionOptions));
                renderFunctions.push(renderMaquetteFunction);
            },
            replace: function (domNode, renderMaquetteFunction) {
                projections.push(exports.dom.replace(domNode, renderMaquetteFunction(), projectionOptions));
                renderFunctions.push(renderMaquetteFunction);
            },
            detach: function (renderMaquetteFunction) {
                for (var i = 0; i < renderFunctions.length; i++) {
                    if (renderFunctions[i] === renderMaquetteFunction) {
                        renderFunctions.splice(i, 1);
                        return projections.splice(i, 1)[0];
                    }
                }
                throw new Error('renderMaquetteFunction was not found');
            }
        };
        return projector;
    };
}));
//# sourceMappingURL=maquette.js.map


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgODI2NjQ1NmNlNzNiYzAwYzBkNTgiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9mYWNhZGUvVk5vZGVBcHAudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL0Jhc2VNb2RlbC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdmlldy9WTm9kZVZpZXcudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21vZGVsL1ZhbHVlSW5qZWN0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FjdGlvbi9CYXNlUmVjZWl2ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FjdGlvbi9BY3Rpb25EaXNwYXRjaGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9hY3Rpb24vQWN0aW9uUXVldWUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlbmRlci9WTm9kZVJlbmRlcmVyLnRzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9tYXF1ZXR0ZS9kaXN0L21hcXVldHRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7OztBQzdEQSwwQ0FBNkM7QUFFdkMsTUFBTyxDQUFDLEtBQUssR0FBRyxJQUFJLG1CQUFRLEVBQUUsQ0FBQzs7Ozs7Ozs7OztBQ0VyQywyQ0FBK0M7QUFDL0MsMkNBQThDO0FBQzlDLDhDQUFzRDtBQUN0RCxrREFBNkQ7QUFDN0QsNkNBQW9EO0FBQ3BELCtDQUFvRTtBQUdwRTtJQVVJO1FBQ0ksSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLDZCQUFRLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUkseUJBQVcsRUFBRSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLG1DQUFnQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDO1FBQ3BFLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBQ3hELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFFTSxFQUFFLENBQUMsSUFBVztRQUNqQixJQUFJLENBQUMsR0FBRyxJQUFJLDJCQUFZLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN2QixNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQUVNLEtBQUssQ0FBQyxJQUFXO1FBQ3BCLElBQUksQ0FBQyxHQUFTLElBQUkscUJBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3hCLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDYixDQUFDO0lBRU0sSUFBSSxDQUFDLElBQVc7UUFDbkIsSUFBSSxDQUFDLEdBQUcsSUFBSSxxQkFBUyxDQUFDLElBQUksRUFDdEIsSUFBSSxDQUFDLFlBQVksRUFDakIsSUFBSSxDQUFDLFlBQVksRUFDakIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDM0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDYixDQUFDO0lBRU0sSUFBSTtRQUNQLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVNLElBQUksQ0FBQyxPQUFtQjtRQUMzQixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVPLFVBQVU7UUFDZCxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzVDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDYixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQVUsRUFBRSxFQUFFO2dCQUM3QixDQUFDLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDckMsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO0lBQ0wsQ0FBQztJQUVPLGdCQUFnQjtRQUNwQixJQUFJLFNBQVMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUMvQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQzdCLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBVSxFQUFFLEVBQUU7Z0JBQ2hDLE1BQU0sQ0FBQyxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDN0IsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUM7SUFDTixDQUFDO0NBQ0o7QUFqRUQsNEJBaUVDOzs7Ozs7Ozs7O0FDekVEO0lBS0ksWUFBWSxJQUFXO1FBQ25CLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFFTSxNQUFNLENBQUMsSUFBYztRQUN4QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxPQUFPO1FBQ1YsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUVNLE1BQU0sQ0FBQyxTQUFnQixFQUFFLE9BQXFCO1FBQ2pELElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN0QyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxJQUFJO1FBQ1AsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVNLE9BQU87SUFFZCxDQUFDO0lBRU0saUJBQWlCLENBQUMsU0FBZ0I7UUFDckMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDM0MsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNWLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMvQixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDZixNQUFNLENBQUM7UUFDWCxDQUFDO1FBQ0QsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLFNBQVMsY0FBYyxDQUFDLENBQUM7SUFDcEQsQ0FBQztDQUNKO0FBeENELDhCQXdDQzs7Ozs7Ozs7OztBQ3ZDRCwrQ0FBdUQ7QUFHdkQ7SUFPSSxZQUFZLElBQVcsRUFBRSxDQUFVLEVBQUUsQ0FBVSxFQUFFLENBQWtCO1FBQy9ELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxDQUFDLENBQUM7UUFDMUIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLEdBQUcsRUFBb0IsQ0FBQztJQUNwRCxDQUFDO0lBRU0sTUFBTSxDQUFDLGVBQW9EO1FBQzlELElBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDO1FBQ3ZDLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVNLE1BQU0sQ0FBQyxJQUFjO1FBQ3hCLElBQUksYUFBYSxHQUFHLElBQUksNkJBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsYUFBYSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDL0csQ0FBQztJQUVNLGVBQWUsQ0FBQyxHQUFHLFdBQW9CO1FBQzFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzFDLElBQUksVUFBVSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FDakIsVUFBVSxFQUNWLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUMvQixJQUFJLENBQUMsZ0JBQWdCLEVBQ3JCLFVBQVUsQ0FDYixDQUNKLENBQUM7UUFDTixDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0NBQ0o7QUF0Q0QsOEJBc0NDOzs7Ozs7Ozs7O0FDM0NEO0lBRUksWUFBWSxTQUFtQjtRQUMzQixJQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztJQUMxQixDQUFDO0lBQ00sTUFBTSxDQUFDLFFBQWU7UUFDekIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ25DLENBQUM7Q0FDSjtBQVJELHNDQVFDOzs7Ozs7Ozs7O0FDTkQ7SUFTSSxZQUFZLElBQVcsRUFBRSxXQUE4QixFQUFFLFVBQWlEO1FBQ3RHLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQy9CLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0lBQ2pDLENBQUM7SUFFTSxLQUFLLENBQUMsSUFBVztRQUNwQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVNLElBQUksQ0FBQyxJQUFXO1FBQ25CLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0sTUFBTSxDQUFDLE1BQTBCO1FBQ3BDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxNQUFNLENBQUM7UUFDaEMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0sUUFBUSxDQUFDLEdBQUcsWUFBcUI7UUFDcEMsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7UUFDakMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0sa0JBQWtCLENBQUMsVUFBaUI7UUFDdkMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQyxJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUMxRSxDQUFDO0lBQ0wsQ0FBQztJQUVNLGFBQWE7UUFDaEIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRU8sZ0JBQWdCLENBQUMsVUFBaUI7UUFDdEMsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDbEQsQ0FBQztDQUNKO0FBaERELG9DQWdEQzs7Ozs7Ozs7OztBQ3JERDtJQUlJLFlBQVksV0FBb0I7UUFDNUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7SUFDbkMsQ0FBQztJQUNNLFFBQVEsQ0FBQyxVQUFpQjtRQUM3QixJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2pDLENBQUM7Q0FDSjtBQVZELDRDQVVDOzs7Ozs7Ozs7O0FDUEQ7SUFHSSxnQkFBZSxDQUFDO0lBRVQsS0FBSyxDQUFDLE1BQWE7UUFDdEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO0lBQy9CLENBQUM7SUFFTSxPQUFPO1FBQ1YsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNoQyxDQUFDO1FBQ0QsT0FBTyxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQztJQUN6QyxDQUFDO0lBRU0sSUFBSTtRQUNQLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzNCLENBQUM7Q0FDSjtBQXBCRCxrQ0FvQkM7Ozs7Ozs7Ozs7QUN0QkQsMENBQWdFO0FBRWhFO0lBRUk7UUFDSSxJQUFJLENBQUMsU0FBUyxHQUFHLDBCQUFlLEVBQUUsQ0FBQztJQUN2QyxDQUFDO0lBRU0sTUFBTSxDQUFDLGNBQTRCO1FBQ3RDLE1BQU0sQ0FBQyxZQUFDLENBQUMsa0JBQWtCLEVBQUUsRUFBRSxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVNLEtBQUssQ0FBQyxPQUFtQixFQUFFLFFBQW9CO1FBQ2xELElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRU0sbUJBQW1CO1FBQ3RCLE1BQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEVBQUU7WUFDaEMsTUFBTSxDQUFDLFlBQUMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZDLENBQUM7SUFDTCxDQUFDO0lBRU0sZUFBZSxDQUFDLE1BQW9CO1FBQ3ZDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUNsQixJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzVCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDN0IsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0NBQ0o7QUE1QkQsc0NBNEJDOzs7Ozs7O0FDL0JEO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0QsY0FBYztBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxREFBcUQsY0FBYztBQUNuRTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixvQkFBb0I7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsZ0JBQWdCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEdBQTBHO0FBQzFHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUZBQW1GO0FBQ25GO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsZUFBZTtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixlQUFlO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLG9CQUFvQjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSwrQkFBK0IsZ0JBQWdCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IscUJBQXFCO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQix1QkFBdUI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0Msa0JBQWtCO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsdUJBQXVCO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLHFCQUFxQjtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsU0FBUztBQUNULHVCQUF1QiwyQkFBMkI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0EsMkVBQTJFLDJCQUEyQjtBQUN0RztBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLCtEQUErRCwyQkFBMkI7QUFDMUY7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0REFBNEQ7QUFDNUQsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQix5QkFBeUI7QUFDM0M7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsbUNBQW1DLG1CQUFtQjtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYyxjQUFjO0FBQzVCLFFBQVEsaUVBQWlFO0FBQ3pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsdUJBQXVCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBLHVDQUF1QyxxQkFBcUI7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQSwyQkFBMkIsd0JBQXdCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLCtCQUErQiw0QkFBNEI7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgODI2NjQ1NmNlNzNiYzAwYzBkNTgiLCJpbXBvcnQgeyBWTm9kZUFwcCB9IGZyb20gJy4vZmFjYWRlL1ZOb2RlQXBwJztcblxuKDxhbnk+d2luZG93KS5sdWNjYSA9IG5ldyBWTm9kZUFwcCgpO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC50cyIsImltcG9ydCB7IE1vZGVsIH0gZnJvbSAnLi4vY29yZS9Nb2RlbC5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgVmlldyB9IGZyb20gJy4uL2NvcmUvVmlldy5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgUmVjZWl2ZXIgfSBmcm9tICcuLi9jb3JlL1JlY2VpdmVyLmludGVyZmFjZSc7XG5pbXBvcnQgeyBBcHBsaWNhdGlvbkNvbnRleHQgfSBmcm9tICcuLi9jb3JlL0FwcGxpY2F0aW9uQ29udGV4dC5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgQmFzZU1vZGVsIH0gZnJvbSAnLi4vbW9kZWwvQmFzZU1vZGVsJztcbmltcG9ydCB7IFZOb2RlVmlldyB9IGZyb20gJy4uL3ZpZXcvVk5vZGVWaWV3JztcbmltcG9ydCB7IEJhc2VSZWNlaXZlciB9IGZyb20gJy4uL2FjdGlvbi9CYXNlUmVjZWl2ZXInO1xuaW1wb3J0IHsgQWN0aW9uRGlzcGF0Y2hlciB9IGZyb20gJy4uL2FjdGlvbi9BY3Rpb25EaXNwYXRjaGVyJ1xuaW1wb3J0IHsgQWN0aW9uUXVldWUgfSBmcm9tICcuLi9hY3Rpb24vQWN0aW9uUXVldWUnO1xuaW1wb3J0IHsgVk5vZGVSZW5kZXJlciBhcyBSZW5kZXJlciB9IGZyb20gJy4uL3JlbmRlci9WTm9kZVJlbmRlcmVyJztcbmltcG9ydCB7IERpc3BsYXlQcm92aWRlck5vZGUsIERpc3BsYXlOb2RlIH0gZnJvbSAnLi4vY29yZS9jb3JlLnR5cGUnXG5cbmV4cG9ydCBjbGFzcyBWTm9kZUFwcCBpbXBsZW1lbnRzIEFwcGxpY2F0aW9uQ29udGV4dDxEaXNwbGF5UHJvdmlkZXJOb2RlLCBEaXNwbGF5Tm9kZT4ge1xuICAgIHByaXZhdGUgbW9kZWxzOk1hcDxzdHJpbmcsIE1vZGVsPjtcbiAgICBwcml2YXRlIHZpZXdzOk1hcDxzdHJpbmcsIFZOb2RlVmlldz47XG4gICAgcHJpdmF0ZSByZWN2Ok1hcDxzdHJpbmcsIFJlY2VpdmVyPjtcbiAgICBwcml2YXRlIGh0bWxQcm92aWRlcjpGdW5jdGlvbjtcbiAgICBwcml2YXRlIHZpZXdJbmplY3RvcjpGdW5jdGlvbjtcbiAgICBwcml2YXRlIGFjdGlvbkRpc3BhdGNoZXI6QWN0aW9uRGlzcGF0Y2hlcjtcbiAgICBwcml2YXRlIGFjdGlvblF1ZXVlOkFjdGlvblF1ZXVlO1xuICAgIHByaXZhdGUgcmVuZGVyZXI6UmVuZGVyZXI7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlciA9IG5ldyBSZW5kZXJlcigpO1xuICAgICAgICB0aGlzLmFjdGlvblF1ZXVlID0gbmV3IEFjdGlvblF1ZXVlKCk7XG4gICAgICAgIHRoaXMuYWN0aW9uRGlzcGF0Y2hlciA9IG5ldyBBY3Rpb25EaXNwYXRjaGVyKHRoaXMuYWN0aW9uUXVldWUucXVldWUpXG4gICAgICAgIHRoaXMuaHRtbFByb3ZpZGVyID0gdGhpcy5yZW5kZXJlci5nZXRWaWV3YWJsZVByb3ZpZGVyKCk7XG4gICAgICAgIHRoaXMudmlld0luamVjdG9yID0gdGhpcy5yZW5kZXJlci5nZXRWaWV3SW5qZWN0b3IodGhpcy52aWV3cyk7XG4gICAgfVxuXG4gICAgcHVibGljIHZtKG5hbWU6c3RyaW5nKTpSZWNlaXZlciB7XG4gICAgICAgIGxldCByID0gbmV3IEJhc2VSZWNlaXZlcihuYW1lLCB0aGlzLm1vZGVscywgdGhpcy52aWV3cyk7XG4gICAgICAgIHRoaXMucmVjdi5zZXQobmFtZSwgcik7XG4gICAgICAgIHJldHVybiByO1xuICAgIH1cblxuICAgIHB1YmxpYyBtb2RlbChuYW1lOnN0cmluZyk6TW9kZWwge1xuICAgICAgICBsZXQgbTpNb2RlbCA9IG5ldyBCYXNlTW9kZWwobmFtZSk7XG4gICAgICAgIHRoaXMubW9kZWxzLnNldChuYW1lLCBtKVxuICAgICAgICByZXR1cm4gbTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdmlldyhuYW1lOnN0cmluZyk6VmlldzxEaXNwbGF5UHJvdmlkZXJOb2RlPiB7XG4gICAgICAgIGxldCB2ID0gbmV3IFZOb2RlVmlldyhuYW1lLFxuICAgICAgICAgICAgdGhpcy5odG1sUHJvdmlkZXIsXG4gICAgICAgICAgICB0aGlzLnZpZXdJbmplY3RvcixcbiAgICAgICAgICAgIHRoaXMuYWN0aW9uRGlzcGF0Y2hlcik7XG4gICAgICAgIHRoaXMudmlld3Muc2V0KG5hbWUsIHYpO1xuICAgICAgICByZXR1cm4gdjtcbiAgICB9XG5cbiAgICBwdWJsaWMgdGljaygpOnZvaWQge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lLmNhbGwodGhpcywgdGhpcy50aWNrKTtcbiAgICAgICAgdGhpcy5hY3Rpb25UaWNrKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGluaXQoZG9tTm9kZTpEaXNwbGF5Tm9kZSk6dm9pZCB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIubW91bnQoZG9tTm9kZSwgdGhpcy5nZXRBcHBSZW5kZXJUcmVlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFjdGlvblRpY2soKSB7XG4gICAgICAgIGxldCBuZXh0QWN0aW9uID0gdGhpcy5hY3Rpb25RdWV1ZS5kZXF1ZXVlKCk7XG4gICAgICAgIGlmIChuZXh0QWN0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnJlY3YuZm9yRWFjaCgocjpSZWNlaXZlcikgPT4ge1xuICAgICAgICAgICAgICAgIHIudHJpZ2dlclN0YWdlQ2hhbmdlKG5leHRBY3Rpb24pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEFwcFJlbmRlclRyZWUoKSB7XG4gICAgICAgIGxldCByZWNlaXZlcnMgPSBBcnJheS5mcm9tKHRoaXMucmVjdi52YWx1ZXMoKSk7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlcmVyLnN0aXRjaCgoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcmVjZWl2ZXJzLm1hcCgocjpSZWNlaXZlcikgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiByLmdldFJlbmRlclRyZWUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KVxuICAgIH1cbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZmFjYWRlL1ZOb2RlQXBwLnRzIiwiaW1wb3J0IHsgTW9kZWwgfSBmcm9tICcuLi9jb3JlL01vZGVsLmludGVyZmFjZSc7XG5pbXBvcnQge01vZGVsRGF0YX0gZnJvbSAnLi4vY29yZS9jb3JlLnR5cGUnO1xuaW1wb3J0IHtIYW5kbGVyfSBmcm9tICcuLi9jb3JlL0hhbmRsZXJULmludGVyZmFjZSc7XG5cbmV4cG9ydCBjbGFzcyBCYXNlTW9kZWwgaW1wbGVtZW50cyBNb2RlbCB7XG4gICAgcHJpdmF0ZSBuYW1lOnN0cmluZztcbiAgICBwcml2YXRlIGRhdGE6TW9kZWxEYXRhO1xuICAgIHByaXZhdGUgaGFuZGxlcnM6TWFwPHN0cmluZywgSGFuZGxlcjx2b2lkPj47XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOnN0cmluZykge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIH1cblxuICAgIHB1YmxpYyBkZWZpbmUoZGF0YTpNb2RlbERhdGEpOk1vZGVsIHtcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcHVibGljIGdldERhdGEoKTpNb2RlbERhdGEge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhO1xuICAgIH1cblxuICAgIHB1YmxpYyBoYW5kbGUoc3RhdGVOYW1lOnN0cmluZywgaGFuZGxlcjpIYW5kbGVyPHZvaWQ+KSB7XG4gICAgICAgIHRoaXMuaGFuZGxlcnMuc2V0KHN0YXRlTmFtZSwgaGFuZGxlcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHB1YmxpYyBzYXZlKCk6KCk9PiBmYWxzZSB7XG4gICAgICAgIHJldHVybiAoKCkgPT4gZmFsc2UpO1xuICAgIH1cblxuICAgIHB1YmxpYyByZWZyZXNoKCk6dm9pZCB7XG4gICAgICAgIFxuICAgIH1cblxuICAgIHB1YmxpYyBoYW5kbGVTdGF0ZUNoYW5nZShzdGF0ZU5hbWU6c3RyaW5nKTp2b2lkIHtcbiAgICAgICAgbGV0IGhhbmRsZXIgPSB0aGlzLmhhbmRsZXJzLmdldChzdGF0ZU5hbWUpO1xuICAgICAgICBpZiAoaGFuZGxlcikge1xuICAgICAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCB0aGlzLmRhdGEpO1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5lcnJvcihgc3RhdGUgJHtzdGF0ZU5hbWV9IG5vdCBoYW5kbGVkYCk7XG4gICAgfVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9tb2RlbC9CYXNlTW9kZWwudHMiLCJpbXBvcnQgeyBWaWV3IH0gZnJvbSAnLi4vY29yZS9WaWV3LmludGVyZmFjZSc7XG5pbXBvcnQgeyBEaXNwbGF5UHJvdmlkZXJOb2RlIH0gZnJvbSAnLi4vY29yZS9jb3JlLnR5cGUnXG5pbXBvcnQgeyBIYW5kbGVyIH0gZnJvbSAnLi4vY29yZS9IYW5kbGVyVC5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgSW5qZWN0b3IgfSBmcm9tICcuLi9jb3JlL0luamVjdG9yLmludGVyZmFjZSc7XG5pbXBvcnQgeyBNb2RlbERhdGEsIFZpZXdDb25zdHJ1Y3RvciB9IGZyb20gJy4uL2NvcmUvY29yZS50eXBlJztcbmltcG9ydCB7IFZhbHVlSW5qZWN0b3IgfSBmcm9tICcuLi9tb2RlbC9WYWx1ZUluamVjdG9yJztcbmltcG9ydCB7IEFjdGlvbkRpc3BhdGNoZXIgfSBmcm9tICcuLi9hY3Rpb24vQWN0aW9uRGlzcGF0Y2hlcidcblxuZXhwb3J0IGNsYXNzIFZOb2RlVmlldyBpbXBsZW1lbnRzIFZpZXc8RGlzcGxheVByb3ZpZGVyTm9kZT4ge1xuICAgIHByaXZhdGUgbmFtZTpzdHJpbmc7XG4gICAgcHJpdmF0ZSB2aWV3Q29uc3RydWN0b3I6SGFuZGxlcjxEaXNwbGF5UHJvdmlkZXJOb2RlPjtcbiAgICBwcml2YXRlIGh0bWxQcm92aWRlcjpGdW5jdGlvbjtcbiAgICBwcml2YXRlIHZpZXdQcm92aWRlcjpGdW5jdGlvbjtcbiAgICBwcml2YXRlIGFjdGlvbkxvb2t1cDpNYXA8c3RyaW5nLCBGdW5jdGlvbj47XG4gICAgcHJpdmF0ZSBhY3Rpb25EaXNwYXRjaGVyOkFjdGlvbkRpc3BhdGNoZXI7XG4gICAgY29uc3RydWN0b3IobmFtZTpzdHJpbmcsIGg6RnVuY3Rpb24sIHY6RnVuY3Rpb24sIGE6QWN0aW9uRGlzcGF0Y2hlcikge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmh0bWxQcm92aWRlciA9IGg7XG4gICAgICAgIHRoaXMudmlld1Byb3ZpZGVyID0gdjtcbiAgICAgICAgdGhpcy5hY3Rpb25EaXNwYXRjaGVyID0gYTtcbiAgICAgICAgdGhpcy5hY3Rpb25Mb29rdXAgPSBuZXcgTWFwPHN0cmluZywgRnVuY3Rpb24+KCk7XG4gICAgfVxuXG4gICAgcHVibGljIGRlZmluZSh2aWV3Q29uc3RydWN0b3I6Vmlld0NvbnN0cnVjdG9yPERpc3BsYXlQcm92aWRlck5vZGU+KTpWaWV3PERpc3BsYXlQcm92aWRlck5vZGU+IHtcbiAgICAgICAgdGhpcy52aWV3Q29uc3RydWN0b3IgPSB2aWV3Q29uc3RydWN0b3I7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHB1YmxpYyByZW5kZXIoZGF0YTpNb2RlbERhdGEpOkRpc3BsYXlQcm92aWRlck5vZGUge1xuICAgICAgICBsZXQgdmFsdWVJbmplY3RvciA9IG5ldyBWYWx1ZUluamVjdG9yKGRhdGEpO1xuICAgICAgICByZXR1cm4gdGhpcy52aWV3Q29uc3RydWN0b3IodGhpcy5odG1sUHJvdmlkZXIsIHRoaXMudmlld1Byb3ZpZGVyLCB2YWx1ZUluamVjdG9yLmluamVjdCwgdGhpcy5hY3Rpb25Mb29rdXApO1xuICAgIH1cblxuICAgIHB1YmxpYyByZWdpc3RlckFjdGlvbnMoLi4uYWN0aW9uTmFtZXM6c3RyaW5nW10pOlZpZXc8RGlzcGxheVByb3ZpZGVyTm9kZT4ge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFjdGlvbk5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgYWN0aW9uTmFtZSA9IGFjdGlvbk5hbWVzW2ldO1xuICAgICAgICAgICAgdGhpcy5hY3Rpb25Mb29rdXAuc2V0KFxuICAgICAgICAgICAgICAgIGFjdGlvbk5hbWUsXG4gICAgICAgICAgICAgICAgdGhpcy5hY3Rpb25EaXNwYXRjaGVyLmRpc3BhdGNoLmJpbmQoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWN0aW9uRGlzcGF0Y2hlciwgXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbk5hbWVcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdmlldy9WTm9kZVZpZXcudHMiLCJpbXBvcnQgeyBNb2RlbERhdGEgfSBmcm9tICcuLi9jb3JlL2NvcmUudHlwZSc7XG5pbXBvcnQgeyBJbmplY3RvciB9IGZyb20gJy4uL2NvcmUvSW5qZWN0b3IuaW50ZXJmYWNlJztcblxuZXhwb3J0IGNsYXNzIFZhbHVlSW5qZWN0b3IgaW1wbGVtZW50cyBJbmplY3Rvcjxhbnk+IHtcbiAgICBwcml2YXRlIGRhdGE6TW9kZWxEYXRhO1xuICAgIGNvbnN0cnVjdG9yKG1vZGVsRGF0YTpNb2RlbERhdGEpIHtcbiAgICAgICAgdGhpcy5kYXRhID0gbW9kZWxEYXRhO1xuICAgIH1cbiAgICBwdWJsaWMgaW5qZWN0KG1vZGVsS2V5OnN0cmluZyk6YW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5nZXQobW9kZWxLZXkpO1xuICAgIH1cbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbW9kZWwvVmFsdWVJbmplY3Rvci50cyIsImltcG9ydCB7IFJlY2VpdmVyIH0gZnJvbSAnLi4vY29yZS9SZWNlaXZlci5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgTW9kZWwgfSBmcm9tICcuLi9jb3JlL01vZGVsLmludGVyZmFjZSc7XG5pbXBvcnQgeyBWaWV3IH0gZnJvbSAnLi4vY29yZS9WaWV3LmludGVyZmFjZSc7XG5pbXBvcnQgeyBEaXNwbGF5UHJvdmlkZXJOb2RlIH0gZnJvbSAnLi4vY29yZS9jb3JlLnR5cGUnXG5cbmV4cG9ydCBjbGFzcyBCYXNlUmVjZWl2ZXIgaW1wbGVtZW50cyBSZWNlaXZlciB7XG4gICAgcHJpdmF0ZSBuYW1lOnN0cmluZztcbiAgICBwcml2YXRlIG1vZGVsTG9va3VwOk1hcDxzdHJpbmcsIE1vZGVsPjtcbiAgICBwcml2YXRlIHZpZXdMb29rdXA6TWFwPHN0cmluZywgVmlldzxEaXNwbGF5UHJvdmlkZXJOb2RlPj47XG4gICAgcHJpdmF0ZSBfbW9kZWw6TW9kZWw7XG4gICAgcHJpdmF0ZSBfdmlldzpWaWV3PERpc3BsYXlQcm92aWRlck5vZGU+O1xuICAgIHByaXZhdGUgYWN0aW9uU3RhdGVSb3V0ZXM6TWFwPHN0cmluZywgc3RyaW5nPjtcbiAgICBwcml2YXRlIGRlcGVuZGVuY2llczogc3RyaW5nW107XG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOnN0cmluZywgbW9kZWxMb29rdXA6TWFwPHN0cmluZywgTW9kZWw+LCB2aWV3TG9va3VwOk1hcDxzdHJpbmcsIFZpZXc8RGlzcGxheVByb3ZpZGVyTm9kZT4+KSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMubW9kZWxMb29rdXAgPSBtb2RlbExvb2t1cDtcbiAgICAgICAgdGhpcy52aWV3TG9va3VwID0gdmlld0xvb2t1cDtcbiAgICB9XG5cbiAgICBwdWJsaWMgbW9kZWwobmFtZTpzdHJpbmcpOlJlY2VpdmVyIHtcbiAgICAgICAgdGhpcy5fbW9kZWwgPSB0aGlzLm1vZGVsTG9va3VwLmdldChuYW1lKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcHVibGljIHZpZXcobmFtZTpzdHJpbmcpOlJlY2VpdmVyIHtcbiAgICAgICAgdGhpcy5fdmlldyA9IHRoaXMudmlld0xvb2t1cC5nZXQobmFtZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY2NlcHQocm91dGVzOk1hcDxzdHJpbmcsIHN0cmluZz4pOlJlY2VpdmVyIHtcbiAgICAgICAgdGhpcy5hY3Rpb25TdGF0ZVJvdXRlcyA9IHJvdXRlcztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcHVibGljIGNvbnRhaW5zKC4uLmRlcGVuZGVuY2llczpzdHJpbmdbXSk6UmVjZWl2ZXIge1xuICAgICAgICB0aGlzLmRlcGVuZGVuY2llcyA9IGRlcGVuZGVuY2llcztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcHVibGljIHRyaWdnZXJTdGFnZUNoYW5nZShhY3Rpb25OYW1lOnN0cmluZyk6dm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmRvZXNBY2NlcHRBY3Rpb24oYWN0aW9uTmFtZSkpIHtcbiAgICAgICAgICAgIHRoaXMuX21vZGVsLmhhbmRsZVN0YXRlQ2hhbmdlKHRoaXMuYWN0aW9uU3RhdGVSb3V0ZXMuZ2V0KGFjdGlvbk5hbWUpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXRSZW5kZXJUcmVlKCk6RGlzcGxheVByb3ZpZGVyTm9kZSB7XG4gICAgICAgIHJldHVybiB0aGlzLl92aWV3LnJlbmRlcih0aGlzLl9tb2RlbC5nZXREYXRhKCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZG9lc0FjY2VwdEFjdGlvbihhY3Rpb25OYW1lOnN0cmluZyk6Ym9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmFjdGlvblN0YXRlUm91dGVzLmhhcyhhY3Rpb25OYW1lKTtcbiAgICB9XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2FjdGlvbi9CYXNlUmVjZWl2ZXIudHMiLCJleHBvcnQgY2xhc3MgQWN0aW9uRGlzcGF0Y2hlciB7XG4gICAgcHJpdmF0ZSBxdWV1ZUFjdGlvbjpGdW5jdGlvbjtcbiAgICBwcml2YXRlIGxvb2t1cDpNYXA8c3RyaW5nLCBGdW5jdGlvbj47XG5cbiAgICBjb25zdHJ1Y3RvcihxdWV1ZUFjdGlvbjpGdW5jdGlvbikge1xuICAgICAgICB0aGlzLnF1ZXVlQWN0aW9uID0gcXVldWVBY3Rpb247XG4gICAgfVxuICAgIHB1YmxpYyBkaXNwYXRjaChhY3Rpb25OYW1lOnN0cmluZyk6dm9pZCB7XG4gICAgICAgIHRoaXMucXVldWVBY3Rpb24oYWN0aW9uTmFtZSk7XG4gICAgfVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9hY3Rpb24vQWN0aW9uRGlzcGF0Y2hlci50cyIsImltcG9ydCB7IFF1ZXVlIH0gZnJvbSAnLi4vY29yZS9RdWV1ZVQuaW50ZXJmYWNlJztcbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gJy4uL2NvcmUvY29yZS50eXBlJztcblxuZXhwb3J0IGNsYXNzIEFjdGlvblF1ZXVlIGltcGxlbWVudHMgUXVldWU8QWN0aW9uPiB7XG4gICAgcHJpdmF0ZSBtZW1iZXJzOkFjdGlvbltdO1xuXG4gICAgY29uc3RydWN0b3IoKSB7fVxuXG4gICAgcHVibGljIHF1ZXVlKGFjdGlvbjpBY3Rpb24pOm51bWJlciB7XG4gICAgICAgIHRoaXMubWVtYmVycy5wdXNoKGFjdGlvbik7XG4gICAgICAgIHJldHVybiB0aGlzLm1lbWJlcnMubGVuZ3RoO1xuICAgIH1cblxuICAgIHB1YmxpYyBkZXF1ZXVlKCk6QWN0aW9uIHtcbiAgICAgICAgaWYgKHRoaXMubWVtYmVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tZW1iZXJzLnNoaWZ0KCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5pbmZvKCdBY3Rpb24gUXVldWUgaXMgZW1wdHknKVxuICAgIH1cblxuICAgIHB1YmxpYyBwZWVrKCk6QWN0aW9uIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWVtYmVyc1swXTtcbiAgICB9XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2FjdGlvbi9BY3Rpb25RdWV1ZS50cyIsImltcG9ydCB7IFJlbmRlcmVyIH0gZnJvbSAnLi4vY29yZS9SZW5kZXJlci5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgaCwgY3JlYXRlUHJvamVjdG9yLCBWTm9kZSwgUHJvamVjdG9yIH0gZnJvbSAnbWFxdWV0dGUnO1xuaW1wb3J0IHsgRGlzcGxheU5vZGUgfSBmcm9tICcuLi9jb3JlL2NvcmUudHlwZSc7XG5leHBvcnQgY2xhc3MgVk5vZGVSZW5kZXJlciBpbXBsZW1lbnRzIFJlbmRlcmVyPFZOb2RlPiB7XG4gICAgcHJpdmF0ZSBwcm9qZWN0b3I6UHJvamVjdG9yO1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnByb2plY3RvciA9IGNyZWF0ZVByb2plY3RvcigpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGl0Y2gocmVuZGVyQ2hpbGRyZW46KCkgPT4gVk5vZGVbXSk6Vk5vZGUge1xuICAgICAgICByZXR1cm4gaCgnZGl2LmFwcENvbnRhaW5lcicsIHt9LCByZW5kZXJDaGlsZHJlbigpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbW91bnQoZG9tTm9kZTpEaXNwbGF5Tm9kZSwgcmVuZGVyRm46KCkgPT4gVk5vZGUpOnZvaWQge1xuICAgICAgICB0aGlzLnByb2plY3Rvci5hcHBlbmQoZG9tTm9kZSwgcmVuZGVyRm4pO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRWaWV3YWJsZVByb3ZpZGVyKCk6KGE6c3RyaW5nLGI6TWFwPHN0cmluZywgYW55PixjOlZOb2RlW10pID0+IFZOb2RlIHtcbiAgICAgICAgcmV0dXJuIChzZWxlY3RvciwgYXR0ciwgY29udGVudHMpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBoKHNlbGVjdG9yLCBhdHRyLCBjb250ZW50cyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Vmlld0luamVjdG9yKGxvb2t1cDpNYXA8YW55LCBhbnk+KToobmFtZTpzdHJpbmcsIGRhdGE6TWFwPGFueSwgYW55PikgPT4gVk5vZGUge1xuICAgICAgICByZXR1cm4gKG5hbWUsIGRhdGEpID0+IHtcbiAgICAgICAgICAgIGxldCB2aWV3ID0gbG9va3VwLmdldChuYW1lKTtcbiAgICAgICAgICAgIGlmICh2aWV3KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZpZXcucmVuZGVyKGRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9yZW5kZXIvVk5vZGVSZW5kZXJlci50cyIsIihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuICAgICAgICBkZWZpbmUoWydleHBvcnRzJ10sIGZhY3RvcnkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBleHBvcnRzLm5vZGVOYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgICAvLyBDb21tb25KU1xuICAgICAgICBmYWN0b3J5KGV4cG9ydHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEJyb3dzZXIgZ2xvYmFsc1xuICAgICAgICBmYWN0b3J5KHJvb3QubWFxdWV0dGUgPSB7fSk7XG4gICAgfVxufSh0aGlzLCBmdW5jdGlvbiAoZXhwb3J0cykge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvLyBDb21tZW50IHRoYXQgaXMgZGlzcGxheWVkIGluIHRoZSBBUEkgZG9jdW1lbnRhdGlvbiBmb3IgdGhlIG1hcXVldHRlIG1vZHVsZTpcbiAgICAvKipcbiAqIFdlbGNvbWUgdG8gdGhlIEFQSSBkb2N1bWVudGF0aW9uIG9mIHRoZSAqKm1hcXVldHRlKiogbGlicmFyeS5cbiAqXG4gKiBbW2h0dHA6Ly9tYXF1ZXR0ZWpzLm9yZy98VG8gdGhlIG1hcXVldHRlIGhvbWVwYWdlXV1cbiAqL1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gICAgdmFyIE5BTUVTUEFDRV9XMyA9ICdodHRwOi8vd3d3LnczLm9yZy8nO1xuICAgIHZhciBOQU1FU1BBQ0VfU1ZHID0gTkFNRVNQQUNFX1czICsgJzIwMDAvc3ZnJztcbiAgICB2YXIgTkFNRVNQQUNFX1hMSU5LID0gTkFNRVNQQUNFX1czICsgJzE5OTkveGxpbmsnO1xuICAgIC8vIFV0aWxpdGllc1xuICAgIHZhciBlbXB0eUFycmF5ID0gW107XG4gICAgdmFyIGV4dGVuZCA9IGZ1bmN0aW9uIChiYXNlLCBvdmVycmlkZXMpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgICAgICBPYmplY3Qua2V5cyhiYXNlKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIHJlc3VsdFtrZXldID0gYmFzZVtrZXldO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKG92ZXJyaWRlcykge1xuICAgICAgICAgICAgT2JqZWN0LmtleXMob3ZlcnJpZGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IG92ZXJyaWRlc1trZXldO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICAgIC8vIEh5cGVyc2NyaXB0IGhlbHBlciBmdW5jdGlvbnNcbiAgICB2YXIgc2FtZSA9IGZ1bmN0aW9uICh2bm9kZTEsIHZub2RlMikge1xuICAgICAgICBpZiAodm5vZGUxLnZub2RlU2VsZWN0b3IgIT09IHZub2RlMi52bm9kZVNlbGVjdG9yKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZub2RlMS5wcm9wZXJ0aWVzICYmIHZub2RlMi5wcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICBpZiAodm5vZGUxLnByb3BlcnRpZXMua2V5ICE9PSB2bm9kZTIucHJvcGVydGllcy5rZXkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdm5vZGUxLnByb3BlcnRpZXMuYmluZCA9PT0gdm5vZGUyLnByb3BlcnRpZXMuYmluZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gIXZub2RlMS5wcm9wZXJ0aWVzICYmICF2bm9kZTIucHJvcGVydGllcztcbiAgICB9O1xuICAgIHZhciB0b1RleHRWTm9kZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2bm9kZVNlbGVjdG9yOiAnJyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGNoaWxkcmVuOiB1bmRlZmluZWQsXG4gICAgICAgICAgICB0ZXh0OiBkYXRhLnRvU3RyaW5nKCksXG4gICAgICAgICAgICBkb21Ob2RlOiBudWxsXG4gICAgICAgIH07XG4gICAgfTtcbiAgICB2YXIgYXBwZW5kQ2hpbGRyZW4gPSBmdW5jdGlvbiAocGFyZW50U2VsZWN0b3IsIGluc2VydGlvbnMsIG1haW4pIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aF8xID0gaW5zZXJ0aW9ucy5sZW5ndGg7IGkgPCBsZW5ndGhfMTsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IGluc2VydGlvbnNbaV07XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpdGVtKSkge1xuICAgICAgICAgICAgICAgIGFwcGVuZENoaWxkcmVuKHBhcmVudFNlbGVjdG9yLCBpdGVtLCBtYWluKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0gIT09IG51bGwgJiYgaXRlbSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXRlbS5oYXNPd25Qcm9wZXJ0eSgndm5vZGVTZWxlY3RvcicpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtID0gdG9UZXh0Vk5vZGUoaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbWFpbi5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgLy8gUmVuZGVyIGhlbHBlciBmdW5jdGlvbnNcbiAgICB2YXIgbWlzc2luZ1RyYW5zaXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignUHJvdmlkZSBhIHRyYW5zaXRpb25zIG9iamVjdCB0byB0aGUgcHJvamVjdGlvbk9wdGlvbnMgdG8gZG8gYW5pbWF0aW9ucycpO1xuICAgIH07XG4gICAgdmFyIERFRkFVTFRfUFJPSkVDVElPTl9PUFRJT05TID0ge1xuICAgICAgICBuYW1lc3BhY2U6IHVuZGVmaW5lZCxcbiAgICAgICAgZXZlbnRIYW5kbGVySW50ZXJjZXB0b3I6IHVuZGVmaW5lZCxcbiAgICAgICAgc3R5bGVBcHBseWVyOiBmdW5jdGlvbiAoZG9tTm9kZSwgc3R5bGVOYW1lLCB2YWx1ZSkge1xuICAgICAgICAgICAgLy8gUHJvdmlkZXMgYSBob29rIHRvIGFkZCB2ZW5kb3IgcHJlZml4ZXMgZm9yIGJyb3dzZXJzIHRoYXQgc3RpbGwgbmVlZCBpdC5cbiAgICAgICAgICAgIGRvbU5vZGUuc3R5bGVbc3R5bGVOYW1lXSA9IHZhbHVlO1xuICAgICAgICB9LFxuICAgICAgICB0cmFuc2l0aW9uczoge1xuICAgICAgICAgICAgZW50ZXI6IG1pc3NpbmdUcmFuc2l0aW9uLFxuICAgICAgICAgICAgZXhpdDogbWlzc2luZ1RyYW5zaXRpb25cbiAgICAgICAgfVxuICAgIH07XG4gICAgdmFyIGFwcGx5RGVmYXVsdFByb2plY3Rpb25PcHRpb25zID0gZnVuY3Rpb24gKHByb2plY3Rvck9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIGV4dGVuZChERUZBVUxUX1BST0pFQ1RJT05fT1BUSU9OUywgcHJvamVjdG9yT3B0aW9ucyk7XG4gICAgfTtcbiAgICB2YXIgY2hlY2tTdHlsZVZhbHVlID0gZnVuY3Rpb24gKHN0eWxlVmFsdWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzdHlsZVZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdHlsZSB2YWx1ZXMgbXVzdCBiZSBzdHJpbmdzJyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHZhciBzZXRQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKGRvbU5vZGUsIHByb3BlcnRpZXMsIHByb2plY3Rpb25PcHRpb25zKSB7XG4gICAgICAgIGlmICghcHJvcGVydGllcykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBldmVudEhhbmRsZXJJbnRlcmNlcHRvciA9IHByb2plY3Rpb25PcHRpb25zLmV2ZW50SGFuZGxlckludGVyY2VwdG9yO1xuICAgICAgICB2YXIgcHJvcE5hbWVzID0gT2JqZWN0LmtleXMocHJvcGVydGllcyk7XG4gICAgICAgIHZhciBwcm9wQ291bnQgPSBwcm9wTmFtZXMubGVuZ3RoO1xuICAgICAgICB2YXIgX2xvb3BfMSA9IGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICB2YXIgcHJvcE5hbWUgPSBwcm9wTmFtZXNbaV07XG4gICAgICAgICAgICAvKiB0c2xpbnQ6ZGlzYWJsZTpuby12YXIta2V5d29yZDogZWRnZSBjYXNlICovXG4gICAgICAgICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcGVydGllc1twcm9wTmFtZV07XG4gICAgICAgICAgICAvKiB0c2xpbnQ6ZW5hYmxlOm5vLXZhci1rZXl3b3JkICovXG4gICAgICAgICAgICBpZiAocHJvcE5hbWUgPT09ICdjbGFzc05hbWUnKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQcm9wZXJ0eSBcImNsYXNzTmFtZVwiIGlzIG5vdCBzdXBwb3J0ZWQsIHVzZSBcImNsYXNzXCIuJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHByb3BOYW1lID09PSAnY2xhc3MnKSB7XG4gICAgICAgICAgICAgICAgcHJvcFZhbHVlLnNwbGl0KC9cXHMrLykuZm9yRWFjaChmdW5jdGlvbiAodG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRvbU5vZGUuY2xhc3NMaXN0LmFkZCh0b2tlbik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHByb3BOYW1lID09PSAnY2xhc3NlcycpIHtcbiAgICAgICAgICAgICAgICAvLyBvYmplY3Qgd2l0aCBzdHJpbmcga2V5cyBhbmQgYm9vbGVhbiB2YWx1ZXNcbiAgICAgICAgICAgICAgICB2YXIgY2xhc3NOYW1lcyA9IE9iamVjdC5rZXlzKHByb3BWYWx1ZSk7XG4gICAgICAgICAgICAgICAgdmFyIGNsYXNzTmFtZUNvdW50ID0gY2xhc3NOYW1lcy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBjbGFzc05hbWVDb3VudDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjbGFzc05hbWUgPSBjbGFzc05hbWVzW2pdO1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvcFZhbHVlW2NsYXNzTmFtZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbU5vZGUuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9wTmFtZSA9PT0gJ3N0eWxlcycpIHtcbiAgICAgICAgICAgICAgICAvLyBvYmplY3Qgd2l0aCBzdHJpbmcga2V5cyBhbmQgc3RyaW5nICghKSB2YWx1ZXNcbiAgICAgICAgICAgICAgICB2YXIgc3R5bGVOYW1lcyA9IE9iamVjdC5rZXlzKHByb3BWYWx1ZSk7XG4gICAgICAgICAgICAgICAgdmFyIHN0eWxlQ291bnQgPSBzdHlsZU5hbWVzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHN0eWxlQ291bnQ7IGorKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3R5bGVOYW1lID0gc3R5bGVOYW1lc1tqXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0eWxlVmFsdWUgPSBwcm9wVmFsdWVbc3R5bGVOYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0eWxlVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrU3R5bGVWYWx1ZShzdHlsZVZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2plY3Rpb25PcHRpb25zLnN0eWxlQXBwbHllcihkb21Ob2RlLCBzdHlsZU5hbWUsIHN0eWxlVmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9wTmFtZSAhPT0gJ2tleScgJiYgcHJvcFZhbHVlICE9PSBudWxsICYmIHByb3BWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdmFyIHR5cGUgPSB0eXBlb2YgcHJvcFZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wTmFtZS5sYXN0SW5kZXhPZignb24nLCAwKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50SGFuZGxlckludGVyY2VwdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcFZhbHVlID0gZXZlbnRIYW5kbGVySW50ZXJjZXB0b3IocHJvcE5hbWUsIHByb3BWYWx1ZSwgZG9tTm9kZSwgcHJvcGVydGllcyk7ICAgIC8vIGludGVyY2VwdCBldmVudGhhbmRsZXJzXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvcE5hbWUgPT09ICdvbmlucHV0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlY29yZCB0aGUgZXZ0LnRhcmdldC52YWx1ZSwgYmVjYXVzZSBJRSBhbmQgRWRnZSBzb21ldGltZXMgZG8gYSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgYmV0d2VlbiBjaGFuZ2luZyB2YWx1ZSBhbmQgcnVubmluZyBvbmlucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvbGRQcm9wVmFsdWUgPSBwcm9wVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BWYWx1ZSA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9sZFByb3BWYWx1ZS5hcHBseSh0aGlzLCBbZXZ0XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldnQudGFyZ2V0WydvbmlucHV0LXZhbHVlJ10gPSBldnQudGFyZ2V0LnZhbHVlOyAgICAvLyBtYXkgYmUgSFRNTFRleHRBcmVhRWxlbWVudCBhcyB3ZWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbU5vZGVbcHJvcE5hbWVdID0gcHJvcFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJyAmJiBwcm9wTmFtZSAhPT0gJ3ZhbHVlJyAmJiBwcm9wTmFtZSAhPT0gJ2lubmVySFRNTCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb2plY3Rpb25PcHRpb25zLm5hbWVzcGFjZSA9PT0gTkFNRVNQQUNFX1NWRyAmJiBwcm9wTmFtZSA9PT0gJ2hyZWYnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLnNldEF0dHJpYnV0ZU5TKE5BTUVTUEFDRV9YTElOSywgcHJvcE5hbWUsIHByb3BWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLnNldEF0dHJpYnV0ZShwcm9wTmFtZSwgcHJvcFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRvbU5vZGVbcHJvcE5hbWVdID0gcHJvcFZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgX2xvb3BfMShpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdmFyIHVwZGF0ZVByb3BlcnRpZXMgPSBmdW5jdGlvbiAoZG9tTm9kZSwgcHJldmlvdXNQcm9wZXJ0aWVzLCBwcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucykge1xuICAgICAgICBpZiAoIXByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcHJvcGVydGllc1VwZGF0ZWQgPSBmYWxzZTtcbiAgICAgICAgdmFyIHByb3BOYW1lcyA9IE9iamVjdC5rZXlzKHByb3BlcnRpZXMpO1xuICAgICAgICB2YXIgcHJvcENvdW50ID0gcHJvcE5hbWVzLmxlbmd0aDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgdmFyIHByb3BOYW1lID0gcHJvcE5hbWVzW2ldO1xuICAgICAgICAgICAgLy8gYXNzdW1pbmcgdGhhdCBwcm9wZXJ0aWVzIHdpbGwgYmUgbnVsbGlmaWVkIGluc3RlYWQgb2YgbWlzc2luZyBpcyBieSBkZXNpZ25cbiAgICAgICAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wZXJ0aWVzW3Byb3BOYW1lXTtcbiAgICAgICAgICAgIHZhciBwcmV2aW91c1ZhbHVlID0gcHJldmlvdXNQcm9wZXJ0aWVzW3Byb3BOYW1lXTtcbiAgICAgICAgICAgIGlmIChwcm9wTmFtZSA9PT0gJ2NsYXNzJykge1xuICAgICAgICAgICAgICAgIGlmIChwcmV2aW91c1ZhbHVlICE9PSBwcm9wVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdcImNsYXNzXCIgcHJvcGVydHkgbWF5IG5vdCBiZSB1cGRhdGVkLiBVc2UgdGhlIFwiY2xhc3Nlc1wiIHByb3BlcnR5IGZvciBjb25kaXRpb25hbCBjc3MgY2xhc3Nlcy4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHByb3BOYW1lID09PSAnY2xhc3NlcycpIHtcbiAgICAgICAgICAgICAgICB2YXIgY2xhc3NMaXN0ID0gZG9tTm9kZS5jbGFzc0xpc3Q7XG4gICAgICAgICAgICAgICAgdmFyIGNsYXNzTmFtZXMgPSBPYmplY3Qua2V5cyhwcm9wVmFsdWUpO1xuICAgICAgICAgICAgICAgIHZhciBjbGFzc05hbWVDb3VudCA9IGNsYXNzTmFtZXMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgY2xhc3NOYW1lQ291bnQ7IGorKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2xhc3NOYW1lID0gY2xhc3NOYW1lc1tqXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9uID0gISFwcm9wVmFsdWVbY2xhc3NOYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByZXZpb3VzT24gPSAhIXByZXZpb3VzVmFsdWVbY2xhc3NOYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9uID09PSBwcmV2aW91c09uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzVXBkYXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9wTmFtZSA9PT0gJ3N0eWxlcycpIHtcbiAgICAgICAgICAgICAgICB2YXIgc3R5bGVOYW1lcyA9IE9iamVjdC5rZXlzKHByb3BWYWx1ZSk7XG4gICAgICAgICAgICAgICAgdmFyIHN0eWxlQ291bnQgPSBzdHlsZU5hbWVzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHN0eWxlQ291bnQ7IGorKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3R5bGVOYW1lID0gc3R5bGVOYW1lc1tqXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld1N0eWxlVmFsdWUgPSBwcm9wVmFsdWVbc3R5bGVOYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9sZFN0eWxlVmFsdWUgPSBwcmV2aW91c1ZhbHVlW3N0eWxlTmFtZV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXdTdHlsZVZhbHVlID09PSBvbGRTdHlsZVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzVXBkYXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXdTdHlsZVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja1N0eWxlVmFsdWUobmV3U3R5bGVWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9qZWN0aW9uT3B0aW9ucy5zdHlsZUFwcGx5ZXIoZG9tTm9kZSwgc3R5bGVOYW1lLCBuZXdTdHlsZVZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2plY3Rpb25PcHRpb25zLnN0eWxlQXBwbHllcihkb21Ob2RlLCBzdHlsZU5hbWUsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCFwcm9wVmFsdWUgJiYgdHlwZW9mIHByZXZpb3VzVmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BWYWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocHJvcE5hbWUgPT09ICd2YWx1ZScpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRvbVZhbHVlID0gZG9tTm9kZVtwcm9wTmFtZV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChkb21WYWx1ZSAhPT0gcHJvcFZhbHVlICAgIC8vIFRoZSAndmFsdWUnIGluIHRoZSBET00gdHJlZSAhPT0gbmV3VmFsdWVcbiYmIChkb21Ob2RlWydvbmlucHV0LXZhbHVlJ10gPyBkb21WYWx1ZSA9PT0gZG9tTm9kZVsnb25pbnB1dC12YWx1ZSddICAgIC8vIElmIHRoZSBsYXN0IHJlcG9ydGVkIHZhbHVlIHRvICdvbmlucHV0JyBkb2VzIG5vdCBtYXRjaCBkb21WYWx1ZSwgZG8gbm90aGluZyBhbmQgd2FpdCBmb3Igb25pbnB1dFxuIDogcHJvcFZhbHVlICE9PSBwcmV2aW91c1ZhbHVlICAgIC8vIE9ubHkgdXBkYXRlIHRoZSB2YWx1ZSBpZiB0aGUgdmRvbSBjaGFuZ2VkXG4pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb21Ob2RlW3Byb3BOYW1lXSA9IHByb3BWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlc2V0IHRoZSB2YWx1ZSwgZXZlbiBpZiB0aGUgdmlydHVhbCBET00gZGlkIG5vdCBjaGFuZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbU5vZGVbJ29uaW5wdXQtdmFsdWUnXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBlbHNlIGRvIG5vdCB1cGRhdGUgdGhlIGRvbU5vZGUsIG90aGVyd2lzZSB0aGUgY3Vyc29yIHBvc2l0aW9uIHdvdWxkIGJlIGNoYW5nZWRcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BWYWx1ZSAhPT0gcHJldmlvdXNWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllc1VwZGF0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9wVmFsdWUgIT09IHByZXZpb3VzVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHR5cGUgPSB0eXBlb2YgcHJvcFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGdW5jdGlvbnMgbWF5IG5vdCBiZSB1cGRhdGVkIG9uIHN1YnNlcXVlbnQgcmVuZGVycyAocHJvcGVydHk6ICcgKyBwcm9wTmFtZSArICcpLiBIaW50OiBkZWNsYXJlIGV2ZW50IGhhbmRsZXIgZnVuY3Rpb25zIG91dHNpZGUgdGhlIHJlbmRlcigpIGZ1bmN0aW9uLicpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSAnc3RyaW5nJyAmJiBwcm9wTmFtZSAhPT0gJ2lubmVySFRNTCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9qZWN0aW9uT3B0aW9ucy5uYW1lc3BhY2UgPT09IE5BTUVTUEFDRV9TVkcgJiYgcHJvcE5hbWUgPT09ICdocmVmJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbU5vZGUuc2V0QXR0cmlidXRlTlMoTkFNRVNQQUNFX1hMSU5LLCBwcm9wTmFtZSwgcHJvcFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvcE5hbWUgPT09ICdyb2xlJyAmJiBwcm9wVmFsdWUgPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9tTm9kZS5yZW1vdmVBdHRyaWJ1dGUocHJvcE5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLnNldEF0dHJpYnV0ZShwcm9wTmFtZSwgcHJvcFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkb21Ob2RlW3Byb3BOYW1lXSAhPT0gcHJvcFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9tTm9kZVtwcm9wTmFtZV0gPSBwcm9wVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllc1VwZGF0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJvcGVydGllc1VwZGF0ZWQ7XG4gICAgfTtcbiAgICB2YXIgZmluZEluZGV4T2ZDaGlsZCA9IGZ1bmN0aW9uIChjaGlsZHJlbiwgc2FtZUFzLCBzdGFydCkge1xuICAgICAgICBpZiAoc2FtZUFzLnZub2RlU2VsZWN0b3IgIT09ICcnKSB7XG4gICAgICAgICAgICAvLyBOZXZlciBzY2FuIGZvciB0ZXh0LW5vZGVzXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChzYW1lKGNoaWxkcmVuW2ldLCBzYW1lQXMpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfTtcbiAgICB2YXIgbm9kZUFkZGVkID0gZnVuY3Rpb24gKHZOb2RlLCB0cmFuc2l0aW9ucykge1xuICAgICAgICBpZiAodk5vZGUucHJvcGVydGllcykge1xuICAgICAgICAgICAgdmFyIGVudGVyQW5pbWF0aW9uID0gdk5vZGUucHJvcGVydGllcy5lbnRlckFuaW1hdGlvbjtcbiAgICAgICAgICAgIGlmIChlbnRlckFuaW1hdGlvbikge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZW50ZXJBbmltYXRpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgZW50ZXJBbmltYXRpb24odk5vZGUuZG9tTm9kZSwgdk5vZGUucHJvcGVydGllcyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbnMuZW50ZXIodk5vZGUuZG9tTm9kZSwgdk5vZGUucHJvcGVydGllcywgZW50ZXJBbmltYXRpb24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgdmFyIG5vZGVUb1JlbW92ZSA9IGZ1bmN0aW9uICh2Tm9kZSwgdHJhbnNpdGlvbnMpIHtcbiAgICAgICAgdmFyIGRvbU5vZGUgPSB2Tm9kZS5kb21Ob2RlO1xuICAgICAgICBpZiAodk5vZGUucHJvcGVydGllcykge1xuICAgICAgICAgICAgdmFyIGV4aXRBbmltYXRpb24gPSB2Tm9kZS5wcm9wZXJ0aWVzLmV4aXRBbmltYXRpb247XG4gICAgICAgICAgICBpZiAoZXhpdEFuaW1hdGlvbikge1xuICAgICAgICAgICAgICAgIGRvbU5vZGUuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcbiAgICAgICAgICAgICAgICB2YXIgcmVtb3ZlRG9tTm9kZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvbU5vZGUucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZG9tTm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRvbU5vZGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGV4aXRBbmltYXRpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgZXhpdEFuaW1hdGlvbihkb21Ob2RlLCByZW1vdmVEb21Ob2RlLCB2Tm9kZS5wcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb25zLmV4aXQodk5vZGUuZG9tTm9kZSwgdk5vZGUucHJvcGVydGllcywgZXhpdEFuaW1hdGlvbiwgcmVtb3ZlRG9tTm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRvbU5vZGUucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgZG9tTm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRvbU5vZGUpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICB2YXIgY2hlY2tEaXN0aW5ndWlzaGFibGUgPSBmdW5jdGlvbiAoY2hpbGROb2RlcywgaW5kZXhUb0NoZWNrLCBwYXJlbnRWTm9kZSwgb3BlcmF0aW9uKSB7XG4gICAgICAgIHZhciBjaGlsZE5vZGUgPSBjaGlsZE5vZGVzW2luZGV4VG9DaGVja107XG4gICAgICAgIGlmIChjaGlsZE5vZGUudm5vZGVTZWxlY3RvciA9PT0gJycpIHtcbiAgICAgICAgICAgIHJldHVybjsgICAgLy8gVGV4dCBub2RlcyBuZWVkIG5vdCBiZSBkaXN0aW5ndWlzaGFibGVcbiAgICAgICAgfVxuICAgICAgICB2YXIgcHJvcGVydGllcyA9IGNoaWxkTm9kZS5wcm9wZXJ0aWVzO1xuICAgICAgICB2YXIga2V5ID0gcHJvcGVydGllcyA/IHByb3BlcnRpZXMua2V5ID09PSB1bmRlZmluZWQgPyBwcm9wZXJ0aWVzLmJpbmQgOiBwcm9wZXJ0aWVzLmtleSA6IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKCFrZXkpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChpICE9PSBpbmRleFRvQ2hlY2spIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5vZGUgPSBjaGlsZE5vZGVzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2FtZShub2RlLCBjaGlsZE5vZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3BlcmF0aW9uID09PSAnYWRkZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHBhcmVudFZOb2RlLnZub2RlU2VsZWN0b3IgKyAnIGhhZCBhICcgKyBjaGlsZE5vZGUudm5vZGVTZWxlY3RvciArICcgY2hpbGQgJyArICdhZGRlZCwgYnV0IHRoZXJlIGlzIG5vdyBtb3JlIHRoYW4gb25lLiBZb3UgbXVzdCBhZGQgdW5pcXVlIGtleSBwcm9wZXJ0aWVzIHRvIG1ha2UgdGhlbSBkaXN0aW5ndWlzaGFibGUuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihwYXJlbnRWTm9kZS52bm9kZVNlbGVjdG9yICsgJyBoYWQgYSAnICsgY2hpbGROb2RlLnZub2RlU2VsZWN0b3IgKyAnIGNoaWxkICcgKyAncmVtb3ZlZCwgYnV0IHRoZXJlIHdlcmUgbW9yZSB0aGFuIG9uZS4gWW91IG11c3QgYWRkIHVuaXF1ZSBrZXkgcHJvcGVydGllcyB0byBtYWtlIHRoZW0gZGlzdGluZ3Vpc2hhYmxlLicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICB2YXIgY3JlYXRlRG9tO1xuICAgIHZhciB1cGRhdGVEb207XG4gICAgdmFyIHVwZGF0ZUNoaWxkcmVuID0gZnVuY3Rpb24gKHZub2RlLCBkb21Ob2RlLCBvbGRDaGlsZHJlbiwgbmV3Q2hpbGRyZW4sIHByb2plY3Rpb25PcHRpb25zKSB7XG4gICAgICAgIGlmIChvbGRDaGlsZHJlbiA9PT0gbmV3Q2hpbGRyZW4pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBvbGRDaGlsZHJlbiA9IG9sZENoaWxkcmVuIHx8IGVtcHR5QXJyYXk7XG4gICAgICAgIG5ld0NoaWxkcmVuID0gbmV3Q2hpbGRyZW4gfHwgZW1wdHlBcnJheTtcbiAgICAgICAgdmFyIG9sZENoaWxkcmVuTGVuZ3RoID0gb2xkQ2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgICB2YXIgbmV3Q2hpbGRyZW5MZW5ndGggPSBuZXdDaGlsZHJlbi5sZW5ndGg7XG4gICAgICAgIHZhciB0cmFuc2l0aW9ucyA9IHByb2plY3Rpb25PcHRpb25zLnRyYW5zaXRpb25zO1xuICAgICAgICB2YXIgb2xkSW5kZXggPSAwO1xuICAgICAgICB2YXIgbmV3SW5kZXggPSAwO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgdmFyIHRleHRVcGRhdGVkID0gZmFsc2U7XG4gICAgICAgIHdoaWxlIChuZXdJbmRleCA8IG5ld0NoaWxkcmVuTGVuZ3RoKSB7XG4gICAgICAgICAgICB2YXIgb2xkQ2hpbGQgPSBvbGRJbmRleCA8IG9sZENoaWxkcmVuTGVuZ3RoID8gb2xkQ2hpbGRyZW5bb2xkSW5kZXhdIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgdmFyIG5ld0NoaWxkID0gbmV3Q2hpbGRyZW5bbmV3SW5kZXhdO1xuICAgICAgICAgICAgaWYgKG9sZENoaWxkICE9PSB1bmRlZmluZWQgJiYgc2FtZShvbGRDaGlsZCwgbmV3Q2hpbGQpKSB7XG4gICAgICAgICAgICAgICAgdGV4dFVwZGF0ZWQgPSB1cGRhdGVEb20ob2xkQ2hpbGQsIG5ld0NoaWxkLCBwcm9qZWN0aW9uT3B0aW9ucykgfHwgdGV4dFVwZGF0ZWQ7XG4gICAgICAgICAgICAgICAgb2xkSW5kZXgrKztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGZpbmRPbGRJbmRleCA9IGZpbmRJbmRleE9mQ2hpbGQob2xkQ2hpbGRyZW4sIG5ld0NoaWxkLCBvbGRJbmRleCArIDEpO1xuICAgICAgICAgICAgICAgIGlmIChmaW5kT2xkSW5kZXggPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBSZW1vdmUgcHJlY2VkaW5nIG1pc3NpbmcgY2hpbGRyZW5cbiAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gb2xkSW5kZXg7IGkgPCBmaW5kT2xkSW5kZXg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZVRvUmVtb3ZlKG9sZENoaWxkcmVuW2ldLCB0cmFuc2l0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja0Rpc3Rpbmd1aXNoYWJsZShvbGRDaGlsZHJlbiwgaSwgdm5vZGUsICdyZW1vdmVkJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGV4dFVwZGF0ZWQgPSB1cGRhdGVEb20ob2xkQ2hpbGRyZW5bZmluZE9sZEluZGV4XSwgbmV3Q2hpbGQsIHByb2plY3Rpb25PcHRpb25zKSB8fCB0ZXh0VXBkYXRlZDtcbiAgICAgICAgICAgICAgICAgICAgb2xkSW5kZXggPSBmaW5kT2xkSW5kZXggKyAxO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIE5ldyBjaGlsZFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEb20obmV3Q2hpbGQsIGRvbU5vZGUsIG9sZEluZGV4IDwgb2xkQ2hpbGRyZW5MZW5ndGggPyBvbGRDaGlsZHJlbltvbGRJbmRleF0uZG9tTm9kZSA6IHVuZGVmaW5lZCwgcHJvamVjdGlvbk9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICBub2RlQWRkZWQobmV3Q2hpbGQsIHRyYW5zaXRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tEaXN0aW5ndWlzaGFibGUobmV3Q2hpbGRyZW4sIG5ld0luZGV4LCB2bm9kZSwgJ2FkZGVkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmV3SW5kZXgrKztcbiAgICAgICAgfVxuICAgICAgICBpZiAob2xkQ2hpbGRyZW5MZW5ndGggPiBvbGRJbmRleCkge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIGNoaWxkIGZyYWdtZW50c1xuICAgICAgICAgICAgZm9yIChpID0gb2xkSW5kZXg7IGkgPCBvbGRDaGlsZHJlbkxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbm9kZVRvUmVtb3ZlKG9sZENoaWxkcmVuW2ldLCB0cmFuc2l0aW9ucyk7XG4gICAgICAgICAgICAgICAgY2hlY2tEaXN0aW5ndWlzaGFibGUob2xkQ2hpbGRyZW4sIGksIHZub2RlLCAncmVtb3ZlZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0ZXh0VXBkYXRlZDtcbiAgICB9O1xuICAgIHZhciBhZGRDaGlsZHJlbiA9IGZ1bmN0aW9uIChkb21Ob2RlLCBjaGlsZHJlbiwgcHJvamVjdGlvbk9wdGlvbnMpIHtcbiAgICAgICAgaWYgKCFjaGlsZHJlbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNyZWF0ZURvbShjaGlsZHJlbltpXSwgZG9tTm9kZSwgdW5kZWZpbmVkLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHZhciBpbml0UHJvcGVydGllc0FuZENoaWxkcmVuID0gZnVuY3Rpb24gKGRvbU5vZGUsIHZub2RlLCBwcm9qZWN0aW9uT3B0aW9ucykge1xuICAgICAgICBhZGRDaGlsZHJlbihkb21Ob2RlLCB2bm9kZS5jaGlsZHJlbiwgcHJvamVjdGlvbk9wdGlvbnMpO1xuICAgICAgICAvLyBjaGlsZHJlbiBiZWZvcmUgcHJvcGVydGllcywgbmVlZGVkIGZvciB2YWx1ZSBwcm9wZXJ0eSBvZiA8c2VsZWN0Pi5cbiAgICAgICAgaWYgKHZub2RlLnRleHQpIHtcbiAgICAgICAgICAgIGRvbU5vZGUudGV4dENvbnRlbnQgPSB2bm9kZS50ZXh0O1xuICAgICAgICB9XG4gICAgICAgIHNldFByb3BlcnRpZXMoZG9tTm9kZSwgdm5vZGUucHJvcGVydGllcywgcHJvamVjdGlvbk9wdGlvbnMpO1xuICAgICAgICBpZiAodm5vZGUucHJvcGVydGllcyAmJiB2bm9kZS5wcm9wZXJ0aWVzLmFmdGVyQ3JlYXRlKSB7XG4gICAgICAgICAgICB2bm9kZS5wcm9wZXJ0aWVzLmFmdGVyQ3JlYXRlLmFwcGx5KHZub2RlLnByb3BlcnRpZXMuYmluZCB8fCB2bm9kZS5wcm9wZXJ0aWVzLCBbXG4gICAgICAgICAgICAgICAgZG9tTm9kZSxcbiAgICAgICAgICAgICAgICBwcm9qZWN0aW9uT3B0aW9ucyxcbiAgICAgICAgICAgICAgICB2bm9kZS52bm9kZVNlbGVjdG9yLFxuICAgICAgICAgICAgICAgIHZub2RlLnByb3BlcnRpZXMsXG4gICAgICAgICAgICAgICAgdm5vZGUuY2hpbGRyZW5cbiAgICAgICAgICAgIF0pO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBjcmVhdGVEb20gPSBmdW5jdGlvbiAodm5vZGUsIHBhcmVudE5vZGUsIGluc2VydEJlZm9yZSwgcHJvamVjdGlvbk9wdGlvbnMpIHtcbiAgICAgICAgdmFyIGRvbU5vZGUsIGksIGMsIHN0YXJ0ID0gMCwgdHlwZSwgZm91bmQ7XG4gICAgICAgIHZhciB2bm9kZVNlbGVjdG9yID0gdm5vZGUudm5vZGVTZWxlY3RvcjtcbiAgICAgICAgdmFyIGRvYyA9IHBhcmVudE5vZGUub3duZXJEb2N1bWVudDtcbiAgICAgICAgaWYgKHZub2RlU2VsZWN0b3IgPT09ICcnKSB7XG4gICAgICAgICAgICBkb21Ob2RlID0gdm5vZGUuZG9tTm9kZSA9IGRvYy5jcmVhdGVUZXh0Tm9kZSh2bm9kZS50ZXh0KTtcbiAgICAgICAgICAgIGlmIChpbnNlcnRCZWZvcmUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGRvbU5vZGUsIGluc2VydEJlZm9yZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoZG9tTm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDw9IHZub2RlU2VsZWN0b3IubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBjID0gdm5vZGVTZWxlY3Rvci5jaGFyQXQoaSk7XG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IHZub2RlU2VsZWN0b3IubGVuZ3RoIHx8IGMgPT09ICcuJyB8fCBjID09PSAnIycpIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9IHZub2RlU2VsZWN0b3IuY2hhckF0KHN0YXJ0IC0gMSk7XG4gICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdm5vZGVTZWxlY3Rvci5zbGljZShzdGFydCwgaSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSAnLicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbU5vZGUuY2xhc3NMaXN0LmFkZChmb3VuZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJyMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLmlkID0gZm91bmQ7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZm91bmQgPT09ICdzdmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvamVjdGlvbk9wdGlvbnMgPSBleHRlbmQocHJvamVjdGlvbk9wdGlvbnMsIHsgbmFtZXNwYWNlOiBOQU1FU1BBQ0VfU1ZHIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb2plY3Rpb25PcHRpb25zLm5hbWVzcGFjZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9tTm9kZSA9IHZub2RlLmRvbU5vZGUgPSBkb2MuY3JlYXRlRWxlbWVudE5TKHByb2plY3Rpb25PcHRpb25zLm5hbWVzcGFjZSwgZm91bmQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb21Ob2RlID0gdm5vZGUuZG9tTm9kZSA9IHZub2RlLmRvbU5vZGUgfHwgZG9jLmNyZWF0ZUVsZW1lbnQoZm91bmQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmb3VuZCA9PT0gJ2lucHV0JyAmJiB2bm9kZS5wcm9wZXJ0aWVzICYmIHZub2RlLnByb3BlcnRpZXMudHlwZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIElFOCBhbmQgb2xkZXIgZG9uJ3Qgc3VwcG9ydCBzZXR0aW5nIGlucHV0IHR5cGUgYWZ0ZXIgdGhlIERPTSBOb2RlIGhhcyBiZWVuIGFkZGVkIHRvIHRoZSBkb2N1bWVudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLnNldEF0dHJpYnV0ZSgndHlwZScsIHZub2RlLnByb3BlcnRpZXMudHlwZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluc2VydEJlZm9yZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZG9tTm9kZSwgaW5zZXJ0QmVmb3JlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZG9tTm9kZS5wYXJlbnROb2RlICE9PSBwYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5hcHBlbmRDaGlsZChkb21Ob2RlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzdGFydCA9IGkgKyAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGluaXRQcm9wZXJ0aWVzQW5kQ2hpbGRyZW4oZG9tTm9kZSwgdm5vZGUsIHByb2plY3Rpb25PcHRpb25zKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdXBkYXRlRG9tID0gZnVuY3Rpb24gKHByZXZpb3VzLCB2bm9kZSwgcHJvamVjdGlvbk9wdGlvbnMpIHtcbiAgICAgICAgdmFyIGRvbU5vZGUgPSBwcmV2aW91cy5kb21Ob2RlO1xuICAgICAgICB2YXIgdGV4dFVwZGF0ZWQgPSBmYWxzZTtcbiAgICAgICAgaWYgKHByZXZpb3VzID09PSB2bm9kZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAgICAvLyBCeSBjb250cmFjdCwgVk5vZGUgb2JqZWN0cyBtYXkgbm90IGJlIG1vZGlmaWVkIGFueW1vcmUgYWZ0ZXIgcGFzc2luZyB0aGVtIHRvIG1hcXVldHRlXG4gICAgICAgIH1cbiAgICAgICAgdmFyIHVwZGF0ZWQgPSBmYWxzZTtcbiAgICAgICAgaWYgKHZub2RlLnZub2RlU2VsZWN0b3IgPT09ICcnKSB7XG4gICAgICAgICAgICBpZiAodm5vZGUudGV4dCAhPT0gcHJldmlvdXMudGV4dCkge1xuICAgICAgICAgICAgICAgIHZhciBuZXdWTm9kZSA9IGRvbU5vZGUub3duZXJEb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh2bm9kZS50ZXh0KTtcbiAgICAgICAgICAgICAgICBkb21Ob2RlLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld1ZOb2RlLCBkb21Ob2RlKTtcbiAgICAgICAgICAgICAgICB2bm9kZS5kb21Ob2RlID0gbmV3Vk5vZGU7XG4gICAgICAgICAgICAgICAgdGV4dFVwZGF0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0VXBkYXRlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh2bm9kZS52bm9kZVNlbGVjdG9yLmxhc3RJbmRleE9mKCdzdmcnLCAwKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHByb2plY3Rpb25PcHRpb25zID0gZXh0ZW5kKHByb2plY3Rpb25PcHRpb25zLCB7IG5hbWVzcGFjZTogTkFNRVNQQUNFX1NWRyB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwcmV2aW91cy50ZXh0ICE9PSB2bm9kZS50ZXh0KSB7XG4gICAgICAgICAgICAgICAgdXBkYXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKHZub2RlLnRleHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLnJlbW92ZUNoaWxkKGRvbU5vZGUuZmlyc3RDaGlsZCk7ICAgIC8vIHRoZSBvbmx5IHRleHRub2RlIHByZXN1bWFibHlcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLnRleHRDb250ZW50ID0gdm5vZGUudGV4dDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB1cGRhdGVkID0gdXBkYXRlQ2hpbGRyZW4odm5vZGUsIGRvbU5vZGUsIHByZXZpb3VzLmNoaWxkcmVuLCB2bm9kZS5jaGlsZHJlbiwgcHJvamVjdGlvbk9wdGlvbnMpIHx8IHVwZGF0ZWQ7XG4gICAgICAgICAgICB1cGRhdGVkID0gdXBkYXRlUHJvcGVydGllcyhkb21Ob2RlLCBwcmV2aW91cy5wcm9wZXJ0aWVzLCB2bm9kZS5wcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucykgfHwgdXBkYXRlZDtcbiAgICAgICAgICAgIGlmICh2bm9kZS5wcm9wZXJ0aWVzICYmIHZub2RlLnByb3BlcnRpZXMuYWZ0ZXJVcGRhdGUpIHtcbiAgICAgICAgICAgICAgICB2bm9kZS5wcm9wZXJ0aWVzLmFmdGVyVXBkYXRlLmFwcGx5KHZub2RlLnByb3BlcnRpZXMuYmluZCB8fCB2bm9kZS5wcm9wZXJ0aWVzLCBbXG4gICAgICAgICAgICAgICAgICAgIGRvbU5vZGUsXG4gICAgICAgICAgICAgICAgICAgIHByb2plY3Rpb25PcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICB2bm9kZS52bm9kZVNlbGVjdG9yLFxuICAgICAgICAgICAgICAgICAgICB2bm9kZS5wcm9wZXJ0aWVzLFxuICAgICAgICAgICAgICAgICAgICB2bm9kZS5jaGlsZHJlblxuICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh1cGRhdGVkICYmIHZub2RlLnByb3BlcnRpZXMgJiYgdm5vZGUucHJvcGVydGllcy51cGRhdGVBbmltYXRpb24pIHtcbiAgICAgICAgICAgIHZub2RlLnByb3BlcnRpZXMudXBkYXRlQW5pbWF0aW9uKGRvbU5vZGUsIHZub2RlLnByb3BlcnRpZXMsIHByZXZpb3VzLnByb3BlcnRpZXMpO1xuICAgICAgICB9XG4gICAgICAgIHZub2RlLmRvbU5vZGUgPSBwcmV2aW91cy5kb21Ob2RlO1xuICAgICAgICByZXR1cm4gdGV4dFVwZGF0ZWQ7XG4gICAgfTtcbiAgICB2YXIgY3JlYXRlUHJvamVjdGlvbiA9IGZ1bmN0aW9uICh2bm9kZSwgcHJvamVjdGlvbk9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHVwZGF0ZTogZnVuY3Rpb24gKHVwZGF0ZWRWbm9kZSkge1xuICAgICAgICAgICAgICAgIGlmICh2bm9kZS52bm9kZVNlbGVjdG9yICE9PSB1cGRhdGVkVm5vZGUudm5vZGVTZWxlY3Rvcikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBzZWxlY3RvciBmb3IgdGhlIHJvb3QgVk5vZGUgbWF5IG5vdCBiZSBjaGFuZ2VkLiAoY29uc2lkZXIgdXNpbmcgZG9tLm1lcmdlIGFuZCBhZGQgb25lIGV4dHJhIGxldmVsIHRvIHRoZSB2aXJ0dWFsIERPTSknKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdXBkYXRlRG9tKHZub2RlLCB1cGRhdGVkVm5vZGUsIHByb2plY3Rpb25PcHRpb25zKTtcbiAgICAgICAgICAgICAgICB2bm9kZSA9IHVwZGF0ZWRWbm9kZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkb21Ob2RlOiB2bm9kZS5kb21Ob2RlXG4gICAgICAgIH07XG4gICAgfTtcbiAgICAvLyBUaGUgb3RoZXIgdHdvIHBhcmFtZXRlcnMgYXJlIG5vdCBhZGRlZCBoZXJlLCBiZWNhdXNlIHRoZSBUeXBlc2NyaXB0IGNvbXBpbGVyIGNyZWF0ZXMgc3Vycm9nYXRlIGNvZGUgZm9yIGRlc3RydWN0dXJpbmcgJ2NoaWxkcmVuJy5cbiAgICBleHBvcnRzLmggPSBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcbiAgICAgICAgdmFyIHByb3BlcnRpZXMgPSBhcmd1bWVudHNbMV07XG4gICAgICAgIGlmICh0eXBlb2Ygc2VsZWN0b3IgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY2hpbGRJbmRleCA9IDE7XG4gICAgICAgIGlmIChwcm9wZXJ0aWVzICYmICFwcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KCd2bm9kZVNlbGVjdG9yJykgJiYgIUFycmF5LmlzQXJyYXkocHJvcGVydGllcykgJiYgdHlwZW9mIHByb3BlcnRpZXMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBjaGlsZEluZGV4ID0gMjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE9wdGlvbmFsIHByb3BlcnRpZXMgYXJndW1lbnQgd2FzIG9taXR0ZWRcbiAgICAgICAgICAgIHByb3BlcnRpZXMgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHRleHQ7XG4gICAgICAgIHZhciBjaGlsZHJlbjtcbiAgICAgICAgdmFyIGFyZ3NMZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICAvLyBSZWNvZ25pemUgYSBjb21tb24gc3BlY2lhbCBjYXNlIHdoZXJlIHRoZXJlIGlzIG9ubHkgYSBzaW5nbGUgdGV4dCBub2RlXG4gICAgICAgIGlmIChhcmdzTGVuZ3RoID09PSBjaGlsZEluZGV4ICsgMSkge1xuICAgICAgICAgICAgdmFyIG9ubHlDaGlsZCA9IGFyZ3VtZW50c1tjaGlsZEluZGV4XTtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb25seUNoaWxkID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIHRleHQgPSBvbmx5Q2hpbGQ7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9ubHlDaGlsZCAhPT0gdW5kZWZpbmVkICYmIG9ubHlDaGlsZCAhPT0gbnVsbCAmJiBvbmx5Q2hpbGQubGVuZ3RoID09PSAxICYmIHR5cGVvZiBvbmx5Q2hpbGRbMF0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgdGV4dCA9IG9ubHlDaGlsZFswXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGV4dCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjaGlsZHJlbiA9IFtdO1xuICAgICAgICAgICAgZm9yICg7IGNoaWxkSW5kZXggPCBhcmdzTGVuZ3RoOyBjaGlsZEluZGV4KyspIHtcbiAgICAgICAgICAgICAgICB2YXIgY2hpbGQgPSBhcmd1bWVudHNbY2hpbGRJbmRleF07XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkID09PSBudWxsIHx8IGNoaWxkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGFwcGVuZENoaWxkcmVuKHNlbGVjdG9yLCBjaGlsZCwgY2hpbGRyZW4pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2hpbGQuaGFzT3duUHJvcGVydHkoJ3Zub2RlU2VsZWN0b3InKSkge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKGNoaWxkKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKHRvVGV4dFZOb2RlKGNoaWxkKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2bm9kZVNlbGVjdG9yOiBzZWxlY3RvcixcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHByb3BlcnRpZXMsXG4gICAgICAgICAgICBjaGlsZHJlbjogY2hpbGRyZW4sXG4gICAgICAgICAgICB0ZXh0OiB0ZXh0ID09PSAnJyA/IHVuZGVmaW5lZCA6IHRleHQsXG4gICAgICAgICAgICBkb21Ob2RlOiBudWxsXG4gICAgICAgIH07XG4gICAgfTtcbiAgICAvKipcbiAqIENvbnRhaW5zIHNpbXBsZSBsb3ctbGV2ZWwgdXRpbGl0eSBmdW5jdGlvbnMgdG8gbWFuaXB1bGF0ZSB0aGUgcmVhbCBET00uXG4gKi9cbiAgICBleHBvcnRzLmRvbSA9IHtcbiAgICAgICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIHJlYWwgRE9NIHRyZWUgZnJvbSBgdm5vZGVgLiBUaGUgW1tQcm9qZWN0aW9uXV0gb2JqZWN0IHJldHVybmVkIHdpbGwgY29udGFpbiB0aGUgcmVzdWx0aW5nIERPTSBOb2RlIGluXG4gICAgICogaXRzIFtbUHJvamVjdGlvbi5kb21Ob2RlfGRvbU5vZGVdXSBwcm9wZXJ0eS5cbiAgICAgKiBUaGlzIGlzIGEgbG93LWxldmVsIG1ldGhvZC4gVXNlcnMgd2lsbCB0eXBpY2FsbHkgdXNlIGEgW1tQcm9qZWN0b3JdXSBpbnN0ZWFkLlxuICAgICAqIEBwYXJhbSB2bm9kZSAtIFRoZSByb290IG9mIHRoZSB2aXJ0dWFsIERPTSB0cmVlIHRoYXQgd2FzIGNyZWF0ZWQgdXNpbmcgdGhlIFtbaF1dIGZ1bmN0aW9uLiBOT1RFOiBbW1ZOb2RlXV1cbiAgICAgKiBvYmplY3RzIG1heSBvbmx5IGJlIHJlbmRlcmVkIG9uY2UuXG4gICAgICogQHBhcmFtIHByb2plY3Rpb25PcHRpb25zIC0gT3B0aW9ucyB0byBiZSB1c2VkIHRvIGNyZWF0ZSBhbmQgdXBkYXRlIHRoZSBwcm9qZWN0aW9uLlxuICAgICAqIEByZXR1cm5zIFRoZSBbW1Byb2plY3Rpb25dXSB3aGljaCBhbHNvIGNvbnRhaW5zIHRoZSBET00gTm9kZSB0aGF0IHdhcyBjcmVhdGVkLlxuICAgICAqL1xuICAgICAgICBjcmVhdGU6IGZ1bmN0aW9uICh2bm9kZSwgcHJvamVjdGlvbk9wdGlvbnMpIHtcbiAgICAgICAgICAgIHByb2plY3Rpb25PcHRpb25zID0gYXBwbHlEZWZhdWx0UHJvamVjdGlvbk9wdGlvbnMocHJvamVjdGlvbk9wdGlvbnMpO1xuICAgICAgICAgICAgY3JlYXRlRG9tKHZub2RlLCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSwgdW5kZWZpbmVkLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlUHJvamVjdGlvbih2bm9kZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgKiBBcHBlbmRzIGEgbmV3IGNoaWxkIG5vZGUgdG8gdGhlIERPTSB3aGljaCBpcyBnZW5lcmF0ZWQgZnJvbSBhIFtbVk5vZGVdXS5cbiAgICAgKiBUaGlzIGlzIGEgbG93LWxldmVsIG1ldGhvZC4gVXNlcnMgd2lsbCB0eXBpY2FsbHkgdXNlIGEgW1tQcm9qZWN0b3JdXSBpbnN0ZWFkLlxuICAgICAqIEBwYXJhbSBwYXJlbnROb2RlIC0gVGhlIHBhcmVudCBub2RlIGZvciB0aGUgbmV3IGNoaWxkIG5vZGUuXG4gICAgICogQHBhcmFtIHZub2RlIC0gVGhlIHJvb3Qgb2YgdGhlIHZpcnR1YWwgRE9NIHRyZWUgdGhhdCB3YXMgY3JlYXRlZCB1c2luZyB0aGUgW1toXV0gZnVuY3Rpb24uIE5PVEU6IFtbVk5vZGVdXVxuICAgICAqIG9iamVjdHMgbWF5IG9ubHkgYmUgcmVuZGVyZWQgb25jZS5cbiAgICAgKiBAcGFyYW0gcHJvamVjdGlvbk9wdGlvbnMgLSBPcHRpb25zIHRvIGJlIHVzZWQgdG8gY3JlYXRlIGFuZCB1cGRhdGUgdGhlIFtbUHJvamVjdGlvbl1dLlxuICAgICAqIEByZXR1cm5zIFRoZSBbW1Byb2plY3Rpb25dXSB0aGF0IHdhcyBjcmVhdGVkLlxuICAgICAqL1xuICAgICAgICBhcHBlbmQ6IGZ1bmN0aW9uIChwYXJlbnROb2RlLCB2bm9kZSwgcHJvamVjdGlvbk9wdGlvbnMpIHtcbiAgICAgICAgICAgIHByb2plY3Rpb25PcHRpb25zID0gYXBwbHlEZWZhdWx0UHJvamVjdGlvbk9wdGlvbnMocHJvamVjdGlvbk9wdGlvbnMpO1xuICAgICAgICAgICAgY3JlYXRlRG9tKHZub2RlLCBwYXJlbnROb2RlLCB1bmRlZmluZWQsIHByb2plY3Rpb25PcHRpb25zKTtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVQcm9qZWN0aW9uKHZub2RlLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAqIEluc2VydHMgYSBuZXcgRE9NIG5vZGUgd2hpY2ggaXMgZ2VuZXJhdGVkIGZyb20gYSBbW1ZOb2RlXV0uXG4gICAgICogVGhpcyBpcyBhIGxvdy1sZXZlbCBtZXRob2QuIFVzZXJzIHdpbCB0eXBpY2FsbHkgdXNlIGEgW1tQcm9qZWN0b3JdXSBpbnN0ZWFkLlxuICAgICAqIEBwYXJhbSBiZWZvcmVOb2RlIC0gVGhlIG5vZGUgdGhhdCB0aGUgRE9NIE5vZGUgaXMgaW5zZXJ0ZWQgYmVmb3JlLlxuICAgICAqIEBwYXJhbSB2bm9kZSAtIFRoZSByb290IG9mIHRoZSB2aXJ0dWFsIERPTSB0cmVlIHRoYXQgd2FzIGNyZWF0ZWQgdXNpbmcgdGhlIFtbaF1dIGZ1bmN0aW9uLlxuICAgICAqIE5PVEU6IFtbVk5vZGVdXSBvYmplY3RzIG1heSBvbmx5IGJlIHJlbmRlcmVkIG9uY2UuXG4gICAgICogQHBhcmFtIHByb2plY3Rpb25PcHRpb25zIC0gT3B0aW9ucyB0byBiZSB1c2VkIHRvIGNyZWF0ZSBhbmQgdXBkYXRlIHRoZSBwcm9qZWN0aW9uLCBzZWUgW1tjcmVhdGVQcm9qZWN0b3JdXS5cbiAgICAgKiBAcmV0dXJucyBUaGUgW1tQcm9qZWN0aW9uXV0gdGhhdCB3YXMgY3JlYXRlZC5cbiAgICAgKi9cbiAgICAgICAgaW5zZXJ0QmVmb3JlOiBmdW5jdGlvbiAoYmVmb3JlTm9kZSwgdm5vZGUsIHByb2plY3Rpb25PcHRpb25zKSB7XG4gICAgICAgICAgICBwcm9qZWN0aW9uT3B0aW9ucyA9IGFwcGx5RGVmYXVsdFByb2plY3Rpb25PcHRpb25zKHByb2plY3Rpb25PcHRpb25zKTtcbiAgICAgICAgICAgIGNyZWF0ZURvbSh2bm9kZSwgYmVmb3JlTm9kZS5wYXJlbnROb2RlLCBiZWZvcmVOb2RlLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlUHJvamVjdGlvbih2bm9kZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgKiBNZXJnZXMgYSBuZXcgRE9NIG5vZGUgd2hpY2ggaXMgZ2VuZXJhdGVkIGZyb20gYSBbW1ZOb2RlXV0gd2l0aCBhbiBleGlzdGluZyBET00gTm9kZS5cbiAgICAgKiBUaGlzIG1lYW5zIHRoYXQgdGhlIHZpcnR1YWwgRE9NIGFuZCB0aGUgcmVhbCBET00gd2lsbCBoYXZlIG9uZSBvdmVybGFwcGluZyBlbGVtZW50LlxuICAgICAqIFRoZXJlZm9yZSB0aGUgc2VsZWN0b3IgZm9yIHRoZSByb290IFtbVk5vZGVdXSB3aWxsIGJlIGlnbm9yZWQsIGJ1dCBpdHMgcHJvcGVydGllcyBhbmQgY2hpbGRyZW4gd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBFbGVtZW50IHByb3ZpZGVkLlxuICAgICAqIFRoaXMgaXMgYSBsb3ctbGV2ZWwgbWV0aG9kLiBVc2VycyB3aWwgdHlwaWNhbGx5IHVzZSBhIFtbUHJvamVjdG9yXV0gaW5zdGVhZC5cbiAgICAgKiBAcGFyYW0gZWxlbWVudCAtIFRoZSBleGlzdGluZyBlbGVtZW50IHRvIGFkb3B0IGFzIHRoZSByb290IG9mIHRoZSBuZXcgdmlydHVhbCBET00uIEV4aXN0aW5nIGF0dHJpYnV0ZXMgYW5kIGNoaWxkIG5vZGVzIGFyZSBwcmVzZXJ2ZWQuXG4gICAgICogQHBhcmFtIHZub2RlIC0gVGhlIHJvb3Qgb2YgdGhlIHZpcnR1YWwgRE9NIHRyZWUgdGhhdCB3YXMgY3JlYXRlZCB1c2luZyB0aGUgW1toXV0gZnVuY3Rpb24uIE5PVEU6IFtbVk5vZGVdXSBvYmplY3RzXG4gICAgICogbWF5IG9ubHkgYmUgcmVuZGVyZWQgb25jZS5cbiAgICAgKiBAcGFyYW0gcHJvamVjdGlvbk9wdGlvbnMgLSBPcHRpb25zIHRvIGJlIHVzZWQgdG8gY3JlYXRlIGFuZCB1cGRhdGUgdGhlIHByb2plY3Rpb24sIHNlZSBbW2NyZWF0ZVByb2plY3Rvcl1dLlxuICAgICAqIEByZXR1cm5zIFRoZSBbW1Byb2plY3Rpb25dXSB0aGF0IHdhcyBjcmVhdGVkLlxuICAgICAqL1xuICAgICAgICBtZXJnZTogZnVuY3Rpb24gKGVsZW1lbnQsIHZub2RlLCBwcm9qZWN0aW9uT3B0aW9ucykge1xuICAgICAgICAgICAgcHJvamVjdGlvbk9wdGlvbnMgPSBhcHBseURlZmF1bHRQcm9qZWN0aW9uT3B0aW9ucyhwcm9qZWN0aW9uT3B0aW9ucyk7XG4gICAgICAgICAgICB2bm9kZS5kb21Ob2RlID0gZWxlbWVudDtcbiAgICAgICAgICAgIGluaXRQcm9wZXJ0aWVzQW5kQ2hpbGRyZW4oZWxlbWVudCwgdm5vZGUsIHByb2plY3Rpb25PcHRpb25zKTtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVQcm9qZWN0aW9uKHZub2RlLCBwcm9qZWN0aW9uT3B0aW9ucyk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAqIFJlcGxhY2VzIGFuIGV4aXN0aW5nIERPTSBub2RlIHdpdGggYSBub2RlIGdlbmVyYXRlZCBmcm9tIGEgW1tWTm9kZV1dLlxuICAgICAqIFRoaXMgaXMgYSBsb3ctbGV2ZWwgbWV0aG9kLiBVc2VycyB3aWxsIHR5cGljYWxseSB1c2UgYSBbW1Byb2plY3Rvcl1dIGluc3RlYWQuXG4gICAgICogQHBhcmFtIGVsZW1lbnQgLSBUaGUgbm9kZSBmb3IgdGhlIFtbVk5vZGVdXSB0byByZXBsYWNlLlxuICAgICAqIEBwYXJhbSB2bm9kZSAtIFRoZSByb290IG9mIHRoZSB2aXJ0dWFsIERPTSB0cmVlIHRoYXQgd2FzIGNyZWF0ZWQgdXNpbmcgdGhlIFtbaF1dIGZ1bmN0aW9uLiBOT1RFOiBbW1ZOb2RlXV1cbiAgICAgKiBvYmplY3RzIG1heSBvbmx5IGJlIHJlbmRlcmVkIG9uY2UuXG4gICAgICogQHBhcmFtIHByb2plY3Rpb25PcHRpb25zIC0gT3B0aW9ucyB0byBiZSB1c2VkIHRvIGNyZWF0ZSBhbmQgdXBkYXRlIHRoZSBbW1Byb2plY3Rpb25dXS5cbiAgICAgKiBAcmV0dXJucyBUaGUgW1tQcm9qZWN0aW9uXV0gdGhhdCB3YXMgY3JlYXRlZC5cbiAgICAgKi9cbiAgICAgICAgcmVwbGFjZTogZnVuY3Rpb24gKGVsZW1lbnQsIHZub2RlLCBwcm9qZWN0aW9uT3B0aW9ucykge1xuICAgICAgICAgICAgcHJvamVjdGlvbk9wdGlvbnMgPSBhcHBseURlZmF1bHRQcm9qZWN0aW9uT3B0aW9ucyhwcm9qZWN0aW9uT3B0aW9ucyk7XG4gICAgICAgICAgICBjcmVhdGVEb20odm5vZGUsIGVsZW1lbnQucGFyZW50Tm9kZSwgZWxlbWVudCwgcHJvamVjdGlvbk9wdGlvbnMpO1xuICAgICAgICAgICAgZWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZVByb2plY3Rpb24odm5vZGUsIHByb2plY3Rpb25PcHRpb25zKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gKiBDcmVhdGVzIGEgW1tDYWxjdWxhdGlvbkNhY2hlXV0gb2JqZWN0LCB1c2VmdWwgZm9yIGNhY2hpbmcgW1tWTm9kZV1dIHRyZWVzLlxuICogSW4gcHJhY3RpY2UsIGNhY2hpbmcgb2YgW1tWTm9kZV1dIHRyZWVzIGlzIG5vdCBuZWVkZWQsIGJlY2F1c2UgYWNoaWV2aW5nIDYwIGZyYW1lcyBwZXIgc2Vjb25kIGlzIGFsbW9zdCBuZXZlciBhIHByb2JsZW0uXG4gKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFtbQ2FsY3VsYXRpb25DYWNoZV1dLlxuICpcbiAqIEBwYXJhbSA8UmVzdWx0PiBUaGUgdHlwZSBvZiB0aGUgdmFsdWUgdGhhdCBpcyBjYWNoZWQuXG4gKi9cbiAgICBleHBvcnRzLmNyZWF0ZUNhY2hlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY2FjaGVkSW5wdXRzO1xuICAgICAgICB2YXIgY2FjaGVkT3V0Y29tZTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGludmFsaWRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjYWNoZWRPdXRjb21lID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIGNhY2hlZElucHV0cyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXN1bHQ6IGZ1bmN0aW9uIChpbnB1dHMsIGNhbGN1bGF0aW9uKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNhY2hlZElucHV0cykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGlucHV0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhY2hlZElucHV0c1tpXSAhPT0gaW5wdXRzW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGVkT3V0Y29tZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWNhY2hlZE91dGNvbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FjaGVkT3V0Y29tZSA9IGNhbGN1bGF0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIGNhY2hlZElucHV0cyA9IGlucHV0cztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhY2hlZE91dGNvbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfTtcbiAgICAvKipcbiAqIENyZWF0ZXMgYSB7QGxpbmsgTWFwcGluZ30gaW5zdGFuY2UgdGhhdCBrZWVwcyBhbiBhcnJheSBvZiByZXN1bHQgb2JqZWN0cyBzeW5jaHJvbml6ZWQgd2l0aCBhbiBhcnJheSBvZiBzb3VyY2Ugb2JqZWN0cy5cbiAqIFNlZSB7QGxpbmsgaHR0cDovL21hcXVldHRlanMub3JnL2RvY3MvYXJyYXlzLmh0bWx8V29ya2luZyB3aXRoIGFycmF5c30uXG4gKlxuICogQHBhcmFtIDxTb3VyY2U+ICAgICAgIFRoZSB0eXBlIG9mIHNvdXJjZSBpdGVtcy4gQSBkYXRhYmFzZS1yZWNvcmQgZm9yIGluc3RhbmNlLlxuICogQHBhcmFtIDxUYXJnZXQ+ICAgICAgIFRoZSB0eXBlIG9mIHRhcmdldCBpdGVtcy4gQSBbW0NvbXBvbmVudF1dIGZvciBpbnN0YW5jZS5cbiAqIEBwYXJhbSBnZXRTb3VyY2VLZXkgICBgZnVuY3Rpb24oc291cmNlKWAgdGhhdCBtdXN0IHJldHVybiBhIGtleSB0byBpZGVudGlmeSBlYWNoIHNvdXJjZSBvYmplY3QuIFRoZSByZXN1bHQgbXVzdCBlaXRoZXIgYmUgYSBzdHJpbmcgb3IgYSBudW1iZXIuXG4gKiBAcGFyYW0gY3JlYXRlUmVzdWx0ICAgYGZ1bmN0aW9uKHNvdXJjZSwgaW5kZXgpYCB0aGF0IG11c3QgY3JlYXRlIGEgbmV3IHJlc3VsdCBvYmplY3QgZnJvbSBhIGdpdmVuIHNvdXJjZS4gVGhpcyBmdW5jdGlvbiBpcyBpZGVudGljYWxcbiAqICAgICAgICAgICAgICAgICAgICAgICB0byB0aGUgYGNhbGxiYWNrYCBhcmd1bWVudCBpbiBgQXJyYXkubWFwKGNhbGxiYWNrKWAuXG4gKiBAcGFyYW0gdXBkYXRlUmVzdWx0ICAgYGZ1bmN0aW9uKHNvdXJjZSwgdGFyZ2V0LCBpbmRleClgIHRoYXQgdXBkYXRlcyBhIHJlc3VsdCB0byBhbiB1cGRhdGVkIHNvdXJjZS5cbiAqL1xuICAgIGV4cG9ydHMuY3JlYXRlTWFwcGluZyA9IGZ1bmN0aW9uIChnZXRTb3VyY2VLZXksIGNyZWF0ZVJlc3VsdCwgdXBkYXRlUmVzdWx0KSB7XG4gICAgICAgIHZhciBrZXlzID0gW107XG4gICAgICAgIHZhciByZXN1bHRzID0gW107XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN1bHRzOiByZXN1bHRzLFxuICAgICAgICAgICAgbWFwOiBmdW5jdGlvbiAobmV3U291cmNlcykge1xuICAgICAgICAgICAgICAgIHZhciBuZXdLZXlzID0gbmV3U291cmNlcy5tYXAoZ2V0U291cmNlS2V5KTtcbiAgICAgICAgICAgICAgICB2YXIgb2xkVGFyZ2V0cyA9IHJlc3VsdHMuc2xpY2UoKTtcbiAgICAgICAgICAgICAgICB2YXIgb2xkSW5kZXggPSAwO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmV3U291cmNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc291cmNlID0gbmV3U291cmNlc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNvdXJjZUtleSA9IG5ld0tleXNbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChzb3VyY2VLZXkgPT09IGtleXNbb2xkSW5kZXhdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRzW2ldID0gb2xkVGFyZ2V0c1tvbGRJbmRleF07XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVSZXN1bHQoc291cmNlLCBvbGRUYXJnZXRzW29sZEluZGV4XSwgaSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbGRJbmRleCsrO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMTsgaiA8IGtleXMubGVuZ3RoICsgMTsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNlYXJjaEluZGV4ID0gKG9sZEluZGV4ICsgaikgJSBrZXlzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoa2V5c1tzZWFyY2hJbmRleF0gPT09IHNvdXJjZUtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRzW2ldID0gb2xkVGFyZ2V0c1tzZWFyY2hJbmRleF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVJlc3VsdChuZXdTb3VyY2VzW2ldLCBvbGRUYXJnZXRzW3NlYXJjaEluZGV4XSwgaSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9sZEluZGV4ID0gc2VhcmNoSW5kZXggKyAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRzW2ldID0gY3JlYXRlUmVzdWx0KHNvdXJjZSwgaSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzdWx0cy5sZW5ndGggPSBuZXdTb3VyY2VzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBrZXlzID0gbmV3S2V5cztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9O1xuICAgIC8qKlxuICogQ3JlYXRlcyBhIFtbUHJvamVjdG9yXV0gaW5zdGFuY2UgdXNpbmcgdGhlIHByb3ZpZGVkIHByb2plY3Rpb25PcHRpb25zLlxuICpcbiAqIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgW1tQcm9qZWN0b3JdXS5cbiAqXG4gKiBAcGFyYW0gcHJvamVjdG9yT3B0aW9ucyAgIE9wdGlvbnMgdGhhdCBpbmZsdWVuY2UgaG93IHRoZSBET00gaXMgcmVuZGVyZWQgYW5kIHVwZGF0ZWQuXG4gKi9cbiAgICBleHBvcnRzLmNyZWF0ZVByb2plY3RvciA9IGZ1bmN0aW9uIChwcm9qZWN0b3JPcHRpb25zKSB7XG4gICAgICAgIHZhciBwcm9qZWN0b3I7XG4gICAgICAgIHZhciBwcm9qZWN0aW9uT3B0aW9ucyA9IGFwcGx5RGVmYXVsdFByb2plY3Rpb25PcHRpb25zKHByb2plY3Rvck9wdGlvbnMpO1xuICAgICAgICBwcm9qZWN0aW9uT3B0aW9ucy5ldmVudEhhbmRsZXJJbnRlcmNlcHRvciA9IGZ1bmN0aW9uIChwcm9wZXJ0eU5hbWUsIGV2ZW50SGFuZGxlciwgZG9tTm9kZSwgcHJvcGVydGllcykge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyBpbnRlcmNlcHQgZnVuY3Rpb24gY2FsbHMgKGV2ZW50IGhhbmRsZXJzKSB0byBkbyBhIHJlbmRlciBhZnRlcndhcmRzLlxuICAgICAgICAgICAgICAgIHByb2plY3Rvci5zY2hlZHVsZVJlbmRlcigpO1xuICAgICAgICAgICAgICAgIHJldHVybiBldmVudEhhbmRsZXIuYXBwbHkocHJvcGVydGllcy5iaW5kIHx8IHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgICAgICB2YXIgcmVuZGVyQ29tcGxldGVkID0gdHJ1ZTtcbiAgICAgICAgdmFyIHNjaGVkdWxlZDtcbiAgICAgICAgdmFyIHN0b3BwZWQgPSBmYWxzZTtcbiAgICAgICAgdmFyIHByb2plY3Rpb25zID0gW107XG4gICAgICAgIHZhciByZW5kZXJGdW5jdGlvbnMgPSBbXTtcbiAgICAgICAgLy8gbWF0Y2hlcyB0aGUgcHJvamVjdGlvbnMgYXJyYXlcbiAgICAgICAgdmFyIGRvUmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc2NoZWR1bGVkID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgaWYgKCFyZW5kZXJDb21wbGV0ZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47ICAgIC8vIFRoZSBsYXN0IHJlbmRlciB0aHJldyBhbiBlcnJvciwgaXQgc2hvdWxkIGJlIGxvZ2dlZCBpbiB0aGUgYnJvd3NlciBjb25zb2xlLlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVuZGVyQ29tcGxldGVkID0gZmFsc2U7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb2plY3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHVwZGF0ZWRWbm9kZSA9IHJlbmRlckZ1bmN0aW9uc1tpXSgpO1xuICAgICAgICAgICAgICAgIHByb2plY3Rpb25zW2ldLnVwZGF0ZSh1cGRhdGVkVm5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVuZGVyQ29tcGxldGVkID0gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgcHJvamVjdG9yID0ge1xuICAgICAgICAgICAgcmVuZGVyTm93OiBkb1JlbmRlcixcbiAgICAgICAgICAgIHNjaGVkdWxlUmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFzY2hlZHVsZWQgJiYgIXN0b3BwZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NoZWR1bGVkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGRvUmVuZGVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3RvcDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChzY2hlZHVsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUoc2NoZWR1bGVkKTtcbiAgICAgICAgICAgICAgICAgICAgc2NoZWR1bGVkID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdG9wcGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXN1bWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzdG9wcGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmVuZGVyQ29tcGxldGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBwcm9qZWN0b3Iuc2NoZWR1bGVSZW5kZXIoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhcHBlbmQ6IGZ1bmN0aW9uIChwYXJlbnROb2RlLCByZW5kZXJNYXF1ZXR0ZUZ1bmN0aW9uKSB7XG4gICAgICAgICAgICAgICAgcHJvamVjdGlvbnMucHVzaChleHBvcnRzLmRvbS5hcHBlbmQocGFyZW50Tm9kZSwgcmVuZGVyTWFxdWV0dGVGdW5jdGlvbigpLCBwcm9qZWN0aW9uT3B0aW9ucykpO1xuICAgICAgICAgICAgICAgIHJlbmRlckZ1bmN0aW9ucy5wdXNoKHJlbmRlck1hcXVldHRlRnVuY3Rpb24pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGluc2VydEJlZm9yZTogZnVuY3Rpb24gKGJlZm9yZU5vZGUsIHJlbmRlck1hcXVldHRlRnVuY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBwcm9qZWN0aW9ucy5wdXNoKGV4cG9ydHMuZG9tLmluc2VydEJlZm9yZShiZWZvcmVOb2RlLCByZW5kZXJNYXF1ZXR0ZUZ1bmN0aW9uKCksIHByb2plY3Rpb25PcHRpb25zKSk7XG4gICAgICAgICAgICAgICAgcmVuZGVyRnVuY3Rpb25zLnB1c2gocmVuZGVyTWFxdWV0dGVGdW5jdGlvbik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWVyZ2U6IGZ1bmN0aW9uIChkb21Ob2RlLCByZW5kZXJNYXF1ZXR0ZUZ1bmN0aW9uKSB7XG4gICAgICAgICAgICAgICAgcHJvamVjdGlvbnMucHVzaChleHBvcnRzLmRvbS5tZXJnZShkb21Ob2RlLCByZW5kZXJNYXF1ZXR0ZUZ1bmN0aW9uKCksIHByb2plY3Rpb25PcHRpb25zKSk7XG4gICAgICAgICAgICAgICAgcmVuZGVyRnVuY3Rpb25zLnB1c2gocmVuZGVyTWFxdWV0dGVGdW5jdGlvbik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVwbGFjZTogZnVuY3Rpb24gKGRvbU5vZGUsIHJlbmRlck1hcXVldHRlRnVuY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBwcm9qZWN0aW9ucy5wdXNoKGV4cG9ydHMuZG9tLnJlcGxhY2UoZG9tTm9kZSwgcmVuZGVyTWFxdWV0dGVGdW5jdGlvbigpLCBwcm9qZWN0aW9uT3B0aW9ucykpO1xuICAgICAgICAgICAgICAgIHJlbmRlckZ1bmN0aW9ucy5wdXNoKHJlbmRlck1hcXVldHRlRnVuY3Rpb24pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRldGFjaDogZnVuY3Rpb24gKHJlbmRlck1hcXVldHRlRnVuY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlbmRlckZ1bmN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVuZGVyRnVuY3Rpb25zW2ldID09PSByZW5kZXJNYXF1ZXR0ZUZ1bmN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJGdW5jdGlvbnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb2plY3Rpb25zLnNwbGljZShpLCAxKVswXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlbmRlck1hcXVldHRlRnVuY3Rpb24gd2FzIG5vdCBmb3VuZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcHJvamVjdG9yO1xuICAgIH07XG59KSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1tYXF1ZXR0ZS5qcy5tYXBcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL21hcXVldHRlL2Rpc3QvbWFxdWV0dGUuanNcbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==
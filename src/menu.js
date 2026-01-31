/**
 * RevealJS Menu Plugin
 * A slide menu plugin for Reveal.js
 * https://github.com/denehyg/reveal.js-menu
 */

// Global environment detection
const globalScope = typeof globalThis !== 'undefined' ? globalThis :
                    typeof window !== 'undefined' ? window :
                    typeof global !== 'undefined' ? global :
                    typeof self !== 'undefined' ? self : {};

// CommonJS module wrapper helper
function commonJSWrapper(moduleFunction, modulePath) {
    return moduleFunction(
        {
            path: modulePath,
            exports: {},
            require: function(dependency, path) {
                throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
            }
        },
        {}
    );
}

// Polyfills and compatibility helpers
const getGlobalEnvironment = function(obj) {
    return obj && obj.Math === Math && obj;
};

const globalEnvironment = getGlobalEnvironment(typeof globalThis === 'object' && globalThis) ||
                          getGlobalEnvironment(typeof window === 'object' && window) ||
                          getGlobalEnvironment(typeof self === 'object' && self) ||
                          getGlobalEnvironment(typeof globalScope === 'object' && globalScope) ||
                          Function('return this')();

const testFeature = function(testFunction) {
    try {
        return !!testFunction();
    } catch (error) {
        return true;
    }
};

const supportsDefineProperty = !testFeature(function() {
    return Object.defineProperty({}, 1, {
        get: function() { return 7; }
    })[1] !== 7;
});

// Object property utilities
const objectPrototype = {};
const propertyIsEnumerable = objectPrototype.propertyIsEnumerable;
const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

const propertyDescriptorHelper = {
    f: getOwnPropertyDescriptor && !propertyIsEnumerable.call({1: 2}, 1) ?
        function(key) {
            const descriptor = getOwnPropertyDescriptor(this, key);
            return !!descriptor && descriptor.enumerable;
        } : propertyIsEnumerable
};

const createPropertyDescriptor = function(flags, value) {
    return {
        enumerable: !(flags & 1),
        configurable: !(flags & 2),
        writable: !(flags & 4),
        value: value
    };
};

const toString = objectPrototype.toString;

const classOf = function(value) {
    return toString.call(value).slice(8, -1);
};

const stringPrototype = '';
const stringSplit = stringPrototype.split;

const indexedObject = testFeature(function() {
    return !Object('z').propertyIsEnumerable(0);
}) ? function(value) {
    return classOf(value) === 'String' ? stringSplit.call(value, '') : Object(value);
} : Object;

const requireObjectCoercible = function(value) {
    if (value == null) throw TypeError("Can't call method on " + value);
    return value;
};

const toIndexedObject = function(value) {
    return indexedObject(requireObjectCoercible(value));
};

const isObject = function(value) {
    return typeof value === 'object' ? value !== null : typeof value === 'function';
};

const toPrimitive = function(value, preferString) {
    if (!isObject(value)) return value;
    
    let converter, result;
    if (preferString && typeof (converter = value.toString) === 'function' && !isObject(result = converter.call(value))) {
        return result;
    }
    if (typeof (converter = value.valueOf) === 'function' && !isObject(result = converter.call(value))) {
        return result;
    }
    if (!preferString && typeof (converter = value.toString) === 'function' && !isObject(result = converter.call(value))) {
        return result;
    }
    
    throw TypeError("Can't convert object to primitive value");
};

const hasOwnProperty = objectPrototype.hasOwnProperty;

const has = function(object, key) {
    return hasOwnProperty.call(object, key);
};

const document = globalEnvironment.document;
const documentExists = isObject(document) && isObject(document.createElement);

const IE8_DOM_DEFINE = !supportsDefineProperty && !testFeature(function() {
    const element = documentExists ? document.createElement('div') : {};
    return Object.defineProperty(element, 'a', {
        get: function() { return 7; }
    }).a !== 7;
});

const nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

const getOwnPropertyDescriptorModule = {
    f: supportsDefineProperty ? nativeGetOwnPropertyDescriptor : function(object, key) {
        object = toIndexedObject(object);
        key = toPrimitive(key, true);
        
        if (IE8_DOM_DEFINE) {
            try {
                return nativeGetOwnPropertyDescriptor(object, key);
            } catch (error) {}
        }
        
        if (has(object, key)) {
            return createPropertyDescriptor(!propertyDescriptorHelper.f.call(object, key), object[key]);
        }
    }
};

const anObject = function(value) {
    if (!isObject(value)) throw TypeError(String(value) + ' is not an object');
    return value;
};

const nativeDefineProperty = Object.defineProperty;

const definePropertyModule = {
    f: supportsDefineProperty ? nativeDefineProperty : function(object, key, descriptor) {
        anObject(object);
        key = toPrimitive(key, true);
        anObject(descriptor);
        
        if (IE8_DOM_DEFINE) {
            try {
                return nativeDefineProperty(object, key, descriptor);
            } catch (error) {}
        }
        
        if ('get' in descriptor || 'set' in descriptor) {
            throw TypeError('Accessors not supported');
        }
        
        if ('value' in descriptor) {
            object[key] = descriptor.value;
        }
        
        return object;
    }
};

const createNonEnumerableProperty = supportsDefineProperty ? function(object, key, value) {
    return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function(object, key, value) {
    object[key] = value;
    return object;
};

const setGlobal = function(key, value) {
    try {
        createNonEnumerableProperty(globalEnvironment, key, value);
    } catch (error) {
        globalEnvironment[key] = value;
    }
    return value;
};

const shared = globalEnvironment['__core-js_shared__'] || setGlobal('__core-js_shared__', {});

const functionToString = Function.toString;

if (typeof shared.inspectSource !== 'function') {
    shared.inspectSource = function(func) {
        return functionToString.call(func);
    };
}

const inspectSource = shared.inspectSource;

const WeakMap = globalEnvironment.WeakMap;
const nativeWeakMapIsNative = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));

const sharedStore = function(key, value) {
    return shared[key] || (shared[key] = value !== undefined ? value : {});
};

sharedStore('versions', []).push({
    version: '3.6.5',
    mode: 'global',
    copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
});

let uid = 0;
const random = Math.random();

const uniqueId = function(key) {
    return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++uid + random).toString(36);
};

const keys = sharedStore('keys');
const hiddenKeys = {};

let weakMapSet, weakMapGet, weakMapHas;
let stateKey;

if (nativeWeakMapIsNative) {
    const store = new WeakMap();
    const weakMapGetMethod = store.get;
    const weakMapHasMethod = store.has;
    const weakMapSetMethod = store.set;
    
    weakMapSet = function(target, state) {
        weakMapSetMethod.call(store, target, state);
        return state;
    };
    
    weakMapGet = function(target) {
        return weakMapGetMethod.call(store, target) || {};
    };
    
    weakMapHas = function(target) {
        return weakMapHasMethod.call(store, target);
    };
} else {
    stateKey = keys['state'] || (keys['state'] = uniqueId('state'));
    hiddenKeys[stateKey] = true;
    
    weakMapSet = function(target, state) {
        createNonEnumerableProperty(target, stateKey, state);
        return state;
    };
    
    weakMapGet = function(target) {
        return has(target, stateKey) ? target[stateKey] : {};
    };
    
    weakMapHas = function(target) {
        return has(target, stateKey);
    };
}

const internalState = {
    set: weakMapSet,
    get: weakMapGet,
    has: weakMapHas,
    enforce: function(target) {
        return weakMapHas(target) ? weakMapGet(target) : weakMapSet(target, {});
    },
    getterFor: function(type) {
        return function(target) {
            let state;
            if (!isObject(target) || (state = weakMapGet(target)).type !== type) {
                throw TypeError('Incompatible receiver, ' + type + ' required');
            }
            return state;
        };
    }
};

const redefine = (function(module) {
    const getInternalState = internalState.get;
    const enforceInternalState = internalState.enforce;
    const template = String(String).split('String');
    
    module.exports = function(target, key, value, options) {
        const unsafe = options ? !!options.unsafe : false;
        const enumerable = options ? !!options.enumerable : false;
        const noTargetGet = options ? !!options.noTargetGet : false;
        
        if (typeof value === 'function') {
            if (typeof key !== 'string' || has(value, 'name')) {
                createNonEnumerableProperty(value, 'name', key);
            }
            enforceInternalState(value).source = template.join(typeof key === 'string' ? key : '');
        }
        
        if (target === globalEnvironment) {
            if (enumerable) {
                target[key] = value;
            } else {
                setGlobal(key, value);
            }
            return;
        }
        
        if (!unsafe) {
            delete target[key];
        } else if (!noTargetGet && target[key]) {
            enumerable = true;
        }
        
        if (enumerable) {
            target[key] = value;
        } else {
            createNonEnumerableProperty(target, key, value);
        }
    };
    
    Function.prototype.toString = function() {
        return typeof this === 'function' && getInternalState(this).source || inspectSource(this);
    };
    
    return module.exports;
})({});

const path = globalEnvironment;

const aFunction = function(value) {
    if (typeof value !== 'function') throw TypeError(String(value) + ' is not a function');
    return value;
};

const getBuiltIn = function(namespace, method) {
    return arguments.length < 2 ? 
        (typeof path[namespace] === 'function' ? path[namespace] : undefined) ||
        (typeof globalEnvironment[namespace] === 'function' ? globalEnvironment[namespace] : undefined) :
        path[namespace] && path[namespace][method] || globalEnvironment[namespace] && globalEnvironment[namespace][method];
};

const ceil = Math.ceil;
const floor = Math.floor;

const toInteger = function(value) {
    return isNaN(value = +value) ? 0 : (value > 0 ? floor : ceil)(value);
};

const min = Math.min;

const toLength = function(value) {
    return value > 0 ? min(toInteger(value), 0x1FFFFFFFFFFFFF) : 0;
};

const max = Math.max;

const toAbsoluteIndex = function(index, length) {
    const integerIndex = toInteger(index);
    return integerIndex < 0 ? max(integerIndex + length, 0) : min(integerIndex, length);
};

const createMethod = function(isIncludes) {
    return function(array, searchElement, fromIndex) {
        const object = toIndexedObject(array);
        const length = toLength(object.length);
        const index = toAbsoluteIndex(fromIndex, length);
        let value;
        
        if (isIncludes && searchElement != searchElement) {
            while (length > index) {
                value = object[index++];
                if (value != value) return true;
            }
        } else {
            for (; length > index; index++) {
                if ((isIncludes || index in object) && object[index] === searchElement) {
                    return isIncludes || index || 0;
                }
            }
        }
        
        return !isIncludes && -1;
    };
};

const arrayIncludes = {
    includes: createMethod(true),
    indexOf: createMethod(false)
};

const indexOf = arrayIncludes.indexOf;

const objectKeys = ['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'];
const objectKeysInternal = objectKeys.concat('length', 'prototype');

const getOwnPropertyNamesModule = {
    f: Object.getOwnPropertyNames || function(object) {
        const result = [];
        const O = toIndexedObject(object);
        let key;
        let index = 0;
        
        for (key in O) {
            if (!has(hiddenKeys, key) && has(O, key)) {
                result.push(key);
            }
        }
        
        while (objectKeysInternal.length > index) {
            key = objectKeysInternal[index++];
            if (has(O, key) && !~indexOf(result, key)) {
                result.push(key);
            }
        }
        
        return result;
    }
};

const getOwnPropertySymbolsModule = {
    f: Object.getOwnPropertySymbols
};

const ownKeys = getBuiltIn('Reflect', 'ownKeys') || function(target) {
    const keys = getOwnPropertyNamesModule.f(anObject(target));
    const getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
    return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(target)) : keys;
};

const copyConstructorProperties = function(target, source) {
    const keys = ownKeys(source);
    const defineProperty = definePropertyModule.f;
    const getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
    
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (!has(target, key)) {
            defineProperty(target, key, getOwnPropertyDescriptor(source, key));
        }
    }
};

const REPLACE_SUPPORTS_NAMED_GROUPS = !testFeature(function() {
    const re = /./;
    re.exec = function() {
        const result = [];
        result.groups = { a: '7' };
        return result;
    };
    return ''.replace(re, '$<a>') !== '7';
});

const REPLACE_KEEPS_$0 = (function() {
    return 'a'.replace(/./, '$0') === '$0';
})();

const REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function() {
    if (/./[Symbol.replace]) {
        return /./[Symbol.replace]('a', '$0') === '';
    }
    return false;
})();

// Main menu plugin export
export default function() {
    let revealInstance;
    let revealConfig;
    let menuOptions = {};
    let ieVersion;
    let isMenuInitialized = false;
    
    // Detect IE version
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ieMatch = /(msie) ([\w.]+)/.exec(userAgent);
    ieVersion = ieMatch && ieMatch[1] === 'msie' ? parseFloat(ieMatch[2]) : null;
    
    let isMouseMoving = false;
    
    /**
     * Initialize menu configuration
     */
    function initializeConfiguration(config) {
        menuOptions = config.menu || {};
        
        // Set default path
        menuOptions.path = menuOptions.path || (function() {
            let path;
            const menuScript = document.querySelector('script[src$="menu.js"]');
            
            if (menuScript) {
                path = menuScript.src.slice(0, -7);
            } else {
                path = import.meta.url.slice(0, import.meta.url.lastIndexOf('/') + 1);
            }
            
            return path;
        })() || 'plugin/menu/';
        
        if (!menuOptions.path.endsWith('/')) {
            menuOptions.path += '/';
        }
        
        // Set defaults for all options
        if (menuOptions.side === undefined) menuOptions.side = 'left';
        if (menuOptions.numbers === undefined) menuOptions.numbers = false;
        if (typeof menuOptions.titleSelector !== 'string') menuOptions.titleSelector = 'h1, h2, h3, h4, h5';
        if (menuOptions.hideMissingTitles === undefined) menuOptions.hideMissingTitles = false;
        if (menuOptions.useTextContentForMissingTitles === undefined) menuOptions.useTextContentForMissingTitles = false;
        if (menuOptions.markers === undefined) menuOptions.markers = true;
        
        // Themes configuration
        if (typeof menuOptions.themesPath !== 'string') menuOptions.themesPath = 'dist/theme/';
        if (!menuOptions.themesPath.endsWith('/')) menuOptions.themesPath += '/';
        
        if (!querySelector('link#theme')) {
            menuOptions.themes = false;
        }
        
        if (menuOptions.themes === true) {
            menuOptions.themes = [
                { name: 'Black', theme: menuOptions.themesPath + 'black.css' },
                { name: 'White', theme: menuOptions.themesPath + 'white.css' },
                { name: 'League', theme: menuOptions.themesPath + 'league.css' },
                { name: 'Sky', theme: menuOptions.themesPath + 'sky.css' },
                { name: 'Beige', theme: menuOptions.themesPath + 'beige.css' },
                { name: 'Simple', theme: menuOptions.themesPath + 'simple.css' },
                { name: 'Serif', theme: menuOptions.themesPath + 'serif.css' },
                { name: 'Blood', theme: menuOptions.themesPath + 'blood.css' },
                { name: 'Night', theme: menuOptions.themesPath + 'night.css' },
                { name: 'Moon', theme: menuOptions.themesPath + 'moon.css' },
                { name: 'Solarized', theme: menuOptions.themesPath + 'solarized.css' }
            ];
        } else if (!Array.isArray(menuOptions.themes)) {
            menuOptions.themes = false;
        }
        
        // Transitions configuration
        if (menuOptions.transitions === undefined) menuOptions.transitions = false;
        
        if (menuOptions.transitions === true) {
            menuOptions.transitions = ['None', 'Fade', 'Slide', 'Convex', 'Concave', 'Zoom'];
        } else if (menuOptions.transitions !== false && 
                  (!Array.isArray(menuOptions.transitions) || 
                   !menuOptions.transitions.every(t => typeof t === 'string'))) {
            console.error("reveal.js-menu error: transitions config value must be 'true' or an array of strings, eg ['None', 'Fade', 'Slide')");
            menuOptions.transitions = false;
        }
        
        // Disable transitions for IE9 and below
        if (ieVersion && ieVersion <= 9) {
            menuOptions.transitions = false;
        }
        
        // Set remaining defaults
        if (menuOptions.openButton === undefined) menuOptions.openButton = true;
        if (menuOptions.openSlideNumber === undefined) menuOptions.openSlideNumber = false;
        if (menuOptions.keyboard === undefined) menuOptions.keyboard = true;
        if (menuOptions.sticky === undefined) menuOptions.sticky = false;
        if (menuOptions.autoOpen === undefined) menuOptions.autoOpen = true;
        if (menuOptions.delayInit === undefined) menuOptions.delayInit = false;
        if (menuOptions.openOnInit === undefined) menuOptions.openOnInit = false;
    }
    
    /**
     * Disable mouse movement tracking
     */
    function disableMouseMoving() {
        isMouseMoving = false;
    }
    
    /**
     * Enable mouse movement tracking after first move
     */
    function enableMouseMovingAfterFirstMove() {
        const slideMenu = querySelector('nav.slide-menu');
        slideMenu.addEventListener('mousemove', function handleFirstMove(event) {
            slideMenu.removeEventListener('mousemove', handleFirstMove);
            isMouseMoving = true;
        });
    }
    
    /**
     * Calculate vertical scroll offset needed for element
     */
    function getVerticalScrollOffset(element) {
        const elementTop = getOffset(element).top - element.offsetParent.offsetTop;
        
        if (elementTop < 0) {
            return -elementTop;
        }
        
        const elementBottom = element.offsetParent.offsetHeight - 
                             (element.offsetTop - element.offsetParent.scrollTop + element.offsetHeight);
        
        return elementBottom < 0 ? elementBottom : 0;
    }
    
    /**
     * Get element offset position
     */
    function getOffset(element) {
        let top = 0;
        let left = 0;
        
        while (element && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop)) {
            top += element.offsetTop - element.scrollTop;
            left += element.offsetLeft - element.scrollLeft;
            element = element.offsetParent;
        }
        
        return { top: top, left: left };
    }
    
    /**
     * Scroll element into view
     */
    function scrollIntoView(element) {
        const offset = getVerticalScrollOffset(element);
        
        if (offset) {
            disableMouseMoving();
            element.scrollIntoView(offset > 0);
            enableMouseMovingAfterFirstMove();
        }
    }
    
    /**
     * Scroll to top of element
     */
    function scrollToTop(element) {
        disableMouseMoving();
        element.offsetParent.scrollTop = element.offsetTop;
        enableMouseMovingAfterFirstMove();
    }
    
    /**
     * Scroll to bottom of element
     */
    function scrollToBottom(element) {
        disableMouseMoving();
        element.offsetParent.scrollTop = element.offsetTop - element.offsetParent.offsetHeight + element.offsetHeight;
        enableMouseMovingAfterFirstMove();
    }
    
    /**
     * Select and highlight a menu item
     */
    function selectMenuItem(element) {
        element.classList.add('selected');
        scrollIntoView(element);
        
        if (menuOptions.sticky && menuOptions.autoOpen) {
            activateMenuItem(element);
        }
    }
    
    /**
     * Handle keyboard navigation
     */
    function handleKeyboardEvent(event) {
        if (!isMenuOpen()) return;
        
        event.stopImmediatePropagation();
        
        switch (event.keyCode) {
            case 72: // H
            case 37: // Left arrow
                navigateToPreviousPanel();
                break;
                
            case 76: // L
            case 39: // Right arrow
                navigateToNextPanel();
                break;
                
            case 75: // K
            case 38: // Up arrow
                navigateToPreviousItem();
                break;
                
            case 74: // J
            case 40: // Down arrow
                navigateToNextItem();
                break;
                
            case 33: // Page Up
            case 85: // U
                pageUp();
                break;
                
            case 34: // Page Down
            case 68: // D
                pageDown();
                break;
                
            case 36: // Home
                navigateToFirstItem();
                break;
                
            case 35: // End
                navigateToLastItem();
                break;
                
            case 32: // Space
            case 13: // Enter
                activateSelectedItem();
                break;
                
            case 27: // Escape
                closeMenu(null, true);
                break;
        }
    }
    
    /**
     * Navigate to previous toolbar panel
     */
    function navigateToPreviousPanel() {
        const currentButton = querySelector('.active-toolbar-button');
        const currentIndex = parseInt(currentButton.getAttribute('data-button'));
        const previousIndex = currentIndex - 1 < 0 ? toolbarButtonCount - 1 : currentIndex - 1;
        const previousPanel = querySelector(`.toolbar-panel-button[data-button="${previousIndex}"]`).getAttribute('data-panel');
        switchPanel(null, previousPanel);
    }
    
    /**
     * Navigate to next toolbar panel
     */
    function navigateToNextPanel() {
        const currentButton = querySelector('.active-toolbar-button');
        const currentIndex = parseInt(currentButton.getAttribute('data-button'));
        const nextIndex = (currentIndex + 1) % toolbarButtonCount;
        const nextPanel = querySelector(`.toolbar-panel-button[data-button="${nextIndex}"]`).getAttribute('data-panel');
        switchPanel(null, nextPanel);
    }
    
    /**
     * Navigate to previous menu item
     */
    function navigateToPreviousItem() {
        const selectedItem = querySelector('.active-menu-panel .slide-menu-items li.selected') ||
                            querySelector('.active-menu-panel .slide-menu-items li.active');
        
        if (selectedItem) {
            querySelectorAll('.active-menu-panel .slide-menu-items li').forEach(item => {
                item.classList.remove('selected');
            });
            
            const currentIndex = parseInt(selectedItem.getAttribute('data-item'));
            const previousItem = querySelector(`.active-menu-panel .slide-menu-items li[data-item="${currentIndex - 1}"]`) || selectedItem;
            selectMenuItem(previousItem);
        } else {
            const firstItem = querySelector('.active-menu-panel .slide-menu-items li.slide-menu-item');
            if (firstItem) selectMenuItem(firstItem);
        }
    }
    
    /**
     * Navigate to next menu item
     */
    function navigateToNextItem() {
        const selectedItem = querySelector('.active-menu-panel .slide-menu-items li.selected') ||
                            querySelector('.active-menu-panel .slide-menu-items li.active');
        
        if (selectedItem) {
            querySelectorAll('.active-menu-panel .slide-menu-items li').forEach(item => {
                item.classList.remove('selected');
            });
            
            const currentIndex = parseInt(selectedItem.getAttribute('data-item'));
            const nextItem = querySelector(`.active-menu-panel .slide-menu-items li[data-item="${currentIndex + 1}"]`) || selectedItem;
            selectMenuItem(nextItem);
        } else {
            const firstItem = querySelector('.active-menu-panel .slide-menu-items li.slide-menu-item');
            if (firstItem) selectMenuItem(firstItem);
        }
    }
    
    /**
     * Page up in menu
     */
    function pageUp() {
        const itemsAbove = querySelectorAll('.active-menu-panel .slide-menu-items li').filter(item => {
            return getVerticalScrollOffset(item) > 0;
        });
        
        const itemsVisible = querySelectorAll('.active-menu-panel .slide-menu-items li').filter(item => {
            return getVerticalScrollOffset(item) === 0;
        });
        
        let targetItem = itemsAbove.length > 0 && 
                        Math.abs(getVerticalScrollOffset(itemsAbove[itemsAbove.length - 1])) < itemsAbove[itemsAbove.length - 1].clientHeight ?
                        itemsAbove[itemsAbove.length - 1] : itemsVisible[0];
        
        if (targetItem) {
            if (targetItem.classList.contains('selected') && itemsAbove.length > 0) {
                scrollToBottom(targetItem);
                const newVisibleItems = querySelectorAll('.active-menu-panel .slide-menu-items li').filter(item => {
                    return getVerticalScrollOffset(item) === 0;
                });
                targetItem = newVisibleItems[0] === targetItem ? itemsAbove[itemsAbove.length - 1] : newVisibleItems[0];
            }
            
            querySelectorAll('.active-menu-panel .slide-menu-items li').forEach(item => {
                item.classList.remove('selected');
            });
            
            selectMenuItem(targetItem);
            scrollToTop(targetItem);
        }
    }
    
    /**
     * Page down in menu
     */
    function pageDown() {
        const itemsVisible = querySelectorAll('.active-menu-panel .slide-menu-items li').filter(item => {
            return getVerticalScrollOffset(item) === 0;
        });
        
        const itemsBelow = querySelectorAll('.active-menu-panel .slide-menu-items li').filter(item => {
            return getVerticalScrollOffset(item) < 0;
        });
        
        let targetItem = itemsBelow.length > 0 && 
                        Math.abs(getVerticalScrollOffset(itemsBelow[0])) < itemsBelow[0].clientHeight ?
                        itemsBelow[0] : itemsVisible[itemsVisible.length - 1];
        
        if (targetItem) {
            if (targetItem.classList.contains('selected') && itemsBelow.length > 0) {
                scrollToTop(targetItem);
                const newVisibleItems = querySelectorAll('.active-menu-panel .slide-menu-items li').filter(item => {
                    return getVerticalScrollOffset(item) === 0;
                });
                targetItem = newVisibleItems[newVisibleItems.length - 1] === targetItem ? itemsBelow[0] : newVisibleItems[newVisibleItems.length - 1];
            }
            
            querySelectorAll('.active-menu-panel .slide-menu-items li').forEach(item => {
                item.classList.remove('selected');
            });
            
            selectMenuItem(targetItem);
            scrollToBottom(targetItem);
        }
    }
    
    /**
     * Navigate to first menu item
     */
    function navigateToFirstItem() {
        querySelectorAll('.active-menu-panel .slide-menu-items li').forEach(item => {
            item.classList.remove('selected');
        });
        
        const firstItem = querySelector('.active-menu-panel .slide-menu-items li:first-of-type');
        if (firstItem) {
            firstItem.classList.add('selected');
            scrollIntoView(firstItem);
        }
    }
    
    /**
     * Navigate to last menu item
     */
    function navigateToLastItem() {
        querySelectorAll('.active-menu-panel .slide-menu-items li').forEach(item => {
            item.classList.remove('selected');
        });
        
        const lastItem = querySelector('.active-menu-panel .slide-menu-items:last-of-type li:last-of-type');
        if (lastItem) {
            lastItem.classList.add('selected');
            scrollIntoView(lastItem);
        }
    }
    
    /**
     * Activate selected menu item
     */
    function activateSelectedItem() {
        const selectedItem = querySelector('.active-menu-panel .slide-menu-items li.selected');
        if (selectedItem) {
            activateMenuItem(selectedItem, true);
        }
    }
    
    /**
     * Open the menu
     */
    function openMenu(event) {
        if (event) event.preventDefault();
        if (isMenuOpen()) return;
        
        querySelector('body').classList.add('slide-menu-active');
        querySelector('.reveal').classList.add('has-' + menuOptions.effect + '-' + menuOptions.side);
        querySelector('.slide-menu').classList.add('active');
        querySelector('.slide-menu-overlay').classList.add('active');
        
        // Update theme highlighting
        if (menuOptions.themes) {
            querySelectorAll('div[data-panel="Themes"] li').forEach(item => {
                item.classList.remove('active');
            });
            
            const currentTheme = querySelector('link#theme').getAttribute('href');
            querySelectorAll(`li[data-theme="${currentTheme}"]`).forEach(item => {
                item.classList.add('active');
            });
        }
        
        // Update transition highlighting
        if (menuOptions.transitions) {
            querySelectorAll('div[data-panel="Transitions"] li').forEach(item => {
                item.classList.remove('active');
            });
            
            querySelectorAll(`li[data-transition="${revealConfig.transition}"]`).forEach(item => {
                item.classList.add('active');
            });
        }
        
        // Scroll to active items
        querySelectorAll('.slide-menu-panel li.active').forEach(item => {
            item.classList.add('selected');
            scrollIntoView(item);
        });
    }
    
    /**
     * Close the menu
     */
    function closeMenu(event, force) {
        if (event) event.preventDefault();
        
        if (menuOptions.sticky && !force) return;
        
        querySelector('body').classList.remove('slide-menu-active');
        querySelector('.reveal').classList.remove('has-' + menuOptions.effect + '-' + menuOptions.side);
        querySelector('.slide-menu').classList.remove('active');
        querySelector('.slide-menu-overlay').classList.remove('active');
        
        querySelectorAll('.slide-menu-panel li.selected').forEach(item => {
            item.classList.remove('selected');
        });
    }
    
    /**
     * Toggle menu open/close
     */
    function toggleMenu(event) {
        if (isMenuOpen()) {
            closeMenu(event, true);
        } else {
            openMenu(event);
        }
    }
    
    /**
     * Check if menu is open
     */
    function isMenuOpen() {
        return querySelector('body').classList.contains('slide-menu-active');
    }
    
    /**
     * Switch to a different panel
     */
    function switchPanel(event, panelName) {
        openMenu(event);
        
        let targetPanel = panelName;
        if (typeof panelName !== 'string') {
            targetPanel = event.currentTarget.getAttribute('data-panel');
        }
        
        querySelector('.slide-menu-toolbar > li.active-toolbar-button').classList.remove('active-toolbar-button');
        querySelector(`li[data-panel="${targetPanel}"]`).classList.add('active-toolbar-button');
        
        querySelector('.slide-menu-panel.active-menu-panel').classList.remove('active-menu-panel');
        querySelector(`div[data-panel="${targetPanel}"]`).classList.add('active-menu-panel');
    }
    
    /**
     * Activate a menu item (navigate to slide, change theme, etc.)
     */
    function activateMenuItem(element, closeAfter) {
        const slideH = parseInt(element.getAttribute('data-slide-h'));
        const slideV = parseInt(element.getAttribute('data-slide-v'));
        const theme = element.getAttribute('data-theme');
        const highlightTheme = element.getAttribute('data-highlight-theme');
        const transition = element.getAttribute('data-transition');
        
        // Navigate to slide if slide indices are present
        if (!isNaN(slideH) && !isNaN(slideV)) {
            revealInstance.slide(slideH, slideV);
        }
        
        // Change theme if specified
        if (theme) {
            changeTheme('theme', theme);
        }
        
        // Change highlight theme if specified
        if (highlightTheme) {
            changeTheme('highlight-theme', highlightTheme);
        }
        
        // Change transition if specified
        if (transition) {
            revealInstance.configure({ transition: transition });
        }
        
        // Handle links
        const link = querySelector('a', element);
        if (link) {
            const shouldFollowLink = closeAfter || 
                                    !menuOptions.sticky || 
                                    (menuOptions.autoOpen && link.href.startsWith('#')) ||
                                    link.href.startsWith(window.location.origin + window.location.pathname + '#');
            
            if (shouldFollowLink) {
                link.click();
            }
        }
        
        closeMenu();
    }
    
    /**
     * Handle menu item click
     */
    function handleMenuItemClick(event) {
        if (event.target.nodeName !== 'A') {
            event.preventDefault();
        }
        activateMenuItem(event.currentTarget);
    }
    
    /**
     * Update active slide indicators
     */
    function updateActiveSlide() {
        const state = revealInstance.getState();
        
        querySelectorAll('li.slide-menu-item, li.slide-menu-item-vertical').forEach(item => {
            item.classList.remove('past');
            item.classList.remove('active');
            item.classList.remove('future');
            
            const itemH = parseInt(item.getAttribute('data-slide-h'));
            const itemV = parseInt(item.getAttribute('data-slide-v'));
            
            if (itemH < state.indexh || (itemH === state.indexh && itemV < state.indexv)) {
                item.classList.add('past');
            } else if (itemH === state.indexh && itemV === state.indexv) {
                item.classList.add('active');
            } else {
                item.classList.add('future');
            }
        });
    }
    
    /**
     * Synchronize font family with reveal presentation
     */
    function syncFontFamily() {
        const revealStyles = window.getComputedStyle(querySelector('.reveal'));
        querySelector('.slide-menu').style.fontFamily = revealStyles.fontFamily;
    }
    
    let toolbarButtonCount = 0;
    
    /**
     * Initialize the menu UI
     */
    function initializeMenu() {
        if (isMenuInitialized) return;
        
        /**
         * Create a toolbar button
         */
        function createToolbarButton(label, panelName, icon, iconClass, clickHandler, isActive) {
            const attributes = {
                'data-button': '' + toolbarButtonCount++,
                'class': 'toolbar-panel-button' + (isActive ? ' active-toolbar-button' : '')
            };
            
            if (panelName) {
                attributes['data-panel'] = panelName;
            }
            
            const button = createElement('li', attributes);
            
            // Add icon
            if (icon.startsWith('fa-')) {
                button.appendChild(createElement('i', { 'class': iconClass + ' ' + icon }));
            } else {
                button.innerHTML = icon + '</i>';
            }
            
            button.appendChild(createElement('br'), querySelector('i', button));
            button.appendChild(createElement('span', { 'class': 'slide-menu-toolbar-label' }, label), querySelector('i', button));
            
            button.onclick = clickHandler;
            toolbar.appendChild(button);
            
            return button;
        }
        
        /**
         * Create a menu item for a slide
         */
        function createSlideMenuItem(itemClass, slideElement, itemIndex, horizontalIndex, verticalIndex) {
            /**
             * Get text content from selector
             */
            function getTextContent(selector, searchInSlide) {
                if (selector === '') return null;
                
                const element = searchInSlide ? 
                               querySelector(selector, slideElement) : 
                               querySelector(selector);
                
                return element ? element.textContent : null;
            }
            
            // Get slide title
            let slideTitle = slideElement.getAttribute('data-menu-title') ||
                           getTextContent('.menu-title', slideElement) ||
                           getTextContent(menuOptions.titleSelector, slideElement);
            
            // Handle missing titles
            if (!slideTitle && menuOptions.useTextContentForMissingTitles) {
                slideTitle = slideElement.textContent.trim();
                if (slideTitle) {
                    slideTitle = slideTitle
                        .split('\n')
                        .map(line => line.trim())
                        .join(' ')
                        .trim()
                        .replace(/^(.{16}[^\s]*).*/, '$1')
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/"/g, '&quot;')
                        .replace(/'/g, '&#039;') + '...';
                }
            }
            
            if (!slideTitle) {
                if (menuOptions.hideMissingTitles) return '';
                itemClass += ' no-title';
                slideTitle = 'Slide ' + (itemIndex + 1);
            }
            
            // Create list item
            const menuItem = createElement('li', {
                'class': itemClass,
                'data-item': itemIndex,
                'data-slide-h': horizontalIndex,
                'data-slide-v': verticalIndex === undefined ? 0 : verticalIndex
            });
            
            // Add status markers
            if (menuOptions.markers) {
                menuItem.appendChild(createElement('i', { 'class': 'fas fa-check-circle fa-fw past' }));
                menuItem.appendChild(createElement('i', { 'class': 'fas fa-arrow-alt-circle-right fa-fw active' }));
                menuItem.appendChild(createElement('i', { 'class': 'far fa-circle fa-fw future' }));
            }
            
            // Add slide numbers
            if (menuOptions.numbers) {
                const numberParts = [];
                let numberFormat = 'h.v';
                
                if (typeof menuOptions.numbers === 'string') {
                    numberFormat = menuOptions.numbers;
                } else if (typeof revealConfig.slideNumber === 'string') {
                    numberFormat = revealConfig.slideNumber;
                }
                
                switch (numberFormat) {
                    case 'c':
                        numberParts.push(itemIndex + 1);
                        break;
                    case 'c/t':
                        numberParts.push(itemIndex + 1, '/', revealInstance.getTotalSlides());
                        break;
                    case 'h/v':
                        numberParts.push(horizontalIndex + 1);
                        if (typeof verticalIndex === 'number' && !isNaN(verticalIndex)) {
                            numberParts.push('/', verticalIndex + 1);
                        }
                        break;
                    default:
                        numberParts.push(horizontalIndex + 1);
                        if (typeof verticalIndex === 'number' && !isNaN(verticalIndex)) {
                            numberParts.push('.', verticalIndex + 1);
                        }
                }
                
                menuItem.appendChild(createElement('span', { 'class': 'slide-menu-item-number' }, numberParts.join('') + '. '));
            }
            
            menuItem.appendChild(createElement('span', { 'class': 'slide-menu-item-title' }, slideTitle));
            
            return menuItem;
        }
        
        /**
         * Handle mouse enter on menu item
         */
        function handleMenuItemHover(event) {
            if (!isMouseMoving) return;
            
            querySelectorAll('.active-menu-panel .slide-menu-items li.selected').forEach(item => {
                item.classList.remove('selected');
            });
            
            event.currentTarget.classList.add('selected');
        }
        
        // Create menu structure
        const revealElement = querySelector('.reveal').parentElement;
        const menuWrapper = createElement('div', { 'class': 'slide-menu-wrapper' });
        revealElement.appendChild(menuWrapper);
        
        const slideMenu = createElement('nav', { 'class': 'slide-menu slide-menu--' + menuOptions.side });
        
        // Handle menu width
        if (typeof menuOptions.width === 'string') {
            const widthPresets = ['normal', 'wide', 'third', 'half', 'full'];
            if (widthPresets.indexOf(menuOptions.width) !== -1) {
                slideMenu.classList.add('slide-menu--' + menuOptions.width);
            } else {
                slideMenu.classList.add('slide-menu--custom');
                slideMenu.style.width = menuOptions.width;
            }
        }
        
        menuWrapper.appendChild(slideMenu);
        syncFontFamily();
        
        // Create overlay
        const overlay = createElement('div', { 'class': 'slide-menu-overlay' });
        menuWrapper.appendChild(overlay);
        overlay.onclick = function() {
            closeMenu(null, true);
        };
        
        // Create toolbar
        const toolbar = createElement('ol', { 'class': 'slide-menu-toolbar' });
        querySelector('.slide-menu').appendChild(toolbar);
        
        // Add toolbar buttons
        createToolbarButton('Slides', 'Slides', 'fa-images', 'fas', switchPanel, true);
        
        // Add custom panels
        if (menuOptions.custom) {
            menuOptions.custom.forEach((customPanel, index) => {
                createToolbarButton(customPanel.title, 'Custom' + index, customPanel.icon, null, switchPanel);
            });
        }
        
        // Add themes button
        if (menuOptions.themes) {
            createToolbarButton('Themes', 'Themes', 'fa-adjust', 'fas', switchPanel);
        }
        
        // Add transitions button
        if (menuOptions.transitions) {
            createToolbarButton('Transitions', 'Transitions', 'fa-sticky-note', 'fas', switchPanel);
        }
        
        // Add close button
        const closeButton = createElement('li', { 'id': 'close', 'class': 'toolbar-panel-button' });
        closeButton.appendChild(createElement('i', { 'class': 'fas fa-times' }));
        closeButton.appendChild(createElement('br'));
        closeButton.appendChild(createElement('span', { 'class': 'slide-menu-toolbar-label' }, 'Close'));
        closeButton.onclick = function() {
            closeMenu(null, true);
        };
        toolbar.appendChild(closeButton);
        
        // Build slides panel
        (function buildSlidesPanel() {
            // Wait for markdown slides to be parsed
            if (document.querySelector('section[data-markdown]:not([data-markdown-parsed])')) {
                setTimeout(buildSlidesPanel, 100);
                return;
            }
            
            const slidesPanel = createElement('div', {
                'data-panel': 'Slides',
                'class': 'slide-menu-panel active-menu-panel'
            });
            slidesPanel.appendChild(createElement('ul', { 'class': 'slide-menu-items' }));
            slideMenu.appendChild(slidesPanel);
            
            const slidesList = querySelector('.slide-menu-panel[data-panel="Slides"] > .slide-menu-items');
            let itemIndex = 0;
            
            // Iterate through slides
            querySelectorAll('.slides > section').forEach((section, horizontalIndex) => {
                const verticalSlides = querySelectorAll('section', section);
                
                if (verticalSlides.length > 0) {
                    // Has vertical slides
                    verticalSlides.forEach((verticalSlide, verticalIndex) => {
                        const itemClass = verticalIndex === 0 ? 'slide-menu-item' : 'slide-menu-item-vertical';
                        const menuItem = createSlideMenuItem(itemClass, verticalSlide, itemIndex, horizontalIndex, verticalIndex);
                        
                        if (menuItem) {
                            slidesList.appendChild(menuItem);
                        }
                        itemIndex++;
                    });
                } else {
                    // Single slide
                    const menuItem = createSlideMenuItem('slide-menu-item', section, itemIndex, horizontalIndex);
                    
                    if (menuItem) {
                        slidesList.appendChild(menuItem);
                    }
                    itemIndex++;
                }
            });
            
            // Add click handlers to menu items
            querySelectorAll('.slide-menu-item, .slide-menu-item-vertical').forEach(item => {
                item.onclick = handleMenuItemClick;
            });
            
            // Update active slide
            updateActiveSlide();
        })();
        
        // Listen for slide changes
        revealInstance.addEventListener('slidechanged', updateActiveSlide);
        
        // Build custom panels
        if (menuOptions.custom) {
            /**
             * Handle successful AJAX load
             */
            function handleAjaxSuccess() {
                if (this.status >= 200 && this.status < 300) {
                    this.panel.innerHTML = this.responseText;
                    processCustomPanel(this.panel);
                } else {
                    handleAjaxError(this);
                }
            }
            
            /**
             * Handle AJAX error
             */
            function handleAjaxError(xhr) {
                const errorMessage = `<p>ERROR: The attempt to fetch ${xhr.responseURL} failed with HTTP status ${xhr.status} (${xhr.statusText}).</p>` +
                                   `<p>Remember that you need to serve the presentation HTML from a HTTP server.</p>`;
                xhr.panel.innerHTML = errorMessage;
            }
            
            /**
             * Process custom panel content
             */
            function processCustomPanel(panel) {
                querySelectorAll('ul.slide-menu-items li.slide-menu-item', panel).forEach((item, index) => {
                    item.setAttribute('data-item', index + 1);
                    item.onclick = handleMenuItemClick;
                    item.addEventListener('mouseenter', handleMenuItemHover);
                });
            }
            
            /**
             * Load custom panel via AJAX
             */
            function loadCustomPanel(panel, url) {
                const xhr = new XMLHttpRequest();
                xhr.panel = panel;
                xhr.onload = handleAjaxSuccess;
                xhr.onerror = handleAjaxError;
                xhr.open('get', url, true);
                xhr.send(null);
            }
            
            // Create custom panels
            menuOptions.custom.forEach((customPanel, index) => {
                const panel = createElement('div', {
                    'data-panel': 'Custom' + index,
                    'class': 'slide-menu-panel slide-menu-custom-panel'
                });
                
                if (customPanel.content) {
                    panel.innerHTML = customPanel.content;
                    processCustomPanel(panel);
                } else if (customPanel.src) {
                    loadCustomPanel(panel, customPanel.src);
                }
                
                slideMenu.appendChild(panel);
            });
        }
        
        // Build themes panel
        if (menuOptions.themes) {
            const themesPanel = createElement('div', {
                'class': 'slide-menu-panel',
                'data-panel': 'Themes'
            });
            slideMenu.appendChild(themesPanel);
            
            const themesList = createElement('ul', { 'class': 'slide-menu-items' });
            themesPanel.appendChild(themesList);
            
            menuOptions.themes.forEach((theme, index) => {
                const attributes = {
                    'class': 'slide-menu-item',
                    'data-item': '' + (index + 1)
                };
                
                if (theme.theme) {
                    attributes['data-theme'] = theme.theme;
                }
                
                if (theme.highlightTheme) {
                    attributes['data-highlight-theme'] = theme.highlightTheme;
                }
                
                const themeItem = createElement('li', attributes, theme.name);
                themesList.appendChild(themeItem);
                themeItem.onclick = handleMenuItemClick;
            });
        }
        
        // Build transitions panel
        if (menuOptions.transitions) {
            const transitionsPanel = createElement('div', {
                'class': 'slide-menu-panel',
                'data-panel': 'Transitions'
            });
            slideMenu.appendChild(transitionsPanel);
            
            const transitionsList = createElement('ul', { 'class': 'slide-menu-items' });
            transitionsPanel.appendChild(transitionsList);
            
            menuOptions.transitions.forEach((transition, index) => {
                const transitionItem = createElement('li', {
                    'class': 'slide-menu-item',
                    'data-transition': transition.toLowerCase(),
                    'data-item': '' + (index + 1)
                }, transition);
                
                transitionsList.appendChild(transitionItem);
                transitionItem.onclick = handleMenuItemClick;
            });
        }
        
        // Add open button
        if (menuOptions.openButton) {
            const openButton = createElement('div', { 'class': 'slide-menu-button' });
            const openLink = createElement('a', { 'href': '#' });
            openLink.appendChild(createElement('i', { 'class': 'fas fa-bars' }));
            openButton.appendChild(openLink);
            querySelector('.reveal').appendChild(openButton);
            openButton.onclick = openMenu;
        }
        
        // Add click handler to slide number
        if (menuOptions.openSlideNumber) {
            querySelector('div.slide-number').onclick = openMenu;
        }
        
        // Add hover handlers to all menu items
        querySelectorAll('.slide-menu-panel .slide-menu-items li').forEach(item => {
            item.addEventListener('mouseenter', handleMenuItemHover);
        });
        
        // Keyboard handling
        if (menuOptions.keyboard) {
            document.addEventListener('keydown', handleKeyboardEvent, false);
            
            // Handle postMessage keyboard events
            window.addEventListener('message', function(event) {
                let data;
                try {
                    data = JSON.parse(event.data);
                } catch (error) {}
                
                if (data && data.method === 'triggerKey') {
                    handleKeyboardEvent({
                        keyCode: data.args[0],
                        stopImmediatePropagation: function() {}
                    });
                }
            });
            
            // Override keyboard condition if needed
            if (revealConfig.keyboardCondition && typeof revealConfig.keyboardCondition === 'function') {
                const originalCondition = revealConfig.keyboardCondition;
                revealConfig.keyboardCondition = function(event) {
                    return originalCondition(event) && (!isMenuOpen() || event.keyCode === 77);
                };
            } else {
                revealConfig.keyboardCondition = function(event) {
                    return !isMenuOpen() || event.keyCode === 77;
                };
            }
            
            // Add key binding
            revealInstance.addKeyBinding({
                keyCode: 77,
                key: 'M',
                description: 'Toggle menu'
            }, toggleMenu);
        }
        
        // Open menu on init if configured
        if (menuOptions.openOnInit) {
            openMenu();
        }
        
        isMenuInitialized = true;
    }
    
    /**
     * Query selector helper
     */
    function querySelector(selector, element) {
        element = element || document;
        return element.querySelector(selector);
    }
    
    /**
     * Query selector all helper
     */
    function querySelectorAll(selector, element) {
        element = element || document;
        return Array.prototype.slice.call(element.querySelectorAll(selector));
    }
    
    /**
     * Create element helper
     */
    function createElement(tagName, attributes, innerHTML) {
        const element = document.createElement(tagName);
        
        if (attributes) {
            Object.getOwnPropertyNames(attributes).forEach(name => {
                element.setAttribute(name, attributes[name]);
            });
        }
        
        if (innerHTML) {
            element.innerHTML = innerHTML;
        }
        
        return element;
    }
    
    /**
     * Change theme
     */
    function changeTheme(linkId, themeUrl) {
        const oldLink = querySelector('link#' + linkId);
        const parentElement = oldLink.parentElement;
        const nextElement = oldLink.nextElementSibling;
        
        oldLink.remove();
        
        const newLink = oldLink.cloneNode();
        newLink.setAttribute('href', themeUrl);
        newLink.onload = function() {
            syncFontFamily();
        };
        
        parentElement.insertBefore(newLink, nextElement);
    }
    
    /**
     * Load external resource
     */
    function loadResource(url, type, callback) {
        const head = document.querySelector('head');
        let element;
        
        if (type === 'script') {
            element = document.createElement('script');
            element.type = 'text/javascript';
            element.src = url;
        } else if (type === 'stylesheet') {
            element = document.createElement('link');
            element.rel = 'stylesheet';
            element.href = url;
        }
        
        const finish = function() {
            if (typeof callback === 'function') {
                callback.call();
                callback = null;
            }
        };
        
        element.onload = finish;
        element.onreadystatechange = function() {
            if (this.readyState === 'loaded') {
                finish();
            }
        };
        
        head.appendChild(element);
    }
    
    /**
     * Initialize the plugin
     */
    function initialize() {
        const shouldInitialize = !ieVersion || ieVersion >= 9;
        
        // Don't initialize in speaker notes with controls disabled
        if (revealInstance.isSpeakerNotes() && window.location.search.endsWith('controls=false')) {
            shouldInitialize = false;
        }
        
        if (shouldInitialize) {
            if (!menuOptions.delayInit) {
                initializeMenu();
            }
            
            // Dispatch menu-ready event
            const eventName = 'menu-ready';
            const event = document.createEvent('HTMLEvents', 1, 2);
            event.initEvent(eventName, true, true);
            querySelector('.reveal').dispatchEvent(event);
            
            // Post message for parent window
            if (revealConfig.postMessageEvents && window.parent !== window.self) {
                window.parent.postMessage(
                    JSON.stringify({
                        namespace: 'reveal',
                        eventName: eventName,
                        state: revealInstance.getState()
                    }),
                    '*'
                );
            }
        }
    }
    
    /**
     * Public API
     */
    return {
        id: 'menu',
        
        init: function(reveal) {
            revealInstance = reveal;
            revealConfig = reveal.getConfig();
            initializeConfiguration(revealConfig);
            
            // Load CSS
            loadResource(menuOptions.path + 'menu.css', 'stylesheet', function() {
                // Load Font Awesome if needed
                if (menuOptions.loadIcons === undefined || menuOptions.loadIcons) {
                    loadResource(menuOptions.path + 'font-awesome/css/all.css', 'stylesheet', initialize);
                } else {
                    initialize();
                }
            });
        },
        
        toggle: toggleMenu,
        openMenu: openMenu,
        closeMenu: closeMenu,
        openPanel: switchPanel,
        isOpen: isMenuOpen,
        initialiseMenu: initializeMenu,
        isMenuInitialised: function() {
            return isMenuInitialized;
        }
    };
}

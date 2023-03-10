import {
  FilteredProducts
} from "/build/_shared/chunk-Q3DHAYPQ.js";
import {
  styles_default
} from "/build/_shared/chunk-LUFSLTAB.js";
import {
  Grid,
  splide_default_min_default
} from "/build/_shared/chunk-OWZIUL5B.js";
import {
  useSearchParams_default
} from "/build/_shared/chunk-ME52MYFA.js";
import {
  require_dataFetcherForShapePage
} from "/build/_shared/chunk-7MFRY4AM.js";
import "/build/_shared/chunk-C5MQ4KT2.js";
import {
  buildMetas
} from "/build/_shared/chunk-JHVSQUXW.js";
import "/build/_shared/chunk-ZIMYLYGD.js";
import "/build/_shared/chunk-NTU3S4GL.js";
import "/build/_shared/chunk-HET3URE2.js";
import {
  Price
} from "/build/_shared/chunk-H52OJRFM.js";
import {
  useAppContext
} from "/build/_shared/chunk-HDCWY7SN.js";
import {
  require_storefront
} from "/build/_shared/chunk-XY3KWW5M.js";
import {
  Form,
  require_jsx_dev_runtime,
  require_react,
  useLoaderData,
  useLocation,
  useNavigate,
  useSubmit,
  useTransition
} from "/build/_shared/chunk-KWNTVCXY.js";
import {
  __commonJS,
  __toESM
} from "/build/_shared/chunk-5KL4PAQL.js";

// node_modules/classnames/index.js
var require_classnames = __commonJS({
  "node_modules/classnames/index.js"(exports, module) {
    (function() {
      "use strict";
      var hasOwn = {}.hasOwnProperty;
      var nativeCodeString = "[native code]";
      function classNames6() {
        var classes = [];
        for (var i = 0; i < arguments.length; i++) {
          var arg = arguments[i];
          if (!arg)
            continue;
          var argType = typeof arg;
          if (argType === "string" || argType === "number") {
            classes.push(arg);
          } else if (Array.isArray(arg)) {
            if (arg.length) {
              var inner = classNames6.apply(null, arg);
              if (inner) {
                classes.push(inner);
              }
            }
          } else if (argType === "object") {
            if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes("[native code]")) {
              classes.push(arg.toString());
              continue;
            }
            for (var key in arg) {
              if (hasOwn.call(arg, key) && arg[key]) {
                classes.push(key);
              }
            }
          }
        }
        return classes.join(" ");
      }
      if (typeof module !== "undefined" && module.exports) {
        classNames6.default = classNames6;
        module.exports = classNames6;
      } else if (typeof define === "function" && typeof define.amd === "object" && define.amd) {
        define("classnames", [], function() {
          return classNames6;
        });
      } else {
        window.classNames = classNames6;
      }
    })();
  }
});

// node_modules/shallowequal/index.js
var require_shallowequal = __commonJS({
  "node_modules/shallowequal/index.js"(exports, module) {
    module.exports = function shallowEqual2(objA, objB, compare, compareContext) {
      var ret = compare ? compare.call(compareContext, objA, objB) : void 0;
      if (ret !== void 0) {
        return !!ret;
      }
      if (objA === objB) {
        return true;
      }
      if (typeof objA !== "object" || !objA || typeof objB !== "object" || !objB) {
        return false;
      }
      var keysA = Object.keys(objA);
      var keysB = Object.keys(objB);
      if (keysA.length !== keysB.length) {
        return false;
      }
      var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
      for (var idx = 0; idx < keysA.length; idx++) {
        var key = keysA[idx];
        if (!bHasOwnProperty(key)) {
          return false;
        }
        var valueA = objA[key];
        var valueB = objB[key];
        ret = compare ? compare.call(compareContext, valueA, valueB, key) : void 0;
        if (ret === false || ret === void 0 && valueA !== valueB) {
          return false;
        }
      }
      return true;
    };
  }
});

// node_modules/rc-slider/assets/index.css
var assets_default = "/build/_assets/index-NXU3OAQ7.css";

// src/routes/$langstore/shop/$folder.tsx
var import_storefront = __toESM(require_storefront());

// src/ui/components/search/index.tsx
var import_react5 = __toESM(require_react());

// src/ui/components/search/attribute-filter.tsx
var import_react = __toESM(require_react());

// src/assets/filterIcon.svg
var filterIcon_default = "/build/_assets/filterIcon-K53QUPVR.svg";

// src/ui/components/search/attribute-filter.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime());
var AttributeFilter = ({ attributes }) => {
  const [show, setShow] = (0, import_react.useState)(false);
  const { _t } = useAppContext();
  const [searchParams] = useSearchParams_default();
  const selectedAttributes = searchParams.getAll("attr");
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: Object.keys(attributes).length > 0 && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(
      "div",
      {
        className: "relative flex justify-between items-center w-60 bg-grey py-2 px-6 rounded-md hover:cursor-pointer",
        onClick: () => setShow(!show),
        children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-md font-bold", children: _t("search.filterByAttributes") }, void 0, false, {
            fileName: "src/ui/components/search/attribute-filter.tsx",
            lineNumber: 19,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", { src: filterIcon_default, alt: "" }, void 0, false, {
            fileName: "src/ui/components/search/attribute-filter.tsx",
            lineNumber: 20,
            columnNumber: 25
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "src/ui/components/search/attribute-filter.tsx",
        lineNumber: 15,
        columnNumber: 21
      },
      this
    ),
    show && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "absolute w-60 z-50", children: Object.keys(attributes).map((key) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "bg-grey px-5 py-2 border-bottom-2", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "font-semibold", children: key }, void 0, false, {
        fileName: "src/ui/components/search/attribute-filter.tsx",
        lineNumber: 26,
        columnNumber: 37
      }, this),
      attributes[key].map((item, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(
          "input",
          {
            type: "checkbox",
            value: `${key}_${item.value}`,
            name: "attr",
            defaultChecked: selectedAttributes.includes(`${key}_${item.value}`)
          },
          void 0,
          false,
          {
            fileName: "src/ui/components/search/attribute-filter.tsx",
            lineNumber: 29,
            columnNumber: 45
          },
          this
        ),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: item.value, children: item.value }, void 0, false, {
          fileName: "src/ui/components/search/attribute-filter.tsx",
          lineNumber: 35,
          columnNumber: 45
        }, this)
      ] }, index, true, {
        fileName: "src/ui/components/search/attribute-filter.tsx",
        lineNumber: 28,
        columnNumber: 41
      }, this))
    ] }, key, true, {
      fileName: "src/ui/components/search/attribute-filter.tsx",
      lineNumber: 25,
      columnNumber: 33
    }, this)) }, void 0, false, {
      fileName: "src/ui/components/search/attribute-filter.tsx",
      lineNumber: 23,
      columnNumber: 25
    }, this)
  ] }, void 0, true, {
    fileName: "src/ui/components/search/attribute-filter.tsx",
    lineNumber: 14,
    columnNumber: 17
  }, this) }, void 0, false, {
    fileName: "src/ui/components/search/attribute-filter.tsx",
    lineNumber: 12,
    columnNumber: 9
  }, this);
};

// src/ui/components/search/price-range-filter.tsx
var import_react2 = __toESM(require_react());

// node_modules/@babel/runtime/helpers/esm/typeof.js
function _typeof(obj) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof(obj);
}

// node_modules/@babel/runtime/helpers/esm/toPrimitive.js
function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null)
    return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== void 0) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object")
      return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}

// node_modules/@babel/runtime/helpers/esm/toPropertyKey.js
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}

// node_modules/@babel/runtime/helpers/esm/defineProperty.js
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

// node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++)
    arr2[i] = arr[i];
  return arr2;
}

// node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr))
    return _arrayLikeToArray(arr);
}

// node_modules/@babel/runtime/helpers/esm/iterableToArray.js
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
    return Array.from(iter);
}

// node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js
function _unsupportedIterableToArray(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}

// node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

// node_modules/@babel/runtime/helpers/esm/toConsumableArray.js
function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

// node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js
function _arrayWithHoles(arr) {
  if (Array.isArray(arr))
    return arr;
}

// node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js
function _iterableToArrayLimit(arr, i) {
  var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
  if (null != _i) {
    var _s, _e, _x, _r, _arr = [], _n = true, _d = false;
    try {
      if (_x = (_i = _i.call(arr)).next, 0 === i) {
        if (Object(_i) !== _i)
          return;
        _n = false;
      } else
        for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = true)
          ;
    } catch (err) {
      _d = true, _e = err;
    } finally {
      try {
        if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r))
          return;
      } finally {
        if (_d)
          throw _e;
      }
    }
    return _arr;
  }
}

// node_modules/@babel/runtime/helpers/esm/nonIterableRest.js
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

// node_modules/@babel/runtime/helpers/esm/slicedToArray.js
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

// node_modules/rc-slider/es/Slider.js
var React15 = __toESM(require_react());
var import_classnames5 = __toESM(require_classnames());
var import_shallowequal = __toESM(require_shallowequal());

// node_modules/rc-util/es/hooks/useEvent.js
var React = __toESM(require_react());
function useEvent(callback) {
  var fnRef = React.useRef();
  fnRef.current = callback;
  var memoFn = React.useCallback(function() {
    var _fnRef$current;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return (_fnRef$current = fnRef.current) === null || _fnRef$current === void 0 ? void 0 : _fnRef$current.call.apply(_fnRef$current, [fnRef].concat(args));
  }, []);
  return memoFn;
}

// node_modules/rc-util/es/hooks/useLayoutEffect.js
var React2 = __toESM(require_react());

// node_modules/rc-util/es/Dom/canUseDom.js
function canUseDom() {
  return !!(typeof window !== "undefined" && window.document && window.document.createElement);
}

// node_modules/rc-util/es/hooks/useLayoutEffect.js
var useLayoutEffect2 = canUseDom() ? React2.useLayoutEffect : React2.useEffect;
var useLayoutUpdateEffect = function useLayoutUpdateEffect2(callback, deps) {
  var firstMountRef = React2.useRef(true);
  useLayoutEffect2(function() {
    if (!firstMountRef.current) {
      return callback();
    }
  }, deps);
  useLayoutEffect2(function() {
    firstMountRef.current = false;
    return function() {
      firstMountRef.current = true;
    };
  }, []);
};

// node_modules/rc-util/es/hooks/useState.js
var React3 = __toESM(require_react());
function useSafeState(defaultValue) {
  var destroyRef = React3.useRef(false);
  var _React$useState = React3.useState(defaultValue), _React$useState2 = _slicedToArray(_React$useState, 2), value = _React$useState2[0], setValue = _React$useState2[1];
  React3.useEffect(function() {
    destroyRef.current = false;
    return function() {
      destroyRef.current = true;
    };
  }, []);
  function safeSetState(updater, ignoreDestroy) {
    if (ignoreDestroy && destroyRef.current) {
      return;
    }
    setValue(updater);
  }
  return [value, safeSetState];
}

// node_modules/rc-util/es/hooks/useMergedState.js
function hasValue(value) {
  return value !== void 0;
}
function useMergedState(defaultStateValue, option) {
  var _ref = option || {}, defaultValue = _ref.defaultValue, value = _ref.value, onChange = _ref.onChange, postState = _ref.postState;
  var _useState = useSafeState(function() {
    if (hasValue(value)) {
      return value;
    } else if (hasValue(defaultValue)) {
      return typeof defaultValue === "function" ? defaultValue() : defaultValue;
    } else {
      return typeof defaultStateValue === "function" ? defaultStateValue() : defaultStateValue;
    }
  }), _useState2 = _slicedToArray(_useState, 2), innerValue = _useState2[0], setInnerValue = _useState2[1];
  var mergedValue = value !== void 0 ? value : innerValue;
  var postMergedValue = postState ? postState(mergedValue) : mergedValue;
  var onChangeFn = useEvent(onChange);
  var _useState3 = useSafeState([mergedValue]), _useState4 = _slicedToArray(_useState3, 2), prevValue = _useState4[0], setPrevValue = _useState4[1];
  useLayoutUpdateEffect(function() {
    var prev = prevValue[0];
    if (innerValue !== prev) {
      onChangeFn(innerValue, prev);
    }
  }, [prevValue]);
  useLayoutUpdateEffect(function() {
    if (!hasValue(value)) {
      setInnerValue(value);
    }
  }, [value]);
  var triggerChange = useEvent(function(updater, ignoreDestroy) {
    setInnerValue(updater, ignoreDestroy);
    setPrevValue([mergedValue], ignoreDestroy);
  });
  return [postMergedValue, triggerChange];
}

// node_modules/@babel/runtime/helpers/esm/extends.js
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

// node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null)
    return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0)
      continue;
    target[key] = source[key];
  }
  return target;
}

// node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js
function _objectWithoutProperties(source, excluded) {
  if (source == null)
    return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0)
        continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key))
        continue;
      target[key] = source[key];
    }
  }
  return target;
}

// node_modules/rc-slider/es/Handles/index.js
var React6 = __toESM(require_react());

// node_modules/@babel/runtime/helpers/esm/objectSpread2.js
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), true).forEach(function(key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}

// node_modules/rc-slider/es/Handles/Handle.js
var React5 = __toESM(require_react());
var import_classnames = __toESM(require_classnames());

// node_modules/rc-util/es/KeyCode.js
var KeyCode = {
  MAC_ENTER: 3,
  BACKSPACE: 8,
  TAB: 9,
  NUM_CENTER: 12,
  ENTER: 13,
  SHIFT: 16,
  CTRL: 17,
  ALT: 18,
  PAUSE: 19,
  CAPS_LOCK: 20,
  ESC: 27,
  SPACE: 32,
  PAGE_UP: 33,
  PAGE_DOWN: 34,
  END: 35,
  HOME: 36,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  PRINT_SCREEN: 44,
  INSERT: 45,
  DELETE: 46,
  ZERO: 48,
  ONE: 49,
  TWO: 50,
  THREE: 51,
  FOUR: 52,
  FIVE: 53,
  SIX: 54,
  SEVEN: 55,
  EIGHT: 56,
  NINE: 57,
  QUESTION_MARK: 63,
  A: 65,
  B: 66,
  C: 67,
  D: 68,
  E: 69,
  F: 70,
  G: 71,
  H: 72,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  M: 77,
  N: 78,
  O: 79,
  P: 80,
  Q: 81,
  R: 82,
  S: 83,
  T: 84,
  U: 85,
  V: 86,
  W: 87,
  X: 88,
  Y: 89,
  Z: 90,
  META: 91,
  WIN_KEY_RIGHT: 92,
  CONTEXT_MENU: 93,
  NUM_ZERO: 96,
  NUM_ONE: 97,
  NUM_TWO: 98,
  NUM_THREE: 99,
  NUM_FOUR: 100,
  NUM_FIVE: 101,
  NUM_SIX: 102,
  NUM_SEVEN: 103,
  NUM_EIGHT: 104,
  NUM_NINE: 105,
  NUM_MULTIPLY: 106,
  NUM_PLUS: 107,
  NUM_MINUS: 109,
  NUM_PERIOD: 110,
  NUM_DIVISION: 111,
  F1: 112,
  F2: 113,
  F3: 114,
  F4: 115,
  F5: 116,
  F6: 117,
  F7: 118,
  F8: 119,
  F9: 120,
  F10: 121,
  F11: 122,
  F12: 123,
  NUMLOCK: 144,
  SEMICOLON: 186,
  DASH: 189,
  EQUALS: 187,
  COMMA: 188,
  PERIOD: 190,
  SLASH: 191,
  APOSTROPHE: 192,
  SINGLE_QUOTE: 222,
  OPEN_SQUARE_BRACKET: 219,
  BACKSLASH: 220,
  CLOSE_SQUARE_BRACKET: 221,
  WIN_KEY: 224,
  MAC_FF_META: 224,
  WIN_IME: 229,
  isTextModifyingKeyEvent: function isTextModifyingKeyEvent(e) {
    var keyCode = e.keyCode;
    if (e.altKey && !e.ctrlKey || e.metaKey || keyCode >= KeyCode.F1 && keyCode <= KeyCode.F12) {
      return false;
    }
    switch (keyCode) {
      case KeyCode.ALT:
      case KeyCode.CAPS_LOCK:
      case KeyCode.CONTEXT_MENU:
      case KeyCode.CTRL:
      case KeyCode.DOWN:
      case KeyCode.END:
      case KeyCode.ESC:
      case KeyCode.HOME:
      case KeyCode.INSERT:
      case KeyCode.LEFT:
      case KeyCode.MAC_FF_META:
      case KeyCode.META:
      case KeyCode.NUMLOCK:
      case KeyCode.NUM_CENTER:
      case KeyCode.PAGE_DOWN:
      case KeyCode.PAGE_UP:
      case KeyCode.PAUSE:
      case KeyCode.PRINT_SCREEN:
      case KeyCode.RIGHT:
      case KeyCode.SHIFT:
      case KeyCode.UP:
      case KeyCode.WIN_KEY:
      case KeyCode.WIN_KEY_RIGHT:
        return false;
      default:
        return true;
    }
  },
  isCharacterKey: function isCharacterKey(keyCode) {
    if (keyCode >= KeyCode.ZERO && keyCode <= KeyCode.NINE) {
      return true;
    }
    if (keyCode >= KeyCode.NUM_ZERO && keyCode <= KeyCode.NUM_MULTIPLY) {
      return true;
    }
    if (keyCode >= KeyCode.A && keyCode <= KeyCode.Z) {
      return true;
    }
    if (window.navigator.userAgent.indexOf("WebKit") !== -1 && keyCode === 0) {
      return true;
    }
    switch (keyCode) {
      case KeyCode.SPACE:
      case KeyCode.QUESTION_MARK:
      case KeyCode.NUM_PLUS:
      case KeyCode.NUM_MINUS:
      case KeyCode.NUM_PERIOD:
      case KeyCode.NUM_DIVISION:
      case KeyCode.SEMICOLON:
      case KeyCode.DASH:
      case KeyCode.EQUALS:
      case KeyCode.COMMA:
      case KeyCode.PERIOD:
      case KeyCode.SLASH:
      case KeyCode.APOSTROPHE:
      case KeyCode.SINGLE_QUOTE:
      case KeyCode.OPEN_SQUARE_BRACKET:
      case KeyCode.BACKSLASH:
      case KeyCode.CLOSE_SQUARE_BRACKET:
        return true;
      default:
        return false;
    }
  }
};
var KeyCode_default = KeyCode;

// node_modules/rc-slider/es/context.js
var React4 = __toESM(require_react());
var SliderContext = /* @__PURE__ */ React4.createContext({
  min: 0,
  max: 0,
  direction: "ltr",
  step: 1,
  includedStart: 0,
  includedEnd: 0,
  tabIndex: 0,
  keyboard: true
});
var context_default = SliderContext;

// node_modules/rc-slider/es/util.js
function getOffset(value, min, max) {
  return (value - min) / (max - min);
}
function getDirectionStyle(direction, value, min, max) {
  var offset = getOffset(value, min, max);
  var positionStyle = {};
  switch (direction) {
    case "rtl":
      positionStyle.right = "".concat(offset * 100, "%");
      positionStyle.transform = "translateX(50%)";
      break;
    case "btt":
      positionStyle.bottom = "".concat(offset * 100, "%");
      positionStyle.transform = "translateY(50%)";
      break;
    case "ttb":
      positionStyle.top = "".concat(offset * 100, "%");
      positionStyle.transform = "translateY(-50%)";
      break;
    default:
      positionStyle.left = "".concat(offset * 100, "%");
      positionStyle.transform = "translateX(-50%)";
      break;
  }
  return positionStyle;
}
function getIndex(value, index) {
  return Array.isArray(value) ? value[index] : value;
}

// node_modules/rc-slider/es/Handles/Handle.js
var _excluded = ["prefixCls", "value", "valueIndex", "onStartMove", "style", "render", "dragging", "onOffsetChange"];
var Handle = /* @__PURE__ */ React5.forwardRef(function(props, ref) {
  var _classNames, _getIndex;
  var prefixCls = props.prefixCls, value = props.value, valueIndex = props.valueIndex, onStartMove = props.onStartMove, style = props.style, render = props.render, dragging = props.dragging, onOffsetChange = props.onOffsetChange, restProps = _objectWithoutProperties(props, _excluded);
  var _React$useContext = React5.useContext(context_default), min = _React$useContext.min, max = _React$useContext.max, direction = _React$useContext.direction, disabled = _React$useContext.disabled, keyboard = _React$useContext.keyboard, range = _React$useContext.range, tabIndex = _React$useContext.tabIndex, ariaLabelForHandle = _React$useContext.ariaLabelForHandle, ariaLabelledByForHandle = _React$useContext.ariaLabelledByForHandle, ariaValueTextFormatterForHandle = _React$useContext.ariaValueTextFormatterForHandle;
  var handlePrefixCls = "".concat(prefixCls, "-handle");
  var onInternalStartMove = function onInternalStartMove2(e) {
    if (!disabled) {
      onStartMove(e, valueIndex);
    }
  };
  var onKeyDown = function onKeyDown2(e) {
    if (!disabled && keyboard) {
      var offset = null;
      switch (e.which || e.keyCode) {
        case KeyCode_default.LEFT:
          offset = direction === "ltr" || direction === "btt" ? -1 : 1;
          break;
        case KeyCode_default.RIGHT:
          offset = direction === "ltr" || direction === "btt" ? 1 : -1;
          break;
        case KeyCode_default.UP:
          offset = direction !== "ttb" ? 1 : -1;
          break;
        case KeyCode_default.DOWN:
          offset = direction !== "ttb" ? -1 : 1;
          break;
        case KeyCode_default.HOME:
          offset = "min";
          break;
        case KeyCode_default.END:
          offset = "max";
          break;
        case KeyCode_default.PAGE_UP:
          offset = 2;
          break;
        case KeyCode_default.PAGE_DOWN:
          offset = -2;
          break;
      }
      if (offset !== null) {
        e.preventDefault();
        onOffsetChange(offset, valueIndex);
      }
    }
  };
  var positionStyle = getDirectionStyle(direction, value, min, max);
  var handleNode = /* @__PURE__ */ React5.createElement("div", _extends({
    ref,
    className: (0, import_classnames.default)(handlePrefixCls, (_classNames = {}, _defineProperty(_classNames, "".concat(handlePrefixCls, "-").concat(valueIndex + 1), range), _defineProperty(_classNames, "".concat(handlePrefixCls, "-dragging"), dragging), _classNames)),
    style: _objectSpread2(_objectSpread2({}, positionStyle), style),
    onMouseDown: onInternalStartMove,
    onTouchStart: onInternalStartMove,
    onKeyDown,
    tabIndex: disabled ? null : getIndex(tabIndex, valueIndex),
    role: "slider",
    "aria-valuemin": min,
    "aria-valuemax": max,
    "aria-valuenow": value,
    "aria-disabled": disabled,
    "aria-label": getIndex(ariaLabelForHandle, valueIndex),
    "aria-labelledby": getIndex(ariaLabelledByForHandle, valueIndex),
    "aria-valuetext": (_getIndex = getIndex(ariaValueTextFormatterForHandle, valueIndex)) === null || _getIndex === void 0 ? void 0 : _getIndex(value)
  }, restProps));
  if (render) {
    handleNode = render(handleNode, {
      index: valueIndex,
      prefixCls,
      value,
      dragging
    });
  }
  return handleNode;
});
if (true) {
  Handle.displayName = "Handle";
}
var Handle_default = Handle;

// node_modules/rc-slider/es/Handles/index.js
var _excluded2 = ["prefixCls", "style", "onStartMove", "onOffsetChange", "values", "handleRender", "draggingIndex"];
var Handles = /* @__PURE__ */ React6.forwardRef(function(props, ref) {
  var prefixCls = props.prefixCls, style = props.style, onStartMove = props.onStartMove, onOffsetChange = props.onOffsetChange, values = props.values, handleRender = props.handleRender, draggingIndex = props.draggingIndex, restProps = _objectWithoutProperties(props, _excluded2);
  var handlesRef = React6.useRef({});
  React6.useImperativeHandle(ref, function() {
    return {
      focus: function focus(index) {
        var _handlesRef$current$i;
        (_handlesRef$current$i = handlesRef.current[index]) === null || _handlesRef$current$i === void 0 ? void 0 : _handlesRef$current$i.focus();
      }
    };
  });
  return /* @__PURE__ */ React6.createElement(React6.Fragment, null, values.map(function(value, index) {
    return /* @__PURE__ */ React6.createElement(Handle_default, _extends({
      ref: function ref2(node) {
        if (!node) {
          delete handlesRef.current[index];
        } else {
          handlesRef.current[index] = node;
        }
      },
      dragging: draggingIndex === index,
      prefixCls,
      style: getIndex(style, index),
      key: index,
      value,
      valueIndex: index,
      onStartMove,
      onOffsetChange,
      render: handleRender
    }, restProps));
  }));
});
if (true) {
  Handles.displayName = "Handles";
}
var Handles_default = Handles;

// node_modules/rc-slider/es/hooks/useDrag.js
var React7 = __toESM(require_react());
function getPosition(e) {
  var obj = "touches" in e ? e.touches[0] : e;
  return {
    pageX: obj.pageX,
    pageY: obj.pageY
  };
}
function useDrag(containerRef, direction, rawValues, min, max, formatValue, triggerChange, finishChange, offsetValues) {
  var _React$useState = React7.useState(null), _React$useState2 = _slicedToArray(_React$useState, 2), draggingValue = _React$useState2[0], setDraggingValue = _React$useState2[1];
  var _React$useState3 = React7.useState(-1), _React$useState4 = _slicedToArray(_React$useState3, 2), draggingIndex = _React$useState4[0], setDraggingIndex = _React$useState4[1];
  var _React$useState5 = React7.useState(rawValues), _React$useState6 = _slicedToArray(_React$useState5, 2), cacheValues = _React$useState6[0], setCacheValues = _React$useState6[1];
  var _React$useState7 = React7.useState(rawValues), _React$useState8 = _slicedToArray(_React$useState7, 2), originValues = _React$useState8[0], setOriginValues = _React$useState8[1];
  var mouseMoveEventRef = React7.useRef(null);
  var mouseUpEventRef = React7.useRef(null);
  React7.useEffect(function() {
    if (draggingIndex === -1) {
      setCacheValues(rawValues);
    }
  }, [rawValues, draggingIndex]);
  React7.useEffect(function() {
    return function() {
      document.removeEventListener("mousemove", mouseMoveEventRef.current);
      document.removeEventListener("mouseup", mouseUpEventRef.current);
      document.removeEventListener("touchmove", mouseMoveEventRef.current);
      document.removeEventListener("touchend", mouseUpEventRef.current);
    };
  }, []);
  var flushValues = function flushValues2(nextValues, nextValue) {
    if (cacheValues.some(function(val, i) {
      return val !== nextValues[i];
    })) {
      if (nextValue !== void 0) {
        setDraggingValue(nextValue);
      }
      setCacheValues(nextValues);
      triggerChange(nextValues);
    }
  };
  var updateCacheValue = function updateCacheValue2(valueIndex, offsetPercent) {
    if (valueIndex === -1) {
      var startValue = originValues[0];
      var endValue = originValues[originValues.length - 1];
      var maxStartOffset = min - startValue;
      var maxEndOffset = max - endValue;
      var offset = offsetPercent * (max - min);
      offset = Math.max(offset, maxStartOffset);
      offset = Math.min(offset, maxEndOffset);
      var formatStartValue = formatValue(startValue + offset);
      offset = formatStartValue - startValue;
      var cloneCacheValues = originValues.map(function(val) {
        return val + offset;
      });
      flushValues(cloneCacheValues);
    } else {
      var offsetDist = (max - min) * offsetPercent;
      var cloneValues = _toConsumableArray(cacheValues);
      cloneValues[valueIndex] = originValues[valueIndex];
      var next = offsetValues(cloneValues, offsetDist, valueIndex, "dist");
      flushValues(next.values, next.value);
    }
  };
  var updateCacheValueRef = React7.useRef(updateCacheValue);
  updateCacheValueRef.current = updateCacheValue;
  var onStartMove = function onStartMove2(e, valueIndex) {
    e.stopPropagation();
    var originValue = rawValues[valueIndex];
    setDraggingIndex(valueIndex);
    setDraggingValue(originValue);
    setOriginValues(rawValues);
    var _getPosition = getPosition(e), startX = _getPosition.pageX, startY = _getPosition.pageY;
    var onMouseMove = function onMouseMove2(event) {
      event.preventDefault();
      var _getPosition2 = getPosition(event), moveX = _getPosition2.pageX, moveY = _getPosition2.pageY;
      var offsetX = moveX - startX;
      var offsetY = moveY - startY;
      var _containerRef$current = containerRef.current.getBoundingClientRect(), width = _containerRef$current.width, height = _containerRef$current.height;
      var offSetPercent;
      switch (direction) {
        case "btt":
          offSetPercent = -offsetY / height;
          break;
        case "ttb":
          offSetPercent = offsetY / height;
          break;
        case "rtl":
          offSetPercent = -offsetX / width;
          break;
        default:
          offSetPercent = offsetX / width;
      }
      updateCacheValueRef.current(valueIndex, offSetPercent);
    };
    var onMouseUp = function onMouseUp2(event) {
      event.preventDefault();
      document.removeEventListener("mouseup", onMouseUp2);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("touchend", onMouseUp2);
      document.removeEventListener("touchmove", onMouseMove);
      mouseMoveEventRef.current = null;
      mouseUpEventRef.current = null;
      setDraggingIndex(-1);
      finishChange();
    };
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("touchend", onMouseUp);
    document.addEventListener("touchmove", onMouseMove);
    mouseMoveEventRef.current = onMouseMove;
    mouseUpEventRef.current = onMouseUp;
  };
  var returnValues = React7.useMemo(function() {
    var sourceValues = _toConsumableArray(rawValues).sort(function(a, b) {
      return a - b;
    });
    var targetValues = _toConsumableArray(cacheValues).sort(function(a, b) {
      return a - b;
    });
    return sourceValues.every(function(val, index) {
      return val === targetValues[index];
    }) ? cacheValues : rawValues;
  }, [rawValues, cacheValues]);
  return [draggingIndex, draggingValue, returnValues, onStartMove];
}

// node_modules/rc-slider/es/Tracks/index.js
var React9 = __toESM(require_react());

// node_modules/rc-slider/es/Tracks/Track.js
var React8 = __toESM(require_react());
var import_classnames2 = __toESM(require_classnames());
function Track(props) {
  var prefixCls = props.prefixCls, style = props.style, start = props.start, end = props.end, index = props.index, onStartMove = props.onStartMove;
  var _React$useContext = React8.useContext(context_default), direction = _React$useContext.direction, min = _React$useContext.min, max = _React$useContext.max, disabled = _React$useContext.disabled, range = _React$useContext.range;
  var trackPrefixCls = "".concat(prefixCls, "-track");
  var offsetStart = getOffset(start, min, max);
  var offsetEnd = getOffset(end, min, max);
  var onInternalStartMove = function onInternalStartMove2(e) {
    if (!disabled && onStartMove) {
      onStartMove(e, -1);
    }
  };
  var positionStyle = {};
  switch (direction) {
    case "rtl":
      positionStyle.right = "".concat(offsetStart * 100, "%");
      positionStyle.width = "".concat(offsetEnd * 100 - offsetStart * 100, "%");
      break;
    case "btt":
      positionStyle.bottom = "".concat(offsetStart * 100, "%");
      positionStyle.height = "".concat(offsetEnd * 100 - offsetStart * 100, "%");
      break;
    case "ttb":
      positionStyle.top = "".concat(offsetStart * 100, "%");
      positionStyle.height = "".concat(offsetEnd * 100 - offsetStart * 100, "%");
      break;
    default:
      positionStyle.left = "".concat(offsetStart * 100, "%");
      positionStyle.width = "".concat(offsetEnd * 100 - offsetStart * 100, "%");
  }
  return /* @__PURE__ */ React8.createElement("div", {
    className: (0, import_classnames2.default)(trackPrefixCls, range && "".concat(trackPrefixCls, "-").concat(index + 1)),
    style: _objectSpread2(_objectSpread2({}, positionStyle), style),
    onMouseDown: onInternalStartMove,
    onTouchStart: onInternalStartMove
  });
}

// node_modules/rc-slider/es/Tracks/index.js
function Tracks(props) {
  var prefixCls = props.prefixCls, style = props.style, values = props.values, startPoint = props.startPoint, onStartMove = props.onStartMove;
  var _React$useContext = React9.useContext(context_default), included = _React$useContext.included, range = _React$useContext.range, min = _React$useContext.min;
  var trackList = React9.useMemo(function() {
    if (!range) {
      if (values.length === 0) {
        return [];
      }
      var startValue = startPoint !== null && startPoint !== void 0 ? startPoint : min;
      var endValue = values[0];
      return [{
        start: Math.min(startValue, endValue),
        end: Math.max(startValue, endValue)
      }];
    }
    var list = [];
    for (var i = 0; i < values.length - 1; i += 1) {
      list.push({
        start: values[i],
        end: values[i + 1]
      });
    }
    return list;
  }, [values, range, startPoint, min]);
  return included ? trackList.map(function(_ref, index) {
    var start = _ref.start, end = _ref.end;
    return /* @__PURE__ */ React9.createElement(Track, {
      index,
      prefixCls,
      style: getIndex(style, index),
      start,
      end,
      key: index,
      onStartMove
    });
  }) : null;
}

// node_modules/rc-slider/es/Marks/index.js
var React11 = __toESM(require_react());

// node_modules/rc-slider/es/Marks/Mark.js
var React10 = __toESM(require_react());
var import_classnames3 = __toESM(require_classnames());
function Mark(props) {
  var prefixCls = props.prefixCls, style = props.style, children = props.children, value = props.value, _onClick = props.onClick;
  var _React$useContext = React10.useContext(context_default), min = _React$useContext.min, max = _React$useContext.max, direction = _React$useContext.direction, includedStart = _React$useContext.includedStart, includedEnd = _React$useContext.includedEnd, included = _React$useContext.included;
  var textCls = "".concat(prefixCls, "-text");
  var positionStyle = getDirectionStyle(direction, value, min, max);
  return /* @__PURE__ */ React10.createElement("span", {
    className: (0, import_classnames3.default)(textCls, _defineProperty({}, "".concat(textCls, "-active"), included && includedStart <= value && value <= includedEnd)),
    style: _objectSpread2(_objectSpread2({}, positionStyle), style),
    onMouseDown: function onMouseDown(e) {
      e.stopPropagation();
    },
    onClick: function onClick() {
      _onClick(value);
    }
  }, children);
}

// node_modules/rc-slider/es/Marks/index.js
function Marks(props) {
  var prefixCls = props.prefixCls, marks = props.marks, onClick = props.onClick;
  var markPrefixCls = "".concat(prefixCls, "-mark");
  if (!marks.length) {
    return null;
  }
  return /* @__PURE__ */ React11.createElement("div", {
    className: markPrefixCls
  }, marks.map(function(_ref) {
    var value = _ref.value, style = _ref.style, label = _ref.label;
    return /* @__PURE__ */ React11.createElement(Mark, {
      key: value,
      prefixCls: markPrefixCls,
      style,
      value,
      onClick
    }, label);
  }));
}

// node_modules/rc-slider/es/Steps/index.js
var React13 = __toESM(require_react());

// node_modules/rc-slider/es/Steps/Dot.js
var React12 = __toESM(require_react());
var import_classnames4 = __toESM(require_classnames());
function Dot(props) {
  var prefixCls = props.prefixCls, value = props.value, style = props.style, activeStyle = props.activeStyle;
  var _React$useContext = React12.useContext(context_default), min = _React$useContext.min, max = _React$useContext.max, direction = _React$useContext.direction, included = _React$useContext.included, includedStart = _React$useContext.includedStart, includedEnd = _React$useContext.includedEnd;
  var dotClassName = "".concat(prefixCls, "-dot");
  var active = included && includedStart <= value && value <= includedEnd;
  var mergedStyle = _objectSpread2(_objectSpread2({}, getDirectionStyle(direction, value, min, max)), typeof style === "function" ? style(value) : style);
  if (active) {
    mergedStyle = _objectSpread2(_objectSpread2({}, mergedStyle), typeof activeStyle === "function" ? activeStyle(value) : activeStyle);
  }
  return /* @__PURE__ */ React12.createElement("span", {
    className: (0, import_classnames4.default)(dotClassName, _defineProperty({}, "".concat(dotClassName, "-active"), active)),
    style: mergedStyle
  });
}

// node_modules/rc-slider/es/Steps/index.js
function Steps(props) {
  var prefixCls = props.prefixCls, marks = props.marks, dots = props.dots, style = props.style, activeStyle = props.activeStyle;
  var _React$useContext = React13.useContext(context_default), min = _React$useContext.min, max = _React$useContext.max, step = _React$useContext.step;
  var stepDots = React13.useMemo(function() {
    var dotSet = /* @__PURE__ */ new Set();
    marks.forEach(function(mark) {
      dotSet.add(mark.value);
    });
    if (dots && step !== null) {
      var current = min;
      while (current <= max) {
        dotSet.add(current);
        current += step;
      }
    }
    return Array.from(dotSet);
  }, [min, max, step, dots, marks]);
  return /* @__PURE__ */ React13.createElement("div", {
    className: "".concat(prefixCls, "-step")
  }, stepDots.map(function(dotValue) {
    return /* @__PURE__ */ React13.createElement(Dot, {
      prefixCls,
      key: dotValue,
      value: dotValue,
      style,
      activeStyle
    });
  }));
}

// node_modules/rc-slider/es/hooks/useOffset.js
var React14 = __toESM(require_react());
function useOffset(min, max, step, markList, allowCross, pushable) {
  var formatRangeValue = React14.useCallback(function(val) {
    var formatNextValue = isFinite(val) ? val : min;
    formatNextValue = Math.min(max, val);
    formatNextValue = Math.max(min, formatNextValue);
    return formatNextValue;
  }, [min, max]);
  var formatStepValue = React14.useCallback(function(val) {
    if (step !== null) {
      var stepValue = min + Math.round((formatRangeValue(val) - min) / step) * step;
      var getDecimal = function getDecimal2(num) {
        return (String(num).split(".")[1] || "").length;
      };
      var maxDecimal = Math.max(getDecimal(step), getDecimal(max), getDecimal(min));
      var fixedValue = Number(stepValue.toFixed(maxDecimal));
      return min <= fixedValue && fixedValue <= max ? fixedValue : null;
    }
    return null;
  }, [step, min, max, formatRangeValue]);
  var formatValue = React14.useCallback(function(val) {
    var formatNextValue = formatRangeValue(val);
    var alignValues = markList.map(function(mark) {
      return mark.value;
    });
    if (step !== null) {
      alignValues.push(formatStepValue(val));
    }
    alignValues.push(min, max);
    var closeValue = alignValues[0];
    var closeDist = max - min;
    alignValues.forEach(function(alignValue) {
      var dist = Math.abs(formatNextValue - alignValue);
      if (dist <= closeDist) {
        closeValue = alignValue;
        closeDist = dist;
      }
    });
    return closeValue;
  }, [min, max, markList, step, formatRangeValue, formatStepValue]);
  var offsetValue = function offsetValue2(values, offset, valueIndex) {
    var mode = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "unit";
    if (typeof offset === "number") {
      var nextValue;
      var originValue = values[valueIndex];
      var targetDistValue = originValue + offset;
      var potentialValues = [];
      markList.forEach(function(mark) {
        potentialValues.push(mark.value);
      });
      potentialValues.push(min, max);
      potentialValues.push(formatStepValue(originValue));
      var sign = offset > 0 ? 1 : -1;
      if (mode === "unit") {
        potentialValues.push(formatStepValue(originValue + sign * step));
      } else {
        potentialValues.push(formatStepValue(targetDistValue));
      }
      potentialValues = potentialValues.filter(function(val) {
        return val !== null;
      }).filter(function(val) {
        return offset < 0 ? val <= originValue : val >= originValue;
      });
      if (mode === "unit") {
        potentialValues = potentialValues.filter(function(val) {
          return val !== originValue;
        });
      }
      var compareValue = mode === "unit" ? originValue : targetDistValue;
      nextValue = potentialValues[0];
      var valueDist = Math.abs(nextValue - compareValue);
      potentialValues.forEach(function(potentialValue) {
        var dist = Math.abs(potentialValue - compareValue);
        if (dist < valueDist) {
          nextValue = potentialValue;
          valueDist = dist;
        }
      });
      if (nextValue === void 0) {
        return offset < 0 ? min : max;
      }
      if (mode === "dist") {
        return nextValue;
      }
      if (Math.abs(offset) > 1) {
        var cloneValues = _toConsumableArray(values);
        cloneValues[valueIndex] = nextValue;
        return offsetValue2(cloneValues, offset - sign, valueIndex, mode);
      }
      return nextValue;
    } else if (offset === "min") {
      return min;
    } else if (offset === "max") {
      return max;
    }
  };
  var offsetChangedValue = function offsetChangedValue2(values, offset, valueIndex) {
    var mode = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "unit";
    var originValue = values[valueIndex];
    var nextValue = offsetValue(values, offset, valueIndex, mode);
    return {
      value: nextValue,
      changed: nextValue !== originValue
    };
  };
  var needPush = function needPush2(dist) {
    return pushable === null && dist === 0 || typeof pushable === "number" && dist < pushable;
  };
  var offsetValues = function offsetValues2(values, offset, valueIndex) {
    var mode = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "unit";
    var nextValues = values.map(formatValue);
    var originValue = nextValues[valueIndex];
    var nextValue = offsetValue(nextValues, offset, valueIndex, mode);
    nextValues[valueIndex] = nextValue;
    if (allowCross === false) {
      var pushNum = pushable || 0;
      if (valueIndex > 0 && nextValues[valueIndex - 1] !== originValue) {
        nextValues[valueIndex] = Math.max(nextValues[valueIndex], nextValues[valueIndex - 1] + pushNum);
      }
      if (valueIndex < nextValues.length - 1 && nextValues[valueIndex + 1] !== originValue) {
        nextValues[valueIndex] = Math.min(nextValues[valueIndex], nextValues[valueIndex + 1] - pushNum);
      }
    } else if (typeof pushable === "number" || pushable === null) {
      for (var i = valueIndex + 1; i < nextValues.length; i += 1) {
        var changed = true;
        while (needPush(nextValues[i] - nextValues[i - 1]) && changed) {
          var _offsetChangedValue = offsetChangedValue(nextValues, 1, i);
          nextValues[i] = _offsetChangedValue.value;
          changed = _offsetChangedValue.changed;
        }
      }
      for (var _i = valueIndex; _i > 0; _i -= 1) {
        var _changed = true;
        while (needPush(nextValues[_i] - nextValues[_i - 1]) && _changed) {
          var _offsetChangedValue2 = offsetChangedValue(nextValues, -1, _i - 1);
          nextValues[_i - 1] = _offsetChangedValue2.value;
          _changed = _offsetChangedValue2.changed;
        }
      }
      for (var _i2 = nextValues.length - 1; _i2 > 0; _i2 -= 1) {
        var _changed2 = true;
        while (needPush(nextValues[_i2] - nextValues[_i2 - 1]) && _changed2) {
          var _offsetChangedValue3 = offsetChangedValue(nextValues, -1, _i2 - 1);
          nextValues[_i2 - 1] = _offsetChangedValue3.value;
          _changed2 = _offsetChangedValue3.changed;
        }
      }
      for (var _i3 = 0; _i3 < nextValues.length - 1; _i3 += 1) {
        var _changed3 = true;
        while (needPush(nextValues[_i3 + 1] - nextValues[_i3]) && _changed3) {
          var _offsetChangedValue4 = offsetChangedValue(nextValues, 1, _i3 + 1);
          nextValues[_i3 + 1] = _offsetChangedValue4.value;
          _changed3 = _offsetChangedValue4.changed;
        }
      }
    }
    return {
      value: nextValues[valueIndex],
      values: nextValues
    };
  };
  return [formatValue, offsetValues];
}

// node_modules/rc-util/es/warning.js
var warned = {};
function warning(valid, message) {
  if (!valid && console !== void 0) {
    console.error("Warning: ".concat(message));
  }
}
function call(method, valid, message) {
  if (!valid && !warned[message]) {
    method(false, message);
    warned[message] = true;
  }
}
function warningOnce(valid, message) {
  call(warning, valid, message);
}
var warning_default = warningOnce;

// node_modules/rc-slider/es/Slider.js
var Slider = /* @__PURE__ */ React15.forwardRef(function(props, ref) {
  var _classNames;
  var _props$prefixCls = props.prefixCls, prefixCls = _props$prefixCls === void 0 ? "rc-slider" : _props$prefixCls, className = props.className, style = props.style, _props$disabled = props.disabled, disabled = _props$disabled === void 0 ? false : _props$disabled, _props$keyboard = props.keyboard, keyboard = _props$keyboard === void 0 ? true : _props$keyboard, autoFocus = props.autoFocus, onFocus = props.onFocus, onBlur = props.onBlur, _props$min = props.min, min = _props$min === void 0 ? 0 : _props$min, _props$max = props.max, max = _props$max === void 0 ? 100 : _props$max, _props$step = props.step, step = _props$step === void 0 ? 1 : _props$step, value = props.value, defaultValue = props.defaultValue, range = props.range, count = props.count, onChange = props.onChange, onBeforeChange = props.onBeforeChange, onAfterChange = props.onAfterChange, _props$allowCross = props.allowCross, allowCross = _props$allowCross === void 0 ? true : _props$allowCross, _props$pushable = props.pushable, pushable = _props$pushable === void 0 ? false : _props$pushable, draggableTrack = props.draggableTrack, reverse = props.reverse, vertical = props.vertical, _props$included = props.included, included = _props$included === void 0 ? true : _props$included, startPoint = props.startPoint, trackStyle = props.trackStyle, handleStyle = props.handleStyle, railStyle = props.railStyle, dotStyle = props.dotStyle, activeDotStyle = props.activeDotStyle, marks = props.marks, dots = props.dots, handleRender = props.handleRender, _props$tabIndex = props.tabIndex, tabIndex = _props$tabIndex === void 0 ? 0 : _props$tabIndex, ariaLabelForHandle = props.ariaLabelForHandle, ariaLabelledByForHandle = props.ariaLabelledByForHandle, ariaValueTextFormatterForHandle = props.ariaValueTextFormatterForHandle;
  var handlesRef = React15.useRef();
  var containerRef = React15.useRef();
  var direction = React15.useMemo(function() {
    if (vertical) {
      return reverse ? "ttb" : "btt";
    }
    return reverse ? "rtl" : "ltr";
  }, [reverse, vertical]);
  var mergedMin = React15.useMemo(function() {
    return isFinite(min) ? min : 0;
  }, [min]);
  var mergedMax = React15.useMemo(function() {
    return isFinite(max) ? max : 100;
  }, [max]);
  var mergedStep = React15.useMemo(function() {
    return step !== null && step <= 0 ? 1 : step;
  }, [step]);
  var mergedPush = React15.useMemo(function() {
    if (pushable === true) {
      return mergedStep;
    }
    return pushable >= 0 ? pushable : false;
  }, [pushable, mergedStep]);
  var markList = React15.useMemo(function() {
    var keys = Object.keys(marks || {});
    return keys.map(function(key) {
      var mark = marks[key];
      var markObj = {
        value: Number(key)
      };
      if (mark && _typeof(mark) === "object" && !/* @__PURE__ */ React15.isValidElement(mark) && ("label" in mark || "style" in mark)) {
        markObj.style = mark.style;
        markObj.label = mark.label;
      } else {
        markObj.label = mark;
      }
      return markObj;
    }).filter(function(_ref) {
      var label = _ref.label;
      return label || typeof label === "number";
    }).sort(function(a, b) {
      return a.value - b.value;
    });
  }, [marks]);
  var _useOffset = useOffset(mergedMin, mergedMax, mergedStep, markList, allowCross, mergedPush), _useOffset2 = _slicedToArray(_useOffset, 2), formatValue = _useOffset2[0], offsetValues = _useOffset2[1];
  var _useMergedState = useMergedState(defaultValue, {
    value
  }), _useMergedState2 = _slicedToArray(_useMergedState, 2), mergedValue = _useMergedState2[0], setValue = _useMergedState2[1];
  var rawValues = React15.useMemo(function() {
    var valueList = mergedValue === null || mergedValue === void 0 ? [] : Array.isArray(mergedValue) ? mergedValue : [mergedValue];
    var _valueList = _slicedToArray(valueList, 1), _valueList$ = _valueList[0], val0 = _valueList$ === void 0 ? mergedMin : _valueList$;
    var returnValues = mergedValue === null ? [] : [val0];
    if (range) {
      returnValues = _toConsumableArray(valueList);
      if (count || mergedValue === void 0) {
        var pointCount = count >= 0 ? count + 1 : 2;
        returnValues = returnValues.slice(0, pointCount);
        while (returnValues.length < pointCount) {
          var _returnValues;
          returnValues.push((_returnValues = returnValues[returnValues.length - 1]) !== null && _returnValues !== void 0 ? _returnValues : mergedMin);
        }
      }
      returnValues.sort(function(a, b) {
        return a - b;
      });
    }
    returnValues.forEach(function(val, index) {
      returnValues[index] = formatValue(val);
    });
    return returnValues;
  }, [mergedValue, range, mergedMin, count, formatValue]);
  var rawValuesRef = React15.useRef(rawValues);
  rawValuesRef.current = rawValues;
  var getTriggerValue = function getTriggerValue2(triggerValues) {
    return range ? triggerValues : triggerValues[0];
  };
  var triggerChange = function triggerChange2(nextValues) {
    var cloneNextValues = _toConsumableArray(nextValues).sort(function(a, b) {
      return a - b;
    });
    if (onChange && !(0, import_shallowequal.default)(cloneNextValues, rawValuesRef.current)) {
      onChange(getTriggerValue(cloneNextValues));
    }
    setValue(cloneNextValues);
  };
  var changeToCloseValue = function changeToCloseValue2(newValue) {
    if (!disabled) {
      var valueIndex = 0;
      var valueDist = mergedMax - mergedMin;
      rawValues.forEach(function(val, index) {
        var dist = Math.abs(newValue - val);
        if (dist <= valueDist) {
          valueDist = dist;
          valueIndex = index;
        }
      });
      var cloneNextValues = _toConsumableArray(rawValues);
      cloneNextValues[valueIndex] = newValue;
      if (range && !rawValues.length && count === void 0) {
        cloneNextValues.push(newValue);
      }
      onBeforeChange === null || onBeforeChange === void 0 ? void 0 : onBeforeChange(getTriggerValue(cloneNextValues));
      triggerChange(cloneNextValues);
      onAfterChange === null || onAfterChange === void 0 ? void 0 : onAfterChange(getTriggerValue(cloneNextValues));
    }
  };
  var onSliderMouseDown = function onSliderMouseDown2(e) {
    e.preventDefault();
    var _containerRef$current = containerRef.current.getBoundingClientRect(), width = _containerRef$current.width, height = _containerRef$current.height, left = _containerRef$current.left, top = _containerRef$current.top, bottom = _containerRef$current.bottom, right = _containerRef$current.right;
    var clientX = e.clientX, clientY = e.clientY;
    var percent;
    switch (direction) {
      case "btt":
        percent = (bottom - clientY) / height;
        break;
      case "ttb":
        percent = (clientY - top) / height;
        break;
      case "rtl":
        percent = (right - clientX) / width;
        break;
      default:
        percent = (clientX - left) / width;
    }
    var nextValue = mergedMin + percent * (mergedMax - mergedMin);
    changeToCloseValue(formatValue(nextValue));
  };
  var _React$useState = React15.useState(null), _React$useState2 = _slicedToArray(_React$useState, 2), keyboardValue = _React$useState2[0], setKeyboardValue = _React$useState2[1];
  var onHandleOffsetChange = function onHandleOffsetChange2(offset, valueIndex) {
    if (!disabled) {
      var next = offsetValues(rawValues, offset, valueIndex);
      onBeforeChange === null || onBeforeChange === void 0 ? void 0 : onBeforeChange(getTriggerValue(rawValues));
      triggerChange(next.values);
      onAfterChange === null || onAfterChange === void 0 ? void 0 : onAfterChange(getTriggerValue(next.values));
      setKeyboardValue(next.value);
    }
  };
  React15.useEffect(function() {
    if (keyboardValue !== null) {
      var valueIndex = rawValues.indexOf(keyboardValue);
      if (valueIndex >= 0) {
        handlesRef.current.focus(valueIndex);
      }
    }
    setKeyboardValue(null);
  }, [keyboardValue]);
  var mergedDraggableTrack = React15.useMemo(function() {
    if (draggableTrack && mergedStep === null) {
      if (true) {
        warning_default(false, "`draggableTrack` is not supported when `step` is `null`.");
      }
      return false;
    }
    return draggableTrack;
  }, [draggableTrack, mergedStep]);
  var finishChange = function finishChange2() {
    onAfterChange === null || onAfterChange === void 0 ? void 0 : onAfterChange(getTriggerValue(rawValuesRef.current));
  };
  var _useDrag = useDrag(containerRef, direction, rawValues, mergedMin, mergedMax, formatValue, triggerChange, finishChange, offsetValues), _useDrag2 = _slicedToArray(_useDrag, 4), draggingIndex = _useDrag2[0], draggingValue = _useDrag2[1], cacheValues = _useDrag2[2], onStartDrag = _useDrag2[3];
  var onStartMove = function onStartMove2(e, valueIndex) {
    onStartDrag(e, valueIndex);
    onBeforeChange === null || onBeforeChange === void 0 ? void 0 : onBeforeChange(getTriggerValue(rawValuesRef.current));
  };
  var dragging = draggingIndex !== -1;
  React15.useEffect(function() {
    if (!dragging) {
      var valueIndex = rawValues.lastIndexOf(draggingValue);
      handlesRef.current.focus(valueIndex);
    }
  }, [dragging]);
  var sortedCacheValues = React15.useMemo(function() {
    return _toConsumableArray(cacheValues).sort(function(a, b) {
      return a - b;
    });
  }, [cacheValues]);
  var _React$useMemo = React15.useMemo(function() {
    if (!range) {
      return [mergedMin, sortedCacheValues[0]];
    }
    return [sortedCacheValues[0], sortedCacheValues[sortedCacheValues.length - 1]];
  }, [sortedCacheValues, range, mergedMin]), _React$useMemo2 = _slicedToArray(_React$useMemo, 2), includedStart = _React$useMemo2[0], includedEnd = _React$useMemo2[1];
  React15.useImperativeHandle(ref, function() {
    return {
      focus: function focus() {
        handlesRef.current.focus(0);
      },
      blur: function blur() {
        var _document = document, activeElement = _document.activeElement;
        if (containerRef.current.contains(activeElement)) {
          activeElement === null || activeElement === void 0 ? void 0 : activeElement.blur();
        }
      }
    };
  });
  React15.useEffect(function() {
    if (autoFocus) {
      handlesRef.current.focus(0);
    }
  }, []);
  var context = React15.useMemo(function() {
    return {
      min: mergedMin,
      max: mergedMax,
      direction,
      disabled,
      keyboard,
      step: mergedStep,
      included,
      includedStart,
      includedEnd,
      range,
      tabIndex,
      ariaLabelForHandle,
      ariaLabelledByForHandle,
      ariaValueTextFormatterForHandle
    };
  }, [mergedMin, mergedMax, direction, disabled, keyboard, mergedStep, included, includedStart, includedEnd, range, tabIndex, ariaLabelForHandle, ariaLabelledByForHandle, ariaValueTextFormatterForHandle]);
  return /* @__PURE__ */ React15.createElement(context_default.Provider, {
    value: context
  }, /* @__PURE__ */ React15.createElement("div", {
    ref: containerRef,
    className: (0, import_classnames5.default)(prefixCls, className, (_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-disabled"), disabled), _defineProperty(_classNames, "".concat(prefixCls, "-vertical"), vertical), _defineProperty(_classNames, "".concat(prefixCls, "-horizontal"), !vertical), _defineProperty(_classNames, "".concat(prefixCls, "-with-marks"), markList.length), _classNames)),
    style,
    onMouseDown: onSliderMouseDown
  }, /* @__PURE__ */ React15.createElement("div", {
    className: "".concat(prefixCls, "-rail"),
    style: railStyle
  }), /* @__PURE__ */ React15.createElement(Tracks, {
    prefixCls,
    style: trackStyle,
    values: sortedCacheValues,
    startPoint,
    onStartMove: mergedDraggableTrack ? onStartMove : null
  }), /* @__PURE__ */ React15.createElement(Steps, {
    prefixCls,
    marks: markList,
    dots,
    style: dotStyle,
    activeStyle: activeDotStyle
  }), /* @__PURE__ */ React15.createElement(Handles_default, {
    ref: handlesRef,
    prefixCls,
    style: handleStyle,
    values: cacheValues,
    draggingIndex,
    onStartMove,
    onOffsetChange: onHandleOffsetChange,
    onFocus,
    onBlur,
    handleRender
  }), /* @__PURE__ */ React15.createElement(Marks, {
    prefixCls,
    marks: markList,
    onClick: changeToCloseValue
  })));
});
if (true) {
  Slider.displayName = "Slider";
}
var Slider_default = Slider;

// node_modules/rc-slider/es/index.js
var es_default = Slider_default;

// src/ui/components/search/price-range-filter.tsx
var import_jsx_dev_runtime2 = __toESM(require_jsx_dev_runtime());
var PriceRangeFilter = ({
  min,
  max,
  formRef
}) => {
  const submit = useSubmit();
  const { state: contextState, _t } = useAppContext();
  const [showSlider, setShowSlider] = (0, import_react2.useState)(false);
  const [priceValue, setPriceValue] = (0, import_react2.useState)({ min, max });
  function onRangeChange(newValue) {
    setPriceValue({ min: newValue[0], max: newValue[1] });
  }
  const minInput = (0, import_react2.useRef)(null);
  const maxInput = (0, import_react2.useRef)(null);
  function onRangeDone(newValue) {
    minInput.current.value = newValue[0];
    maxInput.current.value = newValue[1];
    submit(formRef.current);
  }
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "relative bg-grey filter-container rounded-md text-md w-60 font-bold hover:cursor-pointer", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("input", { type: "hidden", name: "min", defaultValue: min, ref: minInput }, void 0, false, {
      fileName: "src/ui/components/search/price-range-filter.tsx",
      lineNumber: 30,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("input", { type: "hidden", name: "max", defaultValue: max, ref: maxInput }, void 0, false, {
      fileName: "src/ui/components/search/price-range-filter.tsx",
      lineNumber: 31,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("p", { onClick: () => setShowSlider(!showSlider), className: "text-textBlack px-4 py-2", children: _t("search.price.range") }, void 0, false, {
      fileName: "src/ui/components/search/price-range-filter.tsx",
      lineNumber: 33,
      columnNumber: 13
    }, this),
    showSlider && /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "absolute w-full bg-grey  px-4 py-2", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(
        es_default,
        {
          range: true,
          min,
          max,
          defaultValue: [priceValue.min, priceValue.max],
          allowCross: false,
          onChange: onRangeChange,
          onAfterChange: onRangeDone,
          marks: {},
          handleStyle: {
            backgroundColor: "#000",
            border: "1px solid #000"
          },
          trackStyle: {
            backgroundColor: "#000"
          }
        },
        void 0,
        false,
        {
          fileName: "src/ui/components/search/price-range-filter.tsx",
          lineNumber: 38,
          columnNumber: 21
        },
        this
      ),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "flex justify-between mt-2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("p", { className: "text-sm", children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Price, { currencyCode: contextState.currency.code, children: priceValue.min }, void 0, false, {
          fileName: "src/ui/components/search/price-range-filter.tsx",
          lineNumber: 57,
          columnNumber: 29
        }, this) }, void 0, false, {
          fileName: "src/ui/components/search/price-range-filter.tsx",
          lineNumber: 56,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("p", { className: "text-sm", children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Price, { currencyCode: contextState.currency.code, children: priceValue.max }, void 0, false, {
          fileName: "src/ui/components/search/price-range-filter.tsx",
          lineNumber: 60,
          columnNumber: 29
        }, this) }, void 0, false, {
          fileName: "src/ui/components/search/price-range-filter.tsx",
          lineNumber: 59,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "src/ui/components/search/price-range-filter.tsx",
        lineNumber: 55,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "src/ui/components/search/price-range-filter.tsx",
      lineNumber: 37,
      columnNumber: 17
    }, this)
  ] }, void 0, true, {
    fileName: "src/ui/components/search/price-range-filter.tsx",
    lineNumber: 29,
    columnNumber: 9
  }, this);
};

// src/ui/components/search/index.tsx
var import_jsx_dev_runtime3 = __toESM(require_jsx_dev_runtime());
var Filter = ({ aggregations }) => {
  const submit = useSubmit();
  const navigate = useNavigate();
  const location = useLocation();
  const formRef = (0, import_react5.useRef)(null);
  const transition = useTransition();
  const { _t } = useAppContext();
  const price = aggregations.search.aggregations.price;
  const attributes = aggregations.search.aggregations.attributes;
  function handleChange(event) {
    submit(event.currentTarget, { replace: true });
  }
  const grouped = attributes.reduce(
    (memo, item) => {
      if (!memo[item.attribute]) {
        memo[item.attribute] = [];
      }
      memo[item.attribute].push(item);
      return memo;
    },
    {}
  );
  return /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "flex gap-5 mb-10 flex-wrap items-center justify-start", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(
      Form,
      {
        method: "get",
        action: location.pathname,
        onChange: handleChange,
        ref: formRef,
        className: "flex gap-4 flex-wrap",
        children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("label", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(
            "select",
            {
              name: "orderBy",
              className: "w-60 bg-grey py-2 px-6 rounded-md text-md font-bold ",
              defaultValue: "NAME_ASC",
              children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("option", { disabled: true, value: "", className: "text-textBlack", children: _t("search.sort") }, void 0, false, {
                  fileName: "src/ui/components/search/index.tsx",
                  lineNumber: 49,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("option", { value: "PRICE_ASC", children: _t("search.price.lowToHigh") }, void 0, false, {
                  fileName: "src/ui/components/search/index.tsx",
                  lineNumber: 52,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("option", { value: "PRICE_DESC", children: _t("search.price.highToLow") }, void 0, false, {
                  fileName: "src/ui/components/search/index.tsx",
                  lineNumber: 53,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("option", { value: "NAME_ASC", children: _t("search.name.ascending") }, void 0, false, {
                  fileName: "src/ui/components/search/index.tsx",
                  lineNumber: 54,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("option", { value: "NAME_DESC", children: _t("search.name.descending") }, void 0, false, {
                  fileName: "src/ui/components/search/index.tsx",
                  lineNumber: 55,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("option", { value: "STOCK_ASC", children: _t("search.stock.ascending") }, void 0, false, {
                  fileName: "src/ui/components/search/index.tsx",
                  lineNumber: 56,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("option", { value: "STOCK_DESC", children: _t("search.stock.descending") }, void 0, false, {
                  fileName: "src/ui/components/search/index.tsx",
                  lineNumber: 57,
                  columnNumber: 25
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "src/ui/components/search/index.tsx",
              lineNumber: 44,
              columnNumber: 21
            },
            this
          ) }, void 0, false, {
            fileName: "src/ui/components/search/index.tsx",
            lineNumber: 43,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(PriceRangeFilter, { min: price.min, max: price.max, formRef }, void 0, false, {
            fileName: "src/ui/components/search/index.tsx",
            lineNumber: 60,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(AttributeFilter, { attributes: grouped }, void 0, false, {
            fileName: "src/ui/components/search/index.tsx",
            lineNumber: 61,
            columnNumber: 17
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "src/ui/components/search/index.tsx",
        lineNumber: 36,
        columnNumber: 13
      },
      this
    ),
    transition.state === "submitting" ? /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("p", { children: [
      _t("loading"),
      "..."
    ] }, void 0, true, {
      fileName: "src/ui/components/search/index.tsx",
      lineNumber: 64,
      columnNumber: 17
    }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("button", { onClick: () => navigate(location.pathname), children: _t("search.removeAllFilters") }, void 0, false, {
      fileName: "src/ui/components/search/index.tsx",
      lineNumber: 66,
      columnNumber: 17
    }, this)
  ] }, void 0, true, {
    fileName: "src/ui/components/search/index.tsx",
    lineNumber: 35,
    columnNumber: 9
  }, this);
};

// src/ui/pages/Category.tsx
var import_jsx_dev_runtime4 = __toESM(require_jsx_dev_runtime());
var Category_default = ({
  data
}) => {
  const { category, products, priceRangeAndAttributes } = data;
  return /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(import_jsx_dev_runtime4.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "container 2xl px-5 mx-auto w-full", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("h1", { className: "text-3xl font-bold mt-10 mb-4", children: category.title }, void 0, false, {
        fileName: "src/ui/pages/Category.tsx",
        lineNumber: 21,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("p", { className: "w-3/5 mb-10", children: category.description }, void 0, false, {
        fileName: "src/ui/pages/Category.tsx",
        lineNumber: 22,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "src/ui/pages/Category.tsx",
      lineNumber: 20,
      columnNumber: 13
    }, this),
    category.hero && /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: "w-full mx-auto", children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(Grid, { grid: category.hero }, void 0, false, {
      fileName: "src/ui/pages/Category.tsx",
      lineNumber: 26,
      columnNumber: 21
    }, this) }, void 0, false, {
      fileName: "src/ui/pages/Category.tsx",
      lineNumber: 25,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)("div", { className: `container 2xl mt-2 px-5 mx-auto w-full ${category.hero ? "mt-20 pt-10" : ""}`, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(Filter, { aggregations: priceRangeAndAttributes }, void 0, false, {
        fileName: "src/ui/pages/Category.tsx",
        lineNumber: 30,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(FilteredProducts, { products }, void 0, false, {
        fileName: "src/ui/pages/Category.tsx",
        lineNumber: 31,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "src/ui/pages/Category.tsx",
      lineNumber: 29,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "src/ui/pages/Category.tsx",
    lineNumber: 19,
    columnNumber: 9
  }, this);
};

// src/routes/$langstore/shop/$folder.tsx
var import_dataFetcherForShapePage = __toESM(require_dataFetcherForShapePage());
var import_jsx_dev_runtime5 = __toESM(require_jsx_dev_runtime());
var links = () => {
  return [
    { rel: "stylesheet", href: assets_default },
    { rel: "stylesheet", href: splide_default_min_default },
    { rel: "stylesheet", href: styles_default }
  ];
};
var meta = ({ data }) => {
  return buildMetas(data);
};
var folder_default = () => {
  const { data } = useLoaderData();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(Category_default, { data }, void 0, false, {
    fileName: "src/routes/$langstore/shop/$folder.tsx",
    lineNumber: 40,
    columnNumber: 12
  }, this);
};
export {
  folder_default as default,
  links,
  meta
};
//# sourceMappingURL=/build/routes/$langstore/shop/$folder-EMGL272M.js.map

import {
  __commonJS
} from "/build/_shared/chunk-CUPSZOF3.js";

// node_modules/node-fetch/browser.js
var require_browser = __commonJS({
  "node_modules/node-fetch/browser.js"(exports, module) {
    "use strict";
    var getGlobal = function() {
      if (typeof self !== "undefined") {
        return self;
      }
      if (typeof window !== "undefined") {
        return window;
      }
      if (typeof global !== "undefined") {
        return global;
      }
      throw new Error("unable to locate global object");
    };
    var global = getGlobal();
    module.exports = exports = global.fetch;
    if (global.fetch) {
      exports.default = global.fetch.bind(global);
    }
    exports.Headers = global.Headers;
    exports.Request = global.Request;
    exports.Response = global.Response;
  }
});

// node_modules/@crystallize/js-api-client/dist/core/client.js
var require_client = __commonJS({
  "node_modules/@crystallize/js-api-client/dist/core/client.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createClient = void 0;
    var node_fetch_1 = __importDefault(require_browser());
    function authenticationHeaders(config) {
      if (config.sessionId) {
        return {
          Cookie: "connect.sid=" + config.sessionId
        };
      }
      if (config.staticAuthToken) {
        return {
          "X-Crystallize-Static-Auth-Token": config.staticAuthToken
        };
      }
      return {
        "X-Crystallize-Access-Token-Id": config.accessTokenId || "",
        "X-Crystallize-Access-Token-Secret": config.accessTokenSecret || ""
      };
    }
    async function post(path, config, query, variables, init) {
      try {
        const commonHeaders = {
          "Content-type": "application/json; charset=UTF-8",
          Accept: "application/json"
        };
        const headers = {
          ...commonHeaders,
          ...authenticationHeaders(config)
        };
        const body = JSON.stringify({ query, variables });
        const response = await (0, node_fetch_1.default)(path, {
          ...init,
          method: "POST",
          headers,
          body
        });
        if (response.ok && 204 === response.status) {
          return {};
        }
        if (!response.ok) {
          const json2 = await response.json();
          throw {
            code: response.status,
            statusText: response.statusText,
            message: json2.message,
            errors: json2.errors || {}
          };
        }
        const json = await response.json();
        if (json.errors) {
          throw {
            code: 400,
            statusText: "Error was returned from the API",
            message: json.errors[0].message,
            errors: json.errors || {}
          };
        }
        return json.data;
      } catch (exception) {
        throw exception;
      }
    }
    function createApiCaller(uri, configuration) {
      return function callApi(query, variables) {
        return post(uri, configuration, query, variables);
      };
    }
    function createClient(configuration) {
      const identifier = configuration.tenantIdentifier;
      const origin = configuration.origin || ".crystallize.com";
      const apiHost = (path, prefix = "api") => `https://${prefix}${origin}/${path.join("/")}`;
      return {
        catalogueApi: createApiCaller(apiHost([identifier, "catalogue"]), configuration),
        searchApi: createApiCaller(apiHost([identifier, "search"]), configuration),
        orderApi: createApiCaller(apiHost([identifier, "orders"]), configuration),
        subscriptionApi: createApiCaller(apiHost([identifier, "subscriptions"]), configuration),
        pimApi: createApiCaller(apiHost(["graphql"], "pim"), configuration),
        config: {
          tenantId: configuration.tenantId,
          tenantIdentifier: configuration.tenantIdentifier,
          origin: configuration.origin
        }
      };
    }
    exports.createClient = createClient;
  }
});

// node_modules/@crystallize/js-api-client/dist/core/massCallClient.js
var require_massCallClient = __commonJS({
  "node_modules/@crystallize/js-api-client/dist/core/massCallClient.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createMassCallClient = void 0;
    var createFibonnaciSleeper = () => {
      let fibonnaciA = 0, fibonnaciB = 1;
      const sleep = (s) => new Promise((r) => setTimeout(r, s * 1e3));
      return {
        wait: async () => {
          const waitTime = fibonnaciA + fibonnaciB;
          fibonnaciA = fibonnaciB;
          fibonnaciB = waitTime;
          await sleep(waitTime);
        },
        reset: () => {
          fibonnaciA = 0;
          fibonnaciB = 1;
        }
      };
    };
    function createMassCallClient(client, options) {
      let promises = [];
      let failedPromises = [];
      let seek = 0;
      const maxConcurrent = options.maxSpawn ?? 5;
      let increment = options.initialSpawn ?? 1;
      const sleeper = createFibonnaciSleeper();
      const execute = async () => {
        failedPromises = [];
        let batch = [];
        let results = [];
        do {
          let batchErrorCount = 0;
          const to = seek + increment;
          batch = promises.slice(seek, to);
          const batchResults = await Promise.all(batch.map(async (promise) => {
            const buildStandardPromise = async (promise2) => {
              try {
                return {
                  key: promise2.key,
                  result: await promise2.caller(promise2.query, promise2.variables)
                };
              } catch (exception) {
                batchErrorCount++;
                const enqueueFailure = options.onFailure ? await options.onFailure({ from: seek, to }, exception, promise2) : true;
                if (enqueueFailure) {
                  failedPromises.push(promise2);
                }
              }
            };
            if (!options.beforeRequest && !options.afterRequest) {
              return buildStandardPromise(promise);
            }
            return new Promise(async (resolve) => {
              let alteredPromise;
              if (options.beforeRequest) {
                alteredPromise = await options.beforeRequest({ from: seek, to }, promise);
              }
              const result = await buildStandardPromise(alteredPromise ?? promise);
              if (options.afterRequest && result) {
                await options.afterRequest({ from: seek, to }, promise, {
                  [result.key]: result.result
                });
              }
              resolve(result);
            });
          }));
          batchResults.forEach((result) => {
            if (result) {
              results[result.key] = result.result;
            }
          });
          if (options.onBatchDone) {
            options.onBatchDone({ from: seek, to });
          }
          seek += batch.length;
          if (batchErrorCount === batch.length) {
            await sleeper.wait();
          } else {
            sleeper.reset();
          }
          if (batchErrorCount > Math.floor(batch.length / 2)) {
            increment = 1;
          } else if (batchErrorCount > 0 && increment > 1) {
            increment--;
          } else if (batchErrorCount === 0 && increment < maxConcurrent) {
            increment++;
          }
        } while (batch.length > 0 && seek < promises.length);
        return results;
      };
      let counter = 1;
      return {
        execute,
        reset: () => {
          promises = [];
          seek = 0;
          failedPromises = [];
        },
        hasFailed: () => failedPromises.length > 0,
        failureCount: () => failedPromises.length,
        retry: async () => {
          promises = [...failedPromises];
          failedPromises = [];
          seek = 0;
          return await execute();
        },
        catalogueApi: client.catalogueApi,
        searchApi: client.searchApi,
        orderApi: client.orderApi,
        subscriptionApi: client.subscriptionApi,
        pimApi: client.pimApi,
        config: client.config,
        enqueue: {
          catalogueApi: (query, variables) => {
            const key = `catalogueApi-${counter++}`;
            promises.push({ key, caller: client.catalogueApi, query, variables });
            return key;
          },
          searchApi: (query, variables) => {
            const key = `searchApi-${counter++}`;
            promises.push({ key, caller: client.searchApi, query, variables });
            return key;
          },
          orderApi: (query, variables) => {
            const key = `orderApi-${counter++}`;
            promises.push({ key, caller: client.orderApi, query, variables });
            return key;
          },
          subscriptionApi: (query, variables) => {
            const key = `subscriptionApi-${counter++}`;
            promises.push({ key, caller: client.subscriptionApi, query, variables });
            return key;
          },
          pimApi: (query, variables) => {
            const key = `pimApi-${counter++}`;
            promises.push({ key, caller: client.pimApi, query, variables });
            return key;
          }
        }
      };
    }
    exports.createMassCallClient = createMassCallClient;
  }
});

// node_modules/json-to-graphql-query/lib/types/EnumType.js
var require_EnumType = __commonJS({
  "node_modules/json-to-graphql-query/lib/types/EnumType.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EnumType = function() {
      function EnumType2(value) {
        this.value = value;
      }
      return EnumType2;
    }();
    exports.EnumType = EnumType;
  }
});

// node_modules/json-to-graphql-query/lib/types/VariableType.js
var require_VariableType = __commonJS({
  "node_modules/json-to-graphql-query/lib/types/VariableType.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VariableType = function() {
      function VariableType2(value) {
        this.value = value;
      }
      VariableType2.prototype.toJSON = function() {
        return "$" + this.value;
      };
      return VariableType2;
    }();
    exports.VariableType = VariableType;
  }
});

// node_modules/json-to-graphql-query/lib/jsonToGraphQLQuery.js
var require_jsonToGraphQLQuery = __commonJS({
  "node_modules/json-to-graphql-query/lib/jsonToGraphQLQuery.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EnumType_1 = require_EnumType();
    var VariableType_1 = require_VariableType();
    exports.configFields = [
      "__args",
      "__alias",
      "__aliasFor",
      "__variables",
      "__directives",
      "__on",
      "__all_on",
      "__typeName",
      "__name"
    ];
    function stringify(obj_from_json) {
      if (obj_from_json instanceof EnumType_1.EnumType) {
        return obj_from_json.value;
      } else if (obj_from_json instanceof VariableType_1.VariableType) {
        return "$" + obj_from_json.value;
      } else if (typeof obj_from_json !== "object" || obj_from_json === null) {
        return JSON.stringify(obj_from_json);
      } else if (Array.isArray(obj_from_json)) {
        return "[" + obj_from_json.map(function(item) {
          return stringify(item);
        }).join(", ") + "]";
      }
      var props = Object.keys(obj_from_json).map(function(key) {
        return key + ": " + stringify(obj_from_json[key]);
      }).join(", ");
      return "{" + props + "}";
    }
    function buildArgs(argsObj) {
      var args = [];
      for (var argName in argsObj) {
        args.push(argName + ": " + stringify(argsObj[argName]));
      }
      return args.join(", ");
    }
    function buildVariables(varsObj) {
      var args = [];
      for (var varName in varsObj) {
        args.push("$" + varName + ": " + varsObj[varName]);
      }
      return args.join(", ");
    }
    function buildDirectives(dirsObj) {
      var directiveName = Object.keys(dirsObj)[0];
      var directiveValue = dirsObj[directiveName];
      if (typeof directiveValue === "boolean" || typeof directiveValue === "object" && Object.keys(directiveValue).length === 0) {
        return directiveName;
      } else if (typeof directiveValue === "object") {
        var args = [];
        for (var argName in directiveValue) {
          var argVal = stringify(directiveValue[argName]).replace(/"/g, "");
          args.push(argName + ": " + argVal);
        }
        return directiveName + "(" + args.join(", ") + ")";
      } else {
        throw new Error("Unsupported type for directive: " + typeof directiveValue + ". Types allowed: object, boolean.\n" + ("Offending object: " + JSON.stringify(dirsObj)));
      }
    }
    function getIndent(level) {
      return Array(level * 4 + 1).join(" ");
    }
    function filterNonConfigFields(fieldName, ignoreFields) {
      return exports.configFields.indexOf(fieldName) == -1 && ignoreFields.indexOf(fieldName) == -1;
    }
    function convertQuery(node, level, output, options) {
      Object.keys(node).filter(function(key) {
        return filterNonConfigFields(key, options.ignoreFields);
      }).forEach(function(key) {
        var value = node[key];
        if (typeof value === "object") {
          if (Array.isArray(value)) {
            value = value.find(function(item) {
              return item && typeof item === "object";
            });
            if (!value) {
              output.push(["" + key, level]);
              return;
            }
          }
          var fieldCount = Object.keys(value).filter(function(keyCount) {
            return filterNonConfigFields(keyCount, options.ignoreFields);
          }).length;
          var subFields = fieldCount > 0;
          var argsExist = typeof value.__args === "object" && Object.keys(value.__args).length > 0;
          var directivesExist = typeof value.__directives === "object";
          var fullFragmentsExist = value.__all_on instanceof Array;
          var partialFragmentsExist = typeof value.__on === "object";
          var token = "" + key;
          if (typeof value.__name === "string") {
            token = token + " " + value.__name;
          }
          if (typeof value.__aliasFor === "string") {
            token = token + ": " + value.__aliasFor;
          }
          if (typeof value.__variables === "object" && Object.keys(value.__variables).length > 0) {
            token = token + " (" + buildVariables(value.__variables) + ")";
          } else if (argsExist || directivesExist) {
            var argsStr = "";
            var dirsStr = "";
            if (directivesExist) {
              dirsStr = Object.entries(value.__directives).map(function(item) {
                var _a;
                return "@" + buildDirectives((_a = {}, _a[item[0]] = item[1], _a));
              }).join(" ");
            }
            if (argsExist) {
              argsStr = "(" + buildArgs(value.__args) + ")";
            }
            var spacer = directivesExist && argsExist ? " " : "";
            token = token + " " + argsStr + spacer + dirsStr;
          }
          output.push([token + (subFields || partialFragmentsExist || fullFragmentsExist ? " {" : ""), level]);
          convertQuery(value, level + 1, output, options);
          if (fullFragmentsExist) {
            value.__all_on.forEach(function(fullFragment) {
              output.push(["..." + fullFragment, level + 1]);
            });
          }
          if (partialFragmentsExist) {
            var inlineFragments = value.__on instanceof Array ? value.__on : [value.__on];
            inlineFragments.forEach(function(inlineFragment) {
              var name = inlineFragment.__typeName;
              output.push(["... on " + name + " {", level + 1]);
              convertQuery(inlineFragment, level + 2, output, options);
              output.push(["}", level + 1]);
            });
          }
          if (subFields || partialFragmentsExist || fullFragmentsExist) {
            output.push(["}", level]);
          }
        } else if (options.includeFalsyKeys === true || value) {
          output.push(["" + key, level]);
        }
      });
    }
    function jsonToGraphQLQuery(query, options) {
      if (options === void 0) {
        options = {};
      }
      if (!query || typeof query != "object") {
        throw new Error("query object not specified");
      }
      if (Object.keys(query).length == 0) {
        throw new Error("query object has no data");
      }
      if (!(options.ignoreFields instanceof Array)) {
        options.ignoreFields = [];
      }
      var queryLines = [];
      convertQuery(query, 0, queryLines, options);
      var output = "";
      queryLines.forEach(function(_a) {
        var line = _a[0], level = _a[1];
        if (options.pretty) {
          if (output) {
            output += "\n";
          }
          output += getIndent(level) + line;
        } else {
          if (output) {
            output += " ";
          }
          output += line;
        }
      });
      return output;
    }
    exports.jsonToGraphQLQuery = jsonToGraphQLQuery;
  }
});

// node_modules/json-to-graphql-query/lib/index.js
var require_lib = __commonJS({
  "node_modules/json-to-graphql-query/lib/index.js"(exports) {
    "use strict";
    function __export(m) {
      for (var p in m)
        if (!exports.hasOwnProperty(p))
          exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(require_jsonToGraphQLQuery());
    var EnumType_1 = require_EnumType();
    exports.EnumType = EnumType_1.EnumType;
    var VariableType_1 = require_VariableType();
    exports.VariableType = VariableType_1.VariableType;
  }
});

// node_modules/@crystallize/js-api-client/dist/core/navigation.js
var require_navigation = __commonJS({
  "node_modules/@crystallize/js-api-client/dist/core/navigation.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createNavigationFetcher = exports.buildNestedNavigationQuery = exports.NavigationType = void 0;
    var json_to_graphql_query_1 = require_lib();
    var NavigationType;
    (function(NavigationType2) {
      NavigationType2[NavigationType2["Tree"] = 0] = "Tree";
      NavigationType2[NavigationType2["Topics"] = 1] = "Topics";
    })(NavigationType = exports.NavigationType || (exports.NavigationType = {}));
    function nestedQuery(depth, start = 1, extraQuery) {
      const props = {
        id: true,
        name: true,
        path: true,
        ...extraQuery !== void 0 ? extraQuery(start - 1) : {}
      };
      if (depth <= 1) {
        return props;
      }
      return {
        ...props,
        children: {
          ...nestedQuery(depth - 1, start + 1, extraQuery)
        }
      };
    }
    function buildQueryFor(type, path) {
      switch (type) {
        case NavigationType.Tree:
          return {
            __variables: {
              language: "String!",
              path: "String!"
            },
            tree: {
              __aliasFor: "catalogue",
              __args: {
                language: new json_to_graphql_query_1.VariableType("language"),
                path: new json_to_graphql_query_1.VariableType("path")
              }
            }
          };
        case NavigationType.Topics:
          if (path === "" || path === "/") {
            return {
              __variables: {
                language: "String!"
              },
              tree: {
                __aliasFor: "topics",
                __args: {
                  language: new json_to_graphql_query_1.VariableType("language")
                }
              }
            };
          }
          return {
            __variables: {
              language: "String!",
              path: "String!"
            },
            tree: {
              __aliasFor: "topic",
              __args: {
                language: new json_to_graphql_query_1.VariableType("language"),
                path: new json_to_graphql_query_1.VariableType("path")
              }
            }
          };
      }
    }
    function fetchTree(client, type) {
      return (path, language, depth = 1, extraQuery, perLevel) => {
        const query = buildNestedNavigationQuery(type, path, depth, extraQuery, perLevel);
        return client.catalogueApi(query, { language, path });
      };
    }
    function buildNestedNavigationQuery(type, path, depth, extraQuery, perLevel) {
      const baseQuery = buildQueryFor(type, path);
      const query = {
        ...baseQuery,
        tree: {
          ...baseQuery.tree,
          ...nestedQuery(depth, 1, perLevel)
        },
        ...extraQuery !== void 0 ? extraQuery : {}
      };
      return (0, json_to_graphql_query_1.jsonToGraphQLQuery)({ query });
    }
    exports.buildNestedNavigationQuery = buildNestedNavigationQuery;
    function createNavigationFetcher(client) {
      return {
        byFolders: fetchTree(client, NavigationType.Tree),
        byTopics: fetchTree(client, NavigationType.Topics)
      };
    }
    exports.createNavigationFetcher = createNavigationFetcher;
  }
});

// node_modules/@crystallize/js-api-client/dist/core/hydrate.js
var require_hydrate = __commonJS({
  "node_modules/@crystallize/js-api-client/dist/core/hydrate.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createProductHydrater = void 0;
    var json_to_graphql_query_1 = require_lib();
    function byPaths(client) {
      return (paths, language, extraQuery, perProduct, perVariant) => {
        const productListQuery = paths.reduce((acc, path, index) => {
          acc[`product${index}`] = {
            __aliasFor: "catalogue",
            __args: { path, language },
            name: true,
            path: true,
            __on: {
              __typeName: "Product",
              vatType: {
                name: true,
                percent: true
              },
              variants: {
                sku: true,
                name: true,
                attributes: {
                  attribute: true,
                  value: true
                },
                priceVariants: {
                  name: true,
                  price: true,
                  identifier: true,
                  currency: true
                },
                ...perVariant !== void 0 ? perVariant(path, index) : {}
              },
              ...perProduct !== void 0 ? perProduct(path, index) : {}
            }
          };
          return acc;
        }, {});
        const query = {
          ...{ ...productListQuery },
          ...extraQuery !== void 0 ? extraQuery : {}
        };
        const fetch = client.catalogueApi;
        return fetch((0, json_to_graphql_query_1.jsonToGraphQLQuery)({ query }));
      };
    }
    function bySkus(client) {
      async function getPathForSkus(skus, language) {
        const search = client.searchApi;
        const pathsSet = /* @__PURE__ */ new Set();
        let searchAfterCursor;
        async function getNextSearchPage() {
          const searchAPIResponse = await search(`query GET_PRODUCTS_BY_SKU ($skus: [String!], $after: String, $language: String!) {
                    search (
                        after: $after
                        language: $language
                        filter: {
                            include: {
                                skus: $skus
                            }
                        }
                    ) {
                        pageInfo {
                            endCursor
                            hasNextPage
                        }
                        edges {
                            node {
                                path
                            }
                        }
                    }
                }`, {
            skus,
            after: searchAfterCursor,
            language
          });
          const { edges, pageInfo } = searchAPIResponse.search || {};
          edges?.forEach((edge) => pathsSet.add(edge.node.path));
          if (pageInfo?.hasNextPage) {
            searchAfterCursor = pageInfo.endCursor;
            await getNextSearchPage();
          }
        }
        await getNextSearchPage();
        return Array.from(pathsSet);
      }
      return async (skus, language, extraQuery, perProduct, perVariant) => {
        const paths = await getPathForSkus(skus, language);
        if (paths.length === 0) {
          const empty = skus.reduce((acc, sku, index) => {
            acc[`product${index}`] = {};
            return acc;
          }, {});
          return empty;
        }
        return byPaths(client)(paths, language, extraQuery, perProduct, perVariant);
      };
    }
    function createProductHydrater(client) {
      return {
        byPaths: byPaths(client),
        bySkus: bySkus(client)
      };
    }
    exports.createProductHydrater = createProductHydrater;
  }
});

// node_modules/zod/lib/helpers/util.js
var require_util = __commonJS({
  "node_modules/zod/lib/helpers/util.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getParsedType = exports.ZodParsedType = exports.util = void 0;
    var util;
    (function(util2) {
      util2.assertEqual = (val) => val;
      function assertIs(_arg) {
      }
      util2.assertIs = assertIs;
      function assertNever(_x) {
        throw new Error();
      }
      util2.assertNever = assertNever;
      util2.arrayToEnum = (items) => {
        const obj = {};
        for (const item of items) {
          obj[item] = item;
        }
        return obj;
      };
      util2.getValidEnumValues = (obj) => {
        const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
        const filtered = {};
        for (const k of validKeys) {
          filtered[k] = obj[k];
        }
        return util2.objectValues(filtered);
      };
      util2.objectValues = (obj) => {
        return util2.objectKeys(obj).map(function(e) {
          return obj[e];
        });
      };
      util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
        const keys = [];
        for (const key in object) {
          if (Object.prototype.hasOwnProperty.call(object, key)) {
            keys.push(key);
          }
        }
        return keys;
      };
      util2.find = (arr, checker) => {
        for (const item of arr) {
          if (checker(item))
            return item;
        }
        return void 0;
      };
      util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && isFinite(val) && Math.floor(val) === val;
      function joinValues(array, separator = " | ") {
        return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
      }
      util2.joinValues = joinValues;
      util2.jsonStringifyReplacer = (_, value) => {
        if (typeof value === "bigint") {
          return value.toString();
        }
        return value;
      };
    })(util = exports.util || (exports.util = {}));
    exports.ZodParsedType = util.arrayToEnum([
      "string",
      "nan",
      "number",
      "integer",
      "float",
      "boolean",
      "date",
      "bigint",
      "symbol",
      "function",
      "undefined",
      "null",
      "array",
      "object",
      "unknown",
      "promise",
      "void",
      "never",
      "map",
      "set"
    ]);
    var getParsedType = (data) => {
      const t = typeof data;
      switch (t) {
        case "undefined":
          return exports.ZodParsedType.undefined;
        case "string":
          return exports.ZodParsedType.string;
        case "number":
          return isNaN(data) ? exports.ZodParsedType.nan : exports.ZodParsedType.number;
        case "boolean":
          return exports.ZodParsedType.boolean;
        case "function":
          return exports.ZodParsedType.function;
        case "bigint":
          return exports.ZodParsedType.bigint;
        case "symbol":
          return exports.ZodParsedType.symbol;
        case "object":
          if (Array.isArray(data)) {
            return exports.ZodParsedType.array;
          }
          if (data === null) {
            return exports.ZodParsedType.null;
          }
          if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
            return exports.ZodParsedType.promise;
          }
          if (typeof Map !== "undefined" && data instanceof Map) {
            return exports.ZodParsedType.map;
          }
          if (typeof Set !== "undefined" && data instanceof Set) {
            return exports.ZodParsedType.set;
          }
          if (typeof Date !== "undefined" && data instanceof Date) {
            return exports.ZodParsedType.date;
          }
          return exports.ZodParsedType.object;
        default:
          return exports.ZodParsedType.unknown;
      }
    };
    exports.getParsedType = getParsedType;
  }
});

// node_modules/zod/lib/ZodError.js
var require_ZodError = __commonJS({
  "node_modules/zod/lib/ZodError.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ZodError = exports.quotelessJson = exports.ZodIssueCode = void 0;
    var util_1 = require_util();
    exports.ZodIssueCode = util_1.util.arrayToEnum([
      "invalid_type",
      "invalid_literal",
      "custom",
      "invalid_union",
      "invalid_union_discriminator",
      "invalid_enum_value",
      "unrecognized_keys",
      "invalid_arguments",
      "invalid_return_type",
      "invalid_date",
      "invalid_string",
      "too_small",
      "too_big",
      "invalid_intersection_types",
      "not_multiple_of",
      "not_finite"
    ]);
    var quotelessJson = (obj) => {
      const json = JSON.stringify(obj, null, 2);
      return json.replace(/"([^"]+)":/g, "$1:");
    };
    exports.quotelessJson = quotelessJson;
    var ZodError = class extends Error {
      constructor(issues) {
        super();
        this.issues = [];
        this.addIssue = (sub) => {
          this.issues = [...this.issues, sub];
        };
        this.addIssues = (subs = []) => {
          this.issues = [...this.issues, ...subs];
        };
        const actualProto = new.target.prototype;
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(this, actualProto);
        } else {
          this.__proto__ = actualProto;
        }
        this.name = "ZodError";
        this.issues = issues;
      }
      get errors() {
        return this.issues;
      }
      format(_mapper) {
        const mapper = _mapper || function(issue) {
          return issue.message;
        };
        const fieldErrors = { _errors: [] };
        const processError = (error) => {
          for (const issue of error.issues) {
            if (issue.code === "invalid_union") {
              issue.unionErrors.map(processError);
            } else if (issue.code === "invalid_return_type") {
              processError(issue.returnTypeError);
            } else if (issue.code === "invalid_arguments") {
              processError(issue.argumentsError);
            } else if (issue.path.length === 0) {
              fieldErrors._errors.push(mapper(issue));
            } else {
              let curr = fieldErrors;
              let i = 0;
              while (i < issue.path.length) {
                const el = issue.path[i];
                const terminal = i === issue.path.length - 1;
                if (!terminal) {
                  curr[el] = curr[el] || { _errors: [] };
                } else {
                  curr[el] = curr[el] || { _errors: [] };
                  curr[el]._errors.push(mapper(issue));
                }
                curr = curr[el];
                i++;
              }
            }
          }
        };
        processError(this);
        return fieldErrors;
      }
      toString() {
        return this.message;
      }
      get message() {
        return JSON.stringify(this.issues, util_1.util.jsonStringifyReplacer, 2);
      }
      get isEmpty() {
        return this.issues.length === 0;
      }
      flatten(mapper = (issue) => issue.message) {
        const fieldErrors = {};
        const formErrors = [];
        for (const sub of this.issues) {
          if (sub.path.length > 0) {
            fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
            fieldErrors[sub.path[0]].push(mapper(sub));
          } else {
            formErrors.push(mapper(sub));
          }
        }
        return { formErrors, fieldErrors };
      }
      get formErrors() {
        return this.flatten();
      }
    };
    exports.ZodError = ZodError;
    ZodError.create = (issues) => {
      const error = new ZodError(issues);
      return error;
    };
  }
});

// node_modules/zod/lib/locales/en.js
var require_en = __commonJS({
  "node_modules/zod/lib/locales/en.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util();
    var ZodError_1 = require_ZodError();
    var errorMap = (issue, _ctx) => {
      let message;
      switch (issue.code) {
        case ZodError_1.ZodIssueCode.invalid_type:
          if (issue.received === util_1.ZodParsedType.undefined) {
            message = "Required";
          } else {
            message = `Expected ${issue.expected}, received ${issue.received}`;
          }
          break;
        case ZodError_1.ZodIssueCode.invalid_literal:
          message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util_1.util.jsonStringifyReplacer)}`;
          break;
        case ZodError_1.ZodIssueCode.unrecognized_keys:
          message = `Unrecognized key(s) in object: ${util_1.util.joinValues(issue.keys, ", ")}`;
          break;
        case ZodError_1.ZodIssueCode.invalid_union:
          message = `Invalid input`;
          break;
        case ZodError_1.ZodIssueCode.invalid_union_discriminator:
          message = `Invalid discriminator value. Expected ${util_1.util.joinValues(issue.options)}`;
          break;
        case ZodError_1.ZodIssueCode.invalid_enum_value:
          message = `Invalid enum value. Expected ${util_1.util.joinValues(issue.options)}, received '${issue.received}'`;
          break;
        case ZodError_1.ZodIssueCode.invalid_arguments:
          message = `Invalid function arguments`;
          break;
        case ZodError_1.ZodIssueCode.invalid_return_type:
          message = `Invalid function return type`;
          break;
        case ZodError_1.ZodIssueCode.invalid_date:
          message = `Invalid date`;
          break;
        case ZodError_1.ZodIssueCode.invalid_string:
          if (typeof issue.validation === "object") {
            if ("startsWith" in issue.validation) {
              message = `Invalid input: must start with "${issue.validation.startsWith}"`;
            } else if ("endsWith" in issue.validation) {
              message = `Invalid input: must end with "${issue.validation.endsWith}"`;
            } else {
              util_1.util.assertNever(issue.validation);
            }
          } else if (issue.validation !== "regex") {
            message = `Invalid ${issue.validation}`;
          } else {
            message = "Invalid";
          }
          break;
        case ZodError_1.ZodIssueCode.too_small:
          if (issue.type === "array")
            message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
          else if (issue.type === "string")
            message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
          else if (issue.type === "number")
            message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
          else if (issue.type === "date")
            message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(issue.minimum)}`;
          else
            message = "Invalid input";
          break;
        case ZodError_1.ZodIssueCode.too_big:
          if (issue.type === "array")
            message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
          else if (issue.type === "string")
            message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
          else if (issue.type === "number")
            message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
          else if (issue.type === "date")
            message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(issue.maximum)}`;
          else
            message = "Invalid input";
          break;
        case ZodError_1.ZodIssueCode.custom:
          message = `Invalid input`;
          break;
        case ZodError_1.ZodIssueCode.invalid_intersection_types:
          message = `Intersection results could not be merged`;
          break;
        case ZodError_1.ZodIssueCode.not_multiple_of:
          message = `Number must be a multiple of ${issue.multipleOf}`;
          break;
        case ZodError_1.ZodIssueCode.not_finite:
          message = "Number must be finite";
          break;
        default:
          message = _ctx.defaultError;
          util_1.util.assertNever(issue);
      }
      return { message };
    };
    exports.default = errorMap;
  }
});

// node_modules/zod/lib/errors.js
var require_errors = __commonJS({
  "node_modules/zod/lib/errors.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getErrorMap = exports.setErrorMap = exports.defaultErrorMap = void 0;
    var en_1 = __importDefault(require_en());
    exports.defaultErrorMap = en_1.default;
    var overrideErrorMap = en_1.default;
    function setErrorMap(map) {
      overrideErrorMap = map;
    }
    exports.setErrorMap = setErrorMap;
    function getErrorMap() {
      return overrideErrorMap;
    }
    exports.getErrorMap = getErrorMap;
  }
});

// node_modules/zod/lib/helpers/parseUtil.js
var require_parseUtil = __commonJS({
  "node_modules/zod/lib/helpers/parseUtil.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isAsync = exports.isValid = exports.isDirty = exports.isAborted = exports.OK = exports.DIRTY = exports.INVALID = exports.ParseStatus = exports.addIssueToContext = exports.EMPTY_PATH = exports.makeIssue = void 0;
    var errors_1 = require_errors();
    var en_1 = __importDefault(require_en());
    var makeIssue = (params) => {
      const { data, path, errorMaps, issueData } = params;
      const fullPath = [...path, ...issueData.path || []];
      const fullIssue = {
        ...issueData,
        path: fullPath
      };
      let errorMessage = "";
      const maps = errorMaps.filter((m) => !!m).slice().reverse();
      for (const map of maps) {
        errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
      }
      return {
        ...issueData,
        path: fullPath,
        message: issueData.message || errorMessage
      };
    };
    exports.makeIssue = makeIssue;
    exports.EMPTY_PATH = [];
    function addIssueToContext(ctx, issueData) {
      const issue = (0, exports.makeIssue)({
        issueData,
        data: ctx.data,
        path: ctx.path,
        errorMaps: [
          ctx.common.contextualErrorMap,
          ctx.schemaErrorMap,
          (0, errors_1.getErrorMap)(),
          en_1.default
        ].filter((x) => !!x)
      });
      ctx.common.issues.push(issue);
    }
    exports.addIssueToContext = addIssueToContext;
    var ParseStatus = class {
      constructor() {
        this.value = "valid";
      }
      dirty() {
        if (this.value === "valid")
          this.value = "dirty";
      }
      abort() {
        if (this.value !== "aborted")
          this.value = "aborted";
      }
      static mergeArray(status, results) {
        const arrayValue = [];
        for (const s of results) {
          if (s.status === "aborted")
            return exports.INVALID;
          if (s.status === "dirty")
            status.dirty();
          arrayValue.push(s.value);
        }
        return { status: status.value, value: arrayValue };
      }
      static async mergeObjectAsync(status, pairs) {
        const syncPairs = [];
        for (const pair of pairs) {
          syncPairs.push({
            key: await pair.key,
            value: await pair.value
          });
        }
        return ParseStatus.mergeObjectSync(status, syncPairs);
      }
      static mergeObjectSync(status, pairs) {
        const finalObject = {};
        for (const pair of pairs) {
          const { key, value } = pair;
          if (key.status === "aborted")
            return exports.INVALID;
          if (value.status === "aborted")
            return exports.INVALID;
          if (key.status === "dirty")
            status.dirty();
          if (value.status === "dirty")
            status.dirty();
          if (typeof value.value !== "undefined" || pair.alwaysSet) {
            finalObject[key.value] = value.value;
          }
        }
        return { status: status.value, value: finalObject };
      }
    };
    exports.ParseStatus = ParseStatus;
    exports.INVALID = Object.freeze({
      status: "aborted"
    });
    var DIRTY = (value) => ({ status: "dirty", value });
    exports.DIRTY = DIRTY;
    var OK = (value) => ({ status: "valid", value });
    exports.OK = OK;
    var isAborted = (x) => x.status === "aborted";
    exports.isAborted = isAborted;
    var isDirty = (x) => x.status === "dirty";
    exports.isDirty = isDirty;
    var isValid = (x) => x.status === "valid";
    exports.isValid = isValid;
    var isAsync = (x) => typeof Promise !== void 0 && x instanceof Promise;
    exports.isAsync = isAsync;
  }
});

// node_modules/zod/lib/helpers/typeAliases.js
var require_typeAliases = __commonJS({
  "node_modules/zod/lib/helpers/typeAliases.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/zod/lib/helpers/errorUtil.js
var require_errorUtil = __commonJS({
  "node_modules/zod/lib/helpers/errorUtil.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.errorUtil = void 0;
    var errorUtil;
    (function(errorUtil2) {
      errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
      errorUtil2.toString = (message) => typeof message === "string" ? message : message === null || message === void 0 ? void 0 : message.message;
    })(errorUtil = exports.errorUtil || (exports.errorUtil = {}));
  }
});

// node_modules/zod/lib/types.js
var require_types = __commonJS({
  "node_modules/zod/lib/types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.date = exports.boolean = exports.bigint = exports.array = exports.any = exports.coerce = exports.ZodFirstPartyTypeKind = exports.late = exports.ZodSchema = exports.Schema = exports.custom = exports.ZodPipeline = exports.ZodBranded = exports.BRAND = exports.ZodNaN = exports.ZodCatch = exports.ZodDefault = exports.ZodNullable = exports.ZodOptional = exports.ZodTransformer = exports.ZodEffects = exports.ZodPromise = exports.ZodNativeEnum = exports.ZodEnum = exports.ZodLiteral = exports.ZodLazy = exports.ZodFunction = exports.ZodSet = exports.ZodMap = exports.ZodRecord = exports.ZodTuple = exports.ZodIntersection = exports.ZodDiscriminatedUnion = exports.ZodUnion = exports.ZodObject = exports.objectUtil = exports.ZodArray = exports.ZodVoid = exports.ZodNever = exports.ZodUnknown = exports.ZodAny = exports.ZodNull = exports.ZodUndefined = exports.ZodSymbol = exports.ZodDate = exports.ZodBoolean = exports.ZodBigInt = exports.ZodNumber = exports.ZodString = exports.ZodType = void 0;
    exports.NEVER = exports.void = exports.unknown = exports.union = exports.undefined = exports.tuple = exports.transformer = exports.symbol = exports.string = exports.strictObject = exports.set = exports.record = exports.promise = exports.preprocess = exports.pipeline = exports.ostring = exports.optional = exports.onumber = exports.oboolean = exports.object = exports.number = exports.nullable = exports.null = exports.never = exports.nativeEnum = exports.nan = exports.map = exports.literal = exports.lazy = exports.intersection = exports.instanceof = exports.function = exports.enum = exports.effect = exports.discriminatedUnion = void 0;
    var errors_1 = require_errors();
    var errorUtil_1 = require_errorUtil();
    var parseUtil_1 = require_parseUtil();
    var util_1 = require_util();
    var ZodError_1 = require_ZodError();
    var ParseInputLazyPath = class {
      constructor(parent, value, path, key) {
        this.parent = parent;
        this.data = value;
        this._path = path;
        this._key = key;
      }
      get path() {
        return this._path.concat(this._key);
      }
    };
    var handleResult = (ctx, result) => {
      if ((0, parseUtil_1.isValid)(result)) {
        return { success: true, data: result.value };
      } else {
        if (!ctx.common.issues.length) {
          throw new Error("Validation failed but no issues detected.");
        }
        const error = new ZodError_1.ZodError(ctx.common.issues);
        return { success: false, error };
      }
    };
    function processCreateParams(params) {
      if (!params)
        return {};
      const { errorMap, invalid_type_error, required_error, description } = params;
      if (errorMap && (invalid_type_error || required_error)) {
        throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
      }
      if (errorMap)
        return { errorMap, description };
      const customMap = (iss, ctx) => {
        if (iss.code !== "invalid_type")
          return { message: ctx.defaultError };
        if (typeof ctx.data === "undefined") {
          return { message: required_error !== null && required_error !== void 0 ? required_error : ctx.defaultError };
        }
        return { message: invalid_type_error !== null && invalid_type_error !== void 0 ? invalid_type_error : ctx.defaultError };
      };
      return { errorMap: customMap, description };
    }
    var ZodType = class {
      constructor(def) {
        this.spa = this.safeParseAsync;
        this._def = def;
        this.parse = this.parse.bind(this);
        this.safeParse = this.safeParse.bind(this);
        this.parseAsync = this.parseAsync.bind(this);
        this.safeParseAsync = this.safeParseAsync.bind(this);
        this.spa = this.spa.bind(this);
        this.refine = this.refine.bind(this);
        this.refinement = this.refinement.bind(this);
        this.superRefine = this.superRefine.bind(this);
        this.optional = this.optional.bind(this);
        this.nullable = this.nullable.bind(this);
        this.nullish = this.nullish.bind(this);
        this.array = this.array.bind(this);
        this.promise = this.promise.bind(this);
        this.or = this.or.bind(this);
        this.and = this.and.bind(this);
        this.transform = this.transform.bind(this);
        this.brand = this.brand.bind(this);
        this.default = this.default.bind(this);
        this.catch = this.catch.bind(this);
        this.describe = this.describe.bind(this);
        this.pipe = this.pipe.bind(this);
        this.isNullable = this.isNullable.bind(this);
        this.isOptional = this.isOptional.bind(this);
      }
      get description() {
        return this._def.description;
      }
      _getType(input) {
        return (0, util_1.getParsedType)(input.data);
      }
      _getOrReturnCtx(input, ctx) {
        return ctx || {
          common: input.parent.common,
          data: input.data,
          parsedType: (0, util_1.getParsedType)(input.data),
          schemaErrorMap: this._def.errorMap,
          path: input.path,
          parent: input.parent
        };
      }
      _processInputParams(input) {
        return {
          status: new parseUtil_1.ParseStatus(),
          ctx: {
            common: input.parent.common,
            data: input.data,
            parsedType: (0, util_1.getParsedType)(input.data),
            schemaErrorMap: this._def.errorMap,
            path: input.path,
            parent: input.parent
          }
        };
      }
      _parseSync(input) {
        const result = this._parse(input);
        if ((0, parseUtil_1.isAsync)(result)) {
          throw new Error("Synchronous parse encountered promise.");
        }
        return result;
      }
      _parseAsync(input) {
        const result = this._parse(input);
        return Promise.resolve(result);
      }
      parse(data, params) {
        const result = this.safeParse(data, params);
        if (result.success)
          return result.data;
        throw result.error;
      }
      safeParse(data, params) {
        var _a;
        const ctx = {
          common: {
            issues: [],
            async: (_a = params === null || params === void 0 ? void 0 : params.async) !== null && _a !== void 0 ? _a : false,
            contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap
          },
          path: (params === null || params === void 0 ? void 0 : params.path) || [],
          schemaErrorMap: this._def.errorMap,
          parent: null,
          data,
          parsedType: (0, util_1.getParsedType)(data)
        };
        const result = this._parseSync({ data, path: ctx.path, parent: ctx });
        return handleResult(ctx, result);
      }
      async parseAsync(data, params) {
        const result = await this.safeParseAsync(data, params);
        if (result.success)
          return result.data;
        throw result.error;
      }
      async safeParseAsync(data, params) {
        const ctx = {
          common: {
            issues: [],
            contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap,
            async: true
          },
          path: (params === null || params === void 0 ? void 0 : params.path) || [],
          schemaErrorMap: this._def.errorMap,
          parent: null,
          data,
          parsedType: (0, util_1.getParsedType)(data)
        };
        const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
        const result = await ((0, parseUtil_1.isAsync)(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
        return handleResult(ctx, result);
      }
      refine(check, message) {
        const getIssueProperties = (val) => {
          if (typeof message === "string" || typeof message === "undefined") {
            return { message };
          } else if (typeof message === "function") {
            return message(val);
          } else {
            return message;
          }
        };
        return this._refinement((val, ctx) => {
          const result = check(val);
          const setError = () => ctx.addIssue({
            code: ZodError_1.ZodIssueCode.custom,
            ...getIssueProperties(val)
          });
          if (typeof Promise !== "undefined" && result instanceof Promise) {
            return result.then((data) => {
              if (!data) {
                setError();
                return false;
              } else {
                return true;
              }
            });
          }
          if (!result) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      refinement(check, refinementData) {
        return this._refinement((val, ctx) => {
          if (!check(val)) {
            ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
            return false;
          } else {
            return true;
          }
        });
      }
      _refinement(refinement) {
        return new ZodEffects({
          schema: this,
          typeName: ZodFirstPartyTypeKind.ZodEffects,
          effect: { type: "refinement", refinement }
        });
      }
      superRefine(refinement) {
        return this._refinement(refinement);
      }
      optional() {
        return ZodOptional.create(this);
      }
      nullable() {
        return ZodNullable.create(this);
      }
      nullish() {
        return this.optional().nullable();
      }
      array() {
        return ZodArray.create(this);
      }
      promise() {
        return ZodPromise.create(this);
      }
      or(option) {
        return ZodUnion.create([this, option]);
      }
      and(incoming) {
        return ZodIntersection.create(this, incoming);
      }
      transform(transform) {
        return new ZodEffects({
          schema: this,
          typeName: ZodFirstPartyTypeKind.ZodEffects,
          effect: { type: "transform", transform }
        });
      }
      default(def) {
        const defaultValueFunc = typeof def === "function" ? def : () => def;
        return new ZodDefault({
          innerType: this,
          defaultValue: defaultValueFunc,
          typeName: ZodFirstPartyTypeKind.ZodDefault
        });
      }
      brand() {
        return new ZodBranded({
          typeName: ZodFirstPartyTypeKind.ZodBranded,
          type: this,
          ...processCreateParams(void 0)
        });
      }
      catch(def) {
        const defaultValueFunc = typeof def === "function" ? def : () => def;
        return new ZodCatch({
          innerType: this,
          defaultValue: defaultValueFunc,
          typeName: ZodFirstPartyTypeKind.ZodCatch
        });
      }
      describe(description) {
        const This = this.constructor;
        return new This({
          ...this._def,
          description
        });
      }
      pipe(target) {
        return ZodPipeline.create(this, target);
      }
      isOptional() {
        return this.safeParse(void 0).success;
      }
      isNullable() {
        return this.safeParse(null).success;
      }
    };
    exports.ZodType = ZodType;
    exports.Schema = ZodType;
    exports.ZodSchema = ZodType;
    var cuidRegex = /^c[^\s-]{8,}$/i;
    var uuidRegex = /^([a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}|00000000-0000-0000-0000-000000000000)$/i;
    var emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    var datetimeRegex = (args) => {
      if (args.precision) {
        if (args.offset) {
          return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${args.precision}}(([+-]\\d{2}:\\d{2})|Z)$`);
        } else {
          return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${args.precision}}Z$`);
        }
      } else if (args.precision === 0) {
        if (args.offset) {
          return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(([+-]\\d{2}:\\d{2})|Z)$`);
        } else {
          return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$`);
        }
      } else {
        if (args.offset) {
          return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(([+-]\\d{2}:\\d{2})|Z)$`);
        } else {
          return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?Z$`);
        }
      }
    };
    var ZodString = class extends ZodType {
      constructor() {
        super(...arguments);
        this._regex = (regex, validation, message) => this.refinement((data) => regex.test(data), {
          validation,
          code: ZodError_1.ZodIssueCode.invalid_string,
          ...errorUtil_1.errorUtil.errToObj(message)
        });
        this.nonempty = (message) => this.min(1, errorUtil_1.errorUtil.errToObj(message));
        this.trim = () => new ZodString({
          ...this._def,
          checks: [...this._def.checks, { kind: "trim" }]
        });
      }
      _parse(input) {
        if (this._def.coerce) {
          input.data = String(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== util_1.ZodParsedType.string) {
          const ctx2 = this._getOrReturnCtx(input);
          (0, parseUtil_1.addIssueToContext)(
            ctx2,
            {
              code: ZodError_1.ZodIssueCode.invalid_type,
              expected: util_1.ZodParsedType.string,
              received: ctx2.parsedType
            }
          );
          return parseUtil_1.INVALID;
        }
        const status = new parseUtil_1.ParseStatus();
        let ctx = void 0;
        for (const check of this._def.checks) {
          if (check.kind === "min") {
            if (input.data.length < check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.too_small,
                minimum: check.value,
                type: "string",
                inclusive: true,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "max") {
            if (input.data.length > check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.too_big,
                maximum: check.value,
                type: "string",
                inclusive: true,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "length") {
            const tooBig = input.data.length > check.value;
            const tooSmall = input.data.length < check.value;
            if (tooBig || tooSmall) {
              ctx = this._getOrReturnCtx(input, ctx);
              if (tooBig) {
                (0, parseUtil_1.addIssueToContext)(ctx, {
                  code: ZodError_1.ZodIssueCode.too_big,
                  maximum: check.value,
                  type: "string",
                  inclusive: true,
                  exact: true,
                  message: check.message
                });
              } else if (tooSmall) {
                (0, parseUtil_1.addIssueToContext)(ctx, {
                  code: ZodError_1.ZodIssueCode.too_small,
                  minimum: check.value,
                  type: "string",
                  inclusive: true,
                  exact: true,
                  message: check.message
                });
              }
              status.dirty();
            }
          } else if (check.kind === "email") {
            if (!emailRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              (0, parseUtil_1.addIssueToContext)(ctx, {
                validation: "email",
                code: ZodError_1.ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "uuid") {
            if (!uuidRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              (0, parseUtil_1.addIssueToContext)(ctx, {
                validation: "uuid",
                code: ZodError_1.ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "cuid") {
            if (!cuidRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              (0, parseUtil_1.addIssueToContext)(ctx, {
                validation: "cuid",
                code: ZodError_1.ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "url") {
            try {
              new URL(input.data);
            } catch (_a) {
              ctx = this._getOrReturnCtx(input, ctx);
              (0, parseUtil_1.addIssueToContext)(ctx, {
                validation: "url",
                code: ZodError_1.ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "regex") {
            check.regex.lastIndex = 0;
            const testResult = check.regex.test(input.data);
            if (!testResult) {
              ctx = this._getOrReturnCtx(input, ctx);
              (0, parseUtil_1.addIssueToContext)(ctx, {
                validation: "regex",
                code: ZodError_1.ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "trim") {
            input.data = input.data.trim();
          } else if (check.kind === "startsWith") {
            if (!input.data.startsWith(check.value)) {
              ctx = this._getOrReturnCtx(input, ctx);
              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_string,
                validation: { startsWith: check.value },
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "endsWith") {
            if (!input.data.endsWith(check.value)) {
              ctx = this._getOrReturnCtx(input, ctx);
              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_string,
                validation: { endsWith: check.value },
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "datetime") {
            const regex = datetimeRegex(check);
            if (!regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_string,
                validation: "datetime",
                message: check.message
              });
              status.dirty();
            }
          } else {
            util_1.util.assertNever(check);
          }
        }
        return { status: status.value, value: input.data };
      }
      _addCheck(check) {
        return new ZodString({
          ...this._def,
          checks: [...this._def.checks, check]
        });
      }
      email(message) {
        return this._addCheck({ kind: "email", ...errorUtil_1.errorUtil.errToObj(message) });
      }
      url(message) {
        return this._addCheck({ kind: "url", ...errorUtil_1.errorUtil.errToObj(message) });
      }
      uuid(message) {
        return this._addCheck({ kind: "uuid", ...errorUtil_1.errorUtil.errToObj(message) });
      }
      cuid(message) {
        return this._addCheck({ kind: "cuid", ...errorUtil_1.errorUtil.errToObj(message) });
      }
      datetime(options) {
        var _a;
        if (typeof options === "string") {
          return this._addCheck({
            kind: "datetime",
            precision: null,
            offset: false,
            message: options
          });
        }
        return this._addCheck({
          kind: "datetime",
          precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision,
          offset: (_a = options === null || options === void 0 ? void 0 : options.offset) !== null && _a !== void 0 ? _a : false,
          ...errorUtil_1.errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
        });
      }
      regex(regex, message) {
        return this._addCheck({
          kind: "regex",
          regex,
          ...errorUtil_1.errorUtil.errToObj(message)
        });
      }
      startsWith(value, message) {
        return this._addCheck({
          kind: "startsWith",
          value,
          ...errorUtil_1.errorUtil.errToObj(message)
        });
      }
      endsWith(value, message) {
        return this._addCheck({
          kind: "endsWith",
          value,
          ...errorUtil_1.errorUtil.errToObj(message)
        });
      }
      min(minLength, message) {
        return this._addCheck({
          kind: "min",
          value: minLength,
          ...errorUtil_1.errorUtil.errToObj(message)
        });
      }
      max(maxLength, message) {
        return this._addCheck({
          kind: "max",
          value: maxLength,
          ...errorUtil_1.errorUtil.errToObj(message)
        });
      }
      length(len, message) {
        return this._addCheck({
          kind: "length",
          value: len,
          ...errorUtil_1.errorUtil.errToObj(message)
        });
      }
      get isDatetime() {
        return !!this._def.checks.find((ch) => ch.kind === "datetime");
      }
      get isEmail() {
        return !!this._def.checks.find((ch) => ch.kind === "email");
      }
      get isURL() {
        return !!this._def.checks.find((ch) => ch.kind === "url");
      }
      get isUUID() {
        return !!this._def.checks.find((ch) => ch.kind === "uuid");
      }
      get isCUID() {
        return !!this._def.checks.find((ch) => ch.kind === "cuid");
      }
      get minLength() {
        let min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          }
        }
        return min;
      }
      get maxLength() {
        let max = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return max;
      }
    };
    exports.ZodString = ZodString;
    ZodString.create = (params) => {
      var _a;
      return new ZodString({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodString,
        coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false,
        ...processCreateParams(params)
      });
    };
    function floatSafeRemainder(val, step) {
      const valDecCount = (val.toString().split(".")[1] || "").length;
      const stepDecCount = (step.toString().split(".")[1] || "").length;
      const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
      const valInt = parseInt(val.toFixed(decCount).replace(".", ""));
      const stepInt = parseInt(step.toFixed(decCount).replace(".", ""));
      return valInt % stepInt / Math.pow(10, decCount);
    }
    var ZodNumber = class extends ZodType {
      constructor() {
        super(...arguments);
        this.min = this.gte;
        this.max = this.lte;
        this.step = this.multipleOf;
      }
      _parse(input) {
        if (this._def.coerce) {
          input.data = Number(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== util_1.ZodParsedType.number) {
          const ctx2 = this._getOrReturnCtx(input);
          (0, parseUtil_1.addIssueToContext)(ctx2, {
            code: ZodError_1.ZodIssueCode.invalid_type,
            expected: util_1.ZodParsedType.number,
            received: ctx2.parsedType
          });
          return parseUtil_1.INVALID;
        }
        let ctx = void 0;
        const status = new parseUtil_1.ParseStatus();
        for (const check of this._def.checks) {
          if (check.kind === "int") {
            if (!util_1.util.isInteger(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.invalid_type,
                expected: "integer",
                received: "float",
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "min") {
            const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
            if (tooSmall) {
              ctx = this._getOrReturnCtx(input, ctx);
              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.too_small,
                minimum: check.value,
                type: "number",
                inclusive: check.inclusive,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "max") {
            const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
            if (tooBig) {
              ctx = this._getOrReturnCtx(input, ctx);
              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.too_big,
                maximum: check.value,
                type: "number",
                inclusive: check.inclusive,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "multipleOf") {
            if (floatSafeRemainder(input.data, check.value) !== 0) {
              ctx = this._getOrReturnCtx(input, ctx);
              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.not_multiple_of,
                multipleOf: check.value,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "finite") {
            if (!Number.isFinite(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.not_finite,
                message: check.message
              });
              status.dirty();
            }
          } else {
            util_1.util.assertNever(check);
          }
        }
        return { status: status.value, value: input.data };
      }
      gte(value, message) {
        return this.setLimit("min", value, true, errorUtil_1.errorUtil.toString(message));
      }
      gt(value, message) {
        return this.setLimit("min", value, false, errorUtil_1.errorUtil.toString(message));
      }
      lte(value, message) {
        return this.setLimit("max", value, true, errorUtil_1.errorUtil.toString(message));
      }
      lt(value, message) {
        return this.setLimit("max", value, false, errorUtil_1.errorUtil.toString(message));
      }
      setLimit(kind, value, inclusive, message) {
        return new ZodNumber({
          ...this._def,
          checks: [
            ...this._def.checks,
            {
              kind,
              value,
              inclusive,
              message: errorUtil_1.errorUtil.toString(message)
            }
          ]
        });
      }
      _addCheck(check) {
        return new ZodNumber({
          ...this._def,
          checks: [...this._def.checks, check]
        });
      }
      int(message) {
        return this._addCheck({
          kind: "int",
          message: errorUtil_1.errorUtil.toString(message)
        });
      }
      positive(message) {
        return this._addCheck({
          kind: "min",
          value: 0,
          inclusive: false,
          message: errorUtil_1.errorUtil.toString(message)
        });
      }
      negative(message) {
        return this._addCheck({
          kind: "max",
          value: 0,
          inclusive: false,
          message: errorUtil_1.errorUtil.toString(message)
        });
      }
      nonpositive(message) {
        return this._addCheck({
          kind: "max",
          value: 0,
          inclusive: true,
          message: errorUtil_1.errorUtil.toString(message)
        });
      }
      nonnegative(message) {
        return this._addCheck({
          kind: "min",
          value: 0,
          inclusive: true,
          message: errorUtil_1.errorUtil.toString(message)
        });
      }
      multipleOf(value, message) {
        return this._addCheck({
          kind: "multipleOf",
          value,
          message: errorUtil_1.errorUtil.toString(message)
        });
      }
      finite(message) {
        return this._addCheck({
          kind: "finite",
          message: errorUtil_1.errorUtil.toString(message)
        });
      }
      get minValue() {
        let min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          }
        }
        return min;
      }
      get maxValue() {
        let max = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return max;
      }
      get isInt() {
        return !!this._def.checks.find((ch) => ch.kind === "int");
      }
    };
    exports.ZodNumber = ZodNumber;
    ZodNumber.create = (params) => {
      return new ZodNumber({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodNumber,
        coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
        ...processCreateParams(params)
      });
    };
    var ZodBigInt = class extends ZodType {
      _parse(input) {
        if (this._def.coerce) {
          input.data = BigInt(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== util_1.ZodParsedType.bigint) {
          const ctx = this._getOrReturnCtx(input);
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.invalid_type,
            expected: util_1.ZodParsedType.bigint,
            received: ctx.parsedType
          });
          return parseUtil_1.INVALID;
        }
        return (0, parseUtil_1.OK)(input.data);
      }
    };
    exports.ZodBigInt = ZodBigInt;
    ZodBigInt.create = (params) => {
      var _a;
      return new ZodBigInt({
        typeName: ZodFirstPartyTypeKind.ZodBigInt,
        coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false,
        ...processCreateParams(params)
      });
    };
    var ZodBoolean = class extends ZodType {
      _parse(input) {
        if (this._def.coerce) {
          input.data = Boolean(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== util_1.ZodParsedType.boolean) {
          const ctx = this._getOrReturnCtx(input);
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.invalid_type,
            expected: util_1.ZodParsedType.boolean,
            received: ctx.parsedType
          });
          return parseUtil_1.INVALID;
        }
        return (0, parseUtil_1.OK)(input.data);
      }
    };
    exports.ZodBoolean = ZodBoolean;
    ZodBoolean.create = (params) => {
      return new ZodBoolean({
        typeName: ZodFirstPartyTypeKind.ZodBoolean,
        coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
        ...processCreateParams(params)
      });
    };
    var ZodDate = class extends ZodType {
      _parse(input) {
        if (this._def.coerce) {
          input.data = new Date(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== util_1.ZodParsedType.date) {
          const ctx2 = this._getOrReturnCtx(input);
          (0, parseUtil_1.addIssueToContext)(ctx2, {
            code: ZodError_1.ZodIssueCode.invalid_type,
            expected: util_1.ZodParsedType.date,
            received: ctx2.parsedType
          });
          return parseUtil_1.INVALID;
        }
        if (isNaN(input.data.getTime())) {
          const ctx2 = this._getOrReturnCtx(input);
          (0, parseUtil_1.addIssueToContext)(ctx2, {
            code: ZodError_1.ZodIssueCode.invalid_date
          });
          return parseUtil_1.INVALID;
        }
        const status = new parseUtil_1.ParseStatus();
        let ctx = void 0;
        for (const check of this._def.checks) {
          if (check.kind === "min") {
            if (input.data.getTime() < check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.too_small,
                message: check.message,
                inclusive: true,
                exact: false,
                minimum: check.value,
                type: "date"
              });
              status.dirty();
            }
          } else if (check.kind === "max") {
            if (input.data.getTime() > check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.too_big,
                message: check.message,
                inclusive: true,
                exact: false,
                maximum: check.value,
                type: "date"
              });
              status.dirty();
            }
          } else {
            util_1.util.assertNever(check);
          }
        }
        return {
          status: status.value,
          value: new Date(input.data.getTime())
        };
      }
      _addCheck(check) {
        return new ZodDate({
          ...this._def,
          checks: [...this._def.checks, check]
        });
      }
      min(minDate, message) {
        return this._addCheck({
          kind: "min",
          value: minDate.getTime(),
          message: errorUtil_1.errorUtil.toString(message)
        });
      }
      max(maxDate, message) {
        return this._addCheck({
          kind: "max",
          value: maxDate.getTime(),
          message: errorUtil_1.errorUtil.toString(message)
        });
      }
      get minDate() {
        let min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          }
        }
        return min != null ? new Date(min) : null;
      }
      get maxDate() {
        let max = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return max != null ? new Date(max) : null;
      }
    };
    exports.ZodDate = ZodDate;
    ZodDate.create = (params) => {
      return new ZodDate({
        checks: [],
        coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
        typeName: ZodFirstPartyTypeKind.ZodDate,
        ...processCreateParams(params)
      });
    };
    var ZodSymbol = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== util_1.ZodParsedType.symbol) {
          const ctx = this._getOrReturnCtx(input);
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.invalid_type,
            expected: util_1.ZodParsedType.symbol,
            received: ctx.parsedType
          });
          return parseUtil_1.INVALID;
        }
        return (0, parseUtil_1.OK)(input.data);
      }
    };
    exports.ZodSymbol = ZodSymbol;
    ZodSymbol.create = (params) => {
      return new ZodSymbol({
        typeName: ZodFirstPartyTypeKind.ZodSymbol,
        ...processCreateParams(params)
      });
    };
    var ZodUndefined = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== util_1.ZodParsedType.undefined) {
          const ctx = this._getOrReturnCtx(input);
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.invalid_type,
            expected: util_1.ZodParsedType.undefined,
            received: ctx.parsedType
          });
          return parseUtil_1.INVALID;
        }
        return (0, parseUtil_1.OK)(input.data);
      }
    };
    exports.ZodUndefined = ZodUndefined;
    ZodUndefined.create = (params) => {
      return new ZodUndefined({
        typeName: ZodFirstPartyTypeKind.ZodUndefined,
        ...processCreateParams(params)
      });
    };
    var ZodNull = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== util_1.ZodParsedType.null) {
          const ctx = this._getOrReturnCtx(input);
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.invalid_type,
            expected: util_1.ZodParsedType.null,
            received: ctx.parsedType
          });
          return parseUtil_1.INVALID;
        }
        return (0, parseUtil_1.OK)(input.data);
      }
    };
    exports.ZodNull = ZodNull;
    ZodNull.create = (params) => {
      return new ZodNull({
        typeName: ZodFirstPartyTypeKind.ZodNull,
        ...processCreateParams(params)
      });
    };
    var ZodAny = class extends ZodType {
      constructor() {
        super(...arguments);
        this._any = true;
      }
      _parse(input) {
        return (0, parseUtil_1.OK)(input.data);
      }
    };
    exports.ZodAny = ZodAny;
    ZodAny.create = (params) => {
      return new ZodAny({
        typeName: ZodFirstPartyTypeKind.ZodAny,
        ...processCreateParams(params)
      });
    };
    var ZodUnknown = class extends ZodType {
      constructor() {
        super(...arguments);
        this._unknown = true;
      }
      _parse(input) {
        return (0, parseUtil_1.OK)(input.data);
      }
    };
    exports.ZodUnknown = ZodUnknown;
    ZodUnknown.create = (params) => {
      return new ZodUnknown({
        typeName: ZodFirstPartyTypeKind.ZodUnknown,
        ...processCreateParams(params)
      });
    };
    var ZodNever = class extends ZodType {
      _parse(input) {
        const ctx = this._getOrReturnCtx(input);
        (0, parseUtil_1.addIssueToContext)(ctx, {
          code: ZodError_1.ZodIssueCode.invalid_type,
          expected: util_1.ZodParsedType.never,
          received: ctx.parsedType
        });
        return parseUtil_1.INVALID;
      }
    };
    exports.ZodNever = ZodNever;
    ZodNever.create = (params) => {
      return new ZodNever({
        typeName: ZodFirstPartyTypeKind.ZodNever,
        ...processCreateParams(params)
      });
    };
    var ZodVoid = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== util_1.ZodParsedType.undefined) {
          const ctx = this._getOrReturnCtx(input);
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.invalid_type,
            expected: util_1.ZodParsedType.void,
            received: ctx.parsedType
          });
          return parseUtil_1.INVALID;
        }
        return (0, parseUtil_1.OK)(input.data);
      }
    };
    exports.ZodVoid = ZodVoid;
    ZodVoid.create = (params) => {
      return new ZodVoid({
        typeName: ZodFirstPartyTypeKind.ZodVoid,
        ...processCreateParams(params)
      });
    };
    var ZodArray = class extends ZodType {
      _parse(input) {
        const { ctx, status } = this._processInputParams(input);
        const def = this._def;
        if (ctx.parsedType !== util_1.ZodParsedType.array) {
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.invalid_type,
            expected: util_1.ZodParsedType.array,
            received: ctx.parsedType
          });
          return parseUtil_1.INVALID;
        }
        if (def.exactLength !== null) {
          const tooBig = ctx.data.length > def.exactLength.value;
          const tooSmall = ctx.data.length < def.exactLength.value;
          if (tooBig || tooSmall) {
            (0, parseUtil_1.addIssueToContext)(ctx, {
              code: tooBig ? ZodError_1.ZodIssueCode.too_big : ZodError_1.ZodIssueCode.too_small,
              minimum: tooSmall ? def.exactLength.value : void 0,
              maximum: tooBig ? def.exactLength.value : void 0,
              type: "array",
              inclusive: true,
              exact: true,
              message: def.exactLength.message
            });
            status.dirty();
          }
        }
        if (def.minLength !== null) {
          if (ctx.data.length < def.minLength.value) {
            (0, parseUtil_1.addIssueToContext)(ctx, {
              code: ZodError_1.ZodIssueCode.too_small,
              minimum: def.minLength.value,
              type: "array",
              inclusive: true,
              exact: false,
              message: def.minLength.message
            });
            status.dirty();
          }
        }
        if (def.maxLength !== null) {
          if (ctx.data.length > def.maxLength.value) {
            (0, parseUtil_1.addIssueToContext)(ctx, {
              code: ZodError_1.ZodIssueCode.too_big,
              maximum: def.maxLength.value,
              type: "array",
              inclusive: true,
              exact: false,
              message: def.maxLength.message
            });
            status.dirty();
          }
        }
        if (ctx.common.async) {
          return Promise.all(ctx.data.map((item, i) => {
            return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
          })).then((result2) => {
            return parseUtil_1.ParseStatus.mergeArray(status, result2);
          });
        }
        const result = ctx.data.map((item, i) => {
          return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
        });
        return parseUtil_1.ParseStatus.mergeArray(status, result);
      }
      get element() {
        return this._def.type;
      }
      min(minLength, message) {
        return new ZodArray({
          ...this._def,
          minLength: { value: minLength, message: errorUtil_1.errorUtil.toString(message) }
        });
      }
      max(maxLength, message) {
        return new ZodArray({
          ...this._def,
          maxLength: { value: maxLength, message: errorUtil_1.errorUtil.toString(message) }
        });
      }
      length(len, message) {
        return new ZodArray({
          ...this._def,
          exactLength: { value: len, message: errorUtil_1.errorUtil.toString(message) }
        });
      }
      nonempty(message) {
        return this.min(1, message);
      }
    };
    exports.ZodArray = ZodArray;
    ZodArray.create = (schema, params) => {
      return new ZodArray({
        type: schema,
        minLength: null,
        maxLength: null,
        exactLength: null,
        typeName: ZodFirstPartyTypeKind.ZodArray,
        ...processCreateParams(params)
      });
    };
    var objectUtil;
    (function(objectUtil2) {
      objectUtil2.mergeShapes = (first, second) => {
        return {
          ...first,
          ...second
        };
      };
    })(objectUtil = exports.objectUtil || (exports.objectUtil = {}));
    var AugmentFactory = (def) => (augmentation) => {
      return new ZodObject({
        ...def,
        shape: () => ({
          ...def.shape(),
          ...augmentation
        })
      });
    };
    function deepPartialify(schema) {
      if (schema instanceof ZodObject) {
        const newShape = {};
        for (const key in schema.shape) {
          const fieldSchema = schema.shape[key];
          newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
        }
        return new ZodObject({
          ...schema._def,
          shape: () => newShape
        });
      } else if (schema instanceof ZodArray) {
        return ZodArray.create(deepPartialify(schema.element));
      } else if (schema instanceof ZodOptional) {
        return ZodOptional.create(deepPartialify(schema.unwrap()));
      } else if (schema instanceof ZodNullable) {
        return ZodNullable.create(deepPartialify(schema.unwrap()));
      } else if (schema instanceof ZodTuple) {
        return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
      } else {
        return schema;
      }
    }
    var ZodObject = class extends ZodType {
      constructor() {
        super(...arguments);
        this._cached = null;
        this.nonstrict = this.passthrough;
        this.augment = AugmentFactory(this._def);
        this.extend = AugmentFactory(this._def);
      }
      _getCached() {
        if (this._cached !== null)
          return this._cached;
        const shape = this._def.shape();
        const keys = util_1.util.objectKeys(shape);
        return this._cached = { shape, keys };
      }
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== util_1.ZodParsedType.object) {
          const ctx2 = this._getOrReturnCtx(input);
          (0, parseUtil_1.addIssueToContext)(ctx2, {
            code: ZodError_1.ZodIssueCode.invalid_type,
            expected: util_1.ZodParsedType.object,
            received: ctx2.parsedType
          });
          return parseUtil_1.INVALID;
        }
        const { status, ctx } = this._processInputParams(input);
        const { shape, keys: shapeKeys } = this._getCached();
        const extraKeys = [];
        if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
          for (const key in ctx.data) {
            if (!shapeKeys.includes(key)) {
              extraKeys.push(key);
            }
          }
        }
        const pairs = [];
        for (const key of shapeKeys) {
          const keyValidator = shape[key];
          const value = ctx.data[key];
          pairs.push({
            key: { status: "valid", value: key },
            value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
            alwaysSet: key in ctx.data
          });
        }
        if (this._def.catchall instanceof ZodNever) {
          const unknownKeys = this._def.unknownKeys;
          if (unknownKeys === "passthrough") {
            for (const key of extraKeys) {
              pairs.push({
                key: { status: "valid", value: key },
                value: { status: "valid", value: ctx.data[key] }
              });
            }
          } else if (unknownKeys === "strict") {
            if (extraKeys.length > 0) {
              (0, parseUtil_1.addIssueToContext)(ctx, {
                code: ZodError_1.ZodIssueCode.unrecognized_keys,
                keys: extraKeys
              });
              status.dirty();
            }
          } else if (unknownKeys === "strip") {
          } else {
            throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
          }
        } else {
          const catchall = this._def.catchall;
          for (const key of extraKeys) {
            const value = ctx.data[key];
            pairs.push({
              key: { status: "valid", value: key },
              value: catchall._parse(
                new ParseInputLazyPath(ctx, value, ctx.path, key)
              ),
              alwaysSet: key in ctx.data
            });
          }
        }
        if (ctx.common.async) {
          return Promise.resolve().then(async () => {
            const syncPairs = [];
            for (const pair of pairs) {
              const key = await pair.key;
              syncPairs.push({
                key,
                value: await pair.value,
                alwaysSet: pair.alwaysSet
              });
            }
            return syncPairs;
          }).then((syncPairs) => {
            return parseUtil_1.ParseStatus.mergeObjectSync(status, syncPairs);
          });
        } else {
          return parseUtil_1.ParseStatus.mergeObjectSync(status, pairs);
        }
      }
      get shape() {
        return this._def.shape();
      }
      strict(message) {
        errorUtil_1.errorUtil.errToObj;
        return new ZodObject({
          ...this._def,
          unknownKeys: "strict",
          ...message !== void 0 ? {
            errorMap: (issue, ctx) => {
              var _a, _b, _c, _d;
              const defaultError = (_c = (_b = (_a = this._def).errorMap) === null || _b === void 0 ? void 0 : _b.call(_a, issue, ctx).message) !== null && _c !== void 0 ? _c : ctx.defaultError;
              if (issue.code === "unrecognized_keys")
                return {
                  message: (_d = errorUtil_1.errorUtil.errToObj(message).message) !== null && _d !== void 0 ? _d : defaultError
                };
              return {
                message: defaultError
              };
            }
          } : {}
        });
      }
      strip() {
        return new ZodObject({
          ...this._def,
          unknownKeys: "strip"
        });
      }
      passthrough() {
        return new ZodObject({
          ...this._def,
          unknownKeys: "passthrough"
        });
      }
      setKey(key, schema) {
        return this.augment({ [key]: schema });
      }
      merge(merging) {
        const merged = new ZodObject({
          unknownKeys: merging._def.unknownKeys,
          catchall: merging._def.catchall,
          shape: () => objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
          typeName: ZodFirstPartyTypeKind.ZodObject
        });
        return merged;
      }
      catchall(index) {
        return new ZodObject({
          ...this._def,
          catchall: index
        });
      }
      pick(mask) {
        const shape = {};
        util_1.util.objectKeys(mask).map((key) => {
          if (this.shape[key])
            shape[key] = this.shape[key];
        });
        return new ZodObject({
          ...this._def,
          shape: () => shape
        });
      }
      omit(mask) {
        const shape = {};
        util_1.util.objectKeys(this.shape).map((key) => {
          if (util_1.util.objectKeys(mask).indexOf(key) === -1) {
            shape[key] = this.shape[key];
          }
        });
        return new ZodObject({
          ...this._def,
          shape: () => shape
        });
      }
      deepPartial() {
        return deepPartialify(this);
      }
      partial(mask) {
        const newShape = {};
        if (mask) {
          util_1.util.objectKeys(this.shape).map((key) => {
            if (util_1.util.objectKeys(mask).indexOf(key) === -1) {
              newShape[key] = this.shape[key];
            } else {
              newShape[key] = this.shape[key].optional();
            }
          });
          return new ZodObject({
            ...this._def,
            shape: () => newShape
          });
        } else {
          for (const key in this.shape) {
            const fieldSchema = this.shape[key];
            newShape[key] = fieldSchema.optional();
          }
        }
        return new ZodObject({
          ...this._def,
          shape: () => newShape
        });
      }
      required(mask) {
        const newShape = {};
        if (mask) {
          util_1.util.objectKeys(this.shape).map((key) => {
            if (util_1.util.objectKeys(mask).indexOf(key) === -1) {
              newShape[key] = this.shape[key];
            } else {
              const fieldSchema = this.shape[key];
              let newField = fieldSchema;
              while (newField instanceof ZodOptional) {
                newField = newField._def.innerType;
              }
              newShape[key] = newField;
            }
          });
        } else {
          for (const key in this.shape) {
            const fieldSchema = this.shape[key];
            let newField = fieldSchema;
            while (newField instanceof ZodOptional) {
              newField = newField._def.innerType;
            }
            newShape[key] = newField;
          }
        }
        return new ZodObject({
          ...this._def,
          shape: () => newShape
        });
      }
      keyof() {
        return createZodEnum(util_1.util.objectKeys(this.shape));
      }
    };
    exports.ZodObject = ZodObject;
    ZodObject.create = (shape, params) => {
      return new ZodObject({
        shape: () => shape,
        unknownKeys: "strip",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params)
      });
    };
    ZodObject.strictCreate = (shape, params) => {
      return new ZodObject({
        shape: () => shape,
        unknownKeys: "strict",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params)
      });
    };
    ZodObject.lazycreate = (shape, params) => {
      return new ZodObject({
        shape,
        unknownKeys: "strip",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params)
      });
    };
    var ZodUnion = class extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        const options = this._def.options;
        function handleResults(results) {
          for (const result of results) {
            if (result.result.status === "valid") {
              return result.result;
            }
          }
          for (const result of results) {
            if (result.result.status === "dirty") {
              ctx.common.issues.push(...result.ctx.common.issues);
              return result.result;
            }
          }
          const unionErrors = results.map((result) => new ZodError_1.ZodError(result.ctx.common.issues));
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.invalid_union,
            unionErrors
          });
          return parseUtil_1.INVALID;
        }
        if (ctx.common.async) {
          return Promise.all(options.map(async (option) => {
            const childCtx = {
              ...ctx,
              common: {
                ...ctx.common,
                issues: []
              },
              parent: null
            };
            return {
              result: await option._parseAsync({
                data: ctx.data,
                path: ctx.path,
                parent: childCtx
              }),
              ctx: childCtx
            };
          })).then(handleResults);
        } else {
          let dirty = void 0;
          const issues = [];
          for (const option of options) {
            const childCtx = {
              ...ctx,
              common: {
                ...ctx.common,
                issues: []
              },
              parent: null
            };
            const result = option._parseSync({
              data: ctx.data,
              path: ctx.path,
              parent: childCtx
            });
            if (result.status === "valid") {
              return result;
            } else if (result.status === "dirty" && !dirty) {
              dirty = { result, ctx: childCtx };
            }
            if (childCtx.common.issues.length) {
              issues.push(childCtx.common.issues);
            }
          }
          if (dirty) {
            ctx.common.issues.push(...dirty.ctx.common.issues);
            return dirty.result;
          }
          const unionErrors = issues.map((issues2) => new ZodError_1.ZodError(issues2));
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.invalid_union,
            unionErrors
          });
          return parseUtil_1.INVALID;
        }
      }
      get options() {
        return this._def.options;
      }
    };
    exports.ZodUnion = ZodUnion;
    ZodUnion.create = (types, params) => {
      return new ZodUnion({
        options: types,
        typeName: ZodFirstPartyTypeKind.ZodUnion,
        ...processCreateParams(params)
      });
    };
    var getDiscriminator = (type) => {
      if (type instanceof ZodLazy) {
        return getDiscriminator(type.schema);
      } else if (type instanceof ZodEffects) {
        return getDiscriminator(type.innerType());
      } else if (type instanceof ZodLiteral) {
        return [type.value];
      } else if (type instanceof ZodEnum) {
        return type.options;
      } else if (type instanceof ZodNativeEnum) {
        return Object.keys(type.enum);
      } else if (type instanceof ZodDefault) {
        return getDiscriminator(type._def.innerType);
      } else if (type instanceof ZodUndefined) {
        return [void 0];
      } else if (type instanceof ZodNull) {
        return [null];
      } else {
        return null;
      }
    };
    var ZodDiscriminatedUnion = class extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== util_1.ZodParsedType.object) {
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.invalid_type,
            expected: util_1.ZodParsedType.object,
            received: ctx.parsedType
          });
          return parseUtil_1.INVALID;
        }
        const discriminator = this.discriminator;
        const discriminatorValue = ctx.data[discriminator];
        const option = this.optionsMap.get(discriminatorValue);
        if (!option) {
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.invalid_union_discriminator,
            options: Array.from(this.optionsMap.keys()),
            path: [discriminator]
          });
          return parseUtil_1.INVALID;
        }
        if (ctx.common.async) {
          return option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
        } else {
          return option._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
        }
      }
      get discriminator() {
        return this._def.discriminator;
      }
      get options() {
        return this._def.options;
      }
      get optionsMap() {
        return this._def.optionsMap;
      }
      static create(discriminator, options, params) {
        const optionsMap = /* @__PURE__ */ new Map();
        for (const type of options) {
          const discriminatorValues = getDiscriminator(type.shape[discriminator]);
          if (!discriminatorValues) {
            throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
          }
          for (const value of discriminatorValues) {
            if (optionsMap.has(value)) {
              throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
            }
            optionsMap.set(value, type);
          }
        }
        return new ZodDiscriminatedUnion({
          typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
          discriminator,
          options,
          optionsMap,
          ...processCreateParams(params)
        });
      }
    };
    exports.ZodDiscriminatedUnion = ZodDiscriminatedUnion;
    function mergeValues(a, b) {
      const aType = (0, util_1.getParsedType)(a);
      const bType = (0, util_1.getParsedType)(b);
      if (a === b) {
        return { valid: true, data: a };
      } else if (aType === util_1.ZodParsedType.object && bType === util_1.ZodParsedType.object) {
        const bKeys = util_1.util.objectKeys(b);
        const sharedKeys = util_1.util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
        const newObj = { ...a, ...b };
        for (const key of sharedKeys) {
          const sharedValue = mergeValues(a[key], b[key]);
          if (!sharedValue.valid) {
            return { valid: false };
          }
          newObj[key] = sharedValue.data;
        }
        return { valid: true, data: newObj };
      } else if (aType === util_1.ZodParsedType.array && bType === util_1.ZodParsedType.array) {
        if (a.length !== b.length) {
          return { valid: false };
        }
        const newArray = [];
        for (let index = 0; index < a.length; index++) {
          const itemA = a[index];
          const itemB = b[index];
          const sharedValue = mergeValues(itemA, itemB);
          if (!sharedValue.valid) {
            return { valid: false };
          }
          newArray.push(sharedValue.data);
        }
        return { valid: true, data: newArray };
      } else if (aType === util_1.ZodParsedType.date && bType === util_1.ZodParsedType.date && +a === +b) {
        return { valid: true, data: a };
      } else {
        return { valid: false };
      }
    }
    var ZodIntersection = class extends ZodType {
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        const handleParsed = (parsedLeft, parsedRight) => {
          if ((0, parseUtil_1.isAborted)(parsedLeft) || (0, parseUtil_1.isAborted)(parsedRight)) {
            return parseUtil_1.INVALID;
          }
          const merged = mergeValues(parsedLeft.value, parsedRight.value);
          if (!merged.valid) {
            (0, parseUtil_1.addIssueToContext)(ctx, {
              code: ZodError_1.ZodIssueCode.invalid_intersection_types
            });
            return parseUtil_1.INVALID;
          }
          if ((0, parseUtil_1.isDirty)(parsedLeft) || (0, parseUtil_1.isDirty)(parsedRight)) {
            status.dirty();
          }
          return { status: status.value, value: merged.data };
        };
        if (ctx.common.async) {
          return Promise.all([
            this._def.left._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            }),
            this._def.right._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            })
          ]).then(([left, right]) => handleParsed(left, right));
        } else {
          return handleParsed(this._def.left._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          }), this._def.right._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          }));
        }
      }
    };
    exports.ZodIntersection = ZodIntersection;
    ZodIntersection.create = (left, right, params) => {
      return new ZodIntersection({
        left,
        right,
        typeName: ZodFirstPartyTypeKind.ZodIntersection,
        ...processCreateParams(params)
      });
    };
    var ZodTuple = class extends ZodType {
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== util_1.ZodParsedType.array) {
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.invalid_type,
            expected: util_1.ZodParsedType.array,
            received: ctx.parsedType
          });
          return parseUtil_1.INVALID;
        }
        if (ctx.data.length < this._def.items.length) {
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.too_small,
            minimum: this._def.items.length,
            inclusive: true,
            exact: false,
            type: "array"
          });
          return parseUtil_1.INVALID;
        }
        const rest = this._def.rest;
        if (!rest && ctx.data.length > this._def.items.length) {
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.too_big,
            maximum: this._def.items.length,
            inclusive: true,
            exact: false,
            type: "array"
          });
          status.dirty();
        }
        const items = ctx.data.map((item, itemIndex) => {
          const schema = this._def.items[itemIndex] || this._def.rest;
          if (!schema)
            return null;
          return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
        }).filter((x) => !!x);
        if (ctx.common.async) {
          return Promise.all(items).then((results) => {
            return parseUtil_1.ParseStatus.mergeArray(status, results);
          });
        } else {
          return parseUtil_1.ParseStatus.mergeArray(status, items);
        }
      }
      get items() {
        return this._def.items;
      }
      rest(rest) {
        return new ZodTuple({
          ...this._def,
          rest
        });
      }
    };
    exports.ZodTuple = ZodTuple;
    ZodTuple.create = (schemas, params) => {
      if (!Array.isArray(schemas)) {
        throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
      }
      return new ZodTuple({
        items: schemas,
        typeName: ZodFirstPartyTypeKind.ZodTuple,
        rest: null,
        ...processCreateParams(params)
      });
    };
    var ZodRecord = class extends ZodType {
      get keySchema() {
        return this._def.keyType;
      }
      get valueSchema() {
        return this._def.valueType;
      }
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== util_1.ZodParsedType.object) {
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.invalid_type,
            expected: util_1.ZodParsedType.object,
            received: ctx.parsedType
          });
          return parseUtil_1.INVALID;
        }
        const pairs = [];
        const keyType = this._def.keyType;
        const valueType = this._def.valueType;
        for (const key in ctx.data) {
          pairs.push({
            key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
            value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key))
          });
        }
        if (ctx.common.async) {
          return parseUtil_1.ParseStatus.mergeObjectAsync(status, pairs);
        } else {
          return parseUtil_1.ParseStatus.mergeObjectSync(status, pairs);
        }
      }
      get element() {
        return this._def.valueType;
      }
      static create(first, second, third) {
        if (second instanceof ZodType) {
          return new ZodRecord({
            keyType: first,
            valueType: second,
            typeName: ZodFirstPartyTypeKind.ZodRecord,
            ...processCreateParams(third)
          });
        }
        return new ZodRecord({
          keyType: ZodString.create(),
          valueType: first,
          typeName: ZodFirstPartyTypeKind.ZodRecord,
          ...processCreateParams(second)
        });
      }
    };
    exports.ZodRecord = ZodRecord;
    var ZodMap = class extends ZodType {
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== util_1.ZodParsedType.map) {
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.invalid_type,
            expected: util_1.ZodParsedType.map,
            received: ctx.parsedType
          });
          return parseUtil_1.INVALID;
        }
        const keyType = this._def.keyType;
        const valueType = this._def.valueType;
        const pairs = [...ctx.data.entries()].map(([key, value], index) => {
          return {
            key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
            value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
          };
        });
        if (ctx.common.async) {
          const finalMap = /* @__PURE__ */ new Map();
          return Promise.resolve().then(async () => {
            for (const pair of pairs) {
              const key = await pair.key;
              const value = await pair.value;
              if (key.status === "aborted" || value.status === "aborted") {
                return parseUtil_1.INVALID;
              }
              if (key.status === "dirty" || value.status === "dirty") {
                status.dirty();
              }
              finalMap.set(key.value, value.value);
            }
            return { status: status.value, value: finalMap };
          });
        } else {
          const finalMap = /* @__PURE__ */ new Map();
          for (const pair of pairs) {
            const key = pair.key;
            const value = pair.value;
            if (key.status === "aborted" || value.status === "aborted") {
              return parseUtil_1.INVALID;
            }
            if (key.status === "dirty" || value.status === "dirty") {
              status.dirty();
            }
            finalMap.set(key.value, value.value);
          }
          return { status: status.value, value: finalMap };
        }
      }
    };
    exports.ZodMap = ZodMap;
    ZodMap.create = (keyType, valueType, params) => {
      return new ZodMap({
        valueType,
        keyType,
        typeName: ZodFirstPartyTypeKind.ZodMap,
        ...processCreateParams(params)
      });
    };
    var ZodSet = class extends ZodType {
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== util_1.ZodParsedType.set) {
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.invalid_type,
            expected: util_1.ZodParsedType.set,
            received: ctx.parsedType
          });
          return parseUtil_1.INVALID;
        }
        const def = this._def;
        if (def.minSize !== null) {
          if (ctx.data.size < def.minSize.value) {
            (0, parseUtil_1.addIssueToContext)(ctx, {
              code: ZodError_1.ZodIssueCode.too_small,
              minimum: def.minSize.value,
              type: "set",
              inclusive: true,
              exact: false,
              message: def.minSize.message
            });
            status.dirty();
          }
        }
        if (def.maxSize !== null) {
          if (ctx.data.size > def.maxSize.value) {
            (0, parseUtil_1.addIssueToContext)(ctx, {
              code: ZodError_1.ZodIssueCode.too_big,
              maximum: def.maxSize.value,
              type: "set",
              inclusive: true,
              exact: false,
              message: def.maxSize.message
            });
            status.dirty();
          }
        }
        const valueType = this._def.valueType;
        function finalizeSet(elements2) {
          const parsedSet = /* @__PURE__ */ new Set();
          for (const element of elements2) {
            if (element.status === "aborted")
              return parseUtil_1.INVALID;
            if (element.status === "dirty")
              status.dirty();
            parsedSet.add(element.value);
          }
          return { status: status.value, value: parsedSet };
        }
        const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
        if (ctx.common.async) {
          return Promise.all(elements).then((elements2) => finalizeSet(elements2));
        } else {
          return finalizeSet(elements);
        }
      }
      min(minSize, message) {
        return new ZodSet({
          ...this._def,
          minSize: { value: minSize, message: errorUtil_1.errorUtil.toString(message) }
        });
      }
      max(maxSize, message) {
        return new ZodSet({
          ...this._def,
          maxSize: { value: maxSize, message: errorUtil_1.errorUtil.toString(message) }
        });
      }
      size(size, message) {
        return this.min(size, message).max(size, message);
      }
      nonempty(message) {
        return this.min(1, message);
      }
    };
    exports.ZodSet = ZodSet;
    ZodSet.create = (valueType, params) => {
      return new ZodSet({
        valueType,
        minSize: null,
        maxSize: null,
        typeName: ZodFirstPartyTypeKind.ZodSet,
        ...processCreateParams(params)
      });
    };
    var ZodFunction = class extends ZodType {
      constructor() {
        super(...arguments);
        this.validate = this.implement;
      }
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== util_1.ZodParsedType.function) {
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.invalid_type,
            expected: util_1.ZodParsedType.function,
            received: ctx.parsedType
          });
          return parseUtil_1.INVALID;
        }
        function makeArgsIssue(args, error) {
          return (0, parseUtil_1.makeIssue)({
            data: args,
            path: ctx.path,
            errorMaps: [
              ctx.common.contextualErrorMap,
              ctx.schemaErrorMap,
              (0, errors_1.getErrorMap)(),
              errors_1.defaultErrorMap
            ].filter((x) => !!x),
            issueData: {
              code: ZodError_1.ZodIssueCode.invalid_arguments,
              argumentsError: error
            }
          });
        }
        function makeReturnsIssue(returns, error) {
          return (0, parseUtil_1.makeIssue)({
            data: returns,
            path: ctx.path,
            errorMaps: [
              ctx.common.contextualErrorMap,
              ctx.schemaErrorMap,
              (0, errors_1.getErrorMap)(),
              errors_1.defaultErrorMap
            ].filter((x) => !!x),
            issueData: {
              code: ZodError_1.ZodIssueCode.invalid_return_type,
              returnTypeError: error
            }
          });
        }
        const params = { errorMap: ctx.common.contextualErrorMap };
        const fn = ctx.data;
        if (this._def.returns instanceof ZodPromise) {
          return (0, parseUtil_1.OK)(async (...args) => {
            const error = new ZodError_1.ZodError([]);
            const parsedArgs = await this._def.args.parseAsync(args, params).catch((e) => {
              error.addIssue(makeArgsIssue(args, e));
              throw error;
            });
            const result = await fn(...parsedArgs);
            const parsedReturns = await this._def.returns._def.type.parseAsync(result, params).catch((e) => {
              error.addIssue(makeReturnsIssue(result, e));
              throw error;
            });
            return parsedReturns;
          });
        } else {
          return (0, parseUtil_1.OK)((...args) => {
            const parsedArgs = this._def.args.safeParse(args, params);
            if (!parsedArgs.success) {
              throw new ZodError_1.ZodError([makeArgsIssue(args, parsedArgs.error)]);
            }
            const result = fn(...parsedArgs.data);
            const parsedReturns = this._def.returns.safeParse(result, params);
            if (!parsedReturns.success) {
              throw new ZodError_1.ZodError([makeReturnsIssue(result, parsedReturns.error)]);
            }
            return parsedReturns.data;
          });
        }
      }
      parameters() {
        return this._def.args;
      }
      returnType() {
        return this._def.returns;
      }
      args(...items) {
        return new ZodFunction({
          ...this._def,
          args: ZodTuple.create(items).rest(ZodUnknown.create())
        });
      }
      returns(returnType) {
        return new ZodFunction({
          ...this._def,
          returns: returnType
        });
      }
      implement(func) {
        const validatedFunc = this.parse(func);
        return validatedFunc;
      }
      strictImplement(func) {
        const validatedFunc = this.parse(func);
        return validatedFunc;
      }
      static create(args, returns, params) {
        return new ZodFunction({
          args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
          returns: returns || ZodUnknown.create(),
          typeName: ZodFirstPartyTypeKind.ZodFunction,
          ...processCreateParams(params)
        });
      }
    };
    exports.ZodFunction = ZodFunction;
    var ZodLazy = class extends ZodType {
      get schema() {
        return this._def.getter();
      }
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        const lazySchema = this._def.getter();
        return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
      }
    };
    exports.ZodLazy = ZodLazy;
    ZodLazy.create = (getter, params) => {
      return new ZodLazy({
        getter,
        typeName: ZodFirstPartyTypeKind.ZodLazy,
        ...processCreateParams(params)
      });
    };
    var ZodLiteral = class extends ZodType {
      _parse(input) {
        if (input.data !== this._def.value) {
          const ctx = this._getOrReturnCtx(input);
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.invalid_literal,
            expected: this._def.value
          });
          return parseUtil_1.INVALID;
        }
        return { status: "valid", value: input.data };
      }
      get value() {
        return this._def.value;
      }
    };
    exports.ZodLiteral = ZodLiteral;
    ZodLiteral.create = (value, params) => {
      return new ZodLiteral({
        value,
        typeName: ZodFirstPartyTypeKind.ZodLiteral,
        ...processCreateParams(params)
      });
    };
    function createZodEnum(values, params) {
      return new ZodEnum({
        values,
        typeName: ZodFirstPartyTypeKind.ZodEnum,
        ...processCreateParams(params)
      });
    }
    var ZodEnum = class extends ZodType {
      _parse(input) {
        if (typeof input.data !== "string") {
          const ctx = this._getOrReturnCtx(input);
          const expectedValues = this._def.values;
          (0, parseUtil_1.addIssueToContext)(ctx, {
            expected: util_1.util.joinValues(expectedValues),
            received: ctx.parsedType,
            code: ZodError_1.ZodIssueCode.invalid_type
          });
          return parseUtil_1.INVALID;
        }
        if (this._def.values.indexOf(input.data) === -1) {
          const ctx = this._getOrReturnCtx(input);
          const expectedValues = this._def.values;
          (0, parseUtil_1.addIssueToContext)(ctx, {
            received: ctx.data,
            code: ZodError_1.ZodIssueCode.invalid_enum_value,
            options: expectedValues
          });
          return parseUtil_1.INVALID;
        }
        return (0, parseUtil_1.OK)(input.data);
      }
      get options() {
        return this._def.values;
      }
      get enum() {
        const enumValues = {};
        for (const val of this._def.values) {
          enumValues[val] = val;
        }
        return enumValues;
      }
      get Values() {
        const enumValues = {};
        for (const val of this._def.values) {
          enumValues[val] = val;
        }
        return enumValues;
      }
      get Enum() {
        const enumValues = {};
        for (const val of this._def.values) {
          enumValues[val] = val;
        }
        return enumValues;
      }
    };
    exports.ZodEnum = ZodEnum;
    ZodEnum.create = createZodEnum;
    var ZodNativeEnum = class extends ZodType {
      _parse(input) {
        const nativeEnumValues = util_1.util.getValidEnumValues(this._def.values);
        const ctx = this._getOrReturnCtx(input);
        if (ctx.parsedType !== util_1.ZodParsedType.string && ctx.parsedType !== util_1.ZodParsedType.number) {
          const expectedValues = util_1.util.objectValues(nativeEnumValues);
          (0, parseUtil_1.addIssueToContext)(ctx, {
            expected: util_1.util.joinValues(expectedValues),
            received: ctx.parsedType,
            code: ZodError_1.ZodIssueCode.invalid_type
          });
          return parseUtil_1.INVALID;
        }
        if (nativeEnumValues.indexOf(input.data) === -1) {
          const expectedValues = util_1.util.objectValues(nativeEnumValues);
          (0, parseUtil_1.addIssueToContext)(ctx, {
            received: ctx.data,
            code: ZodError_1.ZodIssueCode.invalid_enum_value,
            options: expectedValues
          });
          return parseUtil_1.INVALID;
        }
        return (0, parseUtil_1.OK)(input.data);
      }
      get enum() {
        return this._def.values;
      }
    };
    exports.ZodNativeEnum = ZodNativeEnum;
    ZodNativeEnum.create = (values, params) => {
      return new ZodNativeEnum({
        values,
        typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
        ...processCreateParams(params)
      });
    };
    var ZodPromise = class extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== util_1.ZodParsedType.promise && ctx.common.async === false) {
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.invalid_type,
            expected: util_1.ZodParsedType.promise,
            received: ctx.parsedType
          });
          return parseUtil_1.INVALID;
        }
        const promisified = ctx.parsedType === util_1.ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
        return (0, parseUtil_1.OK)(promisified.then((data) => {
          return this._def.type.parseAsync(data, {
            path: ctx.path,
            errorMap: ctx.common.contextualErrorMap
          });
        }));
      }
    };
    exports.ZodPromise = ZodPromise;
    ZodPromise.create = (schema, params) => {
      return new ZodPromise({
        type: schema,
        typeName: ZodFirstPartyTypeKind.ZodPromise,
        ...processCreateParams(params)
      });
    };
    var ZodEffects = class extends ZodType {
      innerType() {
        return this._def.schema;
      }
      sourceType() {
        return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
      }
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        const effect = this._def.effect || null;
        if (effect.type === "preprocess") {
          const processed = effect.transform(ctx.data);
          if (ctx.common.async) {
            return Promise.resolve(processed).then((processed2) => {
              return this._def.schema._parseAsync({
                data: processed2,
                path: ctx.path,
                parent: ctx
              });
            });
          } else {
            return this._def.schema._parseSync({
              data: processed,
              path: ctx.path,
              parent: ctx
            });
          }
        }
        const checkCtx = {
          addIssue: (arg) => {
            (0, parseUtil_1.addIssueToContext)(ctx, arg);
            if (arg.fatal) {
              status.abort();
            } else {
              status.dirty();
            }
          },
          get path() {
            return ctx.path;
          }
        };
        checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
        if (effect.type === "refinement") {
          const executeRefinement = (acc) => {
            const result = effect.refinement(acc, checkCtx);
            if (ctx.common.async) {
              return Promise.resolve(result);
            }
            if (result instanceof Promise) {
              throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
            }
            return acc;
          };
          if (ctx.common.async === false) {
            const inner = this._def.schema._parseSync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            });
            if (inner.status === "aborted")
              return parseUtil_1.INVALID;
            if (inner.status === "dirty")
              status.dirty();
            executeRefinement(inner.value);
            return { status: status.value, value: inner.value };
          } else {
            return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
              if (inner.status === "aborted")
                return parseUtil_1.INVALID;
              if (inner.status === "dirty")
                status.dirty();
              return executeRefinement(inner.value).then(() => {
                return { status: status.value, value: inner.value };
              });
            });
          }
        }
        if (effect.type === "transform") {
          if (ctx.common.async === false) {
            const base = this._def.schema._parseSync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            });
            if (!(0, parseUtil_1.isValid)(base))
              return base;
            const result = effect.transform(base.value, checkCtx);
            if (result instanceof Promise) {
              throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
            }
            return { status: status.value, value: result };
          } else {
            return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
              if (!(0, parseUtil_1.isValid)(base))
                return base;
              return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({ status: status.value, value: result }));
            });
          }
        }
        util_1.util.assertNever(effect);
      }
    };
    exports.ZodEffects = ZodEffects;
    exports.ZodTransformer = ZodEffects;
    ZodEffects.create = (schema, effect, params) => {
      return new ZodEffects({
        schema,
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        effect,
        ...processCreateParams(params)
      });
    };
    ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
      return new ZodEffects({
        schema,
        effect: { type: "preprocess", transform: preprocess },
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        ...processCreateParams(params)
      });
    };
    var ZodOptional = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType === util_1.ZodParsedType.undefined) {
          return (0, parseUtil_1.OK)(void 0);
        }
        return this._def.innerType._parse(input);
      }
      unwrap() {
        return this._def.innerType;
      }
    };
    exports.ZodOptional = ZodOptional;
    ZodOptional.create = (type, params) => {
      return new ZodOptional({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodOptional,
        ...processCreateParams(params)
      });
    };
    var ZodNullable = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType === util_1.ZodParsedType.null) {
          return (0, parseUtil_1.OK)(null);
        }
        return this._def.innerType._parse(input);
      }
      unwrap() {
        return this._def.innerType;
      }
    };
    exports.ZodNullable = ZodNullable;
    ZodNullable.create = (type, params) => {
      return new ZodNullable({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodNullable,
        ...processCreateParams(params)
      });
    };
    var ZodDefault = class extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        let data = ctx.data;
        if (ctx.parsedType === util_1.ZodParsedType.undefined) {
          data = this._def.defaultValue();
        }
        return this._def.innerType._parse({
          data,
          path: ctx.path,
          parent: ctx
        });
      }
      removeDefault() {
        return this._def.innerType;
      }
    };
    exports.ZodDefault = ZodDefault;
    ZodDefault.create = (type, params) => {
      return new ZodDefault({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodDefault,
        defaultValue: typeof params.default === "function" ? params.default : () => params.default,
        ...processCreateParams(params)
      });
    };
    var ZodCatch = class extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        const result = this._def.innerType._parse({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if ((0, parseUtil_1.isAsync)(result)) {
          return result.then((result2) => {
            return {
              status: "valid",
              value: result2.status === "valid" ? result2.value : this._def.defaultValue()
            };
          });
        } else {
          return {
            status: "valid",
            value: result.status === "valid" ? result.value : this._def.defaultValue()
          };
        }
      }
      removeDefault() {
        return this._def.innerType;
      }
    };
    exports.ZodCatch = ZodCatch;
    ZodCatch.create = (type, params) => {
      return new ZodCatch({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodCatch,
        defaultValue: typeof params.default === "function" ? params.default : () => params.default,
        ...processCreateParams(params)
      });
    };
    var ZodNaN = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== util_1.ZodParsedType.nan) {
          const ctx = this._getOrReturnCtx(input);
          (0, parseUtil_1.addIssueToContext)(ctx, {
            code: ZodError_1.ZodIssueCode.invalid_type,
            expected: util_1.ZodParsedType.nan,
            received: ctx.parsedType
          });
          return parseUtil_1.INVALID;
        }
        return { status: "valid", value: input.data };
      }
    };
    exports.ZodNaN = ZodNaN;
    ZodNaN.create = (params) => {
      return new ZodNaN({
        typeName: ZodFirstPartyTypeKind.ZodNaN,
        ...processCreateParams(params)
      });
    };
    exports.BRAND = Symbol("zod_brand");
    var ZodBranded = class extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        const data = ctx.data;
        return this._def.type._parse({
          data,
          path: ctx.path,
          parent: ctx
        });
      }
      unwrap() {
        return this._def.type;
      }
    };
    exports.ZodBranded = ZodBranded;
    var ZodPipeline = class extends ZodType {
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.common.async) {
          const handleAsync = async () => {
            const inResult = await this._def.in._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            });
            if (inResult.status === "aborted")
              return parseUtil_1.INVALID;
            if (inResult.status === "dirty") {
              status.dirty();
              return (0, parseUtil_1.DIRTY)(inResult.value);
            } else {
              return this._def.out._parseAsync({
                data: inResult.value,
                path: ctx.path,
                parent: ctx
              });
            }
          };
          return handleAsync();
        } else {
          const inResult = this._def.in._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
          if (inResult.status === "aborted")
            return parseUtil_1.INVALID;
          if (inResult.status === "dirty") {
            status.dirty();
            return {
              status: "dirty",
              value: inResult.value
            };
          } else {
            return this._def.out._parseSync({
              data: inResult.value,
              path: ctx.path,
              parent: ctx
            });
          }
        }
      }
      static create(a, b) {
        return new ZodPipeline({
          in: a,
          out: b,
          typeName: ZodFirstPartyTypeKind.ZodPipeline
        });
      }
    };
    exports.ZodPipeline = ZodPipeline;
    var custom = (check, params = {}, fatal) => {
      if (check)
        return ZodAny.create().superRefine((data, ctx) => {
          if (!check(data)) {
            const p = typeof params === "function" ? params(data) : params;
            const p2 = typeof p === "string" ? { message: p } : p;
            ctx.addIssue({ code: "custom", ...p2, fatal });
          }
        });
      return ZodAny.create();
    };
    exports.custom = custom;
    exports.late = {
      object: ZodObject.lazycreate
    };
    var ZodFirstPartyTypeKind;
    (function(ZodFirstPartyTypeKind2) {
      ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
      ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
      ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
      ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
      ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
      ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
      ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
      ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
      ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
      ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
      ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
      ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
      ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
      ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
      ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
      ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
      ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
      ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
      ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
      ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
      ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
      ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
      ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
      ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
      ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
      ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
      ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
      ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
      ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
      ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
      ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
      ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
      ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
      ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
      ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
    })(ZodFirstPartyTypeKind = exports.ZodFirstPartyTypeKind || (exports.ZodFirstPartyTypeKind = {}));
    var instanceOfType = (cls, params = {
      message: `Input not instance of ${cls.name}`
    }) => (0, exports.custom)((data) => data instanceof cls, params, true);
    exports.instanceof = instanceOfType;
    var stringType = ZodString.create;
    exports.string = stringType;
    var numberType = ZodNumber.create;
    exports.number = numberType;
    var nanType = ZodNaN.create;
    exports.nan = nanType;
    var bigIntType = ZodBigInt.create;
    exports.bigint = bigIntType;
    var booleanType = ZodBoolean.create;
    exports.boolean = booleanType;
    var dateType = ZodDate.create;
    exports.date = dateType;
    var symbolType = ZodSymbol.create;
    exports.symbol = symbolType;
    var undefinedType = ZodUndefined.create;
    exports.undefined = undefinedType;
    var nullType = ZodNull.create;
    exports.null = nullType;
    var anyType = ZodAny.create;
    exports.any = anyType;
    var unknownType = ZodUnknown.create;
    exports.unknown = unknownType;
    var neverType = ZodNever.create;
    exports.never = neverType;
    var voidType = ZodVoid.create;
    exports.void = voidType;
    var arrayType = ZodArray.create;
    exports.array = arrayType;
    var objectType = ZodObject.create;
    exports.object = objectType;
    var strictObjectType = ZodObject.strictCreate;
    exports.strictObject = strictObjectType;
    var unionType = ZodUnion.create;
    exports.union = unionType;
    var discriminatedUnionType = ZodDiscriminatedUnion.create;
    exports.discriminatedUnion = discriminatedUnionType;
    var intersectionType = ZodIntersection.create;
    exports.intersection = intersectionType;
    var tupleType = ZodTuple.create;
    exports.tuple = tupleType;
    var recordType = ZodRecord.create;
    exports.record = recordType;
    var mapType = ZodMap.create;
    exports.map = mapType;
    var setType = ZodSet.create;
    exports.set = setType;
    var functionType = ZodFunction.create;
    exports.function = functionType;
    var lazyType = ZodLazy.create;
    exports.lazy = lazyType;
    var literalType = ZodLiteral.create;
    exports.literal = literalType;
    var enumType = ZodEnum.create;
    exports.enum = enumType;
    var nativeEnumType = ZodNativeEnum.create;
    exports.nativeEnum = nativeEnumType;
    var promiseType = ZodPromise.create;
    exports.promise = promiseType;
    var effectsType = ZodEffects.create;
    exports.effect = effectsType;
    exports.transformer = effectsType;
    var optionalType = ZodOptional.create;
    exports.optional = optionalType;
    var nullableType = ZodNullable.create;
    exports.nullable = nullableType;
    var preprocessType = ZodEffects.createWithPreprocess;
    exports.preprocess = preprocessType;
    var pipelineType = ZodPipeline.create;
    exports.pipeline = pipelineType;
    var ostring = () => stringType().optional();
    exports.ostring = ostring;
    var onumber = () => numberType().optional();
    exports.onumber = onumber;
    var oboolean = () => booleanType().optional();
    exports.oboolean = oboolean;
    exports.coerce = {
      string: (arg) => ZodString.create({ ...arg, coerce: true }),
      number: (arg) => ZodNumber.create({ ...arg, coerce: true }),
      boolean: (arg) => ZodBoolean.create({ ...arg, coerce: true }),
      bigint: (arg) => ZodBigInt.create({ ...arg, coerce: true }),
      date: (arg) => ZodDate.create({ ...arg, coerce: true })
    };
    exports.NEVER = parseUtil_1.INVALID;
  }
});

// node_modules/zod/lib/external.js
var require_external = __commonJS({
  "node_modules/zod/lib/external.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_errors(), exports);
    __exportStar(require_parseUtil(), exports);
    __exportStar(require_typeAliases(), exports);
    __exportStar(require_util(), exports);
    __exportStar(require_types(), exports);
    __exportStar(require_ZodError(), exports);
  }
});

// node_modules/zod/lib/index.js
var require_lib2 = __commonJS({
  "node_modules/zod/lib/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod2) {
      if (mod2 && mod2.__esModule)
        return mod2;
      var result = {};
      if (mod2 != null) {
        for (var k in mod2)
          if (k !== "default" && Object.prototype.hasOwnProperty.call(mod2, k))
            __createBinding(result, mod2, k);
      }
      __setModuleDefault(result, mod2);
      return result;
    };
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.z = void 0;
    var mod = __importStar(require_external());
    exports.z = mod;
    __exportStar(require_external(), exports);
    exports.default = mod;
  }
});

// node_modules/@crystallize/js-api-client/dist/types/catalogue.js
var require_catalogue = __commonJS({
  "node_modules/@crystallize/js-api-client/dist/types/catalogue.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.componentType = void 0;
    var zod_1 = require_lib2();
    exports.componentType = zod_1.z.enum([
      "Boolean",
      "ComponentChoice",
      "ContentChunk",
      "Datetime",
      "File",
      "GridRelations",
      "Image",
      "ItemRelations",
      "Location",
      "Numeric",
      "ParagraphCollection",
      "PropertiesTable",
      "RichText",
      "Selection",
      "SingleLine",
      "Video"
    ]).transform((value) => `${value}Content`);
  }
});

// node_modules/@crystallize/js-api-client/dist/core/catalogue.js
var require_catalogue2 = __commonJS({
  "node_modules/@crystallize/js-api-client/dist/core/catalogue.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.catalogueFetcherGraphqlBuilder = exports.createCatalogueFetcher = void 0;
    var json_to_graphql_query_1 = require_lib();
    var catalogue_1 = require_catalogue();
    function createCatalogueFetcher(client) {
      return (query, variables) => {
        return client.catalogueApi((0, json_to_graphql_query_1.jsonToGraphQLQuery)({ query }), variables);
      };
    }
    exports.createCatalogueFetcher = createCatalogueFetcher;
    exports.catalogueFetcherGraphqlBuilder = {
      onItem,
      onProduct,
      onDocument,
      onFolder,
      onComponent,
      onSubscriptionPlan
    };
    function onItem(onItem2, c) {
      return {
        __typeName: "Item",
        __typename: true,
        name: true,
        path: true,
        ...onItem2,
        topics: {
          name: true,
          path: true,
          ...c?.onTopic ? c.onTopic : {}
        }
      };
    }
    function onDocument(onDocument2, c) {
      return {
        __typeName: "Document",
        __typename: true,
        ...onDocument2
      };
    }
    function onFolder(onFolder2, c) {
      const children = () => {
        if (c?.onChildren) {
          return {
            chidlren: {
              ...c.onChildren
            }
          };
        }
        return {};
      };
      return {
        __typeName: "Folder",
        __typename: true,
        ...onFolder2,
        ...children()
      };
    }
    function onProduct(onProduct2, c) {
      const priceVariant = () => {
        if (c?.onPriceVariant) {
          return {
            priceVariants: {
              ...c.onPriceVariant
            }
          };
        }
        return {};
      };
      const variants = () => {
        if (c?.onVariant) {
          return {
            variants: {
              name: true,
              sku: true,
              price: true,
              ...priceVariant(),
              ...c?.onVariant ? c.onVariant : {}
            }
          };
        }
        return {};
      };
      const defaultVariant = () => {
        if (c?.onDefaultVariant) {
          return {
            defaultVariant: {
              ...c.onDefaultVariant
            }
          };
        }
        return {};
      };
      return {
        __typeName: "Product",
        __typename: true,
        ...onProduct2,
        vatType: {
          name: true,
          percent: true
        },
        ...defaultVariant(),
        ...variants()
      };
    }
    var camelCaseHyphens = (id) => id.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    function onComponent(id, type, onComponent2, c) {
      const validType = catalogue_1.componentType.parse(type);
      const aliasName = camelCaseHyphens(id);
      return {
        [aliasName]: {
          __aliasFor: "component",
          __args: {
            id
          },
          content: {
            __typename: true,
            __on: {
              __typeName: validType,
              ...onComponent2
            }
          }
        }
      };
    }
    function onSubscriptionPlan(c) {
      const period = (name) => {
        return {
          ...c?.onPeriod ? c.onPeriod(name) : {},
          priceVariants: {
            identifier: true,
            name: true,
            price: true,
            currency: true
          },
          meteredVariables: {
            id: true,
            name: true,
            identifier: true,
            tierType: true,
            tiers: {
              threshold: true,
              priceVariants: {
                identifier: true,
                name: true,
                price: true,
                currency: true
              }
            }
          }
        };
      };
      return {
        subscriptionPlans: {
          identifier: true,
          name: true,
          periods: {
            id: true,
            name: true,
            initial: period("initial"),
            recurring: period("recurring")
          }
        }
      };
    }
  }
});

// node_modules/@crystallize/js-api-client/dist/types/address.js
var require_address = __commonJS({
  "node_modules/@crystallize/js-api-client/dist/types/address.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.addressInputRequest = void 0;
    var zod_1 = require_lib2();
    var json_to_graphql_query_1 = require_lib();
    exports.addressInputRequest = zod_1.z.object({
      type: zod_1.z.enum(["delivery", "billing", "other"]).transform((val) => new json_to_graphql_query_1.EnumType(val)),
      firstName: zod_1.z.string().optional(),
      middleName: zod_1.z.string().optional(),
      lastName: zod_1.z.string().optional(),
      street: zod_1.z.string().optional(),
      street2: zod_1.z.string().optional(),
      streetNumber: zod_1.z.string().optional(),
      postalCode: zod_1.z.string().optional(),
      city: zod_1.z.string().optional(),
      state: zod_1.z.string().optional(),
      country: zod_1.z.string().optional(),
      phone: zod_1.z.string().optional(),
      email: zod_1.z.string().optional()
    }).strict();
  }
});

// node_modules/@crystallize/js-api-client/dist/types/customer.js
var require_customer = __commonJS({
  "node_modules/@crystallize/js-api-client/dist/types/customer.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.updateCustomerInputRequest = exports.createCustomerInputRequest = exports.orderCustomerInputRequest = void 0;
    var zod_1 = require_lib2();
    var address_1 = require_address();
    exports.orderCustomerInputRequest = zod_1.z.object({
      identifier: zod_1.z.string().optional(),
      firstName: zod_1.z.string().optional(),
      middleName: zod_1.z.string().optional(),
      lastName: zod_1.z.string().optional(),
      birthDate: zod_1.z.date().optional(),
      companyName: zod_1.z.string().optional(),
      taxNumber: zod_1.z.string().optional(),
      addresses: zod_1.z.array(address_1.addressInputRequest).optional()
    }).strict();
    exports.createCustomerInputRequest = exports.orderCustomerInputRequest.extend({
      tenantId: zod_1.z.string().optional(),
      lastName: zod_1.z.string(),
      firstName: zod_1.z.string(),
      phone: zod_1.z.string().optional(),
      meta: zod_1.z.array(zod_1.z.object({
        key: zod_1.z.string(),
        value: zod_1.z.string().optional()
      })).optional(),
      identifier: zod_1.z.string().optional(),
      externalReferences: zod_1.z.array(zod_1.z.object({
        key: zod_1.z.string(),
        value: zod_1.z.string().optional()
      })).optional(),
      email: zod_1.z.string()
    }).strict();
    exports.updateCustomerInputRequest = exports.createCustomerInputRequest.omit({ identifier: true, tenantId: true });
  }
});

// node_modules/@crystallize/js-api-client/dist/types/payment.js
var require_payment = __commonJS({
  "node_modules/@crystallize/js-api-client/dist/types/payment.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.customPaymentInputRequest = exports.cashPaymentInputRequest = exports.stripePaymentInputRequest = exports.paypalPaymentInputRequest = exports.klarnaPaymentInputRequest = exports.paymentProvider = void 0;
    var zod_1 = require_lib2();
    var json_to_graphql_query_1 = require_lib();
    exports.paymentProvider = zod_1.z.enum(["klarna", "stripe", "paypal", "cash", "custom"]).transform((val) => new json_to_graphql_query_1.EnumType(val));
    exports.klarnaPaymentInputRequest = zod_1.z.object({
      klarna: zod_1.z.string().optional(),
      orderId: zod_1.z.string().optional(),
      recurringToken: zod_1.z.string().optional(),
      status: zod_1.z.string().optional(),
      merchantReference1: zod_1.z.string().optional(),
      merchantReference2: zod_1.z.string().optional(),
      metadata: zod_1.z.string().optional()
    }).strict();
    exports.paypalPaymentInputRequest = zod_1.z.object({
      paypal: zod_1.z.string().optional(),
      orderId: zod_1.z.string().optional(),
      subscriptionId: zod_1.z.string().optional(),
      invoiceId: zod_1.z.string().optional(),
      metadata: zod_1.z.string().optional()
    }).strict();
    exports.stripePaymentInputRequest = zod_1.z.object({
      stripe: zod_1.z.string().optional(),
      customerId: zod_1.z.string().optional(),
      orderId: zod_1.z.string().optional(),
      paymentMethod: zod_1.z.string().optional(),
      paymentMethodId: zod_1.z.string().optional(),
      paymentIntentId: zod_1.z.string().optional(),
      subscriptionId: zod_1.z.string().optional(),
      metadata: zod_1.z.string().optional()
    }).strict();
    exports.cashPaymentInputRequest = zod_1.z.object({
      cash: zod_1.z.string().optional()
    }).strict();
    exports.customPaymentInputRequest = zod_1.z.object({
      properties: zod_1.z.array(zod_1.z.object({
        property: zod_1.z.string(),
        value: zod_1.z.string().optional()
      })).optional()
    }).strict();
  }
});

// node_modules/@crystallize/js-api-client/dist/types/order.js
var require_order = __commonJS({
  "node_modules/@crystallize/js-api-client/dist/types/order.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createOrderInputRequest = exports.updateOrderInputRequest = exports.paymentInputRequest = exports.orderItemInputRequest = exports.orderMetadataInputRequest = exports.priceInputRequest = exports.orderItemSubscriptionInputRequest = exports.orderItemMeteredVariableInputRequest = void 0;
    var json_to_graphql_query_1 = require_lib();
    var zod_1 = require_lib2();
    var customer_1 = require_customer();
    var payment_1 = require_payment();
    exports.orderItemMeteredVariableInputRequest = zod_1.z.object({
      id: zod_1.z.string(),
      usage: zod_1.z.number(),
      price: zod_1.z.number()
    }).strict();
    exports.orderItemSubscriptionInputRequest = zod_1.z.object({
      name: zod_1.z.string().optional(),
      period: zod_1.z.number(),
      unit: zod_1.z.enum(["minute", "hour", "day", "week", "month", "year"]).transform((val) => new json_to_graphql_query_1.EnumType(val)),
      start: zod_1.z.date().optional(),
      end: zod_1.z.date().optional(),
      meteredVariables: zod_1.z.array(exports.orderItemMeteredVariableInputRequest).optional()
    }).strict();
    exports.priceInputRequest = zod_1.z.object({
      gross: zod_1.z.number().optional(),
      net: zod_1.z.number().optional(),
      currency: zod_1.z.string(),
      discounts: zod_1.z.array(zod_1.z.object({
        percent: zod_1.z.number().optional()
      })).optional(),
      tax: zod_1.z.object({
        name: zod_1.z.string().optional(),
        percent: zod_1.z.number().optional()
      })
    }).strict();
    exports.orderMetadataInputRequest = zod_1.z.object({
      key: zod_1.z.string(),
      value: zod_1.z.string()
    }).strict();
    exports.orderItemInputRequest = zod_1.z.object({
      name: zod_1.z.string(),
      sku: zod_1.z.string().optional(),
      productId: zod_1.z.string().optional(),
      productVariantId: zod_1.z.string().optional(),
      imageUrl: zod_1.z.string().optional(),
      quantity: zod_1.z.number(),
      subscription: exports.orderItemSubscriptionInputRequest.optional(),
      subscriptionContractId: zod_1.z.string().optional(),
      price: exports.priceInputRequest.optional(),
      subTotal: exports.priceInputRequest.optional(),
      meta: zod_1.z.array(exports.orderMetadataInputRequest).optional()
    }).strict();
    exports.paymentInputRequest = zod_1.z.object({
      provider: payment_1.paymentProvider,
      klarna: payment_1.klarnaPaymentInputRequest.optional(),
      paypal: payment_1.paypalPaymentInputRequest.optional(),
      stripe: payment_1.stripePaymentInputRequest.optional(),
      cash: payment_1.cashPaymentInputRequest.optional(),
      custom: payment_1.customPaymentInputRequest.optional()
    }).strict();
    exports.updateOrderInputRequest = zod_1.z.object({
      customer: customer_1.orderCustomerInputRequest.optional(),
      cart: zod_1.z.array(exports.orderItemInputRequest).optional(),
      payment: zod_1.z.array(exports.paymentInputRequest).optional(),
      total: exports.priceInputRequest.optional(),
      additionnalInformation: zod_1.z.string().optional(),
      meta: zod_1.z.array(exports.orderMetadataInputRequest).optional()
    }).strict();
    exports.createOrderInputRequest = exports.updateOrderInputRequest.extend({
      customer: customer_1.orderCustomerInputRequest,
      cart: zod_1.z.array(exports.orderItemInputRequest),
      createdAt: zod_1.z.date().optional()
    }).strict();
  }
});

// node_modules/@crystallize/js-api-client/dist/core/order.js
var require_order2 = __commonJS({
  "node_modules/@crystallize/js-api-client/dist/core/order.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createOrderPaymentUpdater = exports.createOrderPusher = exports.createOrderFetcher = void 0;
    var order_1 = require_order();
    var json_to_graphql_query_1 = require_lib();
    function buildQuery(onCustomer, onOrderItem, extraQuery) {
      return {
        id: true,
        createdAt: true,
        updatedAt: true,
        customer: {
          identifier: true,
          ...onCustomer !== void 0 ? onCustomer : {}
        },
        cart: {
          name: true,
          sku: true,
          imageUrl: true,
          quantity: true,
          ...onOrderItem !== void 0 ? onOrderItem : {},
          price: {
            gross: true,
            net: true,
            discounts: {
              percent: true
            }
          }
        },
        total: {
          gross: true,
          net: true,
          currency: true,
          discounts: {
            percent: true
          },
          tax: {
            name: true,
            percent: true
          }
        },
        ...extraQuery !== void 0 ? extraQuery : {}
      };
    }
    function createOrderFetcher(apiClient) {
      const fetchPaginatedOrdersByCustomerIdentifier = async (customerIdentifier, extraQueryArgs, onCustomer, onOrderItem, extraQuery) => {
        const orderApi = apiClient.orderApi;
        const query = {
          orders: {
            getAll: {
              __args: {
                customerIdentifier,
                ...extraQueryArgs !== void 0 ? extraQueryArgs : {}
              },
              pageInfo: {
                hasPreviousPage: true,
                hasNextPage: true,
                startCursor: true,
                endCursor: true,
                totalNodes: true
              },
              edges: {
                cursor: true,
                node: buildQuery(onCustomer, onOrderItem, extraQuery)
              }
            }
          }
        };
        const response = await orderApi((0, json_to_graphql_query_1.jsonToGraphQLQuery)({ query }));
        return {
          pageInfo: response.orders.getAll.pageInfo,
          orders: response.orders.getAll?.edges?.map((edge) => edge.node) || []
        };
      };
      const fetchOrderById = async (orderId, onCustomer, onOrderItem, extraQuery) => {
        const orderApi = apiClient.orderApi;
        const query = {
          orders: {
            get: {
              __args: {
                id: orderId
              },
              id: true,
              createdAt: true,
              updatedAt: true,
              customer: {
                identifier: true,
                ...onCustomer !== void 0 ? onCustomer : {}
              },
              cart: {
                name: true,
                sku: true,
                imageUrl: true,
                quantity: true,
                ...onOrderItem !== void 0 ? onOrderItem : {},
                price: {
                  gross: true,
                  net: true,
                  discounts: {
                    percent: true
                  }
                }
              },
              total: {
                gross: true,
                net: true,
                currency: true,
                discounts: {
                  percent: true
                },
                tax: {
                  name: true,
                  percent: true
                }
              },
              ...extraQuery !== void 0 ? extraQuery : {}
            }
          }
        };
        return (await orderApi((0, json_to_graphql_query_1.jsonToGraphQLQuery)({ query })))?.orders?.get;
      };
      return {
        byId: fetchOrderById,
        byCustomerIdentifier: fetchPaginatedOrdersByCustomerIdentifier
      };
    }
    exports.createOrderFetcher = createOrderFetcher;
    function createOrderPusher(apiClient) {
      return async function pushOrder(intentOrder) {
        const intent = order_1.createOrderInputRequest.parse(intentOrder);
        const orderApi = apiClient.orderApi;
        const mutation = {
          mutation: {
            orders: {
              create: {
                __args: {
                  input: {
                    ...intent
                  }
                },
                id: true,
                createdAt: true
              }
            }
          }
        };
        const confirmation = await orderApi((0, json_to_graphql_query_1.jsonToGraphQLQuery)(mutation));
        return {
          id: confirmation.orders.create.id,
          createdAt: confirmation.orders.create.createdAt
        };
      };
    }
    exports.createOrderPusher = createOrderPusher;
    function createOrderPaymentUpdater(apiClient) {
      return async function updaptePaymentOrder(orderId, intentOrder) {
        const intent = order_1.updateOrderInputRequest.parse(intentOrder);
        const pimApi = apiClient.pimApi;
        const mutation = {
          mutation: {
            order: {
              update: {
                __args: {
                  id: orderId,
                  input: {
                    ...intent
                  }
                },
                id: true,
                updatedAt: true
              }
            }
          }
        };
        const confirmation = await pimApi((0, json_to_graphql_query_1.jsonToGraphQLQuery)(mutation));
        return {
          id: confirmation.order.update.id,
          updatedAt: confirmation.order.update.updatedAt
        };
      };
    }
    exports.createOrderPaymentUpdater = createOrderPaymentUpdater;
  }
});

// node_modules/@crystallize/js-api-client/dist/types/search.js
var require_search = __commonJS({
  "node_modules/@crystallize/js-api-client/dist/types/search.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.catalogueSearchOrderBy = exports.catalogueSearchFilter = void 0;
    var json_to_graphql_query_1 = require_lib();
    var zod_1 = require_lib2();
    var topicPathsFilterField = zod_1.z.object({
      value: zod_1.z.string()
    }).strict();
    var topicPathsFilterSection = zod_1.z.object({
      logicalOperator: zod_1.z.enum(["AND", "OR"]).transform((val) => new json_to_graphql_query_1.EnumType(val)),
      fields: zod_1.z.array(topicPathsFilterField).optional()
    }).strict();
    var topicPathsFilter = zod_1.z.object({
      logicalOperator: zod_1.z.enum(["AND", "OR"]).transform((val) => new json_to_graphql_query_1.EnumType(val)),
      sections: zod_1.z.array(topicPathsFilterSection)
    }).strict();
    var priceRangeFilter = zod_1.z.object({
      min: zod_1.z.number(),
      max: zod_1.z.number()
    }).strict();
    var stockFilter = zod_1.z.object({
      min: zod_1.z.number(),
      location: zod_1.z.string().optional()
    }).strict();
    var stockLocationsFilter = zod_1.z.object({
      min: zod_1.z.number(),
      location: zod_1.z.array(zod_1.z.string()).optional(),
      logicalOperator: zod_1.z.enum(["OR"])
    }).strict();
    var itemFilterFields = zod_1.z.object({
      itemIds: zod_1.z.string().optional(),
      productVariantIds: zod_1.z.string().optional(),
      skus: zod_1.z.string().optional(),
      shapeIdentifiers: zod_1.z.string().optional(),
      paths: zod_1.z.string().optional(),
      topicsPaths: topicPathsFilter.optional()
    }).strict();
    var variantAttributeFilter = zod_1.z.object({
      attribute: zod_1.z.string(),
      value: zod_1.z.string()
    }).strict();
    var productVariantsFilter = zod_1.z.object({
      isDefault: zod_1.z.boolean().optional(),
      priceRange: priceRangeFilter.optional(),
      stock: stockFilter.optional(),
      stockLocations: stockLocationsFilter.optional(),
      attributes: variantAttributeFilter.optional()
    });
    exports.catalogueSearchFilter = zod_1.z.object({
      searchTerm: zod_1.z.string().optional(),
      type: zod_1.z.enum(["PRODUCT", "FOLDER", "DOCUMENT"]).transform((val) => new json_to_graphql_query_1.EnumType(val)).optional(),
      include: itemFilterFields.optional(),
      exclude: itemFilterFields.optional(),
      priceVariant: zod_1.z.string().optional(),
      stockLocation: zod_1.z.string().optional(),
      productVariants: productVariantsFilter.optional()
    });
    exports.catalogueSearchOrderBy = zod_1.z.object({
      field: zod_1.z.enum(["ITEM_NAME", "PRICE", "STOCK", "CREATED_AT"]).transform((val) => new json_to_graphql_query_1.EnumType(val)),
      direction: zod_1.z.enum(["ASC", "DESC"]).transform((val) => new json_to_graphql_query_1.EnumType(val))
    }).strict();
  }
});

// node_modules/@crystallize/js-api-client/dist/core/search.js
var require_search2 = __commonJS({
  "node_modules/@crystallize/js-api-client/dist/core/search.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createSearcher = void 0;
    var json_to_graphql_query_1 = require_lib();
    var search_1 = require_search();
    function createSearcher(client) {
      async function* search(language, nodeQuery, filter, orderBy, pageInfo, limit, cursors) {
        const args = {
          language,
          first: limit?.perPage ?? 100
        };
        if (filter) {
          args.filter = search_1.catalogueSearchFilter.parse(filter);
        }
        if (orderBy) {
          args.orderBy = search_1.catalogueSearchOrderBy.parse(orderBy);
        }
        if (cursors?.after) {
          args.after = cursors.after;
        }
        if (cursors?.before) {
          args.after = cursors.before;
        }
        let query = {
          search: {
            __args: args,
            pageInfo: {
              ...pageInfo,
              hasNextPage: true,
              endCursor: true
            },
            edges: {
              cursor: true,
              node: nodeQuery
            }
          }
        };
        let data;
        let yieldAt = 0;
        const max = limit?.total ?? Infinity;
        do {
          args.first = Math.min(max - yieldAt, args.first);
          data = await client.searchApi((0, json_to_graphql_query_1.jsonToGraphQLQuery)({ query }));
          for (const edge of data.search.edges) {
            yield edge.node;
          }
          yieldAt += args.first;
          query.search.__args.after = data.search.pageInfo.endCursor;
        } while (data.search.pageInfo.hasNextPage && yieldAt < max);
      }
      return {
        search
      };
    }
    exports.createSearcher = createSearcher;
  }
});

// node_modules/@crystallize/js-api-client/dist/types/subscription.js
var require_subscription = __commonJS({
  "node_modules/@crystallize/js-api-client/dist/types/subscription.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.updateSubscriptionContractInputRequest = exports.createSubscriptionContractInputRequest = exports.subscriptionContractPhaseInputRequest = exports.subscriptionContractMeteredVariableReferenceInputRequest = exports.subscriptionContractMeteredVariableTierInputRequest = exports.subscriptionContractMetadataInputRequest = void 0;
    var zod_1 = require_lib2();
    var json_to_graphql_query_1 = require_lib();
    var order_1 = require_order();
    var address_1 = require_address();
    exports.subscriptionContractMetadataInputRequest = zod_1.z.object({
      key: zod_1.z.string(),
      value: zod_1.z.string()
    }).strict();
    exports.subscriptionContractMeteredVariableTierInputRequest = zod_1.z.object({
      currency: zod_1.z.string(),
      price: zod_1.z.number(),
      threshold: zod_1.z.number()
    }).strict();
    exports.subscriptionContractMeteredVariableReferenceInputRequest = zod_1.z.object({
      id: zod_1.z.string(),
      tierType: zod_1.z.enum(["graduated", "volume"]).transform((val) => new json_to_graphql_query_1.EnumType(val)),
      tiers: zod_1.z.array(exports.subscriptionContractMeteredVariableTierInputRequest)
    }).strict();
    exports.subscriptionContractPhaseInputRequest = zod_1.z.object({
      currency: zod_1.z.string(),
      price: zod_1.z.number(),
      meteredVariables: zod_1.z.array(exports.subscriptionContractMeteredVariableReferenceInputRequest)
    }).strict();
    exports.createSubscriptionContractInputRequest = zod_1.z.object({
      customerIdentifier: zod_1.z.string(),
      tenantId: zod_1.z.string(),
      addresses: zod_1.z.array(address_1.addressInputRequest).optional(),
      payment: order_1.paymentInputRequest.optional(),
      subscriptionPlan: zod_1.z.object({
        identifier: zod_1.z.string(),
        periodId: zod_1.z.string()
      }).optional(),
      status: zod_1.z.object({
        activeUntil: zod_1.z.date(),
        currency: zod_1.z.string(),
        price: zod_1.z.number(),
        renewAt: zod_1.z.date()
      }),
      item: zod_1.z.object({
        sku: zod_1.z.string(),
        name: zod_1.z.string(),
        imageUrl: zod_1.z.string().optional(),
        meta: zod_1.z.array(exports.subscriptionContractMetadataInputRequest).optional()
      }),
      initial: exports.subscriptionContractPhaseInputRequest.optional(),
      recurring: exports.subscriptionContractPhaseInputRequest.optional()
    }).strict();
    exports.updateSubscriptionContractInputRequest = zod_1.z.object({
      addresses: zod_1.z.array(address_1.addressInputRequest).optional(),
      payment: order_1.paymentInputRequest.optional(),
      status: zod_1.z.object({
        activeUntil: zod_1.z.date().optional(),
        currency: zod_1.z.string().optional(),
        price: zod_1.z.number().optional(),
        renewAt: zod_1.z.date().optional()
      }).optional(),
      item: zod_1.z.object({
        sku: zod_1.z.string().optional(),
        name: zod_1.z.string().optional(),
        imageUrl: zod_1.z.string().optional(),
        meta: zod_1.z.array(exports.subscriptionContractMetadataInputRequest).optional()
      }).optional(),
      initial: exports.subscriptionContractPhaseInputRequest.optional(),
      recurring: exports.subscriptionContractPhaseInputRequest.optional()
    }).strict();
  }
});

// node_modules/@crystallize/js-api-client/dist/core/subscription.js
var require_subscription2 = __commonJS({
  "node_modules/@crystallize/js-api-client/dist/core/subscription.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createSubscriptionContractManager = void 0;
    var json_to_graphql_query_1 = require_lib();
    var subscription_1 = require_subscription();
    var catalogue_1 = require_catalogue2();
    function createSubscriptionContractManager(apiClient) {
      const create = async (intentSubsctiptionContract, extraResultQuery) => {
        const intent = subscription_1.createSubscriptionContractInputRequest.parse(intentSubsctiptionContract);
        const api = apiClient.pimApi;
        const mutation = {
          mutation: {
            subscriptionContract: {
              create: {
                __args: {
                  input: {
                    ...intent,
                    status: {
                      ...intent.status,
                      renewAt: intent.status.renewAt.toISOString(),
                      activeUntil: intent.status.activeUntil.toISOString()
                    }
                  }
                },
                id: true,
                createdAt: true,
                ...extraResultQuery !== void 0 ? extraResultQuery : {}
              }
            }
          }
        };
        const confirmation = await api((0, json_to_graphql_query_1.jsonToGraphQLQuery)(mutation));
        return confirmation.subscriptionContract.create;
      };
      const update = async (id, intentSubsctiptionContract, extraResultQuery) => {
        const intent = subscription_1.updateSubscriptionContractInputRequest.parse(intentSubsctiptionContract);
        const api = apiClient.pimApi;
        const mutation = {
          mutation: {
            subscriptionContract: {
              update: {
                __args: {
                  id,
                  input: {
                    ...intent
                  }
                },
                id: true,
                updatedAt: true,
                ...extraResultQuery !== void 0 ? extraResultQuery : {}
              }
            }
          }
        };
        const confirmation = await api((0, json_to_graphql_query_1.jsonToGraphQLQuery)(mutation));
        return confirmation.subscriptionContract.update;
      };
      const createSubscriptionContractTemplateBasedOnVariant = async (variant, planIdentifier, periodId, priceVariantIdentifier) => {
        const matchingPlan = variant?.subscriptionPlans?.find((plan) => plan.identifier === planIdentifier);
        const matchingPeriod = matchingPlan?.periods?.find((period) => period.id === periodId);
        if (!matchingPlan || !matchingPeriod) {
          throw new Error(`Impossible to find the Subscription Plans for SKU ${variant.sku}, plan: ${planIdentifier}, period: ${periodId}`);
        }
        const getPriceVariant = (priceVariants, identifier) => {
          return priceVariants.find((priceVariant) => priceVariant.identifier === identifier);
        };
        const transformPeriod = (period) => {
          return {
            currency: getPriceVariant(period.priceVariants || [], priceVariantIdentifier)?.currency || "USD",
            price: getPriceVariant(period.priceVariants || [], priceVariantIdentifier)?.price || 0,
            meteredVariables: (period.meteredVariables || []).map((meteredVariable) => {
              return {
                id: meteredVariable.id,
                tierType: new json_to_graphql_query_1.EnumType(meteredVariable.tierType),
                tiers: meteredVariable.tiers.map((tier) => {
                  return {
                    threshold: tier.threshold,
                    currency: getPriceVariant(tier.priceVariants || [], priceVariantIdentifier)?.currency || "USD",
                    price: getPriceVariant(tier.priceVariants || [], priceVariantIdentifier)?.price || 0
                  };
                })
              };
            })
          };
        };
        const contract = {
          item: {
            sku: variant.sku,
            name: variant.name || ""
          },
          subscriptionPlan: {
            identifier: matchingPlan.identifier,
            periodId: matchingPeriod.id
          },
          initial: !matchingPeriod.initial ? void 0 : transformPeriod(matchingPeriod.initial),
          recurring: !matchingPeriod.recurring ? void 0 : transformPeriod(matchingPeriod.recurring)
        };
        return contract;
      };
      const createSubscriptionContractTemplateBasedOnVariantIdentity = async (path, productVariantIdentifier, planIdentifier, periodId, priceVariantIdentifier, language = "en") => {
        if (!productVariantIdentifier.sku && !productVariantIdentifier.id) {
          throw new Error(`Impossible to find the Subscription Plans for Path ${path} with and empty Variant Identity`);
        }
        const fetcher = (0, catalogue_1.createCatalogueFetcher)(apiClient);
        const builder = catalogue_1.catalogueFetcherGraphqlBuilder;
        const data = await fetcher({
          catalogue: {
            __args: {
              path,
              language
            },
            __on: [
              builder.onProduct({}, {
                onVariant: {
                  id: true,
                  name: true,
                  sku: true,
                  ...builder.onSubscriptionPlan()
                }
              })
            ]
          }
        });
        const matchingVariant = data.catalogue?.variants?.find((variant) => {
          if (productVariantIdentifier.sku && variant.sku === productVariantIdentifier.sku) {
            return true;
          }
          if (productVariantIdentifier.id && variant.id === productVariantIdentifier.id) {
            return true;
          }
          return false;
        });
        if (!matchingVariant) {
          throw new Error(`Impossible to find the Subscription Plans for Path ${path} and Variant: (sku: ${productVariantIdentifier.sku} id: ${productVariantIdentifier.id}), plan: ${planIdentifier}, period: ${periodId} in lang: ${language}`);
        }
        return createSubscriptionContractTemplateBasedOnVariant(matchingVariant, planIdentifier, periodId, priceVariantIdentifier);
      };
      return {
        create,
        update,
        createSubscriptionContractTemplateBasedOnVariantIdentity,
        createSubscriptionContractTemplateBasedOnVariant
      };
    }
    exports.createSubscriptionContractManager = createSubscriptionContractManager;
  }
});

// node_modules/@crystallize/js-api-client/dist/core/customer.js
var require_customer2 = __commonJS({
  "node_modules/@crystallize/js-api-client/dist/core/customer.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createCustomerManager = void 0;
    var json_to_graphql_query_1 = require_lib();
    var customer_1 = require_customer();
    function createCustomerManager(apiClient) {
      const create = async (intentCustomer, extraResultQuery) => {
        const intent = customer_1.createCustomerInputRequest.parse(intentCustomer);
        const api = apiClient.pimApi;
        const mutation = {
          mutation: {
            customer: {
              create: {
                __args: {
                  input: {
                    ...intent,
                    tenantId: apiClient.config.tenantId || intent.tenantId || ""
                  }
                },
                identifier: true,
                ...extraResultQuery !== void 0 ? extraResultQuery : {}
              }
            }
          }
        };
        const confirmation = await api((0, json_to_graphql_query_1.jsonToGraphQLQuery)(mutation));
        return confirmation.customer.create;
      };
      const update = async (identifier, intentCustomer, extraResultQuery) => {
        const intent = customer_1.updateCustomerInputRequest.parse(intentCustomer);
        const api = apiClient.pimApi;
        const mutation = {
          mutation: {
            customer: {
              update: {
                __args: {
                  identifier,
                  input: intent,
                  tenantId: apiClient.config.tenantId || ""
                },
                identifier: true,
                ...extraResultQuery !== void 0 ? extraResultQuery : {}
              }
            }
          }
        };
        const confirmation = await api((0, json_to_graphql_query_1.jsonToGraphQLQuery)(mutation));
        return confirmation.customer.update;
      };
      return {
        create,
        update
      };
    }
    exports.createCustomerManager = createCustomerManager;
  }
});

// node_modules/@crystallize/js-api-client/dist/core/pricing.js
var require_pricing = __commonJS({
  "node_modules/@crystallize/js-api-client/dist/core/pricing.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.pricesForUsageOnTier = void 0;
    function pricesForUsageOnTier(usage, tiers, tierType) {
      const sortedTiers = [...tiers].sort((a, b) => a.threshold - b.threshold);
      if (tierType === "volume") {
        return volumeBasedPriceFor(usage, sortedTiers);
      }
      return graduatedBasedPriceFor(usage, sortedTiers);
    }
    exports.pricesForUsageOnTier = pricesForUsageOnTier;
    function volumeBasedPriceFor(usage, tiers) {
      const tiersLength = tiers.length;
      for (let i = tiersLength - 1; i >= 0; i--) {
        const tier = tiers[i];
        if (usage < tier.threshold && i > 0) {
          continue;
        }
        return { [tier.currency]: (usage >= tier.threshold ? tier.price : 0) * usage };
      }
      return { USD: 0 };
    }
    function graduatedBasedPriceFor(usage, tiers) {
      let rest = usage;
      if (tiers[0].threshold > 0) {
        rest = Math.max(0, rest - (tiers[0].threshold - 1));
      }
      const splitUsage = tiers.map((tier, tierIndex) => {
        const limit = tiers[tierIndex + 1]?.threshold || Infinity;
        const tierUsage = rest > limit ? limit : rest;
        rest -= tierUsage;
        return {
          ...tier,
          usage: tierUsage
        };
      });
      return splitUsage.reduce((memo, tier) => {
        return {
          ...memo,
          [tier.currency]: (memo[tier.currency] || 0) + tier.usage * tier.price
        };
      }, {});
    }
  }
});

// node_modules/@crystallize/js-api-client/dist/types/product.js
var require_product = __commonJS({
  "node_modules/@crystallize/js-api-client/dist/types/product.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@crystallize/js-api-client/dist/types/components.js
var require_components = __commonJS({
  "node_modules/@crystallize/js-api-client/dist/types/components.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@crystallize/js-api-client/dist/types/signature.js
var require_signature = __commonJS({
  "node_modules/@crystallize/js-api-client/dist/types/signature.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@crystallize/js-api-client/dist/types/pricing.js
var require_pricing2 = __commonJS({
  "node_modules/@crystallize/js-api-client/dist/types/pricing.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/@crystallize/js-api-client/dist/index.js
var require_dist = __commonJS({
  "node_modules/@crystallize/js-api-client/dist/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CrystallizeCustomerManager = exports.CrystallizeSubscriptionContractManager = exports.CrystallizeOrderFetcherByCustomerIdentifier = exports.CrystallizeOrderFetcherById = exports.CrystallizeSearcher = exports.CrystallizeCatalogueFetcher = exports.CrystallizeCreateOrderPaymentUpdater = exports.CrystallizeOrderPusher = exports.CrystallizeHydraterBySkus = exports.CrystallizeHydraterByPaths = exports.CrystallizeNavigationTopicsFetcher = exports.CrystallizeNavigationFoldersFetcher = exports.CrystallizeClient = void 0;
    __exportStar(require_client(), exports);
    __exportStar(require_massCallClient(), exports);
    __exportStar(require_navigation(), exports);
    __exportStar(require_hydrate(), exports);
    __exportStar(require_catalogue2(), exports);
    __exportStar(require_order2(), exports);
    __exportStar(require_search2(), exports);
    __exportStar(require_subscription2(), exports);
    __exportStar(require_customer2(), exports);
    __exportStar(require_pricing(), exports);
    __exportStar(require_product(), exports);
    __exportStar(require_order(), exports);
    __exportStar(require_payment(), exports);
    __exportStar(require_components(), exports);
    __exportStar(require_search(), exports);
    __exportStar(require_subscription(), exports);
    __exportStar(require_address(), exports);
    __exportStar(require_customer(), exports);
    __exportStar(require_signature(), exports);
    __exportStar(require_pricing2(), exports);
    var client_1 = require_client();
    var navigation_1 = require_navigation();
    var hydrate_1 = require_hydrate();
    var order_1 = require_order2();
    var catalogue_1 = require_catalogue2();
    var search_1 = require_search2();
    var subscription_1 = require_subscription2();
    var customer_1 = require_customer2();
    exports.CrystallizeClient = (0, client_1.createClient)({
      tenantId: globalThis?.process?.env?.CRYSTALLIZE_TENANT_ID ?? "",
      tenantIdentifier: globalThis?.process?.env?.CRYSTALLIZE_TENANT_IDENTIFIER ?? "",
      accessTokenId: globalThis?.process?.env?.CRYSTALLIZE_ACCESS_TOKEN_ID ?? "",
      accessTokenSecret: globalThis?.process?.env?.CRYSTALLIZE_ACCESS_TOKEN_SECRET ?? ""
    });
    var navigationFetcher = (0, navigation_1.createNavigationFetcher)(exports.CrystallizeClient);
    exports.CrystallizeNavigationFoldersFetcher = navigationFetcher.byFolders;
    exports.CrystallizeNavigationTopicsFetcher = navigationFetcher.byTopics;
    var productHydrator = (0, hydrate_1.createProductHydrater)(exports.CrystallizeClient);
    exports.CrystallizeHydraterByPaths = productHydrator.byPaths;
    exports.CrystallizeHydraterBySkus = productHydrator.bySkus;
    exports.CrystallizeOrderPusher = (0, order_1.createOrderPusher)(exports.CrystallizeClient);
    exports.CrystallizeCreateOrderPaymentUpdater = (0, order_1.createOrderPaymentUpdater)(exports.CrystallizeClient);
    exports.CrystallizeCatalogueFetcher = (0, catalogue_1.createCatalogueFetcher)(exports.CrystallizeClient);
    exports.CrystallizeSearcher = (0, search_1.createSearcher)(exports.CrystallizeClient);
    var orderFetcher = (0, order_1.createOrderFetcher)(exports.CrystallizeClient);
    exports.CrystallizeOrderFetcherById = orderFetcher.byId;
    exports.CrystallizeOrderFetcherByCustomerIdentifier = orderFetcher.byCustomerIdentifier;
    exports.CrystallizeSubscriptionContractManager = (0, subscription_1.createSubscriptionContractManager)(exports.CrystallizeClient);
    exports.CrystallizeCustomerManager = (0, customer_1.createCustomerManager)(exports.CrystallizeClient);
  }
});

export {
  require_dist
};
//# sourceMappingURL=/build/_shared/chunk-TZRBUZHL.js.map

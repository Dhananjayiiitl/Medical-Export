import {
  FilteredProducts
} from "/build/_shared/chunk-UR3HKNPH.js";
import "/build/_shared/chunk-PQ34IAI4.js";
import "/build/_shared/chunk-RQRLMEGK.js";
import "/build/_shared/chunk-E6QTRXVA.js";
import "/build/_shared/chunk-M6QED4VA.js";
import "/build/_shared/chunk-JOZO4X6G.js";
import {
  useAppContext
} from "/build/_shared/chunk-Z23A263B.js";
import {
  require_storefront
} from "/build/_shared/chunk-XY3KWW5M.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-DXQKMR6I.js";
import {
  useLoaderData
} from "/build/_shared/chunk-RQMWC5LJ.js";
import {
  __toESM
} from "/build/_shared/chunk-5KL4PAQL.js";

// src/routes/$langstore/search.tsx
var import_storefront = __toESM(require_storefront());

// src/ui/pages/Search.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime());
var Search_default = ({ products }) => {
  const { _t } = useAppContext();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "container px-6 mx-auto w-full", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "font-bold text-4xl mt-10", children: _t("search.label") }, void 0, false, {
      fileName: "src/ui/pages/Search.tsx",
      lineNumber: 10,
      columnNumber: 13
    }, this),
    products.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FilteredProducts, { products }, void 0, false, {
      fileName: "src/ui/pages/Search.tsx",
      lineNumber: 13,
      columnNumber: 21
    }, this) }, void 0, false, {
      fileName: "src/ui/pages/Search.tsx",
      lineNumber: 12,
      columnNumber: 17
    }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-10", children: _t("search.noResults") }, void 0, false, {
      fileName: "src/ui/pages/Search.tsx",
      lineNumber: 16,
      columnNumber: 17
    }, this)
  ] }, void 0, true, {
    fileName: "src/ui/pages/Search.tsx",
    lineNumber: 9,
    columnNumber: 9
  }, this);
};

// src/routes/$langstore/search.tsx
var import_jsx_dev_runtime2 = __toESM(require_jsx_dev_runtime());
var search_default = () => {
  const { data } = useLoaderData();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Search_default, { products: data }, void 0, false, {
    fileName: "src/routes/$langstore/search.tsx",
    lineNumber: 30,
    columnNumber: 12
  }, this);
};
export {
  search_default as default
};
//# sourceMappingURL=/build/routes/$langstore/search-R62HGPEJ.js.map
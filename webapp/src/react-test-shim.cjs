/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any */
// React 19 + testing-library/react v16 compatibility shim
// This is loaded by vitest as the "react" module (via vite alias).
// React 19 removed act from the main export. testing-library/react v16 expects React.act.
// We import react-dom/test-utils which still exports act as a function,
// and attach it to the react namespace before testing-library reads it.

// eslint-disable-next-line @typescript-eslint/no-require-imports
const react = require("react");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { act } = require("react-dom/test-utils");

// Attach act to the react namespace so testing-library finds it
if (typeof react.act === "undefined" || typeof react.act !== "function") {
  react.act = act;
}

module.exports = react;

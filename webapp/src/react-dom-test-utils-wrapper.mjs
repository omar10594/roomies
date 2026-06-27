// ESM wrapper for react-dom/test-utils
// The production build calls React.act() which is undefined in React 19.
// We export act as a standalone function AND ensure it's available
import * as reactDomTestUtils from "react-dom/test-utils";
import * as react from "react";

// Also patch the react module's act property
Object.defineProperty(react, "act", {
  value: reactDomTestUtils.act,
  writable: true,
  configurable: true,
});

export * from "react-dom/test-utils";
export { act } from "react-dom/test-utils";

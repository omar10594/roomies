// ESM wrapper for react that patches act onto the namespace
// Vitest resolves "react" to this file during tests
import * as react from "react";
import { act } from "react-dom/test-utils";

// Attach act to the react namespace so testing-library finds it
Object.defineProperty(react, "act", {
  value: act,
  writable: true,
  configurable: true,
});

export default react;
export * from "react";

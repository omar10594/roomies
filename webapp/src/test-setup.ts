/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Polyfill matchMedia for jsdom (only in browser-like environments)
if (typeof window !== "undefined" && !window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

// Mock Next.js modules
vi.mock("next/navigation", () => ({
  usePathname: vi.fn().mockReturnValue("/"),
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: function NextLinkMock({
    href,
    children,
    className,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
    const React = require("react");
    return React.createElement("a", { href, className, ...props }, children);
  },
}));

// Generic mock factory for UI components
function mockComponent(tagName: string, slotName: string) {
  return function MockComponent(props: React.HTMLAttributes<HTMLElement>) {
    const { className, children, ...rest } = props;
    const React = require("react");
    return React.createElement(tagName, { className, "data-slot": slotName, ...rest }, children);
  };
}

// Mock shadcn Card components
vi.mock("@/components/ui/card", () => ({
  Card: mockComponent("div", "card"),
  CardContent: mockComponent("div", "card-content"),
  CardHeader: mockComponent("div", "card-header"),
  CardFooter: mockComponent("div", "card-footer"),
  CardTitle: mockComponent("div", "card-title"),
  CardDescription: mockComponent("div", "card-description"),
  CardAction: mockComponent("div", "card-action"),
}));

// Mock Badge component
vi.mock("@/components/ui/badge", () => ({
  Badge: mockComponent("span", "badge"),
}));

// Mock Button component
vi.mock("@/components/ui/button", () => ({
  Button: mockComponent("button", "button"),
  buttonVariants: () => "",
}));

// Mock Avatar component
vi.mock("@/components/ui/avatar", () => ({
  Avatar: mockComponent("div", "avatar"),
  AvatarFallback: mockComponent("div", "avatar-fallback"),
}));

// Mock Input component
vi.mock("@/components/ui/input", () => ({
  Input: function MockInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
    const { className, ...rest } = props;
    const React = require("react");
    return React.createElement("input", { className, "data-slot": "input", ...rest });
  },
}));

// Mock Select component
vi.mock("@/components/ui/select", () => ({
  Select: function MockSelect(props: React.HTMLAttributes<HTMLDivElement>) {
    const { children, ...rest } = props;
    const React = require("react");
    return React.createElement("div", { "data-slot": "select", ...rest }, children);
  },
  SelectContent: function MockSelectContent(props: React.HTMLAttributes<HTMLDivElement>) {
    const { children, ...rest } = props;
    const React = require("react");
    return React.createElement("div", { "data-slot": "select-content", ...rest }, children);
  },
  SelectTrigger: function MockSelectTrigger(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    const { children, ...rest } = props;
    const React = require("react");
    return React.createElement("div", { "data-slot": "select-trigger", ...rest }, children);
  },
  SelectValue: function MockValue(props: React.HTMLAttributes<HTMLSpanElement>) {
    const { children, ...rest } = props;
    const React = require("react");
    return React.createElement("span", { "data-slot": "select-value", ...rest }, children);
  },
  SelectItem: function MockSelectItem(props: React.HTMLAttributes<HTMLDivElement>) {
    const { children, ...rest } = props;
    const React = require("react");
    return React.createElement("div", { "data-slot": "select-item", ...rest }, children);
  },
  SelectGroup: function MockSelectGroup(props: React.HTMLAttributes<HTMLDivElement>) {
    const { children, ...rest } = props;
    const React = require("react");
    return React.createElement("div", { "data-slot": "select-group", ...rest }, children);
  },
  SelectLabel: function MockSelectLabel(props: React.HTMLAttributes<HTMLDivElement>) {
    const { children, ...rest } = props;
    const React = require("react");
    return React.createElement("div", { "data-slot": "select-label", ...rest }, children);
  },
  SelectSeparator: function MockSeparator(props: React.HTMLAttributes<HTMLHRElement>) {
    const { className, ...rest } = props;
    const React = require("react");
    return React.createElement("hr", { className, "data-slot": "select-separator", ...rest });
  },
  SelectScrollUpButton: function MockSelectScrollUpButton(props: React.HTMLAttributes<HTMLDivElement>) {
    const { className, ...rest } = props;
    const React = require("react");
    return React.createElement("div", { className, "data-slot": "select-scroll-up-button", ...rest });
  },
  SelectScrollDownButton: function MockSelectScrollDownButton(props: React.HTMLAttributes<HTMLDivElement>) {
    const { className, ...rest } = props;
    const React = require("react");
    return React.createElement(
      "div",
      { className, "data-slot": "select-scroll-down-button", ...rest }
    );
  },
}));

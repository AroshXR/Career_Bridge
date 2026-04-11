// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// POLYFILLS FOR REACT 19 & MODERN ROUTER SUPPORT
// Why: Standard JSDOM (used by Jest) is missing some modern browser APIs like TextEncoder.
// These are required for the newest versions of React and React-Router to run in tests.
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

/* eslint-disable compat/compat */
/* eslint-disable max-lines-per-function */
import { setupLocalStorageMock } from './local-storage.mock';

/**
 * Sets up Jest global mocks
 * which should be used in each app and lib in test-setup.ts files
 * because jest is using jsdom which is lacking some globals.
 */
export const setupJestJsdomGlobalMocks: () => void = () => {
  /**
   * Sets up local storage mock.
   */
  setupLocalStorageMock();

  window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }));

  window.resizeTo = jest
    .fn()
    .mockImplementation((width: number, height: number) => ({ width, height }));

  Object.defineProperty(window, 'getComputedStyle', {
    value: () => ({
      display: 'none',
      appearance: ['-webkit-appearance'],
      getPropertyValue: (): null => null,
    }),
  });

  Object.defineProperty(window.URL, 'createObjectURL', {
    value: jest.fn(),
    writable: false,
  });

  Object.defineProperty(global, 'fetch', {
    value: jest.fn(async () => {
      const promise: Promise<void> = new Promise((resolve: () => void) => {
        resolve();
      });
      return promise;
    }),
    writable: false,
  });

  Object.defineProperty(global, 'URL', {
    value: window.URL,
    writable: true,
  });

  Object.defineProperty(window, 'CSS', { value: null });

  Object.defineProperty(document, 'doctype', {
    value: '<!DOCTYPE html>',
  });

  Object.defineProperty(document.body.style, 'transform', {
    value: () => ({
      enumerable: true,
      configurable: true,
    }),
  });

  /**
   * Mutation observer.
   */
  const mutationObserver = (...args: any[]) => ({
    observe: jest.fn(),
    takeRecords: jest.fn(),
    disconnect: jest.fn(),
  });

  Object.defineProperty(global, 'MutationObserver', {
    value: mutationObserver,
    writable: false,
  });

  /**
   * Override some console methods for testing environment.
   */
  window.console.log = (): null => null;
  window.console.group = (): null => null;
};

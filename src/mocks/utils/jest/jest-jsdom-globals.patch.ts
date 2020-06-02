import { setupJsdomGlobalMocks } from '../globals/globals.mock';
import { setupJsdomWindowMocks } from '../window/window.mock';

/**
 * Sets up Jest global mocks
 * which should be used in each app and lib in test-setup.ts files
 * because jest is using jsdom which is lacking some globals.
 */
export const setupJestJsdomGlobalMocks: () => void = () => {
  setupJsdomWindowMocks();

  setupJsdomGlobalMocks();
};

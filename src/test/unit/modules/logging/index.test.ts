import { describe, expect, it } from 'vitest';

import { getLogger } from '../../../../main/modules/logging';

describe('getLogger', () => {
  it('returns a logger for the requested component', () => {
    const logger = getLogger('test-component');

    expect(logger).toBeDefined();
    expect(logger.info).toEqual(expect.any(Function));
  });
});

export const description = `
Basic unit tests for test framework.
`;

import { TestGroup } from '../../framework/index.js';

import { UnitTest } from './unit_test.js';

export const g = new TestGroup(UnitTest);

g.test('test/sync', t => {});

g.test('test/async', async t => {});

g.test('testp/sync', t => {
  t.log(JSON.stringify(t.params));
}).params([{}]);

g.test('testp/async', async t => {
  t.log(JSON.stringify(t.params));
}).params([{}]);

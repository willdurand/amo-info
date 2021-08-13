import { getExperimentName } from './helpers';

describe(__filename, () => {
  describe('getExperimentName', () => {
    it('returns the name of the experiment without datetime/prefix', () => {
      expect(getExperimentName('20210813_amo_foo_bar_baz')).toEqual(
        'foo bar baz',
      );
    });
  });
});

import { projectsByOrigin } from './settings';

describe(__filename, () => {
  describe('projectsByOrigin', () => {
    it.each(Object.keys(projectsByOrigin))(
      'exposes config for %s',
      (origin) => {
        const config = projectsByOrigin[origin];

        expect(config).toHaveProperty('apiName');
        expect(config).toHaveProperty('apiRepo');
        expect(config).toHaveProperty('apiVersion');
        expect(config).toHaveProperty('appName');
        expect(config).toHaveProperty('appRepo');
        expect(config).toHaveProperty('appVersion');
        expect(config).toHaveProperty('env');
        expect(config).toHaveProperty('hasExperiments');
        expect(config).toHaveProperty('hasFeatureFlags');
        expect(config).toHaveProperty('hasMilestone');
        expect(config).toHaveProperty('pushDoc');
      },
    );
  });
});

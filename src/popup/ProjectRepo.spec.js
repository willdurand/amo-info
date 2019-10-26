import { shallowMount } from '@vue/test-utils';

import GitHubLogo from './GitHubLogo';
import ProjectRepo from './ProjectRepo';
import Skeleton from './Skeleton';

describe(__filename, () => {
  it('renders a GitHubLogo', () => {
    const root = shallowMount(ProjectRepo);

    expect(root.find(GitHubLogo)).toBeVisible();
  });

  it('renders a Skeleton when there is no repository', () => {
    const root = shallowMount(ProjectRepo);

    expect(root.find(Skeleton)).toBeVisible();
  });

  it('renders a link to a GitHub repository', () => {
    const repository = 'some-repo';
    const root = shallowMount(ProjectRepo, { propsData: { repository } });

    const link = root.find('a');
    expect(link).toBeVisible();
    expect(link).toHaveText(repository);
    expect(link.attributes('href')).toEqual(
      `https://github.com/mozilla/${repository}`,
    );
  });
});

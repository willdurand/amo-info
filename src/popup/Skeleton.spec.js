import { shallowMount } from '@vue/test-utils';

import Skeleton from './Skeleton';

describe(__filename, () => {
  it('renders itself', () => {
    const root = shallowMount(Skeleton);

    expect(root.find('.skeleton')).toBeVisible();
  });
});

import { shallowMount } from '@vue/test-utils';

import Value from './Value';
import Skeleton from './Skeleton';

describe(__filename, () => {
  it('is a Vue instance', () => {
    const root = shallowMount(Value);

    expect(root).toBeVueInstance();
  });

  it('renders a title', () => {
    const title = 'some title';
    const root = shallowMount(Value, { propsData: { title } });

    expect(root.find('h3')).toBeVisible();
    expect(root.find('h3')).toHaveText(title);
  });

  it('renders a loading skeleton when there is no value', () => {
    const root = shallowMount(Value);

    expect(root.find(Skeleton)).toBeVisible();
  });

  it('renders a value', () => {
    const value = 'some value';
    const root = shallowMount(Value, { propsData: { value } });

    expect(root.find('pre')).toBeVisible();
  });
});

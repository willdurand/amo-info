import { mount } from '@vue/test-utils';
import Value from './Value';

describe(__filename, () => {
  it('is a Vue instance', () => {
    const wrapper = mount(Value);

    expect(wrapper.isVueInstance()).toEqual(true);
  });
});

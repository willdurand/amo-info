/* global expect */
expect.extend({
  toBeVueInstance(received) {
    return {
      pass: received.isVueInstance(),
      message: () => `expected "${received.name()}" to be a Vue instance`,
    };
  },
  toBeVisible(received) {
    return {
      pass: received.isVisible(),
      message: () => `expected "${received.name()}" to be visible`,
    };
  },
  toHaveText(received, value) {
    const text = received.text();

    return {
      pass: text === value,
      message: () => {
        return `expected "${received.name()}" to have text "${value}" but it was "${text}"`;
      },
    };
  },
});

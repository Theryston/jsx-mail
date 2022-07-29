import React from 'react';
import { ReactJsonRender } from '.';

describe('ReactJsonRender', () => {
  it('should call fromComponent with correct arguments', () => {
    const reactJsonRender = new ReactJsonRender();
    const componentFunction = jest.fn(() => {
      return React.createElement('h1', null, 'Hello World!');
    });
    const props = {};
    reactJsonRender.fromComponent(componentFunction, props);
    expect(componentFunction).toHaveBeenCalledWith(props);
  });

  it('should return correct result', async () => {
    const reactJsonRender = new ReactJsonRender();
    const componentFunction = jest.fn(({ test }) => {
      function TestComponent({ text }) {
        return React.createElement('h1', null, text);
      }

      return React.createElement(
        'div',
        {
          width: '100px',
        },
        test,
        React.createElement(TestComponent, {
          text: 'Test Hello World!',
        }),
      );
    });

    const props = {
      test: 'testing',
    };

    const result = await reactJsonRender.fromComponent(
      componentFunction,
      props,
    );

    expect(result).toMatchSnapshot();
  });
});

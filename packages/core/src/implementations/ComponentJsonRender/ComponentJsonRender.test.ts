import React from 'react';
import styledComponents from 'styled-components';
import { ComponentJsonRender } from './index';

describe('ComponentJsonRender', () => {
  it('should call fromComponent with correct arguments', () => {
    const componentJsonRender = new ComponentJsonRender();
    const componentFunction = jest.fn(() => {
      return React.createElement('h1', null, 'Hello World!');
    });
    const props = {};
    componentJsonRender.fromComponent(componentFunction, props);
    expect(componentFunction).toHaveBeenCalledWith(props);
  });

  it('should return correct result', async () => {
    const componentJsonRender = new ComponentJsonRender();
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
        })
      );
    });

    const props = {
      test: 'testing',
    };

    const result = await componentJsonRender.fromComponent(
      componentFunction,
      props
    );

    expect(result).toMatchSnapshot();
  });

  it('should return works with styled components', async () => {
    const componentJsonRender = new ComponentJsonRender();
    const attrs = {
      bg: 'red',
    };
    const componentFunction = jest.fn(({ test }) => {
      const Container = styledComponents.div
        .withConfig({
          displayName: 'styles__Container',
        })
        .attrs(attrs)(
        // eslint-disable-next-line
        ['width:100%;background-color:', ';'] as any,
        // eslint-disable-next-line
        (props: any) => props.bg || 'red'
      );

      return React.createElement(
        Container,
        {
          bg: '#fff222',
        },
        React.createElement('h1', null, test),
        React.createElement('h1', null, 'Hello World!')
      );
    });

    const props = {
      test: 'testing',
    };

    const result = await componentJsonRender.fromComponent(
      componentFunction,
      props
    );

    expect(result).toMatchSnapshot();
  });
});

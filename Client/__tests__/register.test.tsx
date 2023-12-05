import React from 'react';
import renderer from 'react-test-renderer';

import Register from '../app/(tabs)/register';

describe('<App />', () => {
  it('has 1 child', () => {
    const tree = renderer.create(<Register />).toJSON();
    expect(tree.children.length).toBe(1);
  });
});
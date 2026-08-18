import { describe, it, expect } from 'vitest';
import { DEFAULT_NODE_SPECS, A4_PORTRAIT } from '../types/flowchart';

describe('Project setup sanity check', () => {
  it('should have correct default node dimensions', () => {
    expect(DEFAULT_NODE_SPECS.rectangle.width).toBe(160);
    expect(DEFAULT_NODE_SPECS.rectangle.height).toBe(70);
    expect(DEFAULT_NODE_SPECS.rhombus.width).toBe(180);
    expect(DEFAULT_NODE_SPECS.rhombus.height).toBe(80);
    expect(DEFAULT_NODE_SPECS.stadium.width).toBe(150);
    expect(DEFAULT_NODE_SPECS.stadium.height).toBe(60);
  });

  it('should have correct A4 portrait dimensions', () => {
    expect(A4_PORTRAIT.width).toBe(794);
    expect(A4_PORTRAIT.height).toBe(1123);
  });
});

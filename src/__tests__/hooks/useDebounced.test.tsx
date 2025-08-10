/** @vitest-environment jsdom */

import React, { act } from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { useDebounced } from '../../hooks/useDebounceHook';

function TestComponent({ value, delay }: { value: string; delay: number }) {
  const debounced = useDebounced(value, delay);
  return <div data-testid="value">{debounced}</div>;
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('useDebounced hook', () => {
  it('updates the value only after the specified delay', () => {
    vi.useFakeTimers();
    // enable act in React 19 environment
    // @ts-ignore
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;

    const { rerender } = render(<TestComponent value="a" delay={500} />);
    expect(screen.getByTestId('value').textContent).toBe('a');

    rerender(<TestComponent value="b" delay={500} />);
    // value should remain 'a' before timers run
    expect(screen.getByTestId('value').textContent).toBe('a');

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.getByTestId('value').textContent).toBe('b');
  });

  it('updates when the initial value changes after mount', () => {
    vi.useFakeTimers();
    // enable act in React 19 environment
    // @ts-ignore
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;

    const { rerender } = render(<TestComponent value="first" delay={400} />);
    expect(screen.getByTestId('value').textContent).toBe('first');

    // change the initial prop value on rerender
    rerender(<TestComponent value="second" delay={400} />);
    // debounced value should not update immediately
    expect(screen.getByTestId('value').textContent).toBe('first');

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(screen.getByTestId('value').textContent).toBe('second');
  });

  it('updates to the latest value after rapid changes', () => {
    vi.useFakeTimers();
    // enable act in React 19 environment
    // @ts-ignore
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;

    const { rerender } = render(<TestComponent value="a" delay={500} />);
    expect(screen.getByTestId('value').textContent).toBe('a');

    rerender(<TestComponent value="b" delay={500} />);
    rerender(<TestComponent value="c" delay={500} />);

    // value should remain 'a' before timers run
    expect(screen.getByTestId('value').textContent).toBe('a');

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.getByTestId('value').textContent).toBe('c');
  });

  it('clears pending timers on unmount and delay change', () => {
    vi.useFakeTimers();
    // enable act in React 19 environment
    // @ts-ignore
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;

    const first = render(<TestComponent value="a" delay={500} />);
    // one timer scheduled
    expect(vi.getTimerCount()).toBe(1);

    // unmount should clear timer
    first.unmount();
    expect(vi.getTimerCount()).toBe(0);

    // render again to test delay change
    const second = render(<TestComponent value="a" delay={500} />);
    expect(vi.getTimerCount()).toBe(1);

    second.rerender(<TestComponent value="a" delay={1000} />);
    // there should still be only one timer after delay change
    expect(vi.getTimerCount()).toBe(1);

    second.unmount();
  });
});

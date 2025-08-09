/** @vitest-environment jsdom */

import React, {Suspense, act} from 'react';
import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {createRoot, Root} from 'react-dom/client';

// mock lazy-loaded components
vi.mock('../../../assets/icons/ChevronLeft', () => ({
  default: () => <div data-testid="chevron-left" />,
}));
vi.mock('../../../assets/icons/ChevronRight', () => ({
  default: () => <div data-testid="chevron-right" />,
}));
vi.mock('../../../components/common/FullScreenImage', () => ({
  default: () => <div data-testid="fullscreen" />,
}));
vi.mock('../../../components/common/LazyImage', () => ({
  default: (props: any) => <img {...props} />,
}));

let isFullScreen = false;
const mockToggle = vi.fn();
vi.mock('../../../hooks/useToggleFullscreen', () => ({
  default: () => ({ isFullScreen, toggleFullScreen: mockToggle }),
}));

import ImageSlider from '../../../components/common/ImageSlider';

let container: HTMLDivElement;
let root: Root;
const images = ['a.jpg', 'b.jpg', 'c.jpg'];

const getImg = () => container.querySelector('img');

async function renderSlider(props = {}) {
  await act(async () => {
    root.render(
      <Suspense fallback={null}>
        <ImageSlider images={images} {...props} />
      </Suspense>
    );
  });
  // Allow lazy components to resolve
  await act(async () => {});
}

describe('ImageSlider interactions', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0);
    isFullScreen = false;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    // enable act in React 19 environment
    // @ts-ignore
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('clicking prev/next chevrons updates image index', async () => {
    await renderSlider({ autoSlideTimeout: 1000 });

    expect(getImg()?.getAttribute('alt')).toBe('1');

    await act(async () => {
      container.querySelector('[data-testid="chevron-right"]')!
        .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(getImg()?.getAttribute('alt')).toBe('2');

    await act(async () => {
      container.querySelector('[data-testid="chevron-left"]')!
        .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(getImg()?.getAttribute('alt')).toBe('1');

    await act(async () => {
      container.querySelector('[data-testid="chevron-left"]')!
        .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(getImg()?.getAttribute('alt')).toBe('3');
  });

  it('swiping left/right triggers navigation', async () => {
    await renderSlider({ autoSlideTimeout: 1000 });

    const swipeArea = container.querySelector('div.relative') as HTMLElement;

    await act(async () => {
      const start = new Event('touchstart', { bubbles: true });
      Object.assign(start, { touches: [{ clientX: 100 }] });
      swipeArea.dispatchEvent(start);
      const end = new Event('touchend', { bubbles: true });
      Object.assign(end, { changedTouches: [{ clientX: 50 }] });
      swipeArea.dispatchEvent(end);
    });
    expect(getImg()?.getAttribute('alt')).toBe('2');

    await act(async () => {
      const start = new Event('touchstart', { bubbles: true });
      Object.assign(start, { touches: [{ clientX: 50 }] });
      swipeArea.dispatchEvent(start);
      const end = new Event('touchend', { bubbles: true });
      Object.assign(end, { changedTouches: [{ clientX: 100 }] });
      swipeArea.dispatchEvent(end);
    });
    expect(getImg()?.getAttribute('alt')).toBe('1');
  });

  it('auto-advance skips when fullscreen is true', async () => {
    isFullScreen = true;
    await renderSlider({ autoSlideTimeout: 100 });

    await act(async () => {
      vi.advanceTimersByTime(100);
    });
    expect(getImg()?.getAttribute('alt')).toBe('1');
  });

  it('auto-advance cycles through images', async () => {
    await renderSlider({ autoSlideTimeout: 100 });

    await act(async () => {
      vi.advanceTimersByTime(100);
    });
    expect(getImg()?.getAttribute('alt')).toBe('2');

    await act(async () => {
      vi.advanceTimersByTime(100);
    });
    expect(getImg()?.getAttribute('alt')).toBe('3');

    await act(async () => {
      vi.advanceTimersByTime(100);
    });
    expect(getImg()?.getAttribute('alt')).toBe('1');
  });
});


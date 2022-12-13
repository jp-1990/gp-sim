import { useRef, useCallback, useEffect } from 'react';

/**
 * Returns a Loader component used to trigger the provided action when it intersects the viewport
 * @param callback - callback to call when the Loader component is intersecting the viewport
 * @param trigger - any. Used in the dependancy array of handleObserver useCallback
 * @param rootMargin - string. Margin to add to the loader to determine intersect point
 */
export const useInfiniteScroll = (
  callback: () => any,
  trigger: any,
  rootMargin = '330px'
) => {
  const loader = useRef(null);

  const handleObserver: IntersectionObserverCallback = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        callback();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [trigger, callback]
  );

  useEffect(() => {
    const option = {
      rootMargin,
      root: null,
      threshold: 0
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, [handleObserver, rootMargin]);

  const Loader = () => <div ref={loader} />;

  return {
    Loader
  };
};

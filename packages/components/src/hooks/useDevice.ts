import { useEffect, useState } from 'react';
import { STANDARD_BREAKPOINTS } from './constants';
import type { StandardResponsiveTypes } from './constants';

export function useDevice(): { [key in StandardResponsiveTypes]: boolean } {
  const initialMatches: { [key in StandardResponsiveTypes]: boolean } = {
    mobile: false,
    tablet: false,
    smallScreen: false,
    desktop: false,
    extraLarge: false,
  };

  const [matches, setMatches] = useState(initialMatches);

  useEffect(() => {
    const handleChange = (type: StandardResponsiveTypes, mediaQueryList: MediaQueryList) => {
      setMatches((prev) => ({ ...prev, [type]: mediaQueryList.matches }));
    };

    const mediaQueryLists: { [key in StandardResponsiveTypes]: MediaQueryList } = {
      mobile: window.matchMedia(STANDARD_BREAKPOINTS.mobile),
      tablet: window.matchMedia(STANDARD_BREAKPOINTS.tablet),
      smallScreen: window.matchMedia(STANDARD_BREAKPOINTS.smallScreen),
      desktop: window.matchMedia(STANDARD_BREAKPOINTS.desktop),
      extraLarge: window.matchMedia(STANDARD_BREAKPOINTS.extraLarge),
    };

    // Initialize
    Object.keys(mediaQueryLists).forEach((type) => {
      handleChange(type as StandardResponsiveTypes, mediaQueryLists[type as StandardResponsiveTypes]);
    });

    // Add listeners
    Object.keys(mediaQueryLists).forEach((type) => {
      const mediaQueryList = mediaQueryLists[type as StandardResponsiveTypes];
      mediaQueryList.addEventListener('change', (event) => handleChange(type as StandardResponsiveTypes, event.currentTarget as MediaQueryList));
    });

    // Cleanup listeners
    return () => {
      Object.keys(mediaQueryLists).forEach((type) => {
        const mediaQueryList = mediaQueryLists[type as StandardResponsiveTypes];
        mediaQueryList.removeEventListener('change', (event) => handleChange(type as StandardResponsiveTypes, event.currentTarget as MediaQueryList));
      });
    };
  }, []);

  return matches;
}
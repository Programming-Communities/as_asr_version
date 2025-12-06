'use client';

import { useDeviceType } from '@/hooks/useDeviceType';
import type { AdProps } from '@/types/components';
import AdDesktop from './AdDesktop';
import AdTablet from './AdTablet';
import AdMobile from './AdMobile';

export default function AdWrapper(props: AdProps) {
  const device = useDeviceType();

  switch (device) {
    case 'desktop':
      return <AdDesktop {...props} />;
    case 'tablet':
      return <AdTablet {...props} />;
    case 'mobile':
      return <AdMobile {...props} />;
    default:
      return <AdDesktop {...props} />;
  }
}

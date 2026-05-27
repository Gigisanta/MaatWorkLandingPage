'use client';

import dynamic from 'next/dynamic';

const GalaxyBackground3D = dynamic(() => import('@/components/three/GalaxyBackground3D'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 z-0 bg-gradient-to-b from-violet-950 via-[#030014] to-[#030014]" />
});

export default function GalaxyWrapper() {
  return <GalaxyBackground3D />;
}

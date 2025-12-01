import React, { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import particlesConfig from './particles-config';

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    // This loads the tsparticles package bundle, it's required for this to work
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    // You can do something with the container here, if needed
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={particlesConfig}
      className="fixed top-0 left-0 w-full h-full z-[-1]" // Position behind all content
    />
  );
};

export default ParticlesBackground;
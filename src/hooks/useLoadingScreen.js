import { useState, useEffect } from 'react';

const useLoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [minimumLoadingTime] = useState(3000); // Minimum 3 seconds loading

  useEffect(() => {
    const startTime = Date.now();
    
    // Simulate initial app loading
    const timer = setTimeout(() => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime);
      
      setTimeout(() => {
        setIsLoading(false);
      }, remainingTime);
    }, 100);

    return () => clearTimeout(timer);
  }, [minimumLoadingTime]);

  return { isLoading, setIsLoading };
};

export default useLoadingScreen;

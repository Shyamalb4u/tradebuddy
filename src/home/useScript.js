import { useEffect } from "react";

const useScript = (urls = []) => {
  useEffect(() => {
    const scripts = [];

    urls.forEach((url) => {
      const script = document.createElement("script");
      script.src = url;
      script.async = true;
      document.body.appendChild(script);
      scripts.push(script);
    });

    return () => {
      // cleanup: remove scripts if component unmounts
      scripts.forEach((script) => {
        document.body.removeChild(script);
      });
    };
  }, [urls]);
};

export default useScript;

import { useEffect, useRef, useState } from "react";

const easeOutQuad = (t) => t * (2 - t); // accélère → ralentit

const CountUp = ({ end, duration = 2000 }) => {
  const [value, setValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  // ✅ Détection visibilité
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  // ✅ Animation ease-out + count-up
  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuad(progress);

      const currentValue = Math.floor(eased * end);
      setValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return (
    <span
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.8s ease-out",
      }}
    >
      {value.toLocaleString()}
    </span>
  );
};

export default CountUp;

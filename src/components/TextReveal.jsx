import { useEffect, useState } from "react";

const TextReveal = ({ text, duration = 2000 }) => {
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    const totalChars = text.length;
    const intervalTime = duration / totalChars;

    const interval = setInterval(() => {
      setVisibleChars((prev) => {
        if (prev >= totalChars) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [text, duration]);

  return (
    <h2
      className="text-center mb--40"
      style={{
        fontWeight: "700",
        fontSize: "32px",
        letterSpacing: "2px",
        opacity: 1,
        transition: "opacity 0.5s ease-out",
      }}
    >
      {text.split("").map((char, index) => (
        <span
          key={index}
          style={{
            opacity: index < visibleChars ? 1 : 0,
            transition: "opacity 0.05s ease-out",
          }}
        >
          {char}
        </span>
      ))}
    </h2>
  );
};

export default TextReveal;

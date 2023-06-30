const Spinner: React.FC = () => {
  return (
    <div className="scale-150">
      <svg
        version="1.1"
        viewBox="0 0 64 64"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
        id="spinner"
      >
        <circle
          className="path-gradient"
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke="url(#sGD)"
          strokeWidth="8"
        />
        <path
          className="path-solid"
          d="M 32,4 A 28 28,0,0,0,32,60"
          fill="none"
          stroke="#000"
          strokeWidth="8"
          strokeLinecap="round"
        />

        <defs>
          <linearGradient
            id="sGD"
            gradientUnits="userSpaceOnUse"
            x1="32"
            y1="0"
            x2="32"
            y2="64"
          >
            <stop
              stopColor="#000"
              offset="0.1"
              stopOpacity="0"
              className="stop1"
            ></stop>
            <stop
              stopColor="#000"
              offset=".9"
              stopOpacity="1"
              className="stop2"
            ></stop>
          </linearGradient>
        </defs>

        <animateTransform
          values="0,0,0;360,0,0"
          attributeName="transform"
          type="rotate"
          repeatCount="indefinite"
          dur="750ms"
        ></animateTransform>
      </svg>
    </div>
  );
};

export default Spinner;

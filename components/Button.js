//comes with text, color, size, and background color

const Button = ({ color, text, size, background }) => {
  return (
    <button style={{ backgroundColor: background, hgo }} className="btn">
      {" "}
      {text}{" "}
    </button>
  );
};

export default Button;

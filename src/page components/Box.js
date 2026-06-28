import { useState } from "react";

export function Box({ children, big }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`${big ? "box-big" : "box"}`}>
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>

      {isOpen && children}
    </div>
  );
}

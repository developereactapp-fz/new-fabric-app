import { useRef, useState, useEffect } from "react";

// Focus area definitions for different garment parts
// Adjusted to center each specific piece in the viewport
const focusAreas = {
  // TOP pieces - move DOWN significantly to bring to center
  collar: { x: 0, y: 380, scale: 2.5 },
  accessories: { x: 0, y: 380, scale: 2.5 },
  lapel: { x: 0, y: 320, scale: 2.5 },
  style: { x: 0, y: 300, scale: 2.5 },
  
  // UPPER pieces - move DOWN moderately
  chestPocket: { x: -100, y: 200, scale: 2.5 },
  backDetails: { x: 0, y: 180, scale: 2.2 },
  
  // CENTER pieces - minimal or no adjustment
  placket: { x: 0, y: 80, scale: 2.2 },
  buttons: { x: 0, y: 80, scale: 2.2 },
  button: { x: 0, y: 80, scale: 2.2 },
  pockets: { x: 0, y: 60, scale: 2.2 },
  fit: { x: 0, y: 40, scale: 2 },
  back: { x: 0, y: 40, scale: 2 },
  
  // LOWER pieces - move UP moderately
  sleeve: { x: -80, y: -100, scale: 2.2 },
  pleats: { x: 0, y: -120, scale: 2.2 },
  stripe: { x: 0, y: -140, scale: 2.2 },
  vents: { x: 0, y: -160, scale: 2.2 },
  
  // BOTTOM pieces - move UP significantly
  cuff: { x: -210, y: -260, scale: 2.5 },
  hem: { x: 0, y: -280, scale: 2.5 },
};

export default function ZoomWrapper({ children, focusArea }) {
  const containerRef = useRef();

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const state = useRef({
    dragging: false,
    lastX: 0,
    lastY: 0,
    velocityX: 0,
    velocityY: 0,
    lastTouchDistance: null,
  });

  // Handle focus area changes
  useEffect(() => {
    if (focusArea && focusAreas[focusArea]) {
      const target = focusAreas[focusArea];
      setScale(target.scale);
      setPosition({ x: target.x, y: target.y });
    } else if (focusArea === null) {
      // Reset to default view
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [focusArea]);

  /* ------------------ DOUBLE CLICK ZOOM ------------------ */
  const handleDoubleClick = (e) => {
    const rect = containerRef.current.getBoundingClientRect();

    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const newScale = scale === 1 ? 3 : 1;

    setScale(newScale);
    setPosition({
      x: -offsetX,
      y: -offsetY,
    });
  };

  /* ------------------ MOUSE DRAG ------------------ */
  const onMouseDown = (e) => {
    state.current.dragging = true;
    state.current.lastX = e.clientX;
    state.current.lastY = e.clientY;
  };

  const onMouseMove = (e) => {
    if (!state.current.dragging) return;

    const dx = e.clientX - state.current.lastX;
    const dy = e.clientY - state.current.lastY;

    state.current.velocityX = dx;
    state.current.velocityY = dy;

    setPosition((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));

    state.current.lastX = e.clientX;
    state.current.lastY = e.clientY;
  };

  const onMouseUp = () => {
    state.current.dragging = false;
  };

  /* ------------------ TOUCH (PINCH + DRAG) ------------------ */
  const getDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const onTouchStart = (e) => {
    if (e.touches.length === 2) {
      state.current.lastTouchDistance = getDistance(e.touches);
    } else {
      state.current.dragging = true;
      state.current.lastX = e.touches[0].clientX;
      state.current.lastY = e.touches[0].clientY;
    }
  };

  const onTouchMove = (e) => {
    if (e.touches.length === 2) {
      const dist = getDistance(e.touches);

      if (state.current.lastTouchDistance) {
        let delta = dist - state.current.lastTouchDistance;
        let newScale = scale + delta * 0.01;

        newScale = Math.max(1, Math.min(5, newScale));
        setScale(newScale);
      }

      state.current.lastTouchDistance = dist;
    } else if (state.current.dragging) {
      const dx = e.touches[0].clientX - state.current.lastX;
      const dy = e.touches[0].clientY - state.current.lastY;

      setPosition((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));

      state.current.lastX = e.touches[0].clientX;
      state.current.lastY = e.touches[0].clientY;
    }
  };

  const onTouchEnd = () => {
    state.current.dragging = false;
    state.current.lastTouchDistance = null;
  };

  /* ------------------ INERTIA ------------------ */
  useEffect(() => {
    let animation;

    const applyInertia = () => {
      if (state.current.dragging) return;

      state.current.velocityX *= 0.95;
      state.current.velocityY *= 0.95;

      if (
        Math.abs(state.current.velocityX) < 0.1 &&
        Math.abs(state.current.velocityY) < 0.1
      ) {
        return;
      }

      setPosition((prev) => ({
        x: prev.x + state.current.velocityX,
        y: prev.y + state.current.velocityY,
      }));

      animation = requestAnimationFrame(applyInertia);
    };

    animation = requestAnimationFrame(applyInertia);

    return () => cancelAnimationFrame(animation);
  }, []);

  return (
    <div
      ref={containerRef}
      className="zoom"
      onDoubleClick={handleDoubleClick}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="zoom-inner"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transition: state.current.dragging ? "none" : "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
export default function ArrowNav({ onClick, onPrev, onNext }) {
  const handlePrev = onPrev || onClick;
  const handleNext = onNext || onClick;

  return (
    <>
      <button className="arrow left" onClick={handlePrev}>‹</button>
      <button className="arrow right" onClick={handleNext}>›</button>
    </>
  );
}
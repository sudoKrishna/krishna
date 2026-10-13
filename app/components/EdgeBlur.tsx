export function EdgeBlur() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-40 h-24 backdrop-blur-md [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-24 backdrop-blur-md [mask-image:linear-gradient(to_top,black,transparent)]"
      />
    </>
  );
}

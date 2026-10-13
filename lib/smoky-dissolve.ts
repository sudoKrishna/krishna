/**
 * A light "smoky dissolve" exit: the element blurs + fades + scales away,
 * then the callback fires.
 */
export function dissolve(
  element: HTMLElement,
  options: { onComplete?: () => void } = {},
) {
  const animation = element.animate(
    [
      { opacity: 1, filter: "blur(0px)", transform: "scale(1)" },
      { opacity: 0, filter: "blur(8px)", transform: "scale(1.04)" },
    ],
    { duration: 280, easing: "cubic-bezier(0.4, 0, 0.2, 1)", fill: "forwards" },
  );

  const done = () => options.onComplete?.();
  animation.addEventListener("finish", done);
  animation.addEventListener("cancel", done);

  return animation;
}

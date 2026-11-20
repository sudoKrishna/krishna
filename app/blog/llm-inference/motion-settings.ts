export const ease = [0.22, 1, 0.36, 1] as const;
export const timing = {
  quick: 0.15,
  reveal: 0.4,
  stagger: 0.07,
  token: 0.04,
} as const;
export const tween = (
  reduce: boolean | null,
  duration = timing.quick as number,
) => ({
  duration: reduce ? 0 : duration,
  ease,
});

export const STILL_ICON_TRANSFORM = 'translate3d(0, 0px, 0) scaleX(1.000) scaleY(1.000) rotate(0deg)';

export function getScrollIconTransform(scrollY: number) {
  if (!Number.isFinite(scrollY) || scrollY <= 0) {
    return STILL_ICON_TRANSFORM;
  }

  const impactPhase = scrollY % 120;
  const impactSquash = impactPhase < 28 ? 1 - impactPhase / 28 : 0;
  const reboundStretch = impactPhase >= 28 && impactPhase < 68 ? 1 - Math.abs((impactPhase - 48) / 20) : 0;
  const tiredSquash = Math.min(scrollY / 900, 1) * 0.08;
  const squash = Math.min(1, Math.max(impactSquash, Math.abs(Math.sin(scrollY / 38)) * 0.35) + tiredSquash);
  const scaleX = 1 + squash * 0.24 - reboundStretch * 0.08;
  const scaleY = 1 - squash * 0.24 + reboundStretch * 0.18;
  const hop = Math.round(impactSquash * 3 - reboundStretch * 5);
  const rotation = Math.round(Math.sin(scrollY / 64) * 3 - impactSquash);

  return `translate3d(0, ${hop}px, 0) scaleX(${scaleX.toFixed(3)}) scaleY(${scaleY.toFixed(3)}) rotate(${rotation}deg)`;
}

export function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  trailOpacity: number,
): void {
  ctx.fillStyle = `rgba(10,10,16,${trailOpacity})`
  ctx.fillRect(0, 0, width, height)
}

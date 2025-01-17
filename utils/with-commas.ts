export function numberWithCommas(x: number) {
  return x
    .toFixed(1)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

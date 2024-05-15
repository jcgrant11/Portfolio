export function formatCurrency(num) {
  return '$' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

// export function formatReleaseDate(date) {
//   const dateObj = new Date(Date.parse(date));
//   return dateObj.toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric" });
// }

// export function formatDuration(num) {
//   return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
// }
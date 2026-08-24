const fmt = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatTanggal(d: Date | string): string {
  return fmt.format(new Date(d));
}

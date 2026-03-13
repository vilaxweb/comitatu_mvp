export function formatPrice(price: string): string {
  const n = Number(price);
  if (Number.isNaN(n)) return price;

  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(n);
}


export function formatLabel(value: string | undefined): string {
  if (!value) return "-";
  
  const parts = value.split("_");

  // Case: range like 750_999cc
  if (parts.length === 2 && !isNaN(Number(parts[0]))) {
    const numberPart = parts[1].replace(/[^\d]/g, "");
    const unitPart = parts[1].replace(/[\d]/g, "").toUpperCase();

    return `${parts[0]}-${numberPart} ${unitPart}`;
  }

  // Default case
  return parts
    .map(part => {
      if (part.toLowerCase() === "cc") return "CC";
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ");
}
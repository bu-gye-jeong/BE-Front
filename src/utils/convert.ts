type Unit = "px" | "vw" | "vh";

export function convertUnit(value: number, from: Unit, to: Unit) {
  if (from === to) return value;

  switch (from) {
    case "vw":
      value *= window.innerWidth / 100;
      break;
    case "vh":
      value *= window.innerHeight / 100;
      break;
  }
  switch (to) {
    case "vw":
      return (value *= 100 / window.innerWidth);
    case "vh":
      return (value *= 100 / window.innerHeight);
    case "px":
      return value;
  }
}

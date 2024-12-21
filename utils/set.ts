export function getFullSetType(type: SetType) {
  switch (type) {
    case "W":
      return "Warm-up set";
    case "GS":
      return "Giant set";
    case "DS":
      return "Drop set";
    case "MM":
      return "Myorep match set";
    default:
      return "Straight set";
  }
}

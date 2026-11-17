export function isAlmostDue(
  moveInDate: string,
  today = new Date(),
): boolean | null {
  const validationDate = new Date(moveInDate);
  const month = validationDate.getMonth();
  const day = validationDate.getDate();

  for (let offset = 0; offset <= 2; offset++) {
    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + offset,
    );
    if (date.getMonth() + 1 === month && date.getDate() === day) return true;
  }

  return false;
}

export function formatMonthDay(moveInDate: string) {
  const validationDate = new Date(moveInDate);

  const day = validationDate.getDate();

  const today = new Date();
  const month =
    today.getMonth() == 11 && day > today.getDay() ? 0 : today.getMonth() + 1;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Determine the ordinal suffix
  const getOrdinal = (n: number) => {
    if (n > 3 && n < 21) return "th";
    switch (n % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${getOrdinal(day)} ${months[month]}`;
}

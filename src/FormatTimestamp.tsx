interface FormatTimestampProps {
  timestamp?: string | number | Date | null;
}

export default function FormatTimestamp({ timestamp }: FormatTimestampProps) {
  if (!timestamp) return <span>N/A</span>;

  const dateObj = new Date(timestamp);

  // Formats to: "November 7, 2026"
  const localizedDate = dateObj.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return <span>{localizedDate}</span>;
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const timeOptions = { hour: "numeric", minute: "numeric" };
  return date.toLocaleTimeString([], timeOptions);
}

export default formatTimestamp;

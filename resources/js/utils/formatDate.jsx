export function formatDate(dateString) {
    if (!dateString) return ""; // return empty if missing

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return ""; // invalid date string
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
}

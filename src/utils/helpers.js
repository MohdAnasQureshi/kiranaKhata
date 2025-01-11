import { formatDistance, parseISO, format } from "date-fns";
import { differenceInDays } from "date-fns";

export const formatDate = (date) => format(new Date(date), "PPpp");
export const formatAndGetDate = (date) => {
  const options = { day: "numeric", month: "short", year: "numeric" };
  const formattedDate = new Date(date).toLocaleDateString("en-US", options);
  const parts = formattedDate.split(" "); // e.g., "Jan 5, 2025" -> ["Jan", "5,", "2025"]
  return `${parts[1]} ${parts[0]} ${parts[2]}`.replace(",", ""); // Rearrange and remove comma
};

export const formatAndSubtractOneDay = (dateString) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() - 1); // Subtract one day
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }); // Format as "1 Jan 2025"
};
// We want to make this function work for both Date objects and strings (which come from Supabase)
export const subtractDates = (dateStr1, dateStr2) =>
  differenceInDays(parseISO(String(dateStr1)), parseISO(String(dateStr2)));

export const formatDistanceFromNow = (dateStr) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  })
    .replace("about ", "")
    .replace("in", "In");

// Supabase needs an ISO date string. However, that string will be different on every render because the MS or SEC have changed, which isn't good. So we use this trick to remove any time
export const getToday = function (options = {}) {
  const today = new Date();

  // This is necessary to compare with created_at from Supabase, because it it not at 0.0.0.0, so we need to set the date to be END of the day when we compare it with earlier dates
  if (options?.end)
    // Set to the last second of the day
    today.setUTCHours(23, 59, 59, 999);
  else today.setUTCHours(0, 0, 0, 0);
  return today.toISOString();
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "INR" }).format(
    Math.abs(value)
  );

export const capitalizeFirstLetter = (word) => {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};

// export const calculateMonthsAndDays = (startDate) => {
//   const start = new Date(startDate);
//   const now = new Date();

//   const yearsDiff = now.getFullYear() - start.getFullYear();
//   const monthsDiff = now.getMonth() - start.getMonth() + yearsDiff * 12;
//   const daysDiff =
//     now.getDate() >= start.getDate()
//       ? now.getDate() - start.getDate()
//       : new Date(now.getFullYear(), now.getMonth(), 0).getDate() -
//         start.getDate() +
//         now.getDate();

//   return { months: monthsDiff, days: daysDiff, years: yearsDiff };
// };
//  1 years 1 months 16 days this code gave this error but only 16 days had passed corrected code :

export const calculateMonthsAndDays = (startDate) => {
  const start = new Date(startDate);
  const now = new Date();

  // Calculate the difference in years, months, and days.
  let yearsDiff = now.getFullYear() - start.getFullYear();
  let monthsDiff = now.getMonth() - start.getMonth();
  let daysDiff = now.getDate() - start.getDate();

  // If the current month is earlier than the start month, reduce the yearsDiff and monthsDiff
  if (monthsDiff < 0) {
    yearsDiff--;
    monthsDiff += 12; // Adjust months to a positive number
  }

  // If the current day is earlier than the start day, adjust the days
  if (daysDiff < 0) {
    const previousMonth = new Date(now.getFullYear(), now.getMonth(), 0); // Get last day of previous month
    daysDiff = previousMonth.getDate() - start.getDate() + now.getDate();
    monthsDiff--; // Decrease the month count since we're not at the start day yet
    if (monthsDiff < 0) {
      monthsDiff = 11; // Adjust months and years if necessary
      yearsDiff--;
    }
  }

  return { years: yearsDiff, months: monthsDiff, days: daysDiff };
};

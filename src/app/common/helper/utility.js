const Utility = {
  timeAgo(timestamp) {
    const currentDate = new Date();
    const targetDate = new Date(timestamp);
    const timeDifference = currentDate - targetDate;

    const secondsAgo = Math.floor(timeDifference / 1000);
    if (secondsAgo < 60) {
      return `${secondsAgo} second${secondsAgo === 1 ? "" : "s"} ago`;
    }

    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60) {
      return `${minutesAgo} minute${minutesAgo === 1 ? "" : "s"} ago`;
    }

    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 24) {
      return `${hoursAgo} hour${hoursAgo === 1 ? "" : "s"} ago`;
    }

    const daysAgo = Math.floor(hoursAgo / 24);
    if (daysAgo < 7) {
      return `${daysAgo} day${daysAgo === 1 ? "" : "s"} ago`;
    }

    const weeksAgo = Math.floor(daysAgo / 7);
    if (weeksAgo < 52) {
      return `${weeksAgo} week${weeksAgo === 1 ? "" : "s"} ago`;
    }

    const yearsAgo = Math.floor(weeksAgo / 52);
    return `${yearsAgo} year${yearsAgo === 1 ? "" : "s"} ago`;
  },
  formatDateTime(inputDateTime) {
    const options = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    const formattedDateTime = new Date(inputDateTime).toLocaleDateString(
      "en-SG",
      options
    );

    const formattedWithoutAt = formattedDateTime.replace(" at", ",");
    return formattedWithoutAt;
  },
};

export default Utility;

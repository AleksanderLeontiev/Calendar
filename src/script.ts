const date = new Date();
const prevDate = document.querySelector(".prev") as HTMLHtmlElement;
const nextDate = document.querySelector(".next") as HTMLHtmlElement;
export const renderCalendar = (): void => {
  date.setDate(1);

  const boardMonth = document.querySelector(".date h1") as HTMLHtmlElement;

  const boardCurrentDate = document.querySelector(".date p") as HTMLHtmlElement;

  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();

  const prevLastDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    0
  ).getDate();

  const firstDayIndex = date.getDay();

  const lastDayIndex = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDay();

  const nextDays = 7 - lastDayIndex - 1;
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

  boardMonth.innerHTML = months[date.getMonth()];

  boardCurrentDate.innerHTML = new Date().toDateString();

  const monthDays = document.querySelector(".days") as HTMLHtmlElement;

  let days = "";

  for (let i = firstDayIndex; i > 0; i--) {
    days += `<div class="prev-date">${prevLastDay - i + 1}</div>`;
  }

  for (let i = 1; i <= lastDay; i++) {
    if (
      i === new Date().getDate() &&
      date.getMonth() === new Date().getMonth()
    ) {
      days += `<div class="today">${i}</div>`;
    } else {
      days += `<div class="${i}">${i}</div>`;
    }
  }

  for (let i = 1; i <= nextDays; i++) {
    days += `<div class="next-date">${i}</div>`;
    monthDays.innerHTML = days;
  }
};

prevDate.addEventListener("click", () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
});

nextDate.addEventListener("click", () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
});

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const selectDateEl = document.querySelector('input[type="text"]');
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
  },
};
const selectedDate = flatpickr(selectDateEl, options);
let intervalId = null;

const btnStartEl = document.querySelector('[data-start]');
btnStartEl.disabled = true;

selectDateEl.addEventListener('input', onChangeDate);
function onChangeDate() {
  const unixTime = selectedDate.selectedDates[0].getTime();

  if (Date.now() > unixTime) {
    Notiflix.Notify.failure('Please choose a date in the future');
  } else {
    btnStartEl.disabled = false;
    localStorage.setItem('timer', unixTime);
  }
}

btnStartEl.addEventListener('click', onTimer);

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

const second = document.querySelector('[data-seconds]');
const minutes = document.querySelector('[data-minutes]');
const hours = document.querySelector('[data-hours]');
const days = document.querySelector('[data-days]');

function onTimer() {
  intervalId = setInterval(() => {
    const difference = convertMs(localStorage.getItem('timer') - Date.now());

    second.textContent = addLeadingZero(difference.seconds);
    minutes.textContent = addLeadingZero(difference.minutes);
    hours.textContent = addLeadingZero(difference.hours);
    days.textContent = addLeadingZero(difference.days);

    if (
      second.textContent === '00' &&
      minutes.textContent === '00' &&
      hours.textContent === '00' &&
      days.textContent === '00'
    ) {
      clearInterval(intervalId);
    }
  }, 1000);

  selectDateEl.removeEventListener('input', onChangeDate);

  btnStartEl.disabled = true;
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

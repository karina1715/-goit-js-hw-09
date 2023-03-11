import Notiflix from 'notiflix';

const formEl = document.querySelector('form');
const delayBtnEl = document.querySelector('[name="delay"]');
const delayStepBtnEl = document.querySelector('[name="step"]');
const amountBtnEl = document.querySelector('[name="amount"]');

formEl.addEventListener('submit', e => {
  e.preventDefault();

  let position = 1;
  let delay = +delayBtnEl.value;

  for (let i = 0; i < +amountBtnEl.value; i += 1) {
    createPromise(position, delay)
      .then(({ position, delay }) =>
        Notiflix.Notify.success(
          `✅ Fulfilled promise ${position} in ${delay}ms`
        )
      )
      .catch(({ position, delay }) =>
        Notiflix.Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`)
      );
    position += 1;
    delay += +delayStepBtnEl.value;
  }
  // e.target.reset()
});

function createPromise(position, delay) {
  const shouldResolve = Math.random() > 0.3;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        const value = {
          position,
          delay,
        };
        resolve(value);
      } else {
        const error = {
          position,
          delay,
        };
        reject(error);
      }
    }, delay);
  });
}

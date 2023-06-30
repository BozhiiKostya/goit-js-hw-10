import SlimSelect from 'slim-select';
import Notiflix from 'notiflix';
import { fetchBreeds, fetchCatByBreed } from './cat-api';

const selectEl = document.querySelector('.breed-select');
const loaderEl = document.querySelector('.loader');
const errorEl = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');
const URL = 'https://api.thecatapi.com/v1/breeds';
const API_KEY =
  'live_blWFeV3SgJGRcdrimo1wyiXkgSwcyKUlq54q33Vm9r6QhxmXOMCQBthUWdNIktL5';

Notiflix.Notify.init({
  width: '350px',
  position: 'left-top', // 'right-top' - 'right-bottom' - 'left-top' - 'left-bottom' - 'center-top' - 'center-bottom' - 'center-center'
  distance: '15px',
  opacity: 1,
  borderRadius: '5px',
  rtl: false,
  timeout: 6000,
  messageMaxLength: 110,
  backOverlay: false,
  backOverlayColor: 'rgba(0,0,0,0.5)',
  plainText: true,
  showOnlyTheLastOne: true,
  clickToClose: true,
  pauseOnHover: true,

  failure: {
    background: '#ff0000',
    textColor: '#fff',
    childClassName: 'notiflix-notify-failure',
    notiflixIconColor: 'rgba(0,0,0,0.2)',
    fontAwesomeClassName: 'fas fa-times-circle',
    fontAwesomeIconColor: 'rgba(0,0,0,0.2)',
    backOverlayColor: 'rgba(255,85,73,0.2)',
  },
});
Notiflix.Loading.init({
  className: 'notiflix-loading',
  zindex: 4000,
  rtl: false,
  fontFamily: 'Quicksand',
  cssAnimation: true,
  cssAnimationDuration: 400,
  clickToClose: false,
  customSvgUrl: null,
  customSvgCode: null,
  svgSize: '100px',
  svgColor: '#000000',
  messageID: 'NotiflixLoadingMessage',
  messageFontSize: '20px',
  messageMaxLength: 34,
  messageColor: '#000000',
});
Notiflix.Loading.standard('Loading data, please wait...', {
  backgroundColor: 'rgba(0,0,0,0.4)',
});

selectEl.addEventListener('change', onChangeSelect);

fetchBreeds(URL, API_KEY)
  .then(resp => {
    if (resp) {
      // loaderEl.hidden = true;
      Notiflix.Loading.remove();
      selectEl.hidden = false;
    }

    const markup = resp
      .map(breed => {
        return `<option value="${breed.id}">${breed.name}</option>`;
      })
      .join('');
    if (!resp) {
      throw new Error();
    }
    selectEl.innerHTML = markup;
  })
  .catch(error => {
    console.log(error);
  });

function onChangeSelect() {
  const selectedValue = selectEl.value;
  // loaderEl.hidden = false;
  Notiflix.Loading.standard('Loading data, please wait...', {
    backgroundColor: 'rgba(0,0,0,0.4)',
  });
  catInfo.innerHTML = '';
  fetchCatByBreed(selectedValue, API_KEY)
    .then(resp => {
      if (resp) {
        // loaderEl.hidden = true;
        Notiflix.Loading.remove();
      }
      if (resp[0]?.breeds[0]?.hasOwnProperty('name') === undefined) {
        throw new Error();
      } else {
        errorEl.hidden = true;
        const markup = resp
          .map(breed => {
            return ` <img src="${breed.url}" alt="${breed.breeds[0].description}" width = 500/>
      <div class="wrap-text">
        <h2>${breed.breeds[0].name}</h2>
        <p>${breed.breeds[0].description}</p>
        <p><span>Temperament: </span>${breed.breeds[0].temperament}
</p>
      </div>`;
          })
          .join('');

        catInfo.innerHTML = markup;
      }
    })
    .catch(error => {
      console.log(error);
      Notiflix.Notify.failure(
        'Oops! Something went wrong! Try reloading the page!'
      );
      // loaderEl.hidden = true;
      Notiflix.Loading.remove();
      selectEl.hidden = true;
    });
}

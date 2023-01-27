import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;
const refs = {
  searchBox: document.getElementById('search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener(
  'input',
  debounce(onSearchBoxInput, DEBOUNCE_DELAY)
);

function onSearchBoxInput({ target }) {
  const inputValue = target.value.trim();

  if (!inputValue) {
    clearFields();
    return;
  }

  fetchCountries(inputValue)
    .then(countries => {
      const numberCountries = countries.length;

      if (numberCountries > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }

      if (numberCountries >= 2 && numberCountries <= 10) {
        clearFields();
        refs.countryList.innerHTML = createCountryListMarkup(countries);
        return;
      }

      clearFields();
      refs.countryInfo.innerHTML = createCountryMarkup(countries[0]);
    })
    .catch(err => {
      clearFields();

      if (err.message === '404') {
        Notify.failure('Oops, there is no country with that name');
      } else {
        Notify.failure('Something went wrong');
      }
    });
}

function createCountryListMarkup(countries) {
  return countries
    .map(
      ({ flags, name }) => `<li class='country'>
										<img class='country-flag' src='${flags.svg}'>
										<p class='country-name'>${name.official}</p>
									</li>`
    )
    .join('');
}

function createCountryMarkup({ flags, name, capital, population, languages }) {
  return `<div class='country-header'>
						<img class='country-flag' src='${flags.svg}'>
						<p class='country-name country-name--large'>${name.official}</p>
					</div>
					<ul class='meta-info'>
						<li class='meta-info__item'><span>Capital:</span> ${capital}</li>
						<li class='meta-info__item'><span>Population:</span> ${population}</li>
						<li class='meta-info__item'><span>Languages:</span> ${Object.values(
              languages
            ).join(', ')}</li>
					</ul>
	`;
}

function clearFields() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

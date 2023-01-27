const BASIC_URL = 'https://restcountries.com/v3.1/name/';
const searchParams = new URLSearchParams({
  fields: ['name', 'capital', 'population', 'flags', 'languages'],
});

export function fetchCountries(name) {
  return fetch(`${BASIC_URL}${name}?${searchParams}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}

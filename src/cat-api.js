export function fetchBreeds(url, apiKey) {
  return fetch(`${url}?api_key=${apiKey}`).then(respons => {
    return respons.json();
  });
}

export function fetchCatByBreed(breedId, apiKey) {
  return fetch(
    `https://api.thecatapi.com/v1/images/search?api_key=${apiKey}&breed_ids=${breedId}`
  ).then(respons => {
    return respons.json();
  });
}

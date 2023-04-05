import axios from "axios";

// export async function getPeople() {
//   const response = await axios("https://swapi.dev/api/people/");
//   const data = response.data.results;
//   return data;
// }

export async function getPeople(page = 1) {
  const response = await fetch(`https://swapi.dev/api/people/?page=${page}`);
  const data = await response.json();
  return data;
}

export async function getDetail(id = 1) {
  const response = await axios(`https://swapi.dev/api/people/${id}`);
  return response.data;
}

export async function searchCharacter(name) {
  const response = await axios(`https://swapi.dev/api/people/?search=${name}`);
  return response.data.results;
}

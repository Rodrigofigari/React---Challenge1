import { getPeople, getDetail, searchCharacter, actualPage } from "./functions";
import { useState, useEffect, useRef } from "react";
import Loading from "./Loading";

function App() {
  const [characters, setCharacters] = useState([]);
  const [characterDetail, setCharacterDetail] = useState({});

  const [textSearch, setTextSearch] = useState("");

  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Mostramos a los personajes desde el principio
  useEffect(() => {
    getPeople(page)
      .then((data) => setCharacters(data))
      .catch((err) => console.log(err));
  }, [page]);

  // Mostramos detalles del personaje seleccioando
  const showDetail = (character) => {
    const id = character.url.split("/").slice(-2)[0];
    setIsLoading(true);
    getDetail(id)
      .then((data) => {
        setCharacterDetail(data);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  };

  // Seteamos en un estado intrno el valor del input
  const hanldeSearchInput = (event) => {
    const text = event.target.value;
    setTextSearch(text);
  };

  // Buscamos los personajes a partir del valor del input
  const showCharacter = (event) => {
    if (event.key !== "Enter") return;
    setIsLoading(true);
    searchCharacter(textSearch)
      .then((response) => {
        setCharacters(response);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));

    setTextSearch("");
    setCharacterDetail({});
  };

  // Paginado
  const currentPage = (value) => {
    if (!characters.previous && page + value <= 0) return;
    if (!characters.next && page + value > Math.ceil(characters.count / 10))
      // podria ser directamente 9 ya que sabemos que el totla de personajes es de 82
      return;

    setPage(page + value);
  };

  return (
    <div className="App">
      <input
        type="text"
        placeholder="Busca un personaje"
        // ref={inputRef}
        value={textSearch}
        onChange={hanldeSearchInput}
        onKeyDown={showCharacter}
      />

      <ul style={{ cursor: "pointer" }} className="list">
        {characters.results?.map((character) => (
          <li key={character.name} onClick={() => showDetail(character)}>
            {character.name}
          </li>
        ))}
      </ul>

      <section>
        <button onClick={() => currentPage(-1)}>Prev</button>
        {page}
        <button onClick={() => currentPage(1)}>Next</button>
      </section>

      {isLoading ? (
        <Loading />
      ) : (
        characterDetail && (
          <aside>
            <h1>{characterDetail.name}</h1>
            <ul>
              {Object.entries(characterDetail)
                .slice(0, 8)
                ?.map((prop) => (
                  <li key={prop}>
                    {prop[0]} : {prop[1]}
                  </li>
                ))}
            </ul>
          </aside>
        )
      )}
    </div>
  );
}

export default App;

# React-Challenge 1

- Utilizamos la api de Star Wars

* Debemos pegarle a la api y mostrar los nombres como una lista en pantalla
* Debemos hacer un detalle de cada uno de los personajes. Este se activara al hacer click sobre el nombre
* Debemos hacer una busqueda por query a traves de una searchbar.
* Debemos hacer un paginado

-- Primero: hacemos la peticion a la app y renderizamos los nombres.

```javascript
//function.js
import axios from "axios"; // En caso de querer hacerlo con fetch acordarse de que hay que convertir al obj "json" a js y que el resultado no se encuentra dentro de la prop "data"

export async function getPeople() {
  const response = await axios("https://swapi.dev/api/people/");
  return response.data.result;
}
```

```javascript
//App.jsx
import { useState, useEffect } from "react";

function App() {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    getPeople()
      .then(setCharacters)
      .catch((err) => alert(err));
  });

  return (
    <div>
      <ul>
        {characters?.map((character) => (
          <li key={character.name}>{character.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

-- Segundo: genermos un evento Onclick para que el usuario pueda hacer click en los nombres de los personajes y asi vea un detalle de las props de c/u

```javascript
// function.js
export async function getDetail(id) {
  const response = await axios(`https://swapi.dev/api/people/${id}`);
  return response.data;
}
```

```javascript

    // Vamos a tener que:
    // 1. obtener el id de cada uno de los personajes, solo nos viene en la url al final del string ->	"url": "https://swapi.dev/api/people/12/", tenemos que obtener el 12 en este caso. Hay varias formas de hacerlo yo solo implemente la primera que pense
    // 2. Generar una funcion con el endpoint correspondiente
    // almacenar los valores en un nuevo estado que vamos a pintar en pantalla al mappearlo
    // 3. Le sumamos una logica para mostrar determinadas porp del personaje.
      // Pasamos el objeto del personaje a un array con sub arrays que seran el par clave-valor -> [[name,rodirgo], [edad,22], [ciudad, CABA]]
      // Usamos el metodo slice para agarrar las props que queremos y lo mappeamos. Pasamos los dos vaores del array. Primero la clave y segundo el valor


    const [characterDetail, setCharacterDetail] = useState({}) // Los character son objetos con las props

    const detailCharacters = (character) => {
        const id = character.url.split("/").slice(-2)[0];
        getDetail(id).then(setCharacterDetail)
    }

    return(
        <div>
            <ul>
                {characters?.map((character) => (
                    <li key={character.name} onClick(()=>{detailCharacters(character)})>{character.name}</li>
                ))}
            </ul>

            characterDetail && (
          <aside>
            <h1>{characterDetail.name}</h1>
            <ul>
              {Object.entries(characterDetail).slice(0, 8)?.map((prop) => (
                <li key={prop}>
                  {prop[0]} : {prop[1]}
                </li>
              ))}
            </ul>
          </aside>
        )

        </div>
    )
```

-- Tercero: Hacemos una searchbar para buscar los personajes que coincidan con el nombre ingresado por el usuario

```javascript
// function.js

export async function searchCharacters(name) => {
    const response = await axios(`https://swapi.dev/api/people/?search=${name}`)
    return response.data.results
}

```

```javascript
// App.jsx

// 1. Vamos a agregar un tag input y creaermos un estado inputSearch para vincularlos y asi poder tener controlado el mismo
// 2. Vamos a creara un eventlistener onchange para que escuche los cambios en el input. Este evento llama a una funcion que se encarga de ir actualizando el estado inputSearch
// 3. Generar una funcion con su endpoint correspondiente que me devuelve el array con todos los personajes que tengan ese nombre
// 4. Almacenarlo en el estado characters (este estado era el que mostraba los nombres de los personajes)
// 5. generar un boton para activar el evento. En este caso vamos a realizarlo directamente con el Enter -> Evento "onKeydown()". Por ultimo limpiamos el input y el characterDetail por si tenemos los detalles de algun personaje cargado anteriormente

const [inputSearch, setInputSearch] = useState("")

const handleInputSearch = (event) => {
    setInputSearch(event.target.value)
}

const submitShowCharacter = (event) => {
    // Preguntamos si la tecla precionada es Enter, si no corta la ejecucion
    if(event.key !== "Enter") return;

    searchCharacters(inputSearch).then(setcharacters).catch((err) => alert(err.message))
    setInputSearch("") // estado string
    setCharacterDetail({}) // estado objeto
}

return(
    <div>
    <input type="text" placeholder="Busca un personaje" value={inputSearch} onChange=(handleInputSearch) > {/* onChange={(event) => {setInputSearch(event.target.value)}} */}
    onKeyDown={submitShowCharacter}

    <...>
    </div>
)
```

-- Cuarto: Tenemos que hacer el un paginado. La api ya devuelve con un json con el formato de paginado, por eso vamos a usar las props "next" y "previous" de la data. Tenemos que ahcer algunas modificaciones

```javascript
// App.jsx

// 1. Veniamos haciendo la peticion a la api directamente al endpoint "people/", esto lo cambiamos a un search query por pagina, que va a tener por default el valor 1(pag 1) "people/?page={numero-de-pagina}"
// 2. Modificaremos el retorno de la data en la funcion getPeople para acceder a los props "next y previous"
   // Tendremos que modificar en App, el seteo de "setCharacter" en la funcion getPeople, pimer useEffect. Y tmb habra que modificarlo a la hora del mapeo de los nombres de los personajes. El mapeo de los detalles no hara falta modificarlo
// 3 Haremos dos botones uno para avanzar y otro para retroceder. Tmb haremos un estado "page" para poder mostrar la pagina actual
// 4 Haremos una funcion que validara los extremos del paginado y actualizara el valor de "page" para obtener los personajes correspondientes a la pagina

   // Antes
   useEffect(() => {
        getPeople().then(setCharacters).catch((err => alert(err)))
    })

   // Ahora
   useEffect(() => {
    getPeople(page)
      .then((data) => setCharacters(data)) // pasamos todo el objeto no solo el array de los personajes
      .catch((err) => console.log(err));
  }, [page]);

  return(
    <...>
        // Antes
        {characters?.map((character) => (
            <li key={character.name} onClick(()=>detailCharacters(character))>{character.name}</li>
        ))}

        // Ahora
        <ul>
        {characters.results?.map((character) => (
          <li key={character.name} onClick={() => detailCharacters(character)}>
            {character.name}
          </li>
        ))}
      </ul>
    <...>
  )
```

```javascript
// functions.js

export async function(page){
    const response = await axos(`https://swapi.dev/api/people/?page={page}`);
    return response.data
}
```

--// Botones - Paginado

```javascript

const [page, setPage] = useState(1)

const currentPage (value) = { // value es el 1 o -1
    // Si la porp "previous es null Y la suma del valor actual de la pagina + (que en caso de ser -1 seria (-) )" el valor recibido da como resultamos un valor igual o menor a 0 corta la ejecucion
    if(!characters.previous && page + value <= 0) return;

    // Si la porp "next" es null Y la suma del valor actual de la pagina +/- 1 de como resultado un valor mayor a 9, corta la ejecucion

    // En este caso sabiamos que eran 82 personajes, por ende nueve paginas, pero de no saberlo tenemos la porp "count para su logica" -> Math.ceil(characters.count / 10))
    if(!characters.next && page + value > Math.ceil(characters.count / 10)) return;

    setPage(page + value)

}

    return(
    <...>
      <section>
        <button onClick={() => currentPage(-1)}>Prev</button>
        {page}
        <button onClick={() => currentPage(1)}>Next</button>
      </section>
    <...>
    )
```

import {
    ref,
    computed
} from 'vue'
import {
    defineStore
} from 'pinia'

export const useCounterStore = defineStore('counter', () => {
    /* const count = ref(0)
    const doubleCount = computed(() => count.value * 2)
    function increment() {
      count.value++
    }

    return { count, doubleCount, increment } */


    const API = 'https://api.github.com/users/';

    // 24hs 86,400,000 de milisegundos
    const requestMaxTimeMs = 86400000 * 3;

    const search = ref(null);
    const result = ref(null);
    const error = ref(null);
    const favorites = ref(new Map());



    /* 
        ciclos de vida: mounted -> tiene acceso al DOM
        created, seria el apropiado para este caso
        llama onMounted de app
    */
    function created() {
        /* 
            Chequear que existe un localStorage favorites, y si es así guardar pasado a object
            lo constrario a stringify para volver a convertir de string a json object
        */
        const savedFavorites = JSON.parse(window.localStorage.getItem('favorites'));

        // optional chaining ?. para acortar comprobacion. ej: savedFavorites?.length
        if ((savedFavorites != null) && (savedFavorites.length > 0)) {
            /* 
                Crear un Map (favorit) a partir de lo que hay en el localStorage, recorriendo con map y convirtiendo los elementos a Map
            */
            const favorit = new Map(
                // .map metodo de array para recorrer los elementos, crear un array con id, y objeto, por cada elemento del mapa
                savedFavorites.map((favorite) => [favorite.id, favorite])
            );

            /* 
                Guardar finalmente en mis favoritos, lo que tengo en localStorage
            */
            favorites.value = favorit;
        }
    }

    /* 
        Computadas: isFavorite y allFavorites
        siempre son reactivas. siempre tiene que retornar algo
    */
    const isFavorite = computed(() => {
        // devuelve true o false, dependiendo de si existe
        /* 
            Map has() retorno booleano, si existe o no . result es el que busca y trae, el id verifica en keys del mapa favorites 
        */
        return favorites.value.has(result.value.id);
    })

    const allFavorites = computed(() => {
        /* 
            Convertir favorites a un array, para poder recorrer fácil con un for en el template. retorna objeto iterable con el valor del mapa
        */
        return Array.from(favorites.value.values());
    })



    // Computed para almacenar en un array los login de los favorites, y verificar con el search
    const arrayResultLoginFavoritesMayuscula = computed(() => {

        const miArray = [];
        allFavorites.value.forEach((objeto) => {
            miArray.push(objeto.login);
        });

        return miArray.map(elemento => elemento.toUpperCase());

    })



    /* 
        PROBANDO
    */
    async function probando() {
        const response = await fetch(API + search.value);
        const data = await response.json();
        console.log(data);
        console.log("probando");

    }





    /* 
        evento en el submit form
    */
    async function doSearch() {

        //result.value = error.value = null;

        //const foundInFavorites = favorites.value.get(search.value);

        // booleano
        /* const foundInFavorites = arrayResultLoginFavoritesMayuscula.value.includes(search.value.toUpperCase()); */

        // el elemento mismo
        const foundInFavorites = allFavorites.value.find(elemento => elemento.login.toUpperCase() === search.value.toUpperCase());


        // debe solicitar de nuevo? almacena el valor de retorno.  true o false
        /* 
            IIFE: Expresión de función ejecutada inmediatamente. guardar el valor de la funcion en una variable en este caso
            Cada ves que se lance el método doSearch() se ejecuta esto
        */
        const shouldRequestAgain = (() => {
            if (!!foundInFavorites) {
                // desestructuración de la propiedad lastRequest (ultimo ingreso en ms)
                const {
                    lastRequest
                } = foundInFavorites;

                //console.log(`la resta de times...: ${new Date().getTime() - new Date(lastRequest).getTime()}`);

                /* 
                    devuelve true si el tiempo transcurrido supera el limite. 
                    getTime() returns the number of milliseconds since January 1, 1970 00:00:00
                */
                return (
                    /* 
                        Tiempo en milisegundos ahora - tiempo en milisegundos cuando se añadio a favoritos > maximo tiempo que impuse de tiempo transcurrido.
                        osea devolver true si hay que volver a hacer la peticición porque hace mucho (mas de 3 días) se añadio a fav
                    */
                    new Date().getTime() - new Date(lastRequest).getTime() > requestMaxTimeMs
                );
            }

            return false; // no debe solicitar, retorno false porque no lo encontro directamente en favorites
        })();

        // 2 signos de exclamacion, convertir a booleano y volverlo a pasar al signo que era
        // osea que si foundInFavorites es true y NO necesito volver a pedirlo, y tiene return por lo tanto no debería seguir
        if (!!foundInFavorites && !shouldRequestAgain) {
            console.log('Found and we use the cached version');
            return (result.value = foundInFavorites);
        }

        console.log("si existe, no debería aparecer esto. Si NO existe, si deberia aparecer");

        await doRequest();
        if (foundInFavorites) foundInFavorites.lastRequest = new Date();
    }


    async function doRequest() {
        try {
            console.log('Not found or cached version is too old');

            // limpiar todo, poner result y error en null
            result.value = error.value = null;

            const response = await fetch(API + search.value);

            // Error de usuario no encontrado
            if (!response.ok) throw new Error('User not found ' + search.value);

            const data = await response.json();

            // guardar usuario encontrado en result
            result.value = data;

        } catch (err) {
            error.value = err;
        } finally {
            // limpiar caja de búsqueda
            search.value = null;
        }
    }


    /* 
        FAVORITOS
    */
    function addFavorite() {

        /* 
            Guardar la fecha en milisegundos de cuando se añadio a favorites, añadir propiedad. 
            getTime() returns the number of milliseconds since January 1, 1970 00:00:00
        */
        result.value.lastRequest = Date.now();

        /* 
            Añadir al Map favorites, la key como result.id y result completo en el valor
        */
        favorites.value.set(result.value.id, result.value);
        updateStorage();
    }

    function removeFavorite() {
        favorites.value.delete(result.value.id);
        updateStorage();
    }

    function showFavorite(favorite) {
        /* que al hacer click en el favorito de la lista de arriba, se muestre abajo la descripción */
        result.value = favorite;
    }

    function checkFavorite(id) {
        //console.log(`por parametro id: ${id} y result.value: ${result.value.login} ....`);
        //console.log(id === result.value.login);

        //result.value.login.forEach(e => e === id);


        //return result.value.name === id;
        //return isFavorite;


        //const find = allFavorites.value.find(elemento => elemento.login.toUpperCase() === login.toUpperCase());

        //return find != 'undefined' ? true : false;
        //console.log(find);
    }


    function updateStorage() {
        /* 
            guardar y establecer todos los favoritos(array/computada) en localStorage, convirtiendo con stringify a json String
        */
        window.localStorage.setItem(
            'favorites',
            JSON.stringify(allFavorites.value)
        );
    }



    return {
        API,
        requestMaxTimeMs,
        search,
        result,
        error,
        favorites,
        created,
        isFavorite,
        allFavorites,
        doSearch,
        doRequest,
        addFavorite,
        removeFavorite,
        showFavorite,
        checkFavorite,
        updateStorage,
        probando,

        //arrayResultLoginFavorites

    }
})
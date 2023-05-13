let pagina = 1;
let peliculas = '';

const btnAnterior = document.getElementById("btnAnterior");
const btnSiguiente = document.getElementById("btnSiguiente");

let observador = new IntersectionObserver((entradas, observador) => {
    entradas.forEach(entrada => {
        if(entrada.isIntersecting){
            pagina++;
            cargarPeliculas();
        }
    });
}, {
    rootMargin: '0px 0px 0px 0px',
    threshold: 1.0
})

btnSiguiente.addEventListener('click', () => {
    if(pagina < 1000){
        pagina += 1;
        cargarPeliculas()    
    }
})

btnAnterior.addEventListener('click', () => {
    if(pagina < 1000){
        pagina -= 1;
        cargarPeliculas()    
    }
})

const cargarPeliculas = async () =>{
    try{
        const respuesta = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=0e291d8a192595762f61916d9bbcb1b8&language=es-MX&page=${pagina}`);
    
        console.log(respuesta);

        if(respuesta.status === 200){
            const datos = await respuesta.json();

            datos.results.forEach(pelicula => {
                peliculas += `
                <div class="pelicula">
                    <img class="poster" src="https://image.tmdb.org/t/p/w500/${pelicula.poster_path}">
                    <h3 class="titulo">${pelicula.title}</h3>
                    <h6>Fecha de lanzamiento: ${pelicula.release_date}</h6>
                    <h6>Idioma: ${pelicula.original_language}</h6>
                    <h6>Votos positivos: ${pelicula.vote_count}</h6>
                </div>
                `;
            });

            document.getElementById('contenedor').innerHTML = peliculas;

            const peliculasEnPantalla = document.querySelectorAll('.contenedor .pelicula');
            let ultimaPelicula = peliculasEnPantalla[peliculasEnPantalla.length - 1];
            observador.observe(ultimaPelicula);            

        } else if (respuesta.status === 401){
            console.log('Id equivocado')
        }else if (respuesta.status === 404){
            console.log("La película que buscas no existe")
        }else{
            console.log("Ocurrió un error");
        }
    } catch(error) {
        console.log(error);
    }
}

cargarPeliculas();
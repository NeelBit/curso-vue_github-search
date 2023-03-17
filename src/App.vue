<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { useCounterStore } from './stores/counter';

import AppProfile from './components/AppProfile.vue';

import { onMounted, ref } from 'vue';

const store = useCounterStore();

/* onMounted(() => {
    console.log("onMounted in appProfile");
    store.probando();
}) */

onMounted(() => {
    store.created();
})

const seleccion = ref(false);
const i = ref(Number);

function seleccionado(index) {
    seleccion.value = !seleccion.value;
    
    i.value = index;
    
    //console.log(i.value);
}

</script>

<!-- Diferencia entre Transition y Transition-group es que transition es para elementos (if-show), mientras q group para un listado, for por ej -->

<template>
    <!-- Favorites -->
    <div class="favorites">
        <transition-group name="list">
            <div class="favorite" @click="seleccionado(index)" :class=" seleccion && i == index ? 'probando-click' : 'favorite--no--selected' , {clickeado: seleccion}, store.checkFavorite(favorite.id) ? 'favorite--selected' : 'favorite--no--selected'" v-for="favorite, index in store.allFavorites" :key="favorite.id">
                <a @click.prevent="store.showFavorite(favorite)" href="#" target="_blank">
                    <img :src="favorite.avatar_url" :alt="favorite.name" class="favorite__avatar">
                    <div class="favorite__login">{{ favorite.login }}</div>
                </a>
            </div>
        </transition-group>
    </div>

    <!-- Content -->
    <article class="content">
        <h1 class="content__title">Search GitHub users</h1>

        <!-- Search -->
        <form class="search" @submit.prevent="store.doSearch" @click="seleccion = false">
            <input v-model="store.search" type="text" class="search__input" autofocus required placeholder="Search GitHub users">
            <input type="submit" class="search__submit" value="Search">
        </form>

        <!-- Result -->
        <Transition>
            <AppProfile v-if="store.result" />
            <!-- <p v-else>Esperando por búsqueda</p> -->
        </Transition>

        <!-- Error -->
        <Transition>
            <div class="result__error" v-if="store.error">{{ store.error }} !!! Intente escribir el nombre de usuario correctamente.</div>
        </Transition>
        
    </article>

    <!-- <RouterView /> -->
</template>

<style scoped>



</style>

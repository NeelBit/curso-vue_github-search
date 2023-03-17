<script setup>

/* store */
import { onMounted } from 'vue';
import { useCounterStore } from '../stores/counter';
const store = useCounterStore();

/* const props = defineProps(['result', 'isFavorite']);

const emits = defineEmits(["addFavorite", 'removeFavorite']);

function addFavorite() {
    emits('addFavorite', 'add-favorite')
}

function removeFavorite() {
    emits('removeFavorite', 'remove-favorite')
} */

/* onMounted(() => {
    console.log("onMounted in appProfile");
    store.probando;
}) */

</script>

<template>

    <div class="result">
        <a v-if="store.isFavorite" href="#" class="result__toggle-favorite remove-favorite" @click.prevent="store.removeFavorite">
            Remove favorite ⭐️
        </a>
        <a v-else href="#" class="result__toggle-favorite add-favorite" @click.prevent="store.addFavorite">
            Add favorite ⭐️
        </a>

        <h2 class="result__name">{{ store.result.name }}</h2>

        <img :src="store.result.avatar_url" :alt="store.result.name" class="result__avatar">

        <div class="result__bio">
            <div v-if="store.result.bio">{{ store.result.bio }}</div>
            <div v-else>No bio disponible</div>

            <a v-if="store.result.bio" :href="store.result.blog" target="_blank" class="result__blog">{{ store.result.blog }}</a>
            <div v-else class="result__blog">No blog disponible</div>
        </div>

        <p class="result__type">
            {{ store.result.type }} {{ store.result.login }}
        </p>

    </div>

</template>
<template>
    <main class="home">
        <section class='hero is-dark'>
            <div class='hero-body'>
                <div class='container'>
                    <h1 class='title'>Alex Gomes</h1>
                    <h2 class=subtitle>Software Developer</h2>
                </div>
            </div>
        </section>
        <carousel/>
    </main>
</template>

<script>
import Carousel from '../components/home/CarouselShowcase'

export default {
    data() {
        return {
            
        }
    },
    components: {
        Carousel
    }
}
</script>

<style scoped>
    .home > .hero > .hero-body {
        padding-top: 0rem;
        padding-bottom: 1rem;
    }
</style>
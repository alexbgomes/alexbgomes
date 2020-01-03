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
        <calendar/>
    </main>
</template>

<script>
import Carousel from './Carousel'
import Calendar from './Calendar'

export default {
    data() {
        return {
            
        }
    },
    components: {
        Carousel,
        Calendar
    }
}
</script>

<style scoped>

</style>
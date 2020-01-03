<template>
    <section class='carousel'>
        <b-carousel
            v-model="carousel"
            :indicator="indicator"
            :indicator-inside="indicatorInside"
            :indicator-mode="indicatorMode"
            :indicator-style="indicatorStyle"
            :arrow="arrow"
            :arrow-both="arrowBoth"
            :arrow-hover="arrowHover"
            :icon-prev="iconPrev"
            :icon-next="iconNext"
            :icon-size="iconSize"
            :animated="animated"
            :autoplay="autoPlay"
            :pause-hover="pauseHover"
            :pause-info="pauseInfo"
            :pause-info-type="pauseInfoType"
            :pause-text="pauseText"
            :interval="interval">
            <b-carousel-item v-for="(carousel, i) in carousels" :key="i">
                <section :class="`hero is-medium is-${carousel.color} is-bold`">
                    <div class="hero-body has-text-centered">
                        <h1 class="title">{{carousel.title}}</h1>
                        <p v-if="carousel.content !== undefined" v-html="carousel.content"></p>
                    </div>
                </section>
            </b-carousel-item>
        </b-carousel>
    </section>
</template>

<script>
export default {
    name: 'Carousel',
    data() {
        return {
            carousel: 0,
            indicator: true,
            indicatorInside: true,
            indicatorMode: 'click',
            indicatorStyle: 'is-lines',
            arrow: true,
            arrowBoth: true,
            arrowHover: false,
            iconPrev: 'caret-left',
            iconNext: 'caret-right',
            iconSize: 'is-medium',
            animated: 'slide',
            autoPlay: true,
            pauseHover: true,
            pauseInfo: true,
            pauseInfoType: 'is-dark',
            pauseText: 'Paused',
            interval: 3000,
            carousels: [{
                    title: 'Looking for Summer 2020 Positions!',
                    content: 'Need a passionate 3rd year Computer Science mind with an insatiable curiousity for knowledge, an aptitude for quality work, and a team player?<br>Contact me!',
                    color: 'dark'
                }, {
                    title: 'Slide 2',
                    color: 'primary'
                }, {
                    title: 'Slide 3',
                    color: 'info'
                }, {
                    title: 'Slide 4',
                    color: 'success'
                }, {
                    title: 'Slide 5',
                    color: 'warning'
                }, {
                    title: 'Slide 6',
                    color: 'danger'
                }]
        }
    }
}
</script>

<style scoped>
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
                        <div v-if="carousel.routerLink !== undefined" class="slide-container">
                            <b-tooltip 
                                :label="carousel.linkTooltip"
                                position="is-bottom">
                                <router-link :to="carousel.routerLink" tag="div" class="slide-link slide-container">
                                    <p v-if="carousel.content !== undefined" v-html="carousel.content"></p>
                                </router-link>
                            </b-tooltip>
                        </div>
                        <div v-else-if="carousel.link !== undefined" class="slide-container">
                        <b-tooltip 
                            :label="carousel.linkTooltip"
                            position="is-bottom">
                            <a :href="carousel.link" class="slide-link">
                                <p v-if="carousel.content !== undefined" v-html="carousel.content"></p>
                            </a>
                        </b-tooltip>
                        </div>
                        <div v-else class="slide-container">
                            <p v-if="carousel.content !== undefined" v-html="carousel.content"></p>
                        </div>
                    </div>
                </section>
            </b-carousel-item>
        </b-carousel>
    </section>
</template>

<script>
import { route_data } from '../../router';

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
                    title: 'Looking for New Grad Positions!',
                    content: 'Passionate 4th year Computer Science student, dedicated team player and leader.<br>Contact Me!',
                    routerLink: route_data[2].path,
                    linkTooltip: 'Find out how',
                    color: 'dark'
                }, {
                    title: 'Test External Link',
                    color: 'primary',
                    content: 'Google',
                    link: 'http://www.google.ca/',
                    linkTooltip: 'Google',
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
    .carousel ::v-deep .slide-container {
        height: 8.5rem;
    }

    .carousel ::v-deep .slide-link {
        cursor: pointer;
        display: inline-block;
        height: fit-content;
    }

    .carousel ::v-deep .hero-body > .title {
        padding-top: 1rem;
    }
</style>
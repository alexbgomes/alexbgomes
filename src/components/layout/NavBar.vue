<template>
    <b-navbar 
        type="is-dark"
        fixed-top>
        <template slot="start">
            <b-navbar-item tag="div">
                <div class="buttons">
                    <b-button tag="router-link"
                        :to="homePage"
                        type="is-link">
                        <p v-if="homeText">Home</p>
                        <b-icon v-else icon="home"></b-icon>
                    </b-button>
                </div>
            </b-navbar-item>
        </template>
        <template slot="end">
            <b-navbar-item tag="div">
                <div class="buttons">
                    <b-button tag="router-link"
                        :to="contactsPage"
                        type="is-link">
                        <p>Contact Me</p>
                    </b-button>
                </div>
            </b-navbar-item>
        </template>
    </b-navbar>
</template>

<script>
import { route_data } from '../../router';

export default {
    name: 'NavBar',
    data () {
        return {
            windowWidth: window.innerWidth,
        }
    },
    mounted() {
        this.$nextTick(function() {
            window.addEventListener('resize', this.getWindowWidth);
        })
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.getWindowWidth);
    },
    methods: {
        getWindowWidth() {
            this.windowWidth = window.innerWidth
        }
    },
    computed: {
        homeText() {
            return this.windowWidth < 1024
        },
        homePage() {
            return route_data[1].path
        },
        contactsPage() {
            return route_data[2].path
        }
    }
}
</script>

<style scoped>

</style>
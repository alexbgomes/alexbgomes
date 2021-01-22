import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../pages/HomePage'
import Contact from '../pages/ContactPage'
import Projects from '../pages/ProjectsPage'

import NotFound from '../pages/NotFoundPage'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        component: Home
    }, {
        path: '/home',
        component: Home
    }, {
        path: '/contact',
        component: Contact
    }, {
        path: '/projects',
        component: Projects
    }, {
        //CPS530 project, redirect Routes for this back to React root
        //Vue Router can't take over React Router especially over dist
        path: '/cps530-website',
    }, {
        path: '*',
        component: NotFound
    }]

export const route_data = routes;

export default new VueRouter({
    base: process.env.BASE_URL,
    mode: 'history',
    routes
})
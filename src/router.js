import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import NotFound from './views/NotFound.vue';

const config = require('../config.json');

Vue.use(Router);

let routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '*',
    name: 'not-found',
    component: NotFound,
  },
  {
    path: '/verbose',
    name: 'verbose-home',
    component: () => import(/* webpackChunkName: "verbose" */ './views/Verbose'),
  },
  {
    path: '/verbose/:id',
    name: 'verbose',
    component: () => import(/* webpackChunkName: "verbose" */ './views/Verbose'),
  },
];

if (!config.selfHosted) {
  const publicRoutes = [
  ];
  routes = [...routes, ...publicRoutes];
}

export default new Router({
  mode: 'history',
  base: config.base,
  routes,
});

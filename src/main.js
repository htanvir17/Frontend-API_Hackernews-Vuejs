/* notice that to import things, the sintaxis is diferent from py*/
import Vue from 'vue' 
import VueRouter from 'vue-router';
import App from './App.vue' //entry point
import { routes } from './routes';
import VueAuthenticate from 'vue-authenticate'
import VueAxios from 'vue-axios'
import axios from 'axios';
import { store } from './store/store'
import tree from './components/Tree.vue'
import node from './components/Node.vue'
// import { authMixin } from './mixins/authMixin';

//register our components
Vue.component('tree', tree);
Vue.component('node', node);

Vue.use(VueRouter); //it means from Vue i am going to use this object VueRouter
Vue.use(VueAxios, axios)
Vue.use(VueAuthenticate, {
    baseUrl: 'https://hackers-asw.herokuapp.com',
    storageType: 'localStorage',
    tokenPath: 'token',
    providers: {
        google: {
        clientId:'987660212455-uuo96gos9oerg9bioldf7pgh21rsjjrq.apps.googleusercontent.com',
        redirectUri: 'http://localhost:8080/',
        url: 'https://hackers-asw.herokuapp.com/api/login/social/token_user/',
        }
    }
});

/* this variable is to take url where the user browses*/
const router = new VueRouter({
    mode: 'history',
    routes,  
});

let token = localStorage.getItem('vue-authenticate.vueauth_token');
let isAuthenticated = (token != null);

/* analyze current route*/
router.beforeEach( async (to, from, next) => {
    console.log("Tiene token?"); console.log(isAuthenticated);
    console.log("viene de :"); console.log(from);
    console.log("vamos a "); console.log(to);
    
    if(from.path == '/' && to.name == 'Home'){
        if(!isAuthenticated && localStorage.getItem("Auth_state") !== "PROCESS"){
            return next({ name: 'Login' });
        }
        return next(); //next() go to App
    }
    if (to.name !== 'Login'){
        console.log(`Nos dirigimos a ${to.name}`)
        if(!isAuthenticated){
            return next({ name: 'Login' });
        }
        return next();
    }
    else return next();
});

/* we create our instance Vue, we specify that this instance will have the following PROPERTIES: router, store, and will render the SPA that we called App, and our app name is "app"*/
new Vue({
  router, //indicated above, is to check current route
  store, //import the file
  render: h => h(App), //will render in this file ./App.vue 
}).$mount("#app") // this instance will be mount in somewhere (DOM element) that has to call o inject "app"; mount point ==> it is like (el: "#app") that will be pluged o connected to an elemento of DOM (in our case App.vue)

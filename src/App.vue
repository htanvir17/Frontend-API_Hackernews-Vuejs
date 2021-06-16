
<template>
    <div>
        <center>
            <table id="hnmain" width="85%" cellspacing="0" cellpadding="0" border="0" bgcolor="#f6f6ef">
                <tbody>
                    <tr v-if="haveToken">
                        <td style ="background-color :#ff6600">
                            <table style="padding:2px" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tbody>
                                    <tr>
                                        <td style="width:18px;padding-right:4px">

                                            <router-link to="/">
                                                    <img src="https://news.ycombinator.com/y18.gif" style="border:1px white solid;" width="18" height="18"/>
                                            </router-link>
                                        </td>
                                        <td style="line-height:12pt; height:10px;">
                                            <span class="pagetop">
                                                
                                                    <span v-if="currentWindow('submit') == false">
                                                        <b class="hnname">
                                                            <!--it can recogonize /news because of "routes" defined in properies called router in Vue instanse-->
                                                        <router-link v-bind:to="'/news'" id='Hackernews'>Hacker News</router-link>
                                                        </b>
                                                        | <router-link v-bind:to="'/newest'">News</router-link>    
                                                        | <router-link v-bind:to="'/ask'" >Ask</router-link>
                                                        | <router-link v-bind:to="'/threads?id='+ user.username" v-if="haveToken">Threads</router-link> | 
                                                    </span>
                                                    <router-link v-bind:to="'/submit'">Submit</router-link>
                                                    <span v-if="currentWindow('submitted')">
                                                        <a> | </a>
                                                        <a style ="color:azure"  href=""> {{id}}'s submissions</a>
                                                    </span>
                                                    <span v-if="currentWindow('upvoted')">
                                                        <a> | </a>
                                                        <a style ="color:azure"  href=""> upvoted</a>
                                                    </span>
                                            </span>
                                        </td>
                                        <td style="text-align:right;padding-right:4px;">
                                            <span class="pagetop">
                                                <router-link id="user" v-bind:to="'/user?id=' + user.username">{{user.username}}({{user.karma}})</router-link> 
                                                    | <button v-on:click=logout() id="logout_button"> Log out</button>
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr id="pagespace" title="New Links" style="height:10px"></tr>
                    <tr>
                        <td>
                            <table class="itemlist" cellspacing="0" cellpadding="0" border="0">
                                <tbody>
                                    <router-view/>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr v-if="haveToken">
                        <td><img src="" height="10" width="0"><table width="100%" cellspacing="0" cellpadding="1"><tbody><tr><td bgcolor="#ff6600"></td></tr></tbody></table><br><center><a href="https://www.ycombinator.com/apply/">
                        Applications are open for YC Summer 2020
                        </a></center><br><center><span class="yclinks"><a href="newsguidelines.html">Guidelines</a>
                        | <a href="newsfaq.html">FAQ</a>
                        | <a href="mailto:hn@ycombinator.com">Support</a>
                        | <a href="https://github.com/HackerNews/API">API</a>
                        | <a href="security.html">Security</a>
                        | <a href="lists">Lists</a>
                        | <a href="bookmarklet.html" rel="nofollow">Bookmarklet</a>
                        | <a href="http://www.ycombinator.com/legal/">Legal</a>
                        | <a href="http://www.ycombinator.com/apply/">Apply to YC</a>
                        | <a href="mailto:hn@ycombinator.com">Contact</a></span><br><br><form method="get" action="//hn.algolia.com/">Search:
                        <input type="text" name="q" value="" size="17" autocorrect="off" spellcheck="false" autocapitalize="off" autocomplete="false"></form>
                        </center></td>
                    </tr>
                </tbody>
            </table>
        </center>
    </div>
</template>


<script>
    let token = localStorage.getItem('vue-authenticate.vueauth_token');
    
    /* we have the instance of Vue and remember that we also have the properties */
    export default {
        name: 'app', //this name is not relevant
        data(){
            return{
                user:{
                    username: localStorage.getItem('username'),
                    karma: 1,
                },
            }
        },
        computed: {
            haveToken() { return token != null;}
        },
        methods:{
            logout(){
                console.log("Borro datos del usuario");
                localStorage.removeItem('vue-authenticate.vueauth_token');
                localStorage.removeItem('username');
                localStorage.removeItem('id');
                window.location.href = '/login';
            },
            currentWindow(path) {
                let currentPath = window.location.pathname
                let current = currentPath.split('/')[1]
                current = current.split('?')[0]
                this.id = new URLSearchParams(window.location.search).get('id')
                if (path == current)
                    return true
                else return false
            },
        },
        mounted(){
            
        }
    }
</script>

<style>
    header a.router-link-exact-active {
        color: #fff;
        font-weight: 400;
    }
    header a:hover {
        color: #fff;
    }
    #logout_button {
        background-color: Transparent;
        background-repeat:no-repeat;
        border: none;
        cursor:pointer;
        overflow: hidden;
        outline:none;
    }
    @import './assets/CSS/style.css';
</style>


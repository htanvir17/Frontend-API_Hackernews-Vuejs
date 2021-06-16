<template>
    <span>
        <div v-for="index in contribution_list.length" :key="index">
            <tr class="athing">
                <td align="right" valign="top" class="title"><span class="rank"> {{index}}.</span></td>
                <td valign="top" class="votelinks">
                    <center>
                        <span v-if="contribution_list[index-1].author == user.username" style="text-align=center">
                            <font color="#ff6600" >*</font>
                            <img height="1" width="14">
                        </span>
                        <button v-else-if="!contribution_list[index-1].uservotes.includes(user.username)" class="votearrow" v-bind:id="'vote' + contribution_list[index-1].id_contribution" v-on:click="votecontrib(contribution_list[index-1].id_contribution, index, user)" ></button>
                        <button v-else class="votearrowhidden" v-bind:id="'vote' + contribution_list[index-1].id_contribution"  v-on:click="votecontrib(contribution_list[index-1].id_contribution, index, user)"></button>
                    </center>
                </td>
                <td class="title">
                <a :href="'/item?id='+ contribution_list[index-1].id_contribution" class="storylink" rel="nofollow">ASK HN: {{contribution_list[index-1].title}}</a>
                </td>
            </tr>

            <tr>
                <td colspan="2"></td>
                <td class="subtext">
                    <span class="score">{{contribution_list[index-1].points}} </span>
                    <span v-if="contribution_list[index-1].points == 1"> point </span> 
                    <span v-else> points </span>    
                    by 
                    <a :href="'/user?id=' + contribution_list[index-1].author"> {{contribution_list[index-1].author}} </a>
                    <span class="age">
                        <a :href="'/item?id='+ contribution_list[index-1].id_contribution"> {{whenpublished(contribution_list[index-1].creation_date)}} </a> |
                    </span>  
                    <span v-if="contribution_list[index-1].author == user.username"> 
                        <a :href="'/edit?id='+ contribution_list[index-1].id_contribution">edit</a> |
                        <a :href="'/delete-confirm?id='+ contribution_list[index-1].id_contribution">delete</a>
                    </span>
                    <span v-else> 
                            <button v-if="contribution_list[index-1].uservotes.includes(user.username)" class="unvote" v-bind:id="'unvote' + contribution_list[index-1].id_contribution" v-on:click="unvotecontrib(contribution_list[index-1].id_contribution, index, user)">unvote |</button>
                            <button v-else class="unvotehidden" v-bind:id="'unvote' + contribution_list[index-1].id_contribution" v-on:click="unvotecontrib(contribution_list[index-1].id_contribution, index, user)">unvote |</button>
                        <a :href="'/item?id='+ contribution_list[index-1].id_contribution">
                            <span v-if="contribution_list[index-1].comments==0">
                                discuss
                            </span>   
                            <span v-else-if="contribution_list[index-1].comments==1">
                                1 comment
                            </span>
                            <span v-else>
                                {{contribution_list[index-1].comments }} comments
                            </span>
                        </a>   
                    </span>
                </td>
            </tr>
            <tr class="spacer" style="height:10px"></tr>                
        </div>
    </span>
</template>


<script>
    //import VueJwtDecode from 'vue-jwt-decode';
    import apitools from "../mixins/apitools.js";
    import axios from "axios";
    export default {
        name: 'Ask',
        computed:{ 
        },
        data(){
            return{
                user:{
                    username: localStorage.getItem('username'),
                    karma: 1
                },
                contribution_list: []
            }
        },
        methods:{
            whenpublished(creation_date){
                let y = '"'+ creation_date +'"';
                let dateStr = JSON.parse(y);
                let date = new Date(dateStr);
                var moment = require('moment')
                return moment(date).fromNow();
            },
            getContributionsAsk (){
                let config = {
                    headers: {
                        Authorization:  apitools.getApikey(),
                    }
                }
                axios.get(
                    "https://hackers-asw.herokuapp.com/api/asks",config
                ).then(response => {
                    this.contribution_list = response.data;
                }).catch((error) => {
                        console.log(error);
                });
            },
            votecontrib(idcontrib, ind,user) {
                axios({
                    method: 'post',
                    url: 'https://hackers-asw.herokuapp.com/api/contributions/' + idcontrib + '/votes',
                    headers: {
                        Authorization: apitools.getApikey(),
                    }
                }).then(response => {
                    console.log("We are voting to contrib" +idcontrib)
                    console.log(response.data);
                    console.log("Beforeeee" +idcontrib)
                    console.log(this.contribution_list[ind-1].uservotes)
                    console.log("After" +idcontrib)
                    console.log(this.contribution_list[ind-1].uservotes.push(user.username))
                    console.log(this.contribution_list[ind-1].uservotes)
                    ++this.contribution_list[ind-1].points
                }).catch((error) => {
                    console.log(error);
                })
            },
            unvotecontrib(idcontrib, ind,user) {
                axios({
                    method: 'delete',
                    url: 'https://hackers-asw.herokuapp.com/api/contributions/' + idcontrib + '/votes',
                    headers: {
                        Authorization: apitools.getApikey(),
                    }
                }).then(response => {
                    console.log("We are UNvoting to contrib" +idcontrib)
                    console.log(response.data);
                    console.log(this.contribution_list[ind-1].uservotes)
                    var index = this.contribution_list[ind-1].uservotes.indexOf(user.username)
                    console.log("index is" +index)
                    console.log("Beforeeee" +idcontrib)
                    console.log(this.contribution_list[ind-1].uservotes)
                    if (index > -1) {
                        this.contribution_list[ind-1].uservotes.splice(index, 1)
                    }
                    --this.contribution_list[ind-1].points
                    console.log("After" +idcontrib)
                    console.log(this.contribution_list[ind-1].uservotes)
                }).catch((error) => {
                    console.log(error);
                })
            }
        },
        mounted(){
            this.getContributionsAsk();
        }
    }
</script>


<style>
    @import '../assets/CSS/style.css';
</style>
<template>
    <span>
        <span v-if="user.username == getUrlparams()">
            <div v-for="index in contribution_list.length" :key="index">
                <tr class="athing">
                <td align="right" valign="top" class="title"><span class="rank"> {{index}}.</span></td>
                <td valign="top" class="votelinks">
                    <center>
                        <button v-if="!contribution_list[index-1].uservotes.includes(user.username)" class="votearrow" v-bind:id="'vote' + contribution_list[index-1].id_contribution" v-on:click="votecontrib(contribution_list[index-1].id_contribution, index, user)" ></button>
                        <button v-else class="votearrowhidden" v-bind:id="'vote' + contribution_list[index-1].id_contribution"  v-on:click="votecontrib(contribution_list[index-1].id_contribution, index, user)"></button>
                    </center>
                </td>

                <td class="default">
                    <div style="margin-top:2px; margin-bottom:-10px;">
                        <span class="comhead">
                            <a :href="'/user?id=' + contribution_list[index-1].author" class="hnuser"> {{contribution_list[index-1].author}} </a>
                            <span class="age">
                                <a :href="'/item?id='+ contribution_list[index-1].id_contribution"> {{whenpublished(contribution_list[index-1].creation_date)}} </a> |
                            </span>
                            <button v-if="contribution_list[index-1].uservotes.includes(user.username)" class="unvote" v-bind:id="'unvote' + contribution_list[index-1].id_contribution" v-on:click="unvotecontrib(contribution_list[index-1].id_contribution, index, user)">unvote </button>
                            <button v-else class="unvotehidden" v-bind:id="'unvote' + contribution_list[index-1].id_contribution" v-on:click="unvotecontrib(contribution_list[index-1].id_contribution, index, user)">unvote </button>
                            <span class="par"> |
                                <a v-if="!contribution_list[index-1].parent" :href="'item?id='+contribution_list[index-1].contribution_ref">parent</a>
                                <a  v-else :href="'item?id='+ contribution_list[index-1].parent">parent</a>
                                <span class='storyon'> | on:
                                    <a :href="'/item?id='+ contribution_list[index-1].contribution_ref"  >{{contribution_list[index-1].contribution_ref_title}}</a>
                                </span>
                            </span>
                        </span>
                    </div>
                    <br>
                    <div class="comment">
                        <span class="commtext c00">{{ contribution_list[index-1].text }}</span>
                        <div class='reply'></div>
                    </div>
                </td>
                </tr>
            </div>
        </span>
        <span v-else ><p>You can't see this</p></span>
    </span>
</template>


<script>
    import axios from "axios";
    import apitools from "../mixins/apitools.js";
    export default {
        name: 'Upvotedcomments',
        data(){
            return{
                user:{
                    username: localStorage.getItem('username'),
                    karma: 1
                },
                contribution_list: []
            };
        },
        methods:{
            whenpublished(creation_date){
                let y = '"'+ creation_date +'"';
                let dateStr = JSON.parse(y);
                let date = new Date(dateStr);
                var moment = require('moment')
                return moment(date).fromNow();
            },
            getContributionsAskUrl (username){
                let config = {
                    headers: {
                        Authorization: apitools.getApikey(),
                    }
                }
                axios.get(
                    `https://hackers-asw.herokuapp.com/api/upvotedComments/${username}`,config
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
            },
            getUrlparams() {
                let url = new URL(window.location.href);
                console.log(url.searchParams.get("id"))
                return url.searchParams.get("id");
            },
        },
        mounted () {
            this.getContributionsAskUrl(this.getUrlparams());
            //this.votecontrib();
            //this.unvotecontrib();
        }
    };

</script>


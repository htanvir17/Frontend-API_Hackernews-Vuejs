<template>
  <div>
        <tr class="athing" >
            <td align="right" valign="top" class="title"><span class="rank"></span></td>
            <td valign="top" class="votelinks">
                <center>
                    <font color="#ff6600">*</font>
                    <br>
                    <img height="1" width="14">
                </center>
            </td>
            <td class="title">
                <!--URL-->
                <span v-if="url">
                    <a :href="contribution.url" class="storylink" rel="nofollow">{{contribution.title}}</a>
                    <span class="sitebit comhead">
                        (<a :href="contribution.url">
                            <span class="sitestr">{{getbasepath(contribution.url)}}</span>
                        </a>)
                    </span>
                </span>
                <!--ASK-->
                <span v-else>
                    <a :href="'/item?id=' + contribution.id_contribution" class="storylink" rel="nofollow">{{contribution.title}}</a>
                </span>
            </td>
        </tr>
        <tr>
            <td colspan="2"></td>
            <td class="subtext">
                <span class="score">{{contribution.getpoints}} </span>
                <span v-if="contribution.points == 1"> point </span> 
                <span v-else> points </span>  
                    by 
                <a :href="'/user?id=' + contribution.author"> {{user.username}} </a>
                <span class="age">
                    <a :href="'/item?id='+ contribution.id_contribution"> {{whenpublished(contribution.creation_date)}} </a> |
                </span>  
                    <a :href="'/edit?id='+ contribution.id_contribution">edit</a> |
                    <a :href="'/delete-confirm?id='+ contribution.id_contribution">delete</a>
            </td>
        </tr>
        <tr style="height:20px"></tr>
        <tr>
            <td colspan="2"></td>
            <td>
                Do you want this to be deleted?
                <br><br>
                <button v-on:click="todelete(true)" style="margin-right:3px"> Yes </button>

                <button v-on:click="todelete(false)"> No </button>
            </td>
        </tr>
   </div>
</template>


<script>
    import axios from "axios";
    import apitools from "../mixins/apitools.js";
    export default {
        name: "Delete",
        computed: {},
        data() {
            return {
                user:{
                    username: localStorage.getItem('username'),
                    karma: 1
                },
                contribution: [],
                url: Boolean,
                previus: '/',
            };
        },
        methods: {
            getbasepath(url){
                return url.split('//')[1].split('/')[0]
            },
            todelete(decision){
                //if user wants to delete
                if(decision){
                    let contrib = ''
                    if(this.url)
                        contrib = 'urls'
                    else
                        contrib = 'asks'
                    let id = this.getUrlparams()
                    let config = {
                        headers: {
                            Authorization: apitools.getApikey()
                        }
                    };
                    axios
                    .delete(`https://hackers-asw.herokuapp.com/api/${contrib}/${id}`, config)
                    .then(response => {
                        console.log(response.data);
                        window.location.href = '/'
                        this.$router.push(new URL(window.location.href)) //router that we add in vue instance, and we said the to come back /
                        return
                    })
                    .catch(error => {
                        console.log(error.status);
                    });
                }else{
                    window.location.href = '/'
                    this.$router.push(new URL(window.location.href))
                    return;
                }
            },
            getContributionInfo(id) {
                let config = {
                    headers: {
                        Authorization: apitools.getApikey()
                    }
                };
                axios
                    .get(`https://hackers-asw.herokuapp.com/api/urls/${id}`, config)
                    .then(response => {
                        this.contribution = response.data;
                    })
                    .catch(error => {
                        console.log(error.status);

                        axios
                            .get(`https://hackers-asw.herokuapp.com/api/asks/${id}`, config)
                            .then(response => {
                                this.url = false;
                                console.log(response.data);
                                this.contribution = response.data;
                            })
                            .catch(error => {
                                console.log(error);
                            });

                    console.log(error);
                    });
            },
            getUrlparams() {
                let url = new URL(window.location.href);
                return url.searchParams.get("id");
            },
            whenpublished(creation_date) {
                let y = '"' + creation_date + '"';
                let dateStr = JSON.parse(y);
                let date = new Date(dateStr);
                var moment = require("moment");
                return moment(date).fromNow();
            }
        },
        mounted() {
            this.getContributionInfo(this.getUrlparams());
            this.url = true;
        }
    };
</script>


<style>
     @import '../assets/CSS/style.css';
</style>
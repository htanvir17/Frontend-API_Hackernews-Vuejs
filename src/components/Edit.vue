<template>
    <tr>
        <td>
        <table class="fatitem" border="0">
            <tbody>
                <tr class="athing" id="22831107">
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
                                    <span class="sitestr">{{contribution.url}}</span>
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
                        <span class="score">{{contribution.points}}
                        <span v-if="contribution.points == 1"> point </span> 
                        <span v-else> points </span>    
                        by 
                        <a :href="'/user?id=' + contribution.author"> {{user.username}} </a>
                        <span class="age">
                            <a :href="'/item?id='+ contribution.id_contribution"> {{whenpublished(contribution.creation_date)}} </a> |
                        </span>  
                            <a :href="'/edit?id='+ contribution.id_contribution">edit</a> |
                            <a :href="'/delete-confirm?id='+ contribution.id_contribution">delete</a>
                        </span>
                    </td>
                </tr>
                <tr style="height:2px"></tr>
                <tr>
                    <td colspan="2"></td>
                    <!-- ASK -->
                    <span v-if="!url">
                        <td>{{contribution.text}}</td>
                    </span>
                </tr>
            </tbody>
        </table>
        <br>
        
        <!--we set an event to update boton, then will call the function toUpadte to check RT and to send post request API-->
        <form @submit.prevent="toUpdate">
            <strong style="bl"> {{errorMessage}} <p></p> </strong>
            <table style="margin-left: 15px">
                <tr>
                    <td>title: <input type="text" v-model="form.title" size="50" oninput="tlen(this)" onfocus="tlen(this)"></td>
                </tr>

                <!--URL-->
                <span v-if="url">
                    <tr>
                        <td>url:</td>
                        <td> {{contribution.url}} </td>
                    </tr>
                </span>
                    <!--ASK-->
                <span v-if="!url">
                    <tr>
                        <td>text: </td>
                        <td><input type="textarea" v-model="form.texto" size="50"></td>
                    </tr>
                </span>
                <tr>
                    <td></td>
                </tr>
                <tr>
                    <td><button type="submit">update </button></td>
                </tr>    
            </table>
        </form>
        </td>
    </tr>
</template>


<script>
    import axios from "axios";
    import apitools from "../mixins/apitools.js";
    export default {
        name: "Edit",
        computed: {},
        data() {
            return {
                id_contri: '',
                current_path: '',
                first: Boolean,
                user:{
                    username: localStorage.getItem('username'),
                    karma: 1
                },
                contribution: [],
                url: Boolean, 
                form: {
                        title: '',
                        url: '',
                        texto: ''
                    },
                errorMessage: ''
            };
        },
        methods: {
            toUpdate: async function(){
                if (this.form.title == '') {
                    this.errorMessage = "Title can't be empty. Please try again."
                    return
                }
                //URL: only can change the title
                if(this.url){
                    if (this.form.title.length <= 80) {
                        await axios
                        .put("https://hackers-asw.herokuapp.com/api/urls/" + this.id_contri, 
                            {
                            title: this.form.title,
                            },
                            {
                            headers: {
                                Authorization: apitools.getApikey(),
                            }
                            }
                        ).then(response => {
                            if (response.status == 400) {
                                this.errorMessage = response.data
                            }
                            else {
                                window.location.href = this.current_path;
                                //this.$router.push(new URL(window.location.href))
                                return;
                            }
                        });
                    }
                    else{
                        this.errorMessage = "Title can not be longer than 80 characters. Please try again."
                    return
                    }
                }
                //ASK: can change the title and text
                else {
                    await axios
                    .put("https://hackers-asw.herokuapp.com/api/asks/" + this.id_contri,
                        {
                        title: this.form.title,
                        text: this.form.texto,
                        },
                        {
                        headers: {
                            Authorization: apitools.getApikey(),
                        }
                        }
                    ).then(response => {
                        if (response.status == 400) {
                            this.errorMessage = response.data
                        }
                        else {
                            window.location.href = this.current_path;
                            return;
                        }
                    });
                }
            },
            onReset() {
                this.form.title = ''
                this.form.url = ''
                this.form.texto = ''
            },
            //we have the id but don't know if is an ask or url; we have get the correct instance
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
                        //if we couldn't get url object, so it will be an ask object
                        console.log(error.status);
                        axios
                            .get(`https://hackers-asw.herokuapp.com/api/asks/${id}`, config)
                            .then(response => {
                                this.url = false;
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
                if (this.first){
                    this.current_path = new URL(window.location.href);
                    this.first = false;
                }
                this.id_contri = url.searchParams.get("id");
                return this.id_contri;
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
            this.onReset();
            this.url = true;
            this.first = true;
        }
    };
</script>


<style>
     @import '../assets/CSS/style.css';
</style>
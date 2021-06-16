<template>
  <table border="0" class="comment-tree">
    <tbody>
      <tr v-for="fulla in node" :key=fulla class="athing comtr">
        <td>
          <table border="0">
            <tbody>
              <tr>
                <td class="ind">
                  <img src="https://news.ycombinator.com/s.gif" height="1" :width="20" />
                </td>
                <td valign="top" class="votelinks">
                  <center>
                      <span v-if="comment.author == user.username" style="text-align=center">
                        <font color="#ff6600" >*</font>
                        <img height="1" width="14">
                      </span>
                      <button v-else-if="!comment.uservotes.includes(user.username)" class="votearrow" v-bind:id="'vote' + comment.id_contribution" v-on:click="votecontrib(comment.id_contribution, index, user)" ></button>
                      <button v-else class="votearrowhidden" v-bind:id="'vote' + comment.id_contribution"  v-on:click="votecontrib(comment.id_contribution, index, user)"></button>
                  </center>
                </td>
                <td class="default">
                  <div style="margin-top:2px; margin-bottom:-10px;">
                    <span class="comhead">
                      <a href class="hnuser">{{comment.author}}</a>
                      <span class="age">
                        <a href>  {{whenpublished(comment.creation_date)}}</a>
                      </span> |
                      <a href>edit</a> |
                      <a href>delete</a>
                      <button class="unvotehidden">unvote</button>
                    </span>
                  </div>
                  <br />
                  <div class="comment">
                    <span class="commtext c00">
                      {{comment.text}}
                      <div class="reply">
                        <p>
                          <font size="1">
                            <u>
                              <a  v-if="comment.author != user.username" href>reply</a>
                            </u>
                          </font>
                        </p>
                      </div>
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</template>


<script>
    import apitools from "../mixins/apitools.js";
    import axios from "axios";
    export default {
        name: "node",
        props: {
            node: Object 
        },
        methods:{
            whenpublished(creation_date) {
            let y = '"' + creation_date + '"';
            let dateStr = JSON.parse(y);
            let date = new Date(dateStr);
            var moment = require("moment");
            return moment(date).fromNow();
            },
            calculaEspai(){
                return this.espai * 20;
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
        mounted() {
            console.log(this.node)
        }
    };
</script>
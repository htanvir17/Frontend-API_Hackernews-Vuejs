<template>
  <!--this page is not well implamented-->
  <tr>
    <td>
      <table class="itemlist" cellspacing="0" cellpadding="0" border="0">
        <tbody>
          <tr>
            <td>
              <table class="fatitem" border="0">
                <tbody>
                  <tr class="athing" id="2">
                    <td align="right" valign="top" class="title">
                      <span class="rank"></span>
                    </td>
                    <td valign="top" class="votelinks">
                      <center>
                        <button
                          class="votearrow"
                          id="vote2"
                          likehref="/votepost/2"
                          userlike="7"
                          contid="2"
                        ></button>
                      </center>
                    </td>
                    <td class="title">
                      <!-- URL or ASK  -->
                      <a
                        v-if="url"
                        :href="contribution.url"
                        class="storylink"
                        rel="nofollow"
                      >{{contribution.title}}</a>
                      <a v-else :href="contribution.url" class="storylink" rel="nofollow">ASK HN:</a>

                      <span v-if="url" class="sitebit comhead">
                        (<a :href="contribution.url">
                          <span class="sitestr">{{getbasepath(contribution.url)}}</span>
                        </a>)
                      </span>
                      <span v-else class="sitebit comhead">
                        <a href>
                          <span class="sitestr">{{contribution.title}}</span>
                        </a>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2"></td>
                    <td class="subtext">
                      <span class="score" id="score2" points="0">{{getPoints(contribution.points)}}</span> by
                      <a
                        :href="'/user?id='+ contribution.author"
                        class="hnuser"
                      >{{contribution.author}}</a>

                      <span class="age">
                        <a
                          :href="'/item?id=' + contribution.id_contribution"
                        >{{whenpublished(contribution.creation_date)}}</a> |
                      </span>

                      <button
                        class="unvotehidden"
                        id="unvotehidden2"
                        likehref="/votepost/2"
                        userlike="7"
                        contid="2"
                      >| unvote |</button>

                      <a href>{{getComments(contribution.comments)}}</a>
                    </td>
                  </tr>
                  <tr v-if="url == false">
                    <td colspan="2"></td>
                    <td>{{contribution.text}}</td>
                  </tr>
                  <tr style="height:2px"></tr>
                  <tr>
                    <td colspan="2"></td>
                    <td></td>
                  </tr>
                  <tr style="height:10px"></tr>

                  <tr>
                    <td colspan="2"></td>
                    
                    <td>
                      <form action>
                        <textarea id="id_comment_text" rows="6" cols="60"></textarea>
                        <input type="hidden" name="id" :value="contribution.id_contribution" />
                        <br>
                        <br>
                        <input type="submit" value="add comment" v-on:click="postComment()" />
                      </form>
                    </td>

                  </tr>
  
                </tbody>
              </table>
              <br />
              <br />
              <table border="0" class="comment-tree">
                <tbody>
                  <tree
                    v-if="contribution.comments && contribution.comments.length"
                    :node="contribution.comments"
                  ></tree>
                </tbody>
              </table>

              <br />
              <br />
            </td>
          </tr>
        </tbody>
      </table>
    </td>
  </tr>
</template>


<script>
    import axios from "axios";
    import apitools from "../mixins/apitools.js";
    export default {
      name: "Item",
      computed: {},
      data() {
        return {
          contribution: [],
          user_info: [],
          all_comments: [],
          url: Boolean
        };
      },
      methods: {
        getbasepath(url){
                return url.split('//')[1].split('/')[0]
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
        getPoints(npoints) {
          if (npoints > 1) return `${npoints} points`;
          return `${npoints} point`;
        },
        whenpublished(creation_date) {
          let y = '"' + creation_date + '"';
          let dateStr = JSON.parse(y);
          let date = new Date(dateStr);
          var moment = require("moment");
          return moment(date).fromNow();
        },
        getComments(ncomments) {
          console.log(ncomments.length);
          let n = this.countComments(ncomments);
          if (n > 1) return `${n} comments`;
          else if (n == 1) return `${n} comment`;
          return `discuss`;
        },
        countComments(ncomments) {
          console.log(ncomments);
          let n = ncomments.length;
          ncomments.forEach(element => {
            console.log(element.text);
            n += this.countComments(element.replies);
          });
          return n;
        },
        postComment() {
          let comment = document.getElementById("id_comment_text").value;
          if (comment == "") return;
          let config = {
            headers: {
              Authorization: apitools.getApikey()
            }
          };
          axios
            .post(
              `https://hackers-asw.herokuapp.com/api/asks/${this.contribution.id_contribution}/comments`,
              { text: `${comment}` },
              config
            )
            .then(response => {
              console.log(response.data);
            })
            .catch(error => {
              console.log(error);
              axios
                .post(
                  `https://hackers-asw.herokuapp.com/api/urls/${this.contribution.id_contribution}/comments`,
                  { text: `${comment}` },
                  config
                )
                .then(response => {
                  console.log(response.data);
                });
            });
        }
      },
      mounted() {
        this.getContributionInfo(this.getUrlparams());
        this.url = true;
      }
    };
</script>


<style>
  @import "../assets/CSS/style.css";
</style>
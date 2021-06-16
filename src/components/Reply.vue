<template>
<!--this is the page when we go in /item and we have several comments and we want to reply to one of those; so we show this template (this page is not well implemented)-->
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
                    <td class="default">
                        <div style="margin-top:2px; margin-bottom:-10px;"><span class="comhead">
                            <a :href="'/user?id='+ contribution.author" class="hnuser">{{contribution.author}}</a>
                            <span> </span>
                             <span class="age">  <a href=""> {{whenpublished(contribution.creation_date)}}</a></span> 
                             <span id="unv_23346381"></span> <span class="storyon"> | on: <a :href="'/item?id='+ contribution.contribution_ref">{{contribution.contribution_ref_title}}</a></span>
                            </span>
                        </div>
                        <br>
                        <div class="comment">
                            <span class="commtext c00">
                                {{contribution.text}}
                                <div class="reply"></div>
                            </span>
                        </div>
                    </td>
                  </tr>
                  <tr style="height:10px"></tr>
                  <tr>
                    <td colspan="2"></td>
                    <td>
                      <form method="post" action="reply">
                        <input
                          type="hidden"
                          name="csrfmiddlewaretoken"
                          value="374NnjnRZ3P9C483FY21DQXnGuWUqWh5behRXiYk6wCxT4sqVAp9a8DFqyJadwNO"
                        />
                        <input type="hidden" name="parent" value="1" />
                        <input type="hidden" name="parentcomment" value="6" />
                        <input type="hidden" name="goto" value="item?id=1" />
                        <textarea name="text" rows="6" cols="60"></textarea>
                        <input type="hidden" name="author_id" value="3" />
                        <br />
                        <br />
                        <button type="submit">reply</button>
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
      name: "Reply",
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
        getContributionInfo(params) {
          let id = params['id']
          let idc = params['idc']
          let config = {
            headers: {
              Authorization: apitools.getApikey()
            }
          };
          axios
            .get(`https://hackers-asw.herokuapp.com/api/urls/${id}/comments/${idc}`, config)
            .then(response => {
              this.contribution = response.data;
            })
            .catch(error => {
              console.log(error.status);

              axios
                .get(`https://hackers-asw.herokuapp.com/api/asks/${id}/comments/${idc}`, config)
                .then(response => {
                  console.log("estic ASKSSS");
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
          console.log(url.searchParams.get("id"));
          let p = []
          p['id'] = url.searchParams.get("id")
          p['idc'] = url.searchParams.get("idc")
          return p;
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
        getComments(ncomments) { //don't need
          console.log(ncomments.length);
          let n = this.countComments(ncomments);
          if (n > 1) return `${n} comments`;
          else if (n == 1) return `${n} comment`;
          return `discuss`;
        },
        //recursion function
        countComments(ncomments) {
          let n = ncomments.length;
          ncomments.forEach(element => {
            console.log(element.text);
            n += this.countComments(element.replies);
          });
          return n;
        },
        postComment() { //don't use
          let comment = document.getElementById("id_comment_text").value;
          if (comment == "") return;
          let config = {
            headers: {
              Authorization: apitools.getApikey()
            }
          };
          axios
            .post(
              `https://hackers-asw.herokuapp.com/api/asks/${this.contribution.id_contribution}/comments/${this.contribution.contribution_ref}`,
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
                  `https://hackers-asw.herokuapp.com/api/urls/${this.contribution.id_contribution}/comments/${this.contribution.contribution_ref}`,
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
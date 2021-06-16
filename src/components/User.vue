<template>
  <tr v-if="getUrlparams()==user.username">
    <td>
      {{ searched ? '' : getProfileInfo(user.username) }}
      {{ searched ? '': searched=true}}
      <table class="itemlist" cellspacing="0" cellpadding="0" border="0">
        <tbody>
          <tr>
            <td>
              <form action="">
                <table border="0" cellpadding="0" cellspacing="0">
                  <tbody>
                    <tr>
                      <td bgcolor="#ffffaa">
                        <table cellpadding="5" width="100%">
                          <tbody>
                            <tr>
                              <td>
                                Please put a valid address in the email field, or we won't be able to
                                send you a new password if you forget yours. Your address is only
                                visible to you and us. Crawlers and other users can't see it.
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table border="0">
                  <tbody>
                    <tr class="athing">
                      <td valign="top">user:</td>
                      <td timestamp="1585266333">
                        <a href class="hnuser">{{user.username}}</a>
                      </td>
                    </tr>
                    <tr>
                      <td valign="top">created:</td>
                      <td>
                        <a href>{{whenpublished(user_info.created)}}</a>
                      </td>
                    </tr>
                    <tr>
                      <td valign="top">karma:</td>
                      <td>{{user_info.karma}}</td>
                    </tr>

                    <tr>
                      <td>
                        <label for="id_about">About:</label>
                      </td>
                      <td>
                        <textarea
                          cols="40"
                          rows="10"
                          maxlength="500"
                          id="id_about_"
                          v-model="user_info.about"
                        />
                        <input type="hidden" name="username" :value="user.username" />
                      </td>
                    </tr>

                    <tr>
                      <td valign="top">API Key:</td>
                      <td>{{user.token}}</td>
                    </tr>

                    <tr>
                      <td></td>
                      <td>
                        <a :href="'submitted?id=' + user.username">
                          <u>submissions</u>
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        <a :href="'threads?id=' + user.username ">
                          <u>comments</u>
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        <a :href="'/upvotedsubmissions?id=' + user.username">
                          <u>upvoted submissions</u>
                        </a> /
                        <a :href="'/upvotedcomments?id=' + user.username">
                          <u>comments</u>
                        </a>
                        &nbsp;
                        <span style="font-style:italic">(private)</span>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                    </tr>
                    <tr>
                      <td>
                        <br />
                        <input type="submit" value="update" v-on:click="updateAbout()" />
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <br>
                        <br>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </form>
            </td>
          </tr>
        </tbody>
      </table>
    </td>
  </tr>
  <!--this will never happen because if the user not autenticated, we will send in /login (this issue is checked in main.js)-->
  <tr v-else>
    <td>{{getProfileInfo(getUrlparams())}}
      <table class="itemlist" cellspacing="0" cellpadding="0" border="0">
        <tbody>
          <tr>
            <td>
              <table border="0">
                <tbody>
                  <tr class="athing">
                    <td valign="top">user:</td>
                    <td timestamp="1576632256">
                      <a href class="hnuser">{{user_info.username}}</a>
                    </td>
                  </tr>
                  <tr>
                    <td valign="top">created:</td>
                    <td>
                      <a href>{{whenpublished(user_info.created)}}</a>
                    </td>
                  </tr>
                  <tr>
                    <td valign="top">karma:</td>
                    <td>{{user_info.karma}}</td>
                  </tr>
                  <tr>
                    <td valign="top">about:</td>
                    <td>{{user_info.about}}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>
                      <a href="submitted?id=kennyangelsystem">
                        <u>submissions</u>
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>
                      <a href="threads?id=kennyangelsystem">
                        <u>comments</u>
                      </a>
                    </td>
                  </tr>

                  <tr>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
              <br>
              <br>
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
      name: "Profile",
      computed: {},
      data() {
        return {
          user: {
            username: localStorage.getItem("username"),
            token: apitools.getApikey(),
            karma: 1
          },
          user_info: [],
          searched : Boolean,
        };
      },

      methods: {
        getProfileInfo(user) {
          let config = {
            headers: {
              Authorization: apitools.getApikey()
            }
          };
          axios
            .get(
              `https://hackers-asw.herokuapp.com/api/profile/${user}`,
              config
            )
            .then(response => {
              this.user_info = response.data;
              console.log(this.user.token)
            })
            .catch(error => {
                console.log(this.user)
                console.log(error);
            });
        },
        updateAbout() {
          let about = document.getElementById("id_about_").value;
          let config = {
            headers: {
              Authorization: apitools.getApikey()
            }
          };
          axios
            .put(
              `https://hackers-asw.herokuapp.com/api/profile/${this.user.username}`,
              { about: `${about}` },
              config
            )
            .then(response => {
              this.user_info = response.data;
              
            })
            .catch(error => {
              console.log(error);
            });
        },
        whenpublished(creation_date) {
          let y = '"' + creation_date + '"';
          let dateStr = JSON.parse(y);
          let date = new Date(dateStr);
          var moment = require("moment");
          return moment(date).fromNow();
        },
        getUrlparams() {
          let url = new URL(window.location.href); //get the current path
          if(url.searchParams.get("username") == null){  //analyze the path to get username
            return url.searchParams.get("id")
          }
          return url.searchParams.get("username");
        },
        getOtherProfile(){}
      },

      mounted() {
        this.searched = false;
      }
  };
</script>


<style>
  @import "../assets/CSS/style.css";
</style>
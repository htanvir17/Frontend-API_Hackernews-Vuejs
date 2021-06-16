import axios from 'axios';

export const authMixin = {
    methods: {
        checkToken: async function(){
            let res = await axios.post("https://hackers-asw.herokuapp.com/api/check/", {"token": localStorage.getItem("vue-authenticate.vueauth_token")
            }).then(function (response) {
                console.log("inside")
                return response.data.status;
            }).catch((error) => {
                    console.log(error);
                    return false;
            });
            return await res;
        },
        authenticate: function(provider) {
            /* We set an special value, that will help us to know if the authentication process is in progres.
               It will be important to verify if a request is from a random source or it was made by our provider Google.
               To see the treatment of this go to the beforeEach method in main.js  */
            localStorage.setItem("Auth_state","PROCESS");
            this.$auth.authenticate(provider, {provider: "google-oauth2"}).then(function (response) {
                    console.log("Authentication Works!");
                    localStorage.setItem("username",response.data.username.toString());

                    localStorage.setItem("id",JSON.stringify(response.data.id));
                    localStorage.removeItem("Auth_state");
                    window.location.href = '/';
            }).catch(function(error) {
                localStorage.removeItem("Auth_state");

                console.log(error);
            });
        }
    }
}
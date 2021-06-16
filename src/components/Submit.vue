<template>
  <div class="container mt-3">
    <form @submit.prevent="onSubmit">
        <label> {{errorMessage}} </label>
        <table>
            <tr>
                <td>title</td>
                <td>
                    <input type="text" v-model="form.title" size="50" oninput="tlen(this)" onfocus="tlen(this)">
                    <span style="margin-left:10px"></span>
                </td>
            </tr>
            <tr>
                <td>url</td>
                <td><input type="text" v-model="form.url" size="50"></td>
            </tr>
            <tr>
                <td></td>
                <td><b>or</b></td>
            </tr>
            <tr>
                <td>text</td>
                <td><input type="textarea" v-model="form.texto" size="50"></td>
            </tr>
            <tr>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td><button type="submit">submit </button></td>
            </tr>
        </table>
    </form>
  </div>
</template>

<script>
    import axios from "axios";
    import apitools from '../mixins/apitools';
    export default {
        name: 'Submit',
        data() {
            return {
            form: {
                title: '',
                url: '',
                texto: ''
            },
            errorMessage: ''
            }
        },
        methods: {
            onSubmit: async function(){
                if (this.form.title == '') {
                    this.errorMessage = "Please try again."
                    return
                }
                if (this.form.url != '' & this.form.texto != '') {
                    this.errorMessage = "Submissions can't have both urls and text, so you need to pick one. If you keep the url, you can always post your text as a comment in the thread."
                    return
                }
                if (this.form.url != '') {
                    await axios
                    .post(
                        "https://hackers-asw.herokuapp.com/api/urls",
                        {
                        title: this.form.title,
                        url: this.form.url,
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
                            this.$router.push('/newest')
                            return;
                        }
                    });
                }
                else {
                    await axios
                    .post(
                        "https://hackers-asw.herokuapp.com/api/asks",
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
                            this.$router.push('/newest')
                            return;
                        }
                    });
                }
            },
            onReset() {
                this.form.title = ''
                this.form.url = ''
                this.form.texto = ''
            }
        },
        mounted () {
            this.onReset();
        }
    };
</script>
<style>
     @import '../assets/CSS/style.css';
</style>
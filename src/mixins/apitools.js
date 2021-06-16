
/* generate Api key for user based in username, we also generate the same apikey in backend*/
function getApikey (){
    let id = localStorage.getItem("id").toString();
    let name = localStorage.getItem('username').toString();

    while (name.length < 20){
        name += (name + "-" + id)
    }
    let base_api = name.split("").reverse().join("")
    let cifrado = btoa(base_api)
    let cifrado_reverse = cifrado.split("").reverse().join("")
    
    return cifrado_reverse
}
    
export default {
    getApikey
}
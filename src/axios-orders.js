import axios from "axios";

const instance=axios.create({
    baseURL:'https://burger-builder-d1368.firebaseio.com/'
})
export default instance;
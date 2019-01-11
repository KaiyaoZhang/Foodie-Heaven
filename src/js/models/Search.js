import axios from 'axios';
//import key from '../config';

export default class Search {
    constructor(query){
        this.query = query;
    }
    
    async getResults() {
    const key = 'aa11e8a929a83c94300d096e3a112151';
    try{
        const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
        this.result = res.data.recipes;
    } catch(error){
        alter(error);
        }
    
    }
    
}



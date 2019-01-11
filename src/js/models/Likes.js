export default class Likes {
    constructor() {
        this.likes = [];
    }
    
    addLike(id, title, author, img) {
        const like = {id, title, author, img};
        this.likes.push(like);
        this.persistData();
        return like;
    }
    
    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);
        this.persistData();
    }
    
    isLiked(id) {
        //When there is no index in likes arry equals the id passed in, the findIndex method will return -1, then the whole expression will return false. Otherwise the expression will return true
        return this.likes.findIndex(el => el.id === id) !== -1;
    }
    
    getNumLikes() {
        return this.likes.length;
    }
    
    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }
    
    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        if (storage) this.likes = storage;
    }
    
    
}
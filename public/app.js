var app = {
    getUsers:function(){
        return $.ajax({
            url:'/api/user/',
            type:'GET',
        })
    },

    getUser:function(id){
        return $.ajax({
            url:'/api/user/'+id,
            type:'GET',
            data:''
        })
    },

    saveUser:function(data){
        const formData = data || ''
        return $.ajax({
            url:'/api/user/',
            type:'POST',
            data:formData,
            cache:false,
            dataType:'json',
        })
    },

    getCSV:function(){
        return $.ajax({
            url:'/api/csv/',
            type:'GET',
        })
    },

    savePost:function(data){
        const formData = data || ''
        return $.ajax({
            url:'/api/post/',
            type:'POST',
            data:formData,
            cache:false,
            dataType:'json',
            contentType: false,
            processData: false,
        })
    },

    getPosts :function(){
        return $.ajax({
            url:'/api/post/',
            type:'GET',
        })
    },

    deletePost:function(data){
        return $.ajax({
            url:'/api/post/delete/:id',
            type:'GET',
            data:data,
            cache:false,
            dataType:'json'
        })
    },

    loginUser:function(data){
        return $.ajax({
            url:'/api/auth/user/login/',
            type:'POST',
            data:data,
            cache:false,
            dataType:'json',
            contentType: false,
            processData: false,
        })
    }
    
}
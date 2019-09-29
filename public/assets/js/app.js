(function($){
    $.fn.serializeObject = function() {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
    $.app = {
        createQuiz: function(data){
            data = data || {}
            return $.ajax({
                type:"POST",
                url:"/api/quiz/create",
                data:data,
                dataType:'json'
            })
        },
        
        getQuizs: function(data){
            data = data || {}
            return $.ajax({
                type:"GET",
                url:"/api/quiz/get",
                data:data,
                dataType:'json'
            })
        }
    }
})(jQuery);
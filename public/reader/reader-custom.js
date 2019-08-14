'use strict';
(function (global, $) {
    var settings = {
        metadata:{},
        totalPages:1,
        totalPagesElement:'#numPages',
        templateItems:{
            nextPageBtn:'#next',
            prevPageBtn:'#previous',
            pageNumberField:'#pageNumber'
        },
        pageNum:1
    }
    var PDFTask = global.Annotation = {
        init: function(metadata){
            var self = this;            
            settings.metadata = metadata;
            settings.totalPages = metadata.totalPages;
            self.loadPage();            
            self.initPdfEvents();
        },

        loadPage: function(){            
            window.PDFViewerApplication.open('/api/media/reader?fileName=doc_'+settings.pageNum);
            $(settings.templateItems.pageNumberField).val(settings.pageNum);
        },

        initPdfEvents: function(){
            if(settings.pageNum <= 1){
                $(settings.templateItems.prevPageBtn).prop('disabled', true);
            }
            $(settings.totalPagesElement).html('of '+settings.totalPages)
            $(settings.templateItems.nextPageBtn).bind('click').on('click', increasePageHandler)
            $(settings.templateItems.prevPageBtn).bind('click').on('click', dicreasePageHandler)
        },


    }


    function increasePageHandler(){
        if(settings.pageNum >= settings.totalPages){
            $(settings.templateItems.nextPageBtn).prop('disabled', true);
            return
        }
        $(settings.templateItems.prevPageBtn).prop('disabled', false);
        settings.pageNum += 1;   
        Annotation.loadPage();     
        console.log(settings.pageNum)
    }

    function dicreasePageHandler(){
        if(settings.pageNum <= 1){
            $(settings.templateItems.prevPageBtn).prop('disabled', true);
            return
        }
        $(settings.templateItems.nextPageBtn).prop('disabled', false);
        settings.pageNum -= 1;
        Annotation.loadPage();
        console.log(settings.pageNum)
    }
})(window, jQuery);
'use strict';
(function (global, $) {
    var PDFTask = global.Annotation = {
        init: function(){
            var self = this;
            // window.PDFViewerApplication.
            window.PDFViewerApplication.open('/api/media/reader?fileName=doc_1');
            self.initPdfEvents();

        },

        initPdfEvents: function(){
            // var next = document.getElementById('next')
            $('#next').bind('click').on('click', handler)
        }
    }


    function handler(){
        alert()
    }
})(window, jQuery);
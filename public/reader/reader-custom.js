'use strict';
(function (global, $) {
    var settings = {
        pdfMetaData:{},
        totalPages:1,
        totalPagesElement:'#numPages',
        pdfViewerContainer:'#viewerContainer',
        pageAreaSelector:'.textLayer',
        templateItems:{
            nextPageBtn:'#next',
            prevPageBtn:'#previous',
            pageNumberField:'#pageNumber'
        },
        pageNum:1,
        selectedColor: 'red',
        swapper:'.swiper-wrapper',
        url:'',
        itemCode:'#itemCode',
        annotationPopUp:'#annotation-popup',
        updateNotePopup:'#note-update-popup',
        secondaryToolBarItems:{
            firstPage:'#firstPage',
            lastPage:'#lastPage'
        }
    }

    // Annotation services
    var services = {
        getMetaDataAjax: function(itemCode){
            return $.ajax({
                url:'/api/media/metadata/'+itemCode,
                type:'GET',
                dataType:'json'
            })
        },

        getRecentReadPage: function(data){
            data = data || {};
            return $.ajax({
                url:'/api/media/get-recent-page',
                type:'GET',
                dataType:'json',
                data:data
            })
        },

        createAnnotation: function(data){
            data = data || {};
            return $.ajax({
                url:'/api/annotation/create-note',
                type:'GET',
                dataType:'json',
                data:data
            })
        },

        getAllNotes: function(data){
            data = data || {};
            data.itemCode = $(settings.itemCode).val();
            return $.ajax({
                url:'/api/annotation/get-notes',
                type:'GET',
                dataType:'json',
                data:data
            })
        },

        getNote : function(data){
            data = data || {};
            return $.ajax({
                url:'/api/annotation/get-note',
                type:'GET',
                dataType:'json',
                data:data
            })
        },

        updateNote: function(data){
            data = data || {};
            return $.ajax({
                url:'/api/annotation/update-note',
                type:'GET',
                dataType:'json',
                data:data
            })
        }
    }

    var PDFTask = global.Annotation = {
        currentPage:1,
        const: {
            HIGHLIGHT: 'HIGHLIGHT',
            NOTE: 'NOTE',
            BOOKMARK: 'BOOKMARK',
            // HIGHLIGHT_CARD_MAP: {
            //     RED: 'annotation-card-red',
            //     GREEN: 'annotation-card-green',
            //     YELLOW: 'annotation-card-yellow',
            //     PURPLE: 'annotation-card-purple',
            // },
            HIGHLIGHT_ELEMENT_MAP: {
                RED: 'mark-red',
                GREEN: 'mark-green',
                YELLOW: 'mark-yellow',
                PURPLE: 'mark-purple',
                ORANGE: 'mark-orange',
                BLUE: 'mark-blue'
            },
            HIGHLIGHT_COLOR_MAP: {
                'mark-red' : 'red##white',
                'mark-green' : 'green##white',
                'mark-yellow': 'yellow##black',
                'mark-purple':'purple##white',
                'mark-orange':'orange##black',
                'mark-blue' : 'blue##white'
            }
        },

        doc:'',

        // this method will return the constantsZ
        getAnnotationConstants: function(){            
            return this.const;
        },


        // Get the recent page
        getRecentReadPage: function(){
            var self = this;
            var itemCode = $(settings.itemCode).val()
            self.loadPage()
            return 
            // services.getRecentReadPage({ itemCode : itemCode}).done(function(response){
            //     if(response.status == true){
            //         settings.pageNum = parseInt(response.recent);
            //     }
            //     self.loadPage()
            // })
        },

        // Initializing all things regarding to pdfjs
        init: function(metadata){
            var self = this; 
            settings.url = metadata.load_url;           
            settings.pdfMetaData = metadata;
            settings.totalPages = parseInt(metadata.totalPages);
            self.getRecentReadPage();           
            self.initPdfEvents();
        },

        loadPage: function(){            
            // window.PDFViewerApplication.open(settings.url+settings.pageNum);
            window.PDFViewerApplication.open(settings.pdfMetaData.load_url);
            $(settings.templateItems.pageNumberField).val(settings.pageNum);
        },

        initPdfEvents: function(){
            var self = this;
            if(settings.pageNum <= 1){
                $(settings.templateItems.prevPageBtn).prop('disabled', true);
            }
            var pdfData = settings.pdfMetaData;
            $(settings.secondaryToolBarItems.firstPage).prop('disabled', false);
            $(settings.secondaryToolBarItems.lastPage).prop('disabled', false);
            // $(settings.totalPagesElement).html('of '+settings.totalPages);
            $(settings.templateItems.nextPageBtn).bind('click').on('click', increasePageHandler);
            $(settings.templateItems.prevPageBtn).bind('click').on('click', dicreasePageHandler);
            $(settings.templateItems.pageNumberField).bind('change').on('change', changePageHandler);
            $(settings.secondaryToolBarItems.firstPage).bind('click').on('click', firstPageHandler);
            $(settings.secondaryToolBarItems.lastPage).bind('click').on('click', lastPageHandler);
            
            //Restrict copy Paste in mobile or touch Screen
            $(document).on('taphold', settings.pageAreaSelector, function (event) {
                event.preventDefault();
                $.extend($.mobile, { autoInitializePage: false })
                if (self._isMobile()) {
                    $(settings.pageAreaSelector).attr('unselectable', 'on')
                        .css({
                            'user-select': 'none',
                            'MozUserSelect': 'none',
                            '-webkit-user-select': 'none'
                        }).on('selectstart', false).on('mousedown', false);
                }

            });

            $(document).on('mousedown', settings.pageAreaSelector, function (event) {
                // Clean selection other than textLayer container.
                self._isPdfSelection = true; // flag to track user selection mouse activity
            });
        
            $(document).on('mouseup', function (event) {
                // Clean selection other than textLayer container.
                if (!($(event.target).is('input') || $(event.target).is('textarea')) || self._isPdfSelection) {
                    var rangeSelection = self.getTextSelectionRange();
                    rangeSelection.removeAllRanges();
                }
                self._isPdfSelection = false;
            });
            $(document).on('keydown keyup', function (event) {    //for F12
                if ((event.which === 65 || event.which === 67 || event.which === 83) && !($(event.target).is('input') || $(event.target).is('textarea'))) {
                    var rangeSelection = self.getTextSelectionRange();
                    rangeSelection.removeAllRanges();
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                }
                return true;
            });

            $(document).bind('textlayerrendered').on('textlayerrendered', function () {
                if (pdfData.isFree === '1') {
                    var totalpages = PDFViewerApplication.pagesCount;
                    settings.totalPages = totalpages;
                    $(settings.totalPagesElement).html('of '+settings.totalPages);
                    self.currentPage = PDFViewerApplication.pdfViewer.currentPageNumber;
                }
                // self._renderAnnotations();
                // alert()
                // self.loadAllNotes()
            });

            //checking the page is rendered or not
            $(document).bind('pagerendered').on('pagerendered', function (e) {
                //$.unblockUI();
                // alert()
            });
            $(settings.swapper).swipe({
                swipeLeft: function (event, direction, distance, duration, fingerCount) {
                    event.stopPropagation();
                    event.preventDefault();
                    if ($(this).hasClass('disabled'))
                        return;
                    // self._storeDuration();
                    // var currentPage = settings.pageNumber;
                    // var next_page = currentPage + parseInt(1);
                    // var totalpages = parseInt(settings.pageTotal);
                    // if (totalpages < next_page) {
                    //     next_page = totalpages;
                    // }
                    // self._getPage(next_page);

                },
                fallbackToMouseEvents: false
            });

            $(settings.swapper).swipe({
                swipeRight: function (event, direction, distance, duration, fingerCount) {
                    event.stopPropagation();
                    event.preventDefault();
                    if ($(this).hasClass('disabled'))
                        return;
                    // self._storeDuration();
                    // var currentPage = settings.pageNumber;
                    // var prev_page = currentPage - parseInt(1);
                    // var totalpages = parseInt(settings.pageTotal);
                    // if (prev_page < 1) {
                    //     prev_page = 1;
                    // }
                    // self._getPage(prev_page);
                },
                fallbackToMouseEvents: false
            });
            self.initAnnotationCtrl();
        },

        



        // Initialize annotation control
        initAnnotationCtrl: function () {
            var self = this;
            var selectedText = '';
            var pdfData = settings.pdfMetaData;
            // self.initNotePopup()
            // self.initNoteUpdatePopup()

            $(settings.pdfViewerContainer).on('mouseup', function (event) {
                event.stopPropagation(); // Stop propagation to preserve selection for annotaion creation
                var selectedText = self.getSelectionText();
                var rangeSelection = null;
                if (wrongSelection > 0 && selectedText !== '') {
                    wrongSelection = 0;
                    rangeSelection = self.getTextSelectionRange();
                    rangeSelection.removeAllRanges();
                    alert("Wrong selection cannot proceed");
                    return;
                } else if (wrongSelection > 0 && selectedText === '') {
                    wrongSelection = 0;
                }
                if (selectedText === '') {
                    // Skip creating annotation popup
                    return;
                }
                if (selectedText.length < 5) {
                    rangeSelection = self.getTextSelectionRange();
                    rangeSelection.removeAllRanges();
                    //  alert('Please select 5 or more characters');
                    return;
                }
                var rangeSelection = self.getTextSelectionRange();
                var annotationRange = self.getAnnotationBoundaryData();
                annotationRange.selectionColor = settings.selectedColor;
                annotationRange.markElementName = self.getMarkElementName();
                var annotationData = {
                    pageNo: settings.pageNum,
                    bookId: pdfData.bookid,
                    annotationRange: annotationRange,
                    selectedText: selectedText,
                    type: self.const.HIGHLIGHT
                };
                selectedText = self.getSelectionPhrases(annotationRange);
                var selectionMetaData = {
                    selectedText: selectedText,
                    lineIndexBoundary: [annotationRange.anchorLineIndex, annotationRange.focusLineIndex],
                    elementName: annotationRange.markElementName,
                    color: annotationRange.selectionColor
                };
                selectionMetaData = $.extend({}, annotationData, selectionMetaData);
                self.highlightSelectedText(selectionMetaData);
                annotationData.itemCode = $(settings.itemCode).val()
                self.initNotePopup(annotationData);
                $( settings.annotationPopUp ).dialog( "open" );
                rangeSelection.removeAllRanges();
            });

            // Flag to avoid highlight overlap
            var wrongSelection = 0;
            $(document).on('mousemove', 'mark', function (event) {
                wrongSelection++;
            });
            $(document).on('mousedown', 'mark', function (event) {
                wrongSelection++;
                event.stopPropagation();
            });
            $(settings.pdfViewerContainer).on('mousedown', function (event) {
                wrongSelection = 0;
            });
            
        },



        

        // Initialize save note popup    
        initNotePopup: function(annotationData){
            annotationData = annotationData || {}
            $( settings.annotationPopUp ).dialog({
                autoOpen: false,
                height: 400,
                width: 350,
                top:140,
                modal: true,
                dialogClass: 'annotation-popup',
                buttons: {
                    Save: function(){
                        var noteText = $('#noteText').val()
                        annotationData.noteText = noteText;
                        services.createAnnotation(annotationData).done(function (data) {
                            if(data.status == true){
                                var accordin =  `<h5 data-noteid="${annotationData.annotationRange.markElementName}" class="ui-accordion-header ui-corner-top ui-accordion-header-collapsed ui-corner-all ui-state-default ui-accordion-icons" role="tab" id="ui-id-11" aria-controls="ui-id-12" aria-selected="false" aria-expanded="false" tabindex="-1" style="color: rgb(255, 255, 255); background-color: rgb(128, 0, 128);">
                                <span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-e"></span>${noteText}</h5>`;
                                accordin += `<div class="ui-accordion-content ui-corner-bottom ui-helper-reset ui-widget-content" id="ui-id-12" aria-labelledby="ui-id-11" role="tabpanel" aria-hidden="true" style="display: none;"><p>${annotationData.selectedText}</p></div>`;
                                $('#notes-accordian').append( accordin );
                                $( settings.annotationPopUp ).dialog( "close" );
                            }
                        });
                    },
                    Cancel: function() {
                        $( settings.annotationPopUp ).dialog( "close" );
                    }
                },
            });
        },

        // Initialize update note popup    
        initNoteUpdatePopup: function(annotationData){
            annotationData = annotationData || {}
            var notePopup = $( settings.updateNotePopup ).dialog({
                autoOpen: false,
                height: 400,
                width: 350,
                top:140,
                modal: true,
                dialogClass: 'annotation-popup',
                buttons: {
                    Update: function(){
                        var noteText = $('#noteTextUpdate').val()
                        annotationData.title = noteText;
                        console.log(annotationData)
                        services.updateNote(annotationData).done(function (data) {
                            if(data.status == true){
                                $( settings.annotationPopUp ).dialog( "close" );
                            }
                        });
                    },
                    Cancel: function() {
                        $( settings.updateNotePopup ).dialog( "close" );
                    }
                },
            });
            return notePopup
        },

        // Select the note
        initSelectNoteMark: function(){
            var self = this;
            // getting the note
            $('.select-note').unbind('click').on('click' , function(e){
                var elementName = $(this).prop("tagName");
                var data = { 
                    elementName : elementName , 
                    pageNo: settings.currentPage,
                    itemCode : $(settings.itemCode).val()
                }
                services.getNote(data).done(function(response){
                   if(response.status == true){
                        $('#noteTextUpdate').html(response.data.title);
                        var updateDialog = self.initNoteUpdatePopup(response.data);
                        updateDialog.dialog('open');                        
                   }
                })
            })

            // color selection form selection text to accordin
            $('.select-note').on('mouseover' , function(e){
                var elementName = $(this).prop("tagName");
                var classes = $(this).attr('class');
                var accordins = $('#notes-accordian').find('h5')
                var element = accordins.filter(function(accordin) {
                    var noteId = $(accordins[accordin]).attr('data-noteId')
                    if(elementName.toLowerCase() == noteId){
                        return accordins[accordin]
                    }
                });
                classes  = classes.replace('select-note' , '')
                var color = self.const.HIGHLIGHT_COLOR_MAP[classes.trim()]
                element.css({color:color.split('##')[1] , 'background-color':color.split('##')[0]})
            })
        },

        // Load all notes
        loadAllNotes: function(pageno){
            var self = this
            var data = {
                pageNo : settings.pageNum
            }
            services.getAllNotes(data).done(function(response){
                if(response.status == true){
                    self.renderAllNotes(response.data)
                }
            })
        },

        // Render all notes
        renderAllNotes: function(annotationData){
            annotationData = annotationData || []
            var self = this;
            // $(settings.sideBarTemplates.notes).html('')
            var allAnnotations = '<div id="notes-accordian">';
            annotationData.forEach(function (annotationDataItem) {
                var annotation = annotationDataItem;
                var title = annotation.title;
                allAnnotations += '<h5 data-noteid="'+annotation.annotationRange.markElementName+'">'+title+'</h5>';
                allAnnotations += '<div><p>'+annotation.selectedText+'</p></div>';
                annotation.aid = annotationDataItem._id;
                var annotationRange = annotation.annotationRange;
                annotationRange.anchorLineIndex = parseInt(annotationRange.anchorLineIndex)
                annotationRange.anchorOffset = parseInt(annotationRange.anchorOffset)
                annotationRange.focusLineIndex = parseInt(annotationRange.focusLineIndex)
                annotationRange.focusOffset = parseInt(annotationRange.focusOffset)
                annotationRange.selectionColor = annotationRange.selectionColor;
                annotationRange.markElementName = annotationRange.markElementName
                var selectedText = self.getSelectionPhrases(annotationRange);
                var selectionMetaData = {
                    selectedText: selectedText,
                    lineIndexBoundary: [annotationRange.anchorLineIndex, annotationRange.focusLineIndex],
                    elementName: annotationRange.markElementName,
                    color: annotationRange.selectionColor
                };
                selectionMetaData = $.extend({}, annotationDataItem, selectionMetaData);
                self.highlightSelectedText(selectionMetaData);
            });
            allAnnotations += '</div>';
            // $(settings.sideBarTemplates.notes).html(allAnnotations)
            // $( "#notes-accordian" ).accordion({
            //     collapsible: true,
            //     heightStyle: "content"
            // });
            $('.select-note').attr('title' , 'Click to update note');
            
            self.initSelectNoteMark();
        },


        

        /****************************************  
        *     Start PDF page functionalities    *                                                                       
        ****************************************/  
        
        // All related to selecting text and creating the range
        getTextSelectionRange: function () {
            var range = null;
            if (global.getSelection) {
                range = global.getSelection();
            } else if (document.selection && document.selection.type !== 'Control') {
                range = document.selection.createRange();
            }
            return range;
        },
        /**
         * Function is used to get selection phrases.
         *
         * @param {type} annotationData
         * @returns {Array}
         */
        getSelectionPhrases: function (annotationData) {
            var self = this;
            var $linesElement = self.getLinesElement();
            var startNodeLineIndex = parseInt(annotationData.anchorLineIndex);
            var endNodeLineIndex = parseInt(annotationData.focusLineIndex);
            
            var list = [];
            var srchTxt = '';
            if (endNodeLineIndex < startNodeLineIndex) {
                // For bottom line to top line selection
                srchTxt = $($linesElement[annotationData.anchorLineIndex]).text().substring(0, annotationData.anchorOffset);
                list.push(srchTxt);
                for (var i = (startNodeLineIndex - 1); i > endNodeLineIndex; i--) {
                    list.unshift($($linesElement[i]).text());
                }
                srchTxt = $($linesElement[annotationData.focusLineIndex]).text().substring(annotationData.focusOffset);
                list.unshift(srchTxt);
            } else if (endNodeLineIndex > startNodeLineIndex) {
                // For top line to bottom line selection
                srchTxt = $($linesElement[annotationData.anchorLineIndex]).text().substring(annotationData.anchorOffset);
                list.push(srchTxt);
                for (var i = (startNodeLineIndex + 1); i < endNodeLineIndex; i++) {
                    list.push($($linesElement[i]).text());
                }
                srchTxt = $($linesElement[annotationData.focusLineIndex]).text().substring(0, annotationData.focusOffset);
                list.push(srchTxt);
            } else {
                // For single line selection
                srchTxt = $($linesElement[annotationData.anchorLineIndex]).text().substring(annotationData.anchorOffset, annotationData.focusOffset);
                list.push(srchTxt);
            }
            // console.log(list);
            return list;
        },

        // get all the elements of area selector
        getLinesElement: function () {
            return $(settings.pageAreaSelector).children();
        },

        /**
         * Function to identify selected text
         * @returns {String} Selected text.
         */
        getSelectionText: function () {
            var text = null;
            if (global.getSelection) {
                text = global.getSelection().toString();
            } else if (document.selection && document.selection.type !== 'Control') {
                text = document.selection.createRange().text;
            }
            return text;
        },

        /**
         * Function to generate unique marking element/tag name.
         * 
         * @returns {String}
         */
        getMarkElementName: function () {
            return 'mark' + Math.random().toString().split('.')[1];
        },

        /**
         * Function to calculate server database friendly selected line boundary data. 
         * 
         * @returns {Object}
         */
        getAnnotationBoundaryData: function () {
            // NOTE: "anchor" and "focus"
            // Term "anchor" refers selection start point
            // Term "focus" refers selection end point
            var self = this;
            var annotationData = {
                anchorLineIndex: -1,
                anchorOffset: -1,
                focusLineIndex: -1,
                focusOffset: -1
            };
            var rangeSelection = self.getTextSelectionRange();
            var $startNode = $(rangeSelection.anchorNode);
            var $endNode = $(rangeSelection.focusNode);
            
            var $startNodeLine = $startNode.parents('span');
            var $endNodeLine = $endNode.parents('span');
            var $linesElement = self.getLinesElement();
            var startNodeLineIndex = $linesElement.index($startNodeLine);
            var endNodeLineIndex = $linesElement.index($endNodeLine);
            
            var srchTxt = '';
            if (endNodeLineIndex < startNodeLineIndex) {
                // For bottom line to top line selection
                srchTxt = rangeSelection.anchorNode.textContent.substring(0, rangeSelection.anchorOffset);
                annotationData.anchorOffset = $startNodeLine.text().indexOf(srchTxt) + srchTxt.length;
                srchTxt = rangeSelection.focusNode.textContent.substring(rangeSelection.focusOffset);
                annotationData.focusOffset = $endNodeLine.text().indexOf(srchTxt);
            } else if (endNodeLineIndex > startNodeLineIndex) {
                // For top line to bottom line selection
                srchTxt = rangeSelection.anchorNode.textContent.substring(rangeSelection.anchorOffset);
                annotationData.anchorOffset = $startNodeLine.text().indexOf(srchTxt);
                srchTxt = rangeSelection.focusNode.textContent.substring(0, rangeSelection.focusOffset);
                annotationData.focusOffset = $endNodeLine.text().indexOf(srchTxt) + srchTxt.length;
            } else {
                // For single line selection
                srchTxt = rangeSelection.anchorNode.textContent.substring(rangeSelection.anchorOffset, rangeSelection.focusOffset);
                annotationData.anchorOffset = $startNodeLine.text().indexOf(srchTxt);
                annotationData.focusOffset = null;
                annotationData.focusOffset = $endNodeLine.text().indexOf(srchTxt) + srchTxt.length;
            }
            annotationData.anchorLineIndex = startNodeLineIndex;
            annotationData.focusLineIndex = endNodeLineIndex;
            return annotationData;
        },

        /**
         * Function is used to highlight selections.
         * 
         * @param {type} selectionMetaData
         * @returns {undefined}
         */
        highlightSelectedText: function (selectionMetaData) {
            var self = this;
            var text = selectionMetaData.selectedText;
            var lineIndexBoundary = selectionMetaData.lineIndexBoundary;

            var options = $.extend({
                separateWordSearch: false
            }, {
                element: selectionMetaData.elementName,
                className: self.const.HIGHLIGHT_ELEMENT_MAP[selectionMetaData.color.toUpperCase()] + ' select-note'
            });

            var $linesElement = self.getLinesElement();
            var $contextElements = [];
            if (lineIndexBoundary[0] < lineIndexBoundary[1]) {
                $contextElements = $linesElement.slice(lineIndexBoundary[0], lineIndexBoundary[1] + 1);
            } else {
                $contextElements = $linesElement.slice(lineIndexBoundary[1], lineIndexBoundary[0] + 1);
            }
            $.each($contextElements, function (index, $element) {
                $($element).mark(text[index], options);
            });
        },

        /**
         *
         *Function To detect Touch in Mobile ONly
        */
        _isMobile: function () {
            return ('ontouchstart' in document.documentElement);
        },

    }



    // All Handlers written here
    // next page handler
    function increasePageHandler(){
        if(settings.pageNum >= settings.totalPages){
            $(settings.templateItems.nextPageBtn).prop('disabled', true);
            return
        }
        $(settings.templateItems.prevPageBtn).prop('disabled', false);
        if(settings.pdfMetaData.isFree === '1'){
            PDFViewerApplication.page++;
            return false;
        }
        settings.pageNum += 1;   
        Annotation.loadPage();     
    }
    
    // previous page handler
    function dicreasePageHandler(){
        if(settings.pageNum <= 1){
            $(settings.templateItems.prevPageBtn).prop('disabled', true);
            return
        }
        $(settings.templateItems.nextPageBtn).prop('disabled', false);
        settings.pageNum -= 1;
        Annotation.loadPage();
    }

    // input page handler
    function changePageHandler(){
        var pageno = parseInt($(this).val());
        settings.pageNum = pageno;
        Annotation.loadPage();
    }
    
    // GOTO first page
    function firstPageHandler(){
        $(settings.templateItems.prevPageBtn).prop('disabled', true);
        $(settings.templateItems.nextPageBtn).prop('disabled', false);
        settings.pageNum = 1;   
        Annotation.loadPage();     
    }

    // GOTO last page
    function lastPageHandler(){
        $(settings.templateItems.nextPageBtn).prop('disabled', true);
        $(settings.templateItems.prevPageBtn).prop('disabled', false);
        settings.pageNum = settings.totalPages;   
        Annotation.loadPage();     
    }
    


})(window, jQuery);
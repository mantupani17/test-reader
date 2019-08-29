'use strict';
(function (global, $) {
  // Global TTS initialization
  var synth = window.speechSynthesis;
  // Global PDF Reader Settings
  var settings = {
    pdfMetaData: {},
    totalPages: 1,
    totalPagesElement: '#numPages',
    pdfViewerContainer: '#viewerContainer',
    pageAreaSelector: '.textLayer',
    templateItems: {
      nextPageBtn: '#next',
      prevPageBtn: '#previous',
      pageNumberField: '#pageNumber'
    },
    pageNum: 1,
    selectedColor: 'yellow',
    swapper: '.swiper-wrapper',
    url: '',
    itemCode: '#itemCode',
    annotationPopUp: '#annotation-popup',
    updateNotePopup: '#note-update-popup',
    secondaryToolBarItems: {
      firstPage: '#firstPage',
      lastPage: '#lastPage'
    },
    sideBarItems: {
      viewNotes: '#viewNotes',
      viewBookMarks: '#viewBookMarks',
      bookmarkBtn: '.bookmark-btn',
      bookmarkLink: '.bookmark-link',
      downloadAll: '#downloadAll',
      changeBgColor:'#backgroundColor'
    },
    sideBarTemplates: {
      notesTemplate: '#notesView',
      colorTemplate: '.colorTemplate',
      notes: '#board',
      bookmarkView: '#bookmarkView',
      bookmarks: '#bookmarks',
      deleteBookMark: '.delete-bookmark',
      dictionaryView: '#dictionaryView',
      findBarView: '#findBarView',
      contentEbookTemplate: '#relatedBooksTemplate',
      contentVideoTemplate: '#relatedVideosTemplate',
      dictSearchResult: '#dictSearchResult',
      highlightView: '#highlightView',
      changeBg:'#change-bg'
    },
    colorBox: '.color-box',
    toolbarSidebar: '#toolbarSidebar',
    toolbar: {
      viewBookmark: '#viewBookmark'
    },
    toolbarButton: '.customToolBtn',
    closeBtn: '.close',
    toolbarContainer: '#customToolbarContainer',
    jsTemplates: {
      notesTemplate: '#notes-template',
      relatedBooksTemplate: '#related-content-template'
    },
    annotationData: '',
    eBooksBtn: '#ebooks',
    videosBtn: '#videos',
    downloadNote: '.download-note',
    pdfConf: {
      margins: {
        align: 'left',
        top: 20,
        bottom: 60,
        left: 20,
        width: 200,
        height: 400
      },
      pdfObj: new jsPDF()
    },
    noteType: 'NOTE'
  }

  // Annotation services
  var services = {
    getMetaDataAjax: function (itemCode) {
      return $.ajax({
        url: '/api/media/metadata/' + itemCode,
        type: 'GET',
        dataType: 'json'
      })
    },

    getRecentReadPage: function (data) {
      data = data || {};
      return $.ajax({
        url: '/api/media/get-recent-page',
        type: 'GET',
        dataType: 'json',
        data: data
      })
    },

    createAnnotation: function (data) {
      data = data || {};
      return $.ajax({
        url: '/api/annotation/create-note',
        type: 'GET',
        dataType: 'json',
        data: data
      })
    },

    getAllNotes: function (data) {
      data = data || {};
      data.itemCode = $(settings.itemCode).val();
      return $.ajax({
        url: '/api/annotation/get-notes',
        type: 'GET',
        dataType: 'json',
        data: data
      })
    },

    getNote: function (data) {
      data = data || {};
      return $.ajax({
        url: '/api/annotation/get-note',
        type: 'GET',
        dataType: 'json',
        data: data
      })
    },

    updateNote: function (data) {
      data = data || {};
      return $.ajax({
        url: '/api/annotation/update-note',
        type: 'GET',
        dataType: 'json',
        data: data
      })
    },

    deleteNote: function (data) {
      data = data || {};
      return $.ajax({
        url: '/api/annotation/delete-note',
        type: 'GET',
        dataType: 'json',
        data: data
      })
    },

    // Bookmark
    createBookmark: function (data) {
      data = data || {}
      return $.ajax({
        url: '/api/bookmark/create',
        type: 'GET',
        dataType: 'json',
        data: data
      })
    },

    getBookmarks: function (data) {
      data = data || {};
      return $.ajax({
        url: '/api/bookmark/all-bookmarks',
        type: 'GET',
        dataType: 'json',
        data: data
      })
    },

    removeBookMark: function (data) {
      data = data || {};
      return $.ajax({
        url: '/api/bookmark/delete',
        type: 'GET',
        dataType: 'json',
        data: data
      })
    },

    // Related books
    getRelatedContents: function (data) {
      data = data || {}
      return $.ajax({
        url: '/api/content/related-books',
        type: 'GET',
        dataType: 'json',
        data: data
      })
    },

    searchInDictionary: function (word) {
      word = word || ''
      return $.ajax({
        url: '/api/utility/dictionary/search?searchWord=' + word,
        type: 'GET',
        dataType: 'json'
      })
    }


  }

  var PDFTask = global.Annotation = {
    currentPage: 1,
    const: {
      HIGHLIGHT: 'HIGHLIGHT',
      NOTE: 'NOTE',
      BOOKMARK: 'BOOKMARK',
      HIGHLIGHT_ELEMENT_MAP: {
        RED: 'mark-red',
        GREEN: 'mark-green',
        YELLOW: 'mark-yellow',
        PURPLE: 'mark-purple',
        ORANGE: 'mark-orange',
        BLUE: 'mark-blue'
      },
      HIGHLIGHT_COLOR_MAP: {
        'mark-red': 'red##white',
        'mark-green': 'green##white',
        'mark-yellow': 'yellow##black',
        'mark-purple': 'purple##white',
        'mark-orange': 'orange##black',
        'mark-blue': 'blue##white'
      }
    },


    doc: '',

    // this method will return the constantsZ
    getAnnotationConstants: function () {
      return this.const;
    },


    // Get the recent page
    getRecentReadPage: function () {
      var self = this;
      var itemCode = $(settings.itemCode).val();
      services.getRecentReadPage({
        itemCode: itemCode
      }).done(function (response) {
        if (response.status == true) {
          if (response.recent == 1) {
            self.loadPage()
          } else {
            var confirm = self.initConfirmationPopup(response);
            $(confirm).dialog("open");
          }
        }
      })
    },

    // Initializing all things regarding to pdfjs
    init: function (metadata) {
      var self = this;
      settings.url = metadata.load_url;
      settings.pdfMetaData = metadata;
      settings.totalPages = parseInt(metadata.totalpages);
      self.getRecentReadPage();
      self.initNotePopup()
      self.initNoteUpdatePopup()
    },

    loadPage: function () {
      var xmlhttp;
      xmlhttp = new XMLHttpRequest();
      window.PDFViewerApplication.open(settings.url + settings.pageNum, {
        'httpHeaders': {
          'Authorization': settings.pdfMetaData.authorization,
        }
      });
      $(settings.templateItems.pageNumberField).val(settings.pageNum);
      this.initPdfEvents();
    },


    initPdfEvents: function () {
      var self = this;
      var itemCode = $(settings.itemCode).val();
      $('#book-title').html(settings.pdfMetaData.title)
      if (settings.pageNum <= 1) {
        $(settings.templateItems.prevPageBtn).prop('disabled', true);
        $(settings.templateItems.nextPageBtn).prop('disabled', false);
      }
      if (settings.pageNum >= settings.totalPages) {
        $(settings.templateItems.prevPageBtn).prop('disabled', false);
        $(settings.templateItems.nextPageBtn).prop('disabled', true);
      }
      if (settings.pageNum > 1 && settings.pageNum < settings.totalPages) {
        $(settings.templateItems.prevPageBtn).prop('disabled', false);
        $(settings.templateItems.nextPageBtn).prop('disabled', false);
      }
      $(settings.secondaryToolBarItems.firstPage).prop('disabled', false);
      $(settings.secondaryToolBarItems.lastPage).prop('disabled', false);
      $(settings.totalPagesElement).html('of ' + settings.totalPages);
      $(settings.templateItems.nextPageBtn).unbind('click').on('click', increasePageHandler);
      $(settings.templateItems.prevPageBtn).unbind('click').on('click', dicreasePageHandler);
      $(settings.templateItems.pageNumberField).unbind('change').on('change', changePageHandler);
      $(settings.secondaryToolBarItems.firstPage).unbind('click').on('click', firstPageHandler);
      $(settings.secondaryToolBarItems.lastPage).unbind('click').on('click', lastPageHandler);
      //Restrict copy Paste in mobile or touch Screen
      $(document).unbind('taphold').on('taphold', settings.pageAreaSelector, function (event) {
        event.preventDefault();
        $.extend($.mobile, {
          autoInitializePage: false
        })
        if (self._isMobile()) {
          $(settings.pageAreaSelector).attr('unselectable', 'on')
            .css({
              'user-select': 'none',
              'MozUserSelect': 'none',
              '-webkit-user-select': 'none'
            }).on('selectstart', false).on('mousedown', false);
        }

      });

      $(document).unbind('mousedown').on('mousedown', settings.pageAreaSelector, function (event) {
        // Clean selection other than textLayer container.
        self._isPdfSelection = true; // flag to track user selection mouse activity
      });

      $(document).unbind('mouseup').on('mouseup', function (event) {
        // Clean selection other than textLayer container.
        if (!($(event.target).is('input') || $(event.target).is('textarea')) || self._isPdfSelection) {
          var rangeSelection = self.getTextSelectionRange();
          rangeSelection.removeAllRanges();
        }
        self._isPdfSelection = false;
      });

      $(document).unbind('keydown keyup').on('keydown keyup', function (event) {
        //for F12
        if ((event.which === 65 || event.keyCode == 17 || event.which === 67 || event.which === 123 || event.which === 83) && !($(event.target).is('input') || $(event.target).is('textarea'))) {
          var rangeSelection = self.getTextSelectionRange();
          rangeSelection.removeAllRanges();
          event.preventDefault();
          event.stopPropagation();
          return false;
        }
        return true;
      });

      $(document).unbind('textlayerrendered').on('textlayerrendered', function () {
        self.loadAllNotes()
      });

      //checking the page is rendered or not
      $(document).unbind('pagerendered').on('pagerendered', function (e) {
        // self.loadAllNotes()
      });

      // Swipe left in mobile screen
      $(settings.swapper).swipe({
        swipeLeft: function (event, direction, distance, duration, fingerCount) {
          event.stopPropagation();
          event.preventDefault();
          if ($(this).hasClass('disabled'))
            return;
            increasePageHandler();
        },
        fallbackToMouseEvents: false
      });

      // Swipe right in mobile screen
      $(settings.swapper).swipe({
        swipeRight: function (event, direction, distance, duration, fingerCount) {
          event.stopPropagation();
          event.preventDefault();
          if ($(this).hasClass('disabled'))
            return;
            dicreasePageHandler();
        },
        fallbackToMouseEvents: false
      });

      $(settings.closeBtn).on('click', function () {
        location.href = '/dashboard';
      })

      // All sidebar button event handlers
      $(settings.toolbarButton).unbind('click').on('click', function () {
        var dataItem = $(this).data('toolitem');
        $('#customToolbarContainer').show('swing');
        // $('#downloadAll').addClass('hidden')
        self.hideAllToolContentViews();

        if (dataItem == 'notes') {
          $(settings.sideBarTemplates.notesTemplate).removeClass('hidden');
          settings.noteType = 'NOTE';
          $('#sidebar-name').html('Notes: ');
          $('#downloadAll').removeClass('hidden')
          self.loadAllNotes()
        }

        if (dataItem == 'bookmark') {
          $(settings.sideBarTemplates.bookmarkView).removeClass('hidden');
          $('#sidebar-name').html('Bookmarks: ');
          loadAllBookMarks(itemCode);
        }

        if (dataItem == 'dictionary') {
          $(settings.sideBarTemplates.dictionaryView).removeClass('hidden');
          $('#sidebar-name').html('Dictionary: ');
        }

        if (dataItem == 'findbar') {
          $(settings.sideBarTemplates.findBarView).removeClass('hidden');
          $('#findbar').removeClass('hidden');
          $('#sidebar-name').html('Search: ');
        }

        if (dataItem == 'highlight') {
          $(settings.sideBarTemplates.highlightView).removeClass('hidden');
          settings.noteType = 'HIGHLIGHT';
          $('#findbar').removeClass('hidden');
          $('#sidebar-name').html('Highlights: ');
          $(settings.sideBarTemplates.colorTemplate).unbind('click').on('click', '.highlight-color-box', highlightColor);
        }


      })

      $('.closeContainer').click(function (event) {
        event.preventDefault();
        $('#customToolbarContainer').hide('swing');
      });


      $('.rltdBooksCloseNew').click(function (event) {
        event.preventDefault();
        $('#sidebar').hide('swing');
      });

      var i = 1;
      $('#sidebar-toggle').click(function (event) {
        event.preventDefault();
        $('#sidebar').toggle('slow', 'swing',
          function () {
            if (i % 2 == 0) {
              i = 1;
              return;
            }
            var childrenVideo = $(settings.sideBarTemplates.contentVideoTemplate).children();
            var childrenEbook = $(settings.sideBarTemplates.contentEbookTemplate).children();
            if (childrenEbook.length > 0 || childrenVideo.length > 0) {
              i++;
            } else {
              self.loadRelatedBooks();
              i++;
            }

          }
        );
      });

      // text type search   
      $('#search-text').on('keyup', function (e) {
        e.preventDefault();
        var word = $(this).val();
        if (e.keyCode == 13) {
          self.loadDictionary(word);
        }
      })

      // click on search ion
      $('#slide').on('click', function () {
        var word = $('#search-text').val();
        self.loadDictionary(word);
      })

      $(settings.sideBarItems.downloadAll).unbind('click').on('click', function () {
        self.downloadAllNotes();
      })
      
      // color picker toggle
      $(settings.sideBarItems.changeBgColor).unbind('click').on('click' , function(e){
        e.preventDefault()
        if($(settings.sideBarTemplates.changeBg).hasClass('hidden')){
          $(settings.sideBarTemplates.changeBg).removeClass('hidden')
        }else{
          $(settings.sideBarTemplates.changeBg).addClass('hidden')
        }
        // alert()
      })

      
      // Read book by TTS
      $(document).unbind('click').on("click", '#startReading', function () {
        // Getting current PDF page instance from PDF Viewer
        if($(this).children('i').hasClass('fa-volume-up')){
          $(this).children('i').addClass('fa-volume-off')
          $(this).children('i').removeClass('fa-volume-up')
          // synth.pause();
        }else{
          $(this).children('i').addClass('fa-volume-up')
          $(this).children('i').removeClass('fa-volume-off')
          // synth.play();
        }
        var textToRead = $('.textLayer').children('span').siblings().not('.spoken');
        TTSTask.readText(textToRead);
      });
    





      self.initAnnotationCtrl();
      self.initBookMarkCtrl();

    },

    hideAllToolContentViews: function () {
      $(settings.sideBarTemplates.notesTemplate).addClass('hidden');
      $(settings.sideBarTemplates.bookmarkView).addClass('hidden');
      $(settings.sideBarTemplates.dictionaryView).addClass('hidden');
      $(settings.sideBarTemplates.findBarView).addClass('hidden');
      $(settings.sideBarTemplates.highlightView).addClass('hidden');
    },

    initBookMarkCtrl: function () {
      var itemCode = $(settings.itemCode).val();
      var self = this;
      $(settings.toolbar.viewBookmark).unbind('click').on('click', function (e) {
        var data = {
          itemCode: itemCode,
          pageNo: settings.pageNum
        }
        services.createBookmark(data).done(function (response) {
          if (response.status == true) {
            loadAllBookMarks(itemCode)
          }
        })
      })

      $(settings.sideBarTemplates.bookmarks).unbind('click').on('click', settings.sideBarItems.bookmarkBtn, function () {
        var pageNo = $(this).data('pageno')
        settings.pageNum = parseInt(pageNo);
        self.loadPage()
      })



    },


    // Initialize annotation control
    initAnnotationCtrl: function () {
      var self = this;
      var selectedText = '';
      var pdfData = settings.pdfMetaData;
      $(document).on('mouseup', settings.pageAreaSelector ,  function (event) {
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
          type: settings.noteType
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
        annotationData.itemCode = $(settings.itemCode).val();
        settings.annotationData = annotationData;
        if (settings.noteType == 'NOTE') {
          $(settings.annotationPopUp).dialog("open");
        } else {
          services.createAnnotation(settings.annotationData).done(function (response) { })
        }

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

      // $(document).on('mousedown' , function(e){
      //   if ($(e.target).is('.pickshell')) {
      //     // $(settings.sideBarTemplates.changeBg).removeClass('hidden');
      //     return 
      //   }else{
      //     $(settings.sideBarTemplates.changeBg).addClass('hidden');
      //   }
      // })

      // View zoom screen
      $('#presentationMode').on('click' , function(e){
        self._fullScreenMode();
      })
      // 

      

    },


    initConfirmationPopup: function (response) {
      $('#confirmPage').html(response.recent)
      var confirm = $('#read-confirmation').dialog({
        autoOpen: false,
        height: 150,
        width: 300,
        top: 160,
        modal: true,
        closeOnEscape: false,
        dialogClass: "no-close",
        // position: ['center',200],
        buttons: {
          Yes: function () {
            settings.pageNum = parseInt(response.recent);
            confirmLoadPage()
          },
          No: function () {
            settings.pageNum = 1;
            confirmLoadPage()
          }
        },
      });
      return confirm;
    },

    // Initialize save note popup    
    initNotePopup: function (annotationData) {
      var self = this;
      annotationData = annotationData || {}
      $('#noteText').val('')
      $(settings.annotationPopUp).dialog({
        autoOpen: false,
        height: 400,
        width: 350,
        top: 140,
        modal: true,
        dialogClass: 'annotation-popup',
        buttons: {
          Save: function () {
            var noteText = $('#noteText').val()
            annotationData.noteText = noteText;
            services.createAnnotation(settings.annotationData).done(function (data) {
              if (data.status == true) {
                var annotation = settings.annotationData;
                var $noteTemplate = $(settings.jsTemplates.notesTemplate).html();
                var $el = $('<notes-component></notes-component>');
                $el.html($noteTemplate);
                var noteClass = $el.find('.note');
                var note = $el.find('.remove');
                var download = $el.find('.download');
                var titleText = $el.find('.title');
                var contentText = $el.find('.cnt');
                var actionBtn = $el.find('.updateNote');
                note.addClass('remove-note');
                download.addClass('download-note');
                note.attr('data-noteid', annotation.annotationRange.markElementName);
                download.attr('data-noteid', annotation.annotationRange.markElementName);
                actionBtn.attr('data-noteid', annotation.annotationRange.markElementName)
                titleText.html(annotation.selectedText);
                titleText.attr('readonly', 'readonly');
                noteClass.addClass('mark-' + annotation.annotationRange.selectionColor);
                contentText.html(annotation.noteText);
                $(settings.sideBarTemplates.notes).append($el.html());
                $(settings.annotationPopUp).dialog("close");
              }
            });
          },
          Cancel: function () {
            $(settings.annotationData.annotationRange.markElementName).remove()
            $(settings.annotationPopUp).dialog("close");
          }
        },
      });
      //   var annotation =  settings.annotationData.annotationRange;      
      $(settings.sideBarTemplates.colorTemplate).unbind('click').on('click', settings.colorBox, selectBgColor);
    },

    // Initialize update note popup    
    initNoteUpdatePopup: function (annotationData) {
      annotationData = annotationData || {}
      var notePopup = $(settings.updateNotePopup).dialog({
        autoOpen: false,
        height: 400,
        width: 350,
        top: 140,
        modal: true,
        dialogClass: 'annotation-popup',
        buttons: {
          Update: function () {
            var noteText = $('#noteTextUpdate').val()
            settings.annotationData.title = noteText;
            services.updateNote(settings.annotationData).done(function (data) {
              if (data.status == true) {
                $(settings.updateNotePopup).dialog("close");
              }
            });
          },
          Cancel: function () {
            $(settings.updateNotePopup).dialog("close");
          }
        },
      });

      $(settings.sideBarTemplates.colorTemplate).unbind('click').on('click', settings.colorBox, selectBgColor);
      return notePopup
    },

    // Select the note
    initSelectNoteMark: function () {
      var self = this;
      // getting the note
      $('.select-note').unbind('click').on('click', function (e) {
        var elementName = $(this).prop("tagName");
        var data = {
          elementName: elementName,
          pageNo: settings.pageNum,
          itemCode: $(settings.itemCode).val()
        }
        services.getNote(data).done(function (response) {
          if (response.status == true) {
            $('#noteTextUpdate').val(response.data.title);
            settings.annotationData = response.data;
            $(settings.updateNotePopup).dialog('open');
          }
        })
      })
    },

    // Load all notes
    loadAllNotes: function (pageno) {
      var self = this
      var data = {
        pageNo: settings.pageNum
      }
      services.getAllNotes(data).done(function (response) {
        if (response.status == true) {
          self.renderAllNotes(response.data)
        }
      })
    },

    // Render all notes
    renderAllNotes: function (annotationData) {
      annotationData = annotationData || []
      var self = this;
      var $noteTemplate = $(settings.jsTemplates.notesTemplate).html()
      $(settings.sideBarTemplates.notes).html('')
      annotationData.forEach(function (annotationDataItem) {
        var $el = $('<notes-component></notes-component>')
        $el.html($noteTemplate);
        var annotation = annotationDataItem;
        var title = annotation.title;
        var noteClass = $el.find('.note');
        var note = $el.find('.remove');
        var download = $el.find('.download');
        var titleText = $el.find('.title');
        var contentText = $el.find('.cnt');
        var actionBtn = $el.find('.updateNote');
        note.addClass('remove-note');
        download.addClass('download-note');
        note.attr('data-noteid', annotation.annotationRange.markElementName);
        download.attr('data-noteid', annotation.annotationRange.markElementName);
        actionBtn.attr('data-noteid', annotation.annotationRange.markElementName);
        titleText.html(annotation.selectedText);
        noteClass.addClass('mark-' + annotation.annotationRange.selectionColor);
        contentText.attr('id', annotation.annotationRange.markElementName)
        titleText.attr('id', 'title-' + annotation.annotationRange.markElementName)
        contentText.html(title);
        annotation.aid = annotationDataItem._id;
        var annotationRange = annotation.annotationRange;
        annotationRange.anchorLineIndex = parseInt(annotationRange.anchorLineIndex)
        annotationRange.anchorOffset = parseInt(annotationRange.anchorOffset)
        annotationRange.focusLineIndex = parseInt(annotationRange.focusLineIndex)
        annotationRange.focusOffset = parseInt(annotationRange.focusOffset)
        annotationRange.selectionColor = annotationRange.selectionColor;
        annotationRange.markElementName = annotationRange.markElementName;
        var selectedText = self.getSelectionPhrases(annotationRange);
        var selectionMetaData = {
          selectedText: selectedText,
          lineIndexBoundary: [annotationRange.anchorLineIndex, annotationRange.focusLineIndex],
          elementName: annotationRange.markElementName,
          color: annotationRange.selectionColor
        };
        selectionMetaData = $.extend({}, annotationDataItem, selectionMetaData);
        self.highlightSelectedText(selectionMetaData);
        $(settings.sideBarTemplates.notes).append($el.html())
      });


      $('.select-note').attr('title', 'Click to update note');
      $('.title').attr('readonly', 'readonly');

      $('.remove-note').unbind('click').on('click', function (e) {
        var elemId = $(this).data('noteid');
        var pageNum = settings.pageNum;
        var itemCode = $(settings.itemCode).val();
        var $this = $(this);
        services.deleteNote({ elemId, pageNum, itemCode }).done(function (response) {
          if (response.status == true) {
            $this.parent('div').hide('swing', function () {
              $this.parent('div').remove();
            });
            $(elemId).remove();
          }
        })
      })

      $('.updateNote').unbind('click').on('click', function (e) {
        var elemId = $(this).data('noteid');
        var note = $('#' + elemId).val();
        var itemCode = $(settings.itemCode).val();
        var pageNo = settings.pageNum
        services.updateNote({ elemId, note, itemCode, pageNo }).done(function (data) {
          if (data.status == true) {
          }
        });
      })

      $(settings.downloadNote).unbind('click').on('click', function (e) {
        var elemId = $(this).data('noteid')
        // var pdf = new jsPDF();
        var pdf = settings.pdfConf.pdfObj;
        var title = $('#title-' + elemId).val();
        var selectedText = $('#' + elemId).val();
        var $el = '<download-template></download-template>';
        $el = $($el);
        $el.append('<div class="dwnld-div">Book: ' + settings.pdfMetaData.title + '</div>');
        $el.append('<div class="dwnld-note-pageno">Page no: ' + settings.pageNum + '</div>');
        $el.append('<div class="dwnld-note-title">Note Title : ' + title + '</div>');
        $el.append('<div class="dwnld-note">Note : ' + selectedText + '</div>')
        var source = $el;
        var specialElementHandlers = {
          // element with id of "bypass" - jQuery style selector
          '#bypassme': function (element, renderer) {
            // true = "handled elsewhere, bypass text extraction"
            return true
          }
        };
        var margins = settings.pdfConf.margins;
        pdf.fromHTML(
          source.html(), // HTML string or DOM elem ref.
          margins.left, // x coord
          margins.top, { // y coord
            'width': margins.width, // max width of content on PDF
            'elementHandlers': specialElementHandlers
          },

          function (dispose) {
            // dispose: object with X, Y of the last line add to the PDF 
            //          this allow the insertion of new lines after html
            pdf.save(elemId + '.pdf');
          }, margins
        );
      })

      self.initSelectNoteMark();
    },

    downloadAllNotes: function () {
      var self = this;
      var data = {
        // pageNo: settings.pageNum
      }
      services.getAllNotes(data).done(function (response) {
        if (response.status == true) {
          var downloadData = response.data;
          var pdf = settings.pdfConf.pdfObj;
          var margins = settings.pdfConf.margins;
          var htm = '';
          var $el = $('<download-template></download-template>');
          downloadData.forEach(function (data, index) {
            htm += '<div class="dwnld-div">Book: ' + settings.pdfMetaData.title + '</div>';
            htm += '<div class="dwnld-note-pageno">Page no: ' + data.pageNo + '</div>';
            htm += '<div class="dwnld-note-title" style="width:200px;overflow:auto;">Note Title : ' + data.selectedText + '</div>';
            htm += '<div class="dwnld-note" style="width:200px;">Note : ' + data.title + '</div><br><br>';
          })
          $el.append(htm);
          var specialElementHandlers = {
            // element with id of "bypass" - jQuery style selector
            '#bypassme': function (element, renderer) {
              // true = "handled elsewhere, bypass text extraction"
              return true
            }
          };
          pdf.fromHTML(
            $el.html(), // HTML string or DOM elem ref.
            margins.left, // x coord
            margins.top, { // y coord
              'width': margins.width, // max width of content on PDF
              'elementHandlers': specialElementHandlers
            },

            function (dispose) {
              // dispose: object with X, Y of the last line add to the PDF 
              //          this allow the insertion of new lines after html
              pdf.save(settings.pdfMetaData.title + '.pdf');
            }, margins
          );
        }
      })
    },

    loadRelatedBooks: function () {
      var self = this;
      var data = {
        class: settings.pdfMetaData.class,
        subject: settings.pdfMetaData.subject,
        category: settings.pdfMetaData.category
      }
      services.getRelatedContents(data).done(function (response) {
        if (response.status == true) {
          var data = response.data;
          self.renderRelatedBooks(data)
        }
      })
    },

    renderRelatedBooks: function (data) {
      var $rltdBooksTemplate = $(settings.jsTemplates.relatedBooksTemplate).html();
      $(settings.sideBarTemplates.contentEbookTemplate).html('');
      $(settings.sideBarTemplates.contentVideoTemplate).html('');
      $.each(data, function (index, list) {
        var $el = $('<books-component></books-component>')
        $el.html($rltdBooksTemplate);
        var img = $el.find('.eBookimage');
        img.attr('src', '/api/media/get-poster/' + list.type + '?itemcode=' + list.itemCode)
        var bookName = $el.find('.bookName')
        bookName.html(list.title)
        bookName.attr('href', '/dashboard/mReader/' + list.itemCode)
        if (list.type == 'eBook') {
          $(settings.sideBarTemplates.contentEbookTemplate).append($el.html())
        } else {
          $(settings.sideBarTemplates.contentVideoTemplate).append($el.html())
        }
      })

      $(settings.eBooksBtn).on('click', function () {
        $(settings.sideBarTemplates.contentEbookTemplate).removeClass('hidden');
        $(settings.sideBarTemplates.contentVideoTemplate).addClass('hidden');
        $(this).removeClass('deactive-render').addClass('active-render')
        $(settings.videosBtn).removeClass('active-render').addClass('deactive-render')
        var children = $(settings.sideBarTemplates.contentEbookTemplate).children();
        if (children.length == 0) {
          $(settings.sideBarTemplates.contentVideoTemplate).html('<h4 style="color: #242321;"><center>No ebooks found</center></h4>')
        }
      })

      $(settings.videosBtn).on('click', function () {
        $(settings.sideBarTemplates.contentEbookTemplate).addClass('hidden');
        $(settings.sideBarTemplates.contentVideoTemplate).removeClass('hidden');
        $(this).removeClass('deactive-render').addClass('active-render')
        $(settings.eBooksBtn).removeClass('active-render').addClass('deactive-render')
        var children = $(settings.sideBarTemplates.contentVideoTemplate).children();
        if (children.length == 0) {
          $(settings.sideBarTemplates.contentVideoTemplate).html('<h4 style="color: #242321;"><center>No videos found</center></h4>')
        }
        // console.log(children.length)
      })
    },

    loadDictionary: function (word) {
      var self = this;
      $('.icon-container').removeClass('hidden');
      if (word != '') {
        services.searchInDictionary(word).done(function (response) {
          self.renderDictionarySearchResult(response.results, word);
        })
      }
    },

    renderDictionarySearchResult: function (result, word) {
      $(settings.sideBarTemplates.dictSearchResult).removeClass('hidden')
      if (typeof result !== 'undefined') {
        result = result[0] || []
        word = word || ''
        var $self = this;
        var dictionaryData = result.lexicalEntries;
        var meaning = dictionaryData[0];
        // var nounData = dictionaryData[1];
        // var verbData = dictionaryData[2];
        $('#dict-mean-description').html('');
        var origin = meaning['entries'][0].etymologies;
        var meaningSense = meaning['entries'][0].senses;
        var pronunciations = meaning.pronunciations[0] ;
        var audioIcon = $('#dict-audio');
        audioIcon.attr('src' , pronunciations.audioFile)
        var meaninExa = $self.getMeaningMeaning(meaningSense);
        $('#dict-mean-description').html(meaninExa);
        $('#dict-origin-description').html(origin);
        $('.search-word').html(word);
      } else {
        $('#dict-mean-description').html('Result not found...');
        $('#dict-origin-description').html('Origin not found...')
      }
      $('.icon-container').addClass('hidden');
    },


    getMeaningMeaning: function (meaningSense) {
      var meaningList = ''
      var examplesList = ''
      for (var key in meaningSense) {
        if (meaningSense.hasOwnProperty(key)) {
          var dictMean = meaningSense[key]
          for (var key1 in dictMean) {
            if (dictMean.hasOwnProperty(key1)) {
              // definitions
              if (key1 == 'definitions') {
                meaningList += '<strong> - ' + dictMean.definitions.join(',') + '</strong><br><br>'
              }

              if (key1 == 'examples') {
                for (var key2 in dictMean.examples) {
                  if (dictMean.examples.hasOwnProperty(key2)) {
                    examplesList += '<strong> Example: ' + dictMean.examples[key2].text + '</strong><br><br>'
                  }
                }
              }
            }
          }
        }
      }
      return meaningList + examplesList;
    },

    _fullScreenMode: function (elem) {
      elem = elem || document.documentElement;
      if (!document.fullscreenElement && !document.mozFullScreenElement &&
          !document.webkitFullscreenElement && !document.msFullscreenElement) {
          if (elem.requestFullscreen) {
              elem.requestFullscreen();
          } else if (elem.msRequestFullscreen) {
              elem.msRequestFullscreen();
          } else if (elem.mozRequestFullScreen) {
              elem.mozRequestFullScreen();
          } else if (elem.webkitRequestFullscreen) {
              elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
          }
      } else {
          if (document.exitFullscreen) {
              document.exitFullscreen();
          } else if (document.msExitFullscreen) {
              document.msExitFullscreen();
          } else if (document.mozCancelFullScreen) {
              document.mozCancelFullScreen();
          } else if (document.webkitExitFullscreen) {
              document.webkitExitFullscreen();
          }
      }
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



  var utterThis = '';
  var TTSTask = {
      // all things related to read the page
      readText: function (textToRead) {
        var self = this;
        
        
        // utterance.rate = 1;
        var PDFView = window.PDFViewerApplication
        var pdfPage = PDFView.pdfViewer.getPageView(0);        
        var ttx = pdfPage.textLayer.textContentItemsStr.map(function (s) { return s.toString().trim(); }).join(' ');
        // var utterance = new SpeechSynthesisUtterance(ttx);
        // utterance.lang = 'en-UK';
        // // utterance.text = ttx;
        // synth.speak(utterance);

        // utterance.onstart = function(event){
        //   console.log('start reading')     
        // }
        // utterance.onmark = function(event) {
        //   console.log('start mark')
        // }

        var speechUtteranceChunker = function (utt, settings, callback) {
            settings = settings || {};
            var newUtt;
            var txt = (settings && settings.offset !== undefined ? utt.text.substring(settings.offset) : utt.text);
            if (utt.voice && utt.voice.voiceURI === 'native') { // Not part of the spec
                newUtt = utt;
                newUtt.text = txt;
                newUtt.addEventListener('end', function () {
                    if (speechUtteranceChunker.cancel) {
                        speechUtteranceChunker.cancel = false;
                    }
                    if (callback !== undefined) {
                        callback();
                    }
                });
            }
            else {
                var chunkLength = (settings && settings.chunkLength) || 160;
                var pattRegex = new RegExp('^[\\s\\S]{' + Math.floor(chunkLength / 2) + ',' + chunkLength + '}[.!?,]{1}|^[\\s\\S]{1,' + chunkLength + '}$|^[\\s\\S]{1,' + chunkLength + '} ');
                var chunkArr = txt.match(pattRegex);
        
                if (chunkArr[0] === undefined || chunkArr[0].length <= 2) {
                    //call once all text has been spoken...
                    if (callback !== undefined) {
                        callback();
                    }
                    return;
                }
                var chunk = chunkArr[0];
                newUtt = new SpeechSynthesisUtterance(chunk);
                var x;
                for (x in utt) {
                    if (utt.hasOwnProperty(x) && x !== 'text') {
                        newUtt[x] = utt[x];
                    }
                }
                newUtt.addEventListener('end', function () {
                    if (speechUtteranceChunker.cancel) {
                        speechUtteranceChunker.cancel = false;
                        return;
                    }
                    settings.offset = settings.offset || 0;
                    settings.offset += chunk.length - 1;
                    speechUtteranceChunker(utt, settings, callback);
                });
          }
      
          if (settings.modifier) {
              settings.modifier(newUtt);
          }
          console.log(newUtt); //IMPORTANT!! Do not remove: Logging the object out fixes some onend firing issues.
          //placing the speak invocation inside a callback fixes ordering and onend issues.
          setTimeout(function () {
              speechSynthesis.speak(newUtt);
          }, 0);
        }


        //create an utterance as you normally would...
        var myLongText = `Although the phrase is nonsense, it does have a long history. 
        The phrase has been used for several centuries by typographers to show the most 
        distinctive features of their fonts. It is used because the letters involved and 
        the letter spacing in those combinations reveal, at their best, the weight, design, 
        and other important features of the typeface.
          A 1994 issue of "Before & After" magazine traces "Lorem ipsum ..." 
        to a jumbled Latin version of a passage from de Finibus Bonorum et Malorum, a 
        treatise on the theory of ethics written by Cicero in 45 B.C. The passage 
        "Lorem ipsum ..." is taken from text that reads, "Neque porro quisquam est qui 
        dolorem ipsum quia dolor sit amet, consectetur, adipisci velit ...," which translates as, 
        "There is no one who loves pain itself, who seeks after it and wants to have it, 
        simply because it is pain..."
          During the 1500s, a printer adapted Cicero's text to develop a page of type 
        samples. Since then, the Latin-like text has been the printing industry's standard 
        for fake, or dummy, text. Before electronic publishing, graphic designers had to 
        mock up layouts by drawing in squiggled lines to indicate text. The advent of 
        self-adhesive sheets preprinted with "Lorem ipsum" gave a more realistic way to 
        indicate where text would go on a page.`;

        var utterance = new SpeechSynthesisUtterance(ttx);

        //modify it as you normally would
        var voiceArr = speechSynthesis.getVoices();
        utterance.voice = voiceArr[2];

        //pass it into the chunking function to have it played out.
        //you can set the max number of characters by changing the chunkLength property below.
        //a callback function can also be added that will fire once the entire text has been spoken.
        speechUtteranceChunker(utterance, {
            chunkLength: 120
        }, function () {
            //some code to execute when done
            console.log('done');
        });

        // utterance.onboundary = function(event) {
        //   console.log('start boundary')
        // }

        // utterance.onpause = function(event) {
        //   console.log('pause reading')
        // }

        // utterance.onresume = function(event) {
        //   console.log('resume reading')
        // }

        // utterance.onend = function (event) {
        //     console.log('end reading')
        //     // console.log(event.utterance.text)
        // }

        // utterance.onerror = function (event) {
        //   console.log('error at here !');
        //   // return;
        // }
        return
        //default lanuage is US english, utterThis.lang = 'en-US';
        $.each(textToRead, function () {
            
            var $sentence = $(this);
            console.log($sentence.text())
            utterance.text = $sentence.text();
            utterance.voice = self._setBookLanguage(settings.pdfMetaData.language);
            utterance.volume = 1
            synth.speak(utterance);
            utterance.onend = function (event) {
                $sentence.addClass('spoken');
                $("#startReading").removeClass("fa-volume-off");
                $("#startReading").addClass("fa-volume-up");
            };
        })  
        
        
      },

      // Check if the device & and language support speech then only show the TTS Reader
      // Needs to be enhanced with support for other lang
      _setBookLanguage: function (eBookLang) {
          eBookLang = eBookLang.toLowerCase();
          switch (eBookLang) {
              case 'english':
                  eBookLang = 'en-US';
                  break;
              case 'hindi':
                  eBookLang = 'hi-IN';
                  break;
              default:
                  eBookLang = 'en-US';
          }
          var voices = [];
          voices = synth.getVoices();
          for (var i = 0; i < voices.length; i++) {
              if (voices[i].lang == eBookLang) {
                  return voices[i];
              }
          }
      },

      // Check if the device & and language support speech then only show the TTS Reader
      _checkSpeachSupport: function () {
          var self = this;
          utterThis = new SpeechSynthesisUtterance();
          if (utterThis !== undefined && utterThis !== null) {
              console.log('this is supporting')
          }
      }
  }

  TTSTask._checkSpeachSupport();



    // stop reading
    // $(document).on('click', '#playerStop', function (e) {
    //     e.preventDefault();
    //     if (synth.speaking) {
    //         synth.cancel();
    //         $("#playerRead").removeClass("pauseText");
    //         $("#playerRead").addClass("playText");
    //         $("#playerActions").removeClass("fa-volume-off");
    //         $("#playerActions").addClass("fa-volume-up");
    //     }
    //     return;
    // });

    // $(document).on('click', '.sound', function (e) {
    //     e.preventDefault();
    //     var url = $(this).attr('make-sound');
    //     var a = new Audio(url);
    //     a.play();
    // });



  // All Handlers written here
  // next page handler
  function increasePageHandler() {
    if (settings.pageNum >= settings.totalPages) {
      $(settings.templateItems.nextPageBtn).prop('disabled', true);
      return
    }
    $(settings.templateItems.prevPageBtn).prop('disabled', false);
    settings.pageNum += 1;
    Annotation.loadPage();
  }

  // previous page handler
  function dicreasePageHandler() {
    if (settings.pageNum <= 1) {
      $(settings.templateItems.prevPageBtn).prop('disabled', true);
      return
    }
    $(settings.templateItems.nextPageBtn).prop('disabled', false);
    settings.pageNum -= 1;
    Annotation.loadPage();
  }

  // input page handler
  function changePageHandler() {
    var pageno = parseInt($(this).val());
    if (pageno > settings.totalPages) {
      $(this).val(settings.pageNum);
      return;
    }
    settings.pageNum = pageno;
    Annotation.loadPage();
  }

  // GOTO first page
  function firstPageHandler() {
    $(settings.templateItems.prevPageBtn).prop('disabled', true);
    $(settings.templateItems.nextPageBtn).prop('disabled', false);
    settings.pageNum = 1;
    Annotation.loadPage();
  }

  // GOTO last page
  function lastPageHandler() {
    $(settings.templateItems.nextPageBtn).prop('disabled', true);
    $(settings.templateItems.prevPageBtn).prop('disabled', false);
    settings.pageNum = settings.totalPages;
    Annotation.loadPage();
  }

  // Color box handler
  function selectBgColor() {
    var color = $(this).data('color');
    settings.selectedColor = color;
    var oldColor = settings.annotationData.annotationRange.selectionColor;
    var newColor = color;
    if (newColor == oldColor) {
      return
    }
    $('.color-box').removeClass('color-focus');
    $(this).addClass('color-focus');
    settings.annotationData.annotationRange.selectionColor = color;
    var annotationElem = $(settings.annotationData.annotationRange.markElementName);
    annotationElem.removeClass().addClass('select-note mark-' + newColor);
  }


  // highlight bg color
  function highlightColor() {
    var color = $(this).data('color');
    settings.selectedColor = color;
  }


  // Load all bookmarks
  function loadAllBookMarks(itemCode) {
    $(settings.sideBarTemplates.bookmarks, settings.sideBarTemplates.bookmarkView).html('No bookmarks');
    var bookmarks = '';
    services.getBookmarks({
      itemCode: itemCode
    }).done(function (response) {
      if (response.status == true) {
        var data = response.data;
        $.each(data, function (index, list) {
          bookmarks += '<div class="bookmark-link"><div class="bookmark-btn" data-pageno="' + list.pageNo + '">page ' + list.pageNo + '</div><span class="delete-bookmark" data-pageno="' + list.pageNo + '"><i class="fa fa-times"></i></span></div>'
        })
        $(settings.sideBarTemplates.bookmarks, settings.sideBarTemplates.bookmarkView).html(bookmarks);
      } else {
        $(settings.sideBarTemplates.bookmarks, settings.sideBarTemplates.bookmarkView).html('No bookmarks');
      }

      $(settings.sideBarItems.bookmarkLink).unbind('click').on('click', settings.sideBarTemplates.deleteBookMark, function (e) {
        e.preventDefault()
        var self = $(this);
        var pageNo = $(this).data('pageno')
        var data = {
          itemCode: $(settings.itemCode).val(),
          pageNo: pageNo
        }
        services.removeBookMark(data).done(function (response) {
          if (response.status == true) {
            self.parent('div').remove();
          }
        })

      })
    })
  }

  function confirmLoadPage() {
    $('#read-confirmation').dialog("close");
    Annotation.loadPage()
  }


  window.onbeforeprint = function (e) {
    // location.href = '/dashboard/403';
    return false;
  };

  // Off Right click and the context menu
  document.oncontextmenu = function () { return false; };



})(window, jQuery);


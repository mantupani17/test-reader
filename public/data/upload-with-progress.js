var Upload = function (file) {
    this.file = file;
};

Upload.prototype.getType = function() {
    return this.file.type;
};
Upload.prototype.getSize = function() {
    return this.file.size;
};
Upload.prototype.getName = function() {
    return this.file.name;
};
Upload.prototype.doUpload = function () {
    var that = this;
    var formData = new FormData();

    // add assoc key values, this will be posts values
    formData.append("file", this.file, this.getName());
    formData.append("upload_file", true);

    $.ajax({
        type: "POST",
        url: "script",
        xhr: function () {
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
                myXhr.upload.addEventListener('progress', that.progressHandling, false);
            }
            return myXhr;
        },
        success: function (data) {
            // your callback here
        },
        error: function (error) {
        },
        async: true,
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        timeout: 60000
    }); 
}

Upload.prototype.progressHandling = function (event) {
    var percent = 0;
    var position = event.loaded || event.position;
    var total = event.total;
    var progress_bar_id = "#progress-wrp";
    if (event.lengthComputable) {
        percent = Math.ceil(position / total * 100);
    }
    // update progressbars classes so it fits your code
    $(progress_bar_id + " .progress-bar").css("width", +percent + "%");
    $(progress_bar_id + " .status").text(percent + "%");
};

//Change id to your id
$("#ingredient_file").on("change", function (e) {
    var file = $(this)[0].files[0];
    var upload = new Upload(file);

    // maby check size or type here with upload.getSize() and upload.getType()

    // execute upload
    upload.doUpload();
});

/* <div id="progress-wrp">
    <div class="progress-bar"></div>
    <div class="status">0%</div>
</div> */

// #progress-wrp {
//     border: 1px solid #0099CC;
//     padding: 1px;
//     position: relative;
//     height: 30px;
//     border-radius: 3px;
//     margin: 10px;
//     text-align: left;
//     background: #fff;
//     box-shadow: inset 1px 3px 6px rgba(0, 0, 0, 0.12);
//   }
  
//   #progress-wrp .progress-bar {
//     height: 100%;
//     border-radius: 3px;
//     background-color: #f39ac7;
//     width: 0;
//     box-shadow: inset 1px 1px 10px rgba(0, 0, 0, 0.11);
//   }
  
//   #progress-wrp .status {
//     top: 3px;
//     left: 50%;
//     position: absolute;
//     display: inline-block;
//     color: #000000;
//   }
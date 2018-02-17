var app = angular.module('trixDemo', ['angularTrix','ngRoute','ngSanitize']);

// defining SPA routes
app.config(['$routeProvider',function($routeProvider){
  $routeProvider
  .when('/',{
    templateUrl : 'partials/input.html',
    controller : 'trixController'
  })
  .when('/output', {
    templateUrl : 'partials/output.html',
    controller : 'outputController'

  });
}]);

// input controller
app.controller('trixController', function($scope, $timeout,$http) {

  $scope.trix = '';

// to save the data from Ctrl + s key
  $(window).bind('keydown', function(event) {
    if (event.ctrlKey || event.metaKey) {
        switch (String.fromCharCode(event.which).toLowerCase()) {
        case 's':
            event.preventDefault();
            document.getElementById('butcli').onclick();
            break;
          }
        }
      });

// word count
    $scope.$watch('trix', function(text) {
    if(!text) {
        $scope.wordCount = 0;
    }
    else {
        var matches = text.match(/[^\s\n\r]+/g);
        $scope.wordCount = matches ? matches.length : 0;
      }
    });

    var events = ['trixInitialize', 'trixChange', 'trixSelectionChange', 'trixFocus', 'trixBlur', 'trixFileAccept', 'trixAttachmentAdd', 'trixAttachmentRemove'];

    for (var i = 0; i < events.length; i++) {
        $scope[events[i]] = function(e) {
            console.info('Event type:', e.type);
        }
      };

    var createStorageKey, host, uploadAttachment;
// add button
     $scope.trixInitialize = function(e){
        var buttonHTML = '<span class="button_group text_tools"> <button type="button" id="butcli" class="save"  data-attribute="save" data-key="s" title="save" >Save</button> </span>';
        event.target.toolbarElement.
      	querySelector(".button_group.text_tools").
    		insertAdjacentHTML("beforebegin", buttonHTML);

// posting the content
      document.getElementById("butcli").onclick = function(){
        if($scope.trix != ''){
          var data = {
            content : $scope.trix
          };
          $http({
            method : 'POST',
            url : '/postContent',
            headers : { 'Content-Type' : 'application/json' },
            data : data
          });
          alert("content saved");
        }
        else {
          alert("No content to save");
        }
      }
  }

// attachment
      $scope.trixAttachmentAdd = function(e) {
        var attachment;
        attachment = e.attachment;
        if (attachment.file) {
            return uploadAttachment(attachment);
          }
        }
        host = "https://d13txem1unpe48.cloudfront.net/";
          uploadAttachment = function(attachment) {
          var file, form, key, xhr;
          file = attachment.file;
          key = createStorageKey(file);
          form = new FormData;
          form.append("key", key);
          form.append("Content-Type", file.type);
          form.append("file", file);
          xhr = new XMLHttpRequest;
          xhr.open("POST", host, true);
          xhr.upload.onprogress = function(event) {
              var progress;
              progress = event.loaded / event.total * 100;
              return attachment.setUploadProgress(progress);
            };
            xhr.onload = function() {
              var href, url;
              if (xhr.status === 204) {
                  url = href = host + key;
                  return attachment.setAttributes({
                      url: url,
                      href: href
                    });
                  }
                };
                return xhr.send(form);
              };
          createStorageKey = function(file) {
            var date, day, time;
            date = new Date();
            day = date.toISOString().slice(0, 10);
            time = date.getTime();
            return "tmp/" + day + "/" + time + "-" + file.name;
          };
        });

// output controller
app.controller('outputController', function($scope,$http){
  $http.get('/getContent').success(function(response){
    console.log(response);
    $scope.editorContent = response;
  });
});

"use strict";

/**
 *  Service para definição de campos multivalorados e concatenação de campos com labelFunction.
 */
angular.module("appServices", [])

  .service('SocketService', ['$http', function ($http) {
        var client;
        this.connect = function connect() {
            client = io.connect('https://localhost:3000');
            return client;
        };

        this.disconnect = function disconnect() {
            if (client) {
                client.disconnect();
            }
        };
    }]).service('ComponentsServices', [function () {

        this.SelectionManager = function SelectionManager(elementSelector,btnSelector){
            var self = this;
            self.btn = btnSelector;
            self.element = elementSelector;
            self.selectedList = [];
            self.isDeleteMode = false;
            self.isEditMode = false;
            var danger = 'alert-danger';
            var warn = 'alert-warning';
            var btnAccent = 'md-accent';
            var btnWarn = 'md-warn';

            self.clear = function clear() {
                var component = $('.' + self.element);
                component.removeClass(danger);
                component.removeClass(warn);
                self.selectedList = [];
                self.resetStatus();
            };

            self.resetStatus = function resetStatus(){
                if($('.' + danger).length <= 0){
                    $('.' + self.btn + ' ng-md-icon').removeClass("rotate135").addClass("reset");
                    $('.' + self.btn).removeClass(btnWarn).addClass(btnAccent);
                    self.isDeleteMode = false;
                }else{
                    self.isDeleteMode = true;
                }

                if($('.' + warn).length <= 0){
                    self.isEditMode = false;
                }else{
                    self.isEditMode = true;
                }
            };

            self.select = function (model, event) {
                var target = $(event.$$element).children();

                if (target.hasClass(danger)) {
                    target.removeClass(danger);

                    var x;
                    for (x in self.selectedList) {
                        if(self.selectedList[x]._id == model._id){
                            delete self.selectedList[x];
                        }
                    }
                    self.resetStatus();
                } else {
                    target.addClass(danger);
                    self.selectedList.push(model);
                    $('.' + self.btn + ' ng-md-icon').addClass("rotate135");
                    $('.' + self.btn).removeClass(btnAccent).addClass(btnWarn);
                    self.isDeleteMode = true;
                }

                $('.' + self.element).removeClass(warn);
            };

            self.edit = function (model, event) {
                var target = $(event.currentTarget).children();

                if (target.hasClass(warn)) {
                    self.isEditMode = false;
                    return target.removeClass(warn);
                } else {
                    $('.' + self.element).removeClass(warn);
                    target.addClass(warn);
                    $('.' + self.element).removeClass(danger);
                    self.isEditMode = true;
                }

                $('.' + self.element).removeClass(danger);
                self.resetStatus();

                self.selectedList = [];
            };

            self.getSelectedList = function(){
                return self.selectedList;
            };

            self.getIsDeleteMode = function(){
                return self.isDeleteMode;
            };

            self.getIsEditMode = function(){
                return self.isEditMode;
            };
        }


    }]).service('UploadService', ['$timeout','$upload', function ($timeout,$upload) {
        var self = this;

        self.uploadRightAway = false;
        self.modalUrl = '';
        self.completed = false;

        self.changeAngularVersion = function () {
            window.location.hash = self.angularVersion;
            window.location.reload(true);
        };
        self.hasUploader = function (index) {
            return self.upload[index] != null;
        };
        self.abort = function (index) {
            self.upload[index].abort();
            self.upload[index] = null;
        };

        self.angularVersion = window.location.hash.length > 1 ? window.location.hash.substring(1) : '1.4.7';
        self.onFileSelect = function ($files) {
            self.selectedFiles = [];
            self.progress = [];
            if (self.upload && self.upload.length > 0) {
                for (var i = 0; i < self.upload.length; i++) {
                    if (self.upload[i] != null) {
                        self.upload[i].abort();
                    }
                }
            }
            self.upload = [];
            self.uploadResult = [];
            self.selectedFiles = $files;
            self.dataUrls = [];
            self.setPreview = setPreview;

            function setPreview(fileReader, index) {
                fileReader.onload = function (e) {
                    $timeout(function () {
                        self.dataUrls[index] = e.target.result;
                    });
                }
            }

            for (var i = 0; i < $files.length; i++) {
                var $file = $files[i];
                if (window.FileReader && $file.type.indexOf('image') > -1) {
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL($files[i]);
                    self.setPreview(fileReader, i);
                }
                self.progress[i] = -1;
                if (self.uploadRightAway) {
                    self.start(i);
                }
            }
        };

        self.start = function (index,produtoId,url) {

            self.progress[index] = 0;
            self.upload[index] = $upload.upload({
                url: url,
                //headers: {'Authorization': 'xxx'},
                data: {
                    productId: produtoId,
                    slideshow: false,
                    principal: false
                },
                file: self.selectedFiles[index],
                fileFormDataName: 'myFile'
            }).then(function (response) {
                self.item=response.data;
                self.uploadResult.push(response.data.result);
                self.completed = true;
                return true;

            }, null, function (evt) {
                self.progress[index] = parseInt(100.0 * evt.loaded / evt.total);
                self.completed = false;
                return false;
            });
        };


    }]);

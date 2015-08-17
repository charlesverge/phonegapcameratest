/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        app.setupcamera();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    setupcamera: function () {
        var cameraElement = document.getElementById('camera');
        cameraElement.onclick = app.capture;
        cameraElement = document.getElementById('select');
        cameraElement.onclick = app.select;
    },
    capture: function () {
        var settings = {
            quality: 80,
            destinationType: Camera.PictureSourceType.FILE_URI,
            //destinationType : destinationType.NATIVE_URI,
            allowEdit: false, // this turns on / off cropping
            saveToPhotoAlbum: true,
            correctOrientation: false,
            encodingType: navigator.camera.EncodingType.JPEG,
            cameraDirection: Camera.Direction.BACK,
            targetWidth: 1280,
            targetHeight: 800
        };
        navigator.camera.getPicture(app.camerasuccess, app.camerafail, settings);
    },
    select: function () {
        var settings = {
            quality: 90,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
            correctOrientation : false,
        };
        navigator.camera.getPicture(app.camerasuccess, app.camerafail, settings);
    },
    camerasuccess: function (imageURI) {
        if (device.platform == 'ios') {
            app.camerasuccessios(imageURI);
        } else if (device.platform == 'Android') {
            app.camerasuccessandroid(imageURI);
        } else {
            console.log('No success call back for platform ' + device.platform + ' using ios callback');
            app.camerasuccessios(imageURI);
        }
    },
    camerasuccessios: function (imageURI) {
        console.log("camerasuccessios: imageURI: " + imageURI);
        var imageElement = document.getElementById('image');
        imageElement.innerHTML = '<img src="' + imageURI + '">';
    },
    camerasuccessandroid: function (imageURI) {
        console.log("camerasuccessandroid: imageURI: " + imageURI);
        var imageElement = document.getElementById('image');
        imageElement.innerHTML = '<img src="' + imageURI + '">';
    },
};

/**
 * Recursively dump an object.
 * @param mixed err Object or scalar to return as a string.
 * @returns sring Formatted string respentation of the object.
 */
function dumpvar(err, depth) {
    "use strict";
    var vDebug = "",
        prop;
    // Prevent infinite loops.
    if (typeof depth == 'undefined') {
        depth = 3;
    }
    var prefix = '';
    if (depth !== 3) {
        vDebug += "\n";
        for (var i = 0; i < (3 - depth); i++) {
            prefix += "    ";
        }
    }
    if (typeof err === "string") {
        return err;
    }
    for (prop in err) {
        if (err.hasOwnProperty(prop)) {
            vDebug += prefix + "property: " + prop + " value: [ " + (is_array(err[prop]) || typeof err[prop] == 'object' && !is_empty(err[prop]) ? dumpvar(err[prop], depth - 1) : err[prop]) + "]\n";
        }
    }
    if (depth !== 3) {
        return vDebug;
    }
    if (typeof err !== "undefined" && err !== null) {
        vDebug += "toString(): " + " value: [" + err.toString() + "]";
    } else {
        if (typeof err === "undefined") {
            vDebug += "toString(): " + " value: undefined";
        } else {
            vDebug += "toString(): " + " value: null";
        }
    }
    return vDebug;
}

/**
 * Check is object is an array.
 * @return boolean True on is an array.
 */
function is_array(o) {
    'use strict';
    if (o !== null && typeof o === 'object') {
        return (typeof o.push === 'undefined') ? false : true;
    } else {
        return false;
    }
}

/**
 * Check is object is empty.
 * @return boolean True on empty object.
 */
function is_empty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            return false;
        }
    }
    return true;
}
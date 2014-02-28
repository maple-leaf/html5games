/*
 * rubikt.js
 * Copyright (C) 2014  <@TJF-PC>
 *
 * Distributed under terms of the MIT license.
 */

(function($, TWEEN){
    var point, direction, group, rotation, animation_queue;
    animation_queue = [];
    point = {
        startEle: '',
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0
    };
    rotation = {
        toLeft: function(group){
            clockwise(group);
            animate();
        },
        toRight: function(group) {
            clockwise(group, true);
            animate();
        },
        toTop: function(group) {
            clockwise(group, false, true);
            animate();
        },
        toBottom: function(group) {
            clockwise(group, true, true);
            animate();
        },
        toFront: function(group) {
            clockwise(group, false, true, true);
            animate();
        },
        toBack: function(group) {
            clockwise(group, true, true, true);
            animate();
        }
    }

    function clockwise(group, reverse, vert, frontBack) {
        /*
         * TODO:
         *      FIXME: there's some strange gap between each faces when rotating, can be fixed by slightly change translatex or translatey.
         *      FEATURE: rotating whole rubik's cube using right button of mouse
         */
        var faces;
        /*
         *if(typeof reverse === "undefined" || reverse === null){
         *    reverse = false;
         *}
         */
        faces = {
            'front': {
                'ele': [
                    group==='middle'?(frontBack?'ftc':'fcr'):(group==='bottom'?(frontBack?'ftl':'fbr'):'ftr'),
                    group==='middle'?'fcc':(group==='bottom'?(frontBack?'fcl':'fbc'):(frontBack?'fcr':'ftc')),
                    group==='middle'?(frontBack?'fbc':'fcl'):(group==='bottom'?'fbl':(frontBack?'fbr':'ftl'))
                ],
                /* reverse? front->right: left->front */
                'original': {
                    rotateX: 0,
                    rotateY: 0,
                    translateX: frontBack?(group==='middle'?100:(group==='bottom'?0:200)):200,
                    translateY: frontBack?0:(group==='middle'?100:(group==='bottom'?200:0)),
                    translateZ: reverse?50:0,
                },
                'target': {
                    rotateX: frontBack?(reverse?90:-90):0,
                    rotateY: frontBack?0:(reverse?90:-90),
                    translateX: frontBack?(group==='middle'?100:(group==='bottom'?0:200)):(reverse?250:-50),
                    translateY: frontBack?(reverse?-250:50):(group==='middle'?100:(group==='bottom'?200:0)),
                    translateZ: reverse?(frontBack?50:250):(frontBack?250:50),
                },
                'space': frontBack?100:-100
            },
            'back': {
                'ele': [
                    group==='middle'?(frontBack?'bbc':'bcl'):(group==='bottom'?(frontBack?'bbl':'bbl'):(frontBack?'bbr':'btl')),
                    group==='middle'?(frontBack?'bcc':'bcc'):(group==='bottom'?(frontBack?'bcl':'bbc'):(frontBack?'bcr':'btc')),
                    group==='middle'?(frontBack?'btc':'bcr'):(group==='bottom'?(frontBack?'btl':'bbr'):(frontBack?'btr':'btr'))
                ],
                /* reverse? front->right: left->front */
                'original': {
                    rotateX: 0,
                    rotateY: 0,
                    translateX: frontBack?(group==='middle'?100:(group==='bottom'?0:200)):0,
                    translateY: frontBack?(reverse?150:50):(group==='middle'?100:(group==='bottom'?200:0)),
                    translateZ: frontBack?-300:-250,
                },
                'target': {
                    rotateX: frontBack?(reverse?90:-90):0,
                    rotateY: frontBack?0:(reverse?90:-90),
                    translateX: frontBack?(group==='middle'?100:(group==='bottom'?0:200)):(reverse?50:-250),
                    translateY: frontBack?(reverse?-50:50):(group==='middle'?100:(group==='bottom'?200:0)),
                    translateZ: reverse?(frontBack?-250:-50):(frontBack?-50:-250),
                },
                'space': frontBack&&reverse?-100:100
            },
            'left': {
                'ele': [
                    group==='middle'?(vert?'lcr':'ltc'):(group==='bottom'?(vert?'ltr':'ltr'):(vert?'lbr':'ltl')),
                    group==='middle'?(vert?'lcc':'lcc'):(group==='bottom'?(vert?'ltc':'lcr'):(vert?'lbc':'lcl')),
                    group==='middle'?(vert?'lcl':'lbc'):(group==='bottom'?(vert?'ltl':'lbr'):(vert?'lbl':'lbl'))
                ],
                'original': {
                    rotateX: vert?-90:0,
                    rotateY: 90,
                    translateX: reverse?0:(vert?25:50), /* need to change start value here, strange?? */
                    translateY: group==='middle'?(vert?150:100):(group==='bottom'?(vert?50:200):(vert?250:0)),
                    translateZ: -50,
                },
                'target': {
                    rotateX: vert?-90:0,
                    rotateY: reverse?180:0,
                    translateX: reverse?(vert?0:-200):(vert?200:0),
                    translateY: group==='middle'?(vert?150:100):(group==='bottom'?(vert?50:200):(vert?250:0)),
                    translateZ: -50,
                    translateZ: reverse?(vert?-250:0):(vert?-50:-300),
                },
                'space': vert?-100:100
            },
            'right': {
                'ele': [
                    group==='middle'?(vert?'rcl':'rbc'):(group==='bottom'?(vert?'rtl':'rbr'):(vert?'rbl':'rbl')),
                    group==='middle'?(vert?'rcc':'rcc'):(group==='bottom'?(vert?'rtc':'rcr'):(vert?'rbc':'rcl')),
                    group==='middle'?(vert?'rcr':'rtc'):(group==='bottom'?(vert?'rtr':'rtr'):(vert?'rbr':'rtl'))
                ],
                'original': {
                    rotateX: vert?90:0,
                    rotateY: -90,
                    translateX: vert?0:-250,
                    translateY: group==='middle'?(vert?-150:100):(group==='bottom'?(vert?-50:200):(vert?-250:0)),
                    translateZ: -250,
                },
                'target': {
                    rotateX: vert?90:0,
                    rotateY: reverse?(vert?-180:0):(vert?0:-180),
                    translateX: reverse?(vert?0:0):(vert?200:-200),
                    translateY: group==='middle'?(vert?-150:100):(group==='bottom'?(vert?-50:200):(vert?-250:0)),
                    translateZ: reverse?(vert?-50:-300):(vert?-250:0),
                },
                'space': vert?-100:100
            },
            'up': {
                'ele': [
                    group==='middle'?(frontBack?'ubc':'ucl'):(group==='bottom'?(frontBack?'ubl':'utl'):(frontBack?'ubr':'ubl')),
                    group==='middle'?'ucc':(group==='bottom'?(frontBack?'ucl':'utc'):(frontBack?'ucr':'ubc')),
                    group==='middle'?(frontBack?'utc':'ucr'):(group==='bottom'?(frontBack?'utl':'utr'):(frontBack?'utr':'ubr'))
                ],
                'original': {
                    rotateX: -90,
                    rotateY: 0,
                    translateX: frontBack?(group==='middle'?150:(group==='bottom'?50:250)):0,
                    translateY: frontBack?250:(group==='middle'?150:(group==='bottom'?50:250)),
                    translateZ: -50,
                },
                'target': {
                    rotateX: frontBack?(reverse?0:-180):-90,
                    rotateY: frontBack?0:(reverse?90:-90),
                    translateX: frontBack?(group==='middle'?100:(group==='bottom'?0:200)):(reverse?-200:0),
                    translateY: frontBack?(reverse?200:0):(group==='middle'?150:(group==='bottom'?50:250)),
                    translateZ: frontBack?(reverse?-300:0):(reverse?-50:-250),
                },
                'space': frontBack?-100:100
            },
            'down': {
                'ele': [
                    group==='middle'?(frontBack?'dtc':'dcr'):(group==='bottom'?(frontBack?'dtl':'dtr'):(frontBack?'dtr':'dbr')),
                    group==='middle'?'dcc':(group==='bottom'?(frontBack?'dcl':'dtc'):(frontBack?'dcr':'dbc')),
                    group==='middle'?(frontBack?'dbc':'dcl'):(group==='bottom'?(frontBack?'dbl':'dtl'):(frontBack?'dbr':'dbl'))
                ],
                'original': {
                    rotateX: 90,
                    rotateY: 0,
                    translateX: frontBack?(group==='middle'?100:(group==='bottom'?0:200)):(reverse?0:50), /* change this from 200 to make start position right */
                    translateY: frontBack?-250:(group==='middle'?-150:(group==='bottom'?-50:-250)),
                    translateZ: -250,
                },
                'target': {
                    rotateX: frontBack?(reverse?180:0):90,
                    rotateY: frontBack?(reverse?-200:0):(reverse?-90:90),
                    translateX: frontBack?(group==='middle'?100:(group==='bottom'?0:200)):(reverse?-200:0),
                    translateY: frontBack?(reverse?-200:0):(group==='middle'?-150:(group==='bottom'?-50:-250)),
                    translateZ: reverse?(frontBack?0:-250):(frontBack?-300:-50),
                },
                'space': 100
            }
        };
        if(vert && frontBack){
            ['front', 'down', 'back', 'up'].forEach(function(face){
                new TWEEN.Tween(faces[face].original)
                .to(faces[face].target, 500 )
                .onUpdate( function () {
                    var ele, transform, i, animation_done, rubik, shift;
                    for(i = 0; i < faces[face].ele.length; i++){
                        ele = document.getElementById(faces[face].ele[i]);
                        transform = 'rotateX(' + this.rotateX + 'deg)' + ' translate3d(' + this.translateX + 'px,'+ (this.translateY + i * faces[face].space) + 'px,' + this.translateZ + 'px)';
                        if(typeof ele.style.webkitTransform !== "undefined"){
                            ele.style.webkitTransform = transform;
                        }else if(typeof ele.style.MozTransform !== "undefined"){
                            ele.style.MozTransform = transform;
                        }
                        // push style queue here to detect if all complete
                        animation_done = this.rotateX === faces[face].target.rotateX;
                        if(animation_done && animation_queue.indexOf(faces[face].ele[i]) === -1){
                            animation_queue.push(faces[face].ele[i]);
                        }
                    }

                })
                .onComplete(function(){
                    var original_faces, target_face, ele;
                    original_faces = ['front', 'down', 'back', 'up'];
                    if(animation_queue.length === 12){
                        // all animation completed
                        original_faces.forEach(function(face){
                            if(face === 'front'){
                                target_face = original_faces[reverse?3:1];
                            }else if(face === 'down'){
                                target_face = original_faces[reverse?0:2];
                            }else if(face === 'back'){
                                target_face = original_faces[reverse?1:3];
                            }else{
                                target_face = original_faces[reverse?2:0];
                            }
                            for(i = 0; i < faces[face].ele.length; i++){
                                ele = document.getElementById(faces[face].ele[i]);
                                ele.setAttribute('style', '');
                                ele.id = 'tmp-' + faces[target_face].ele[i];
                            }
                        });
                        $('div[id^="tmp-"]').each(function(i, ele){
                            ele.id = ele.id.substring(ele.id.lastIndexOf('-')+1);
                        })
                        animation_queue = [];
                    }
                })
                .start();
            });
        }else if(vert){
            ['down', 'left', 'up', 'right'].forEach(function(face){
                new TWEEN.Tween(faces[face].original)
                .to(faces[face].target, 500 )
                .onUpdate( function () {
                    for(var i = 0; i < faces[face].ele.length; i++){
                        var ele, transform, animation_done;
                        ele = document.getElementById(faces[face].ele[i]);
                        transform = 'rotateX('+ this.rotateX + 'deg) '+'rotateY(' + this.rotateY + 'deg) ' + 'translate3d(' + (this.translateX + i * faces[face].space) + 'px,'+ this.translateY + 'px,' + this.translateZ + 'px)';
                        if(typeof ele.style.webkitTransform !== "undefined"){
                            ele.style.webkitTransform = transform;
                        }else if(typeof ele.style.MozTransform !== "undefined"){
                            ele.style.MozTransform = transform;
                        }
                        // push style queue here to detect if all complete
                        animation_done = this.rotateY === faces[face].target.rotateY;
                        if(animation_done && animation_queue.indexOf(faces[face].ele[i]) === -1){
                            animation_queue.push(faces[face].ele[i]);
                        }
                    }

                })
                .onComplete(function(){
                    var original_faces, target_face, ele;
                    original_faces = ['up', 'right', 'down', 'left'];
                    if(animation_queue.length === 12){
                        // all animation completed
                        original_faces.forEach(function(face){
                            if(face === 'up'){
                                target_face = original_faces[reverse?3:1];
                            }else if(face === 'right'){
                                target_face = original_faces[reverse?0:2];
                            }else if(face === 'down'){
                                target_face = original_faces[reverse?1:3];
                            }else{
                                target_face = original_faces[reverse?2:0];
                            }
                            for(i = 0; i < faces[face].ele.length; i++){
                                ele = document.getElementById(faces[face].ele[i]);
                                ele.removeAttribute('style');
                                ele.id = 'tmp-' + faces[target_face].ele[i];
                            }
                        });
                        $('div[id^="tmp-"]').each(function(i, ele){
                            ele.id = ele.id.substring(ele.id.lastIndexOf('-')+1);
                        })
                        animation_queue = [];
                    }
                })
                .start();
            });
        }else{
            ['front', 'left', 'back', 'right'].forEach(function(face){
                new TWEEN.Tween(faces[face].original)
                .to(faces[face].target, 500 )
                .onUpdate( function () {
                    for(var i = 0; i < faces[face].ele.length; i++){
                        var ele, transform, animation_done;
                        ele = document.getElementById(faces[face].ele[i]);
                        transform = 'rotateY(' + this.rotateY + 'deg)' + ' translate3d(' + (this.translateX + i * faces[face].space) + 'px,'+ this.translateY + 'px,' + this.translateZ + 'px)';
                        if(typeof ele.style.webkitTransform !== "undefined"){
                            ele.style.webkitTransform = transform;
                        }else if(typeof ele.style.MozTransform !== "undefined"){
                            ele.style.MozTransform = transform;
                        }
                        animation_done = this.rotateY === faces[face].target.rotateY;
                        if(animation_done && animation_queue.indexOf(faces[face].ele[i]) === -1){
                            animation_queue.push(faces[face].ele[i]);
                        }
                    }

                })
                .onComplete(function(){
                    var original_faces, target_face, ele;
                    original_faces = ['front', 'right', 'back', 'left'];
                    if(animation_queue.length === 12){
                        // all animation completed
                        original_faces.forEach(function(face){
                            if(face === 'front'){
                                target_face = original_faces[!reverse?3:1];
                            }else if(face === 'right'){
                                target_face = original_faces[!reverse?0:2];
                            }else if(face === 'back'){
                                target_face = original_faces[!reverse?1:3];
                            }else{
                                target_face = original_faces[!reverse?2:0];
                            }
                            for(i = 0; i < faces[face].ele.length; i++){
                                ele = document.getElementById(faces[face].ele[i]);
                                ele.removeAttribute('style');
                                ele.id = 'tmp-' + faces[target_face].ele[i];
                            }
                        });
                        $('div[id^="tmp-"]').each(function(i, ele){
                            ele.id = ele.id.substring(ele.id.lastIndexOf('-')+1);
                        })
                        animation_queue = [];
                    }
                })
                .start();
            });
        }
    }
    function animate() {

        requestAnimationFrame( animate );
        TWEEN.update();

    }

    /*
     * group: split rubikt's cube horizontal to three group:
     *          top, middle, bottom
     */
    function rotate(group, direction) {
        switch (direction) {
            case 'left':
                rotation.toLeft(group);
                break;
            case 'right':
                rotation.toRight(group);
                break;
            case 'up':
                rotation.toTop(group);
                break;
            case 'down':
                rotation.toBottom(group);
                break;
            case 'front':
                rotation.toFront(group);
                break;
            case 'back':
                rotation.toBack(group);
                break;
            default:
                console.log('direction error');
        }
    }

    $('#rubik').mousedown(function(e){
        if(e.button === 0) {
            // mouse left click
            point.startEle = e.target.id;
            point.startX = e.pageX;
            point.startY = e.pageY;
        }
    }).mouseup(function(e){
        if(e.button === 2) return;
        var target, mouse_direction, distanceX, distanceY, ratioXY;
        distanceX = e.pageX - point.startX;
        distanceY = e.pageY - point.startY;
        if(distanceY === 0){
            e.pageY > 0 ?distanceY = 0.1 : distanceY = -0.1;
        }
        ratioXY = distanceX / distanceY;

        if(ratioXY > -0.01 && ratioXY < 0.01){
            // too small , ignore
            return;
        }
        if(point.startEle.indexOf('f') === 0){
            // front face
            // value here used to compare is not the exact limit number, same below
            if(ratioXY < -1 || ratioXY > 1){
                distanceX > 0 ? direction = 'right' : direction = 'left';
            }else if(ratioXY > -1 && ratioXY < 1) {
                distanceY > 0 ? direction = 'front' : direction = 'back';
            }
            if(direction === 'front' || direction === 'back'){
                if(point.startEle.indexOf('l') === 2){
                    group = 'bottom';
                }else if(point.startEle.indexOf('r') === 2){
                    group = 'top';
                }else {
                    group = 'middle';
                }
            }else{
                if(point.startEle.indexOf('t') === 1){
                    group = 'top';
                }else if(point.startEle.indexOf('b') === 1){
                    group = 'bottom';
                }else {
                    group = 'middle';
                }
            }
        }else if(point.startEle.indexOf('l') === 0){
            // left face
            if(ratioXY < 0.4 && ratioXY > -0.6){
                direction = distanceY > 0 ? 'down' : 'up';
            }else {
                direction = distanceX > 0 ? 'right' : 'left';
            }
            console.log(point.startEle)
            if(direction === 'left' || direction === 'right'){
                if(point.startEle.lastIndexOf('r') === 2){
                    group = 'bottom';
                }else if(point.startEle.lastIndexOf('l') === 2){
                    group = 'top';
                }else {
                    group = 'middle';
                }
            }else{
                if(point.startEle.indexOf('t') === 1){
                    group = 'bottom';
                }else if(point.startEle.indexOf('b') === 1){
                    group = 'top';
                }else {
                    group = 'middle';
                }
            }
        }else if(point.startEle.indexOf('u') === 0){
            // up face
            if(ratioXY > 6 || ratioXY < -2){
                direction = distanceX > 0? 'up' : 'down';
            }else{
                direction = distanceY > 0 ? 'front' : 'back';
            }
            if(direction === 'down' || direction === 'up'){
                if(point.startEle.indexOf('t') === 1){
                    group = 'bottom';
                }else if(point.startEle.indexOf('b') === 1){
                    group = 'top';
                }else {
                    group = 'middle';
                }
            }else{
                if(point.startEle.indexOf('l') === 2){
                    group = 'bottom';
                }else if(point.startEle.indexOf('r') === 2){
                    group = 'top';
                }else {
                    group = 'middle';
                }
            }
        }else{
            return;
        }
        rotate(group, direction);
    });
}(jQuery, TWEEN))


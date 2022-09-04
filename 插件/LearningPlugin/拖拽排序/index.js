/**
 * Drag 鎷栧姩
 *
 */
 ;
 // 璁板綍鍏冪礌瀹氫綅淇℃伅
 var locate_info = [];
 (function($, window, document, undefined) {
     'use strict';
     // 榛樿鍙傛暟
     var Data = {
         defaults: {
             class: '', // 鍞竴
             spacing: '10', // 闂磋窛
             revert: 'index', // 杩斿洖绫诲瀷 id index
             range: true, // 鏄惁鍏佽鎷栧姩瓒呭嚭鍖哄煙
         }
     };
     // 鎻掍欢寮曟搸
     var Engine = {
         // 鑾峰彇灞炴€ц缃�
         getAttrSettings: function($original) {
             let defaults = Data.defaults;
             var attrData = {};
             $.each(defaults, (key, val) => {
                 if ($original.is('[data-' + key + ']')) {
                     var elAttr = $original.attr('data-' + key);
                     if (elAttr === 'true' || elAttr === 'false') { elAttr = elAttr === 'true'; }
                     if (elAttr === "") { elAttr = defaults[key]; }
                     attrData[key] = elAttr;
                 }
             })
             return attrData;
         },
         // 鍒濆鍖�
         initialize: function($original, userSettings) {
             let self = this,
                 settings = $.extend(true, {}, userSettings),
                 attrSettings = self.getAttrSettings($original);
             settings = $.extend(settings, attrSettings);
             Build.build($original, settings);
 
             // 浜嬩欢鏂规硶
             Binds.bind($original, locate_info, settings)
             return $original
         },
         // 妫€鏌ョ洰鏍�
         controlTarget: function($target, controls) {
             // 鍒濆鍖栨椂鏄惁鏄痙rag
             if ($.inArray('isDrag', controls) !== -1 && !$target.hasClass('drag')) {
                 console.error('Drag | initialization failed锛孖nvalid input element');
                 console.log($target[0]);
                 return false;
             }
             // 鏄惁鍞竴
             if ($.inArray('isSingle', controls) !== -1 && $target.length > 1) {
                 console.error('Drag | Can only be called on a single element');
                 console.log($target[0]);
                 return false;
             }
             // 鍒濆鍖栨椂鏄惁鍖呭惈鎷栧姩鍏冪礌
             if ($.inArray('drag_elemt', controls) !== -1 && $target.children().length < 1) {
                 console.error('Drag | No "drag_item" drag element');
                 console.log($target[0]);
                 return false;
             }
             return true;
         },
         // 妫€鏌alues
         controlValues: function($target, values) {
             if (!(values instanceof Object)) {
                 console.error('values parameter is not a valid Object');
                 console.log($target[0]);
                 console.log(values);
                 return false;
             }
             return true;
         },
         del: function($original, valObjs) {
             let self = this,
                 aLi = $original.children(),
                 spacing = parseInt($original.data('spacing')), // 杈硅窛
                 column = Math.floor($original.width() / (aLi.outerWidth() + spacing * 2)), // 鎬诲垪鏁�
                 aLi_height = aLi.outerHeight() + spacing * 2, // 鎷栧姩鍏冪礌楂樺害
                 aLi_width = aLi.outerWidth() + spacing * 2, // 鎷栧姩鍏冪礌瀹藉害
                 rows = Math.ceil(aLi.length / column); // 鎬昏鏁�
             aLi.each(function(index, el) {
                 let t = $(this);
                 if (t.attr('index') > valObjs.index) {
                     let idx = t.attr('index'),
                         t_row = Math.ceil(idx / column - 1),
                         t_col = idx % column == 0 ? column - 1 : idx % column - 1,
                         left = t_col * aLi_width + spacing,
                         top = t_row * aLi_height + spacing;
                     t.attr('index', idx - 1);
                     t.css({
                         left: left + 'px',
                         top: top + 'px',
                         margin: '0px',
                         position: 'absolute'
                     })
                 } else {
                     t.css({
                         margin: '0px',
                         position: 'absolute'
                     })
                 }
             });
             // 鐖剁骇鐨勯珮搴�
             $original.css('height', aLi_height * rows + 'px')
         },
         set: function($original, valObjs) {
             let self = this,
                 oUl = document.querySelector("." + $original.data('class')),
                 aLi = oUl.querySelectorAll(".drag_item"),
                 obj, oNear;
             for (var i = 0; i < aLi.length; i++) {
                 if (aLi[i].getAttribute("index") == valObjs.start) {
                     obj = aLi[i];
                 }
                 if (aLi[i].getAttribute("index") == valObjs.end) {
                     oNear = aLi[i];
                 }
             }
             clearInterval(oNear.timer);
             clearInterval(obj.timer);
             Binds.startMove(oNear, locate_info[valObjs.start]);
             Binds.startMove(obj, locate_info[valObjs.end]);
             // 杩斿洖褰撳墠鍒囨崲
             if ($original.data('revert') === 'id') {
                 $(document).trigger('drag:' + $original.data('class'), [$(obj).data('id'), $(oNear).data('id')]);
             }
             if ($original.data('revert') === 'index') {
                 $(document).trigger('drag:' + $original.data('class'), [valObjs.start, valObjs.end]);
             }
             //浜ゆ崲index
             obj.setAttribute("index", valObjs.end);
             oNear.setAttribute("index", valObjs.start);
         },
         reset: function($original) {
             $original.children().css({
                 position: 'static',
                 margin: $original.data('spacing') + 'px'
             });
         }
     }
     var Build = {
         build: function($original, settings) {
             let self = this,
                 oUl = document.querySelector("." + $original.data('class')),
                 aLi = oUl.querySelectorAll(".drag_item"),
                 column = Math.floor(oUl.offsetWidth / (aLi[0].offsetWidth + parseInt(settings.spacing) * 2)),
                 aLi_height = aLi[0].offsetHeight + parseInt(settings.spacing) * 2,
                 rows = Math.ceil(aLi.length / column);
 
             // console.log(aLi)
             // 閲嶆柊瀹氫綅鎷栧姩鍏冪礌
             for (var i = 0; i < aLi.length; i++) {
                 aLi[i].style.margin = settings.spacing + 'px';
 
                 let t, l;
 
                 if (aLi[i].classList.contains('nail_end')) {
                     t = aLi[i].offsetTop;
                     l = aLi[i].offsetLeft;
                 } else {
                     t = aLi[i].style.top ? parseInt(aLi[i].style.top) : aLi[i].offsetTop;
                     l = aLi[i].style.left ? parseInt(aLi[i].style.left) : aLi[i].offsetLeft;
                 }
 
                 if (!aLi[i].getAttribute('index')) {
                     // aLi[i].index = i;
                     locate_info[i] = { left: l, top: t };
                     aLi[i].setAttribute('index', i)
                 }
                 // console.log(aLi[i].index)
                 // console.log('---------------------')
                 aLi[i].style.zIndex = 5;
                 aLi[i].style.top = t + "px";
                 aLi[i].style.left = l + "px";
             }
             for (var b = 0; b < aLi.length; b++) {
                 aLi[b].style.position = "absolute";
                 aLi[b].style.margin = 0;
             }
             // 鐖剁骇鐨勯珮搴�
             oUl.style.height = aLi_height * rows + 'px';
             if (!$original.data('spacing')) {
                 $original.data('spacing', settings.spacing)
             }
         }
     }
     // 浜嬩欢
     var minZindex = 5;
     var Binds = {
         // 鍒濆鍖�
         bind: function($original, locate_info, settings) {
             let self = this,
                 oUl = document.querySelector("." + settings.class),
                 aLi = oUl.querySelectorAll(".drag_item");
             for (var i = 0; i < aLi.length; i++) {
                 // 鐐瑰嚮浜嬩欢
                 if (aLi[i].removeEventListener) { // 鎵€鏈夋祻瑙堝櫒锛岄櫎浜� IE 8 鍙婃洿鏃㊣E鐗堟湰
                     aLi[i].removeEventListener("mousemove", function() {});
                 } else if (x.detachEvent) { // IE 8 鍙婃洿鏃㊣E鐗堟湰
                     aLi[i].detachEvent("onmousemove", function() {});
                 }
                 aLi[i].addEventListener('mousedown', self.mousedown.bind(this, locate_info, $original, settings));
             }
         },
         // 鐐瑰嚮浜嬩欢
         mousedown: function(locate_info, $original, settings, event) {
             // 闃绘浜嬩欢榛樿琛屼负锛岃В鍐虫嫋鍔ㄦ墦寮€鏂伴〉闈�
             event.stopPropagation()
             event.preventDefault()
 
             // 绂佺敤鍥剧墖鐨勯粯璁よ涓猴紝瑙ｅ喅鍥剧墖棰勮鏃跺啿绐�
             $original.find('img').on('click', function(e) {
                 e.preventDefault();
                 e.stopPropagation();
             })
 
             let self = this,
                 oUl = document.querySelector("." + settings.class),
                 aLi = oUl.querySelectorAll(".drag_item"),
                 obj;
             var disX = 0,
                 disY = 0;
             // 鍒ゆ柇鏄惁鏄嫋鍔ㄥ厓绱�
             if (event.target.classList.contains('drag_item')) {
                 obj = event.target
             } else {
                 obj = $(event.target).parents('.drag_item')[0]
             }
 
             // 鍒ゆ柇鏄惁鍙互鎷栧姩
             if (obj.classList.contains('forbid') || $(event.target).parents('.cancel').length > 0 || $(event.target).hasClass('cancel')) {
                 return false;
             }
 
             var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
             var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
             obj.style.zIndex = minZindex++;
             //褰撻紶鏍囨寜涓嬫椂璁＄畻榧犳爣涓庢嫋鎷藉璞＄殑璺濈
             disX = event.clientX + scrollLeft - obj.offsetLeft;
             disY = event.clientY + scrollTop - obj.offsetTop;
             document.onmousemove = function(event) {
                 //褰撻紶鏍囨嫋鍔ㄦ椂璁＄畻div鐨勪綅缃�
                 var l = event.clientX - disX + scrollLeft;
                 var t = event.clientY - disY + scrollTop;
                 obj.style.left = l + "px";
                 obj.style.top = t + "px";
 
                 for (var i = 0; i < aLi.length; i++) {
                     aLi[i].classList.remove('active');
                 }
                 var oNear = self.findMin(obj, aLi);
                 if (oNear && !oNear.classList.contains('forbid')) {
                     oNear.classList.add('active');
                 }
             }
             document.onmouseup = function() {
                 document.onmousemove = null; //褰撻紶鏍囧脊璧锋椂绉诲嚭绉诲姩浜嬩欢
                 document.onmouseup = null; //绉诲嚭up浜嬩欢锛屾竻绌哄唴瀛�
                 //妫€娴嬫槸鍚︽櫘纰颁笂锛屽湪浜ゆ崲浣嶇疆
                 var oNear = self.findMin(obj, aLi);
                 if (oNear && !oNear.classList.contains('forbid')) {
                     oNear.classList.remove('active');
                     oNear.style.zIndex = minZindex++;
                     obj.style.zIndex = minZindex++;
                     self.startMove(oNear, locate_info[obj.getAttribute('index')]);
                     self.startMove(obj, locate_info[oNear.getAttribute('index')]);
                     // 杩斿洖鍒囨崲鍏冪礌浣嶇疆 obj璧峰浣嶇疆 onear缁撴潫浣嶇疆
                     let start = obj.getAttribute('index'),
                         end = oNear.getAttribute('index'),
                         start_id = obj.dataset.id && obj.dataset.id !== undefined ? obj.dataset.id : '',
                         end_id = oNear.dataset.id && oNear.dataset.id !== undefined ? oNear.dataset.id : '';
 
                     // 杩斿洖褰撳墠鍒囨崲
                     if (settings.revert === 'id') {
                         $(document).trigger('drag:' + settings.class, [start_id, end_id]);
                     }
                     if (settings.revert === 'index') {
                         $(document).trigger('drag:' + settings.class, [start, end]);
                     }
 
                     //浜ゆ崲index
                     obj.setAttribute('index', end);
                     oNear.setAttribute('index', start);
                 } else {
                     self.startMove(obj, locate_info[obj.getAttribute('index')]);
                 }
             }
             clearInterval(obj.timer);
             return false; //浣庣増鏈嚭鐜扮姝㈢鍙�
         },
         // 绉诲姩浣嶇疆
         startMove: function(obj, json) {
             let self = this;
             clearInterval(obj.timer);
             obj.timer = setInterval(function() {
                 var isStop = true;
                 for (var attr in json) {
                     var iCur = 0;
                     if (attr == "opacity") { iCur = parseInt(parseFloat(self.getStyle(obj, attr)) * 100); } else { iCur = parseInt(self.getStyle(obj, attr)); }
                     var ispeed = (json[attr] - iCur) / 8;
                     ispeed = ispeed > 0 ? Math.ceil(ispeed) : Math.floor(ispeed);
                     if (iCur != json[attr]) { isStop = false; }
                     if (attr == "opacity") {
                         obj.style.filter = "alpha:(opacity:" + (json[attr] + ispeed) + ")";
                         obj.style.opacity = (json[attr] + ispeed) / 100;
                     } else { obj.style[attr] = iCur + ispeed + "px"; }
                 }
                 if (isStop) { clearInterval(obj.timer); }
             }, 30);
         },
         // 鑾峰彇灞炴€�
         getStyle: function(obj, attr) {
             return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, false)[attr];
         },
         // 鎵惧埌璺濈鏈€杩戠殑
         findMin: function(obj, aLi) {
             let self = this;
             var minDis = 999999999;
             var minIndex = -1;
             for (var i = 0; i < aLi.length; i++) {
                 if (obj == aLi[i]) continue;
                 if (self.colTest(obj, aLi[i])) {
                     var dis = self.getDis(obj, aLi[i]);
                     if (dis < minDis) {
                         minDis = dis;
                         minIndex = i;
                     }
                 }
             }
             if (minIndex == -1) {
                 return null;
             } else {
                 return aLi[minIndex];
             }
         },
         //纰版挒妫€娴�
         colTest: function(obj1, obj2) {
             var t1 = obj1.offsetTop;
             var r1 = obj1.offsetWidth + obj1.offsetLeft;
             var b1 = obj1.offsetHeight + obj1.offsetTop;
             var l1 = obj1.offsetLeft;
 
             var t2 = obj2.offsetTop;
             var r2 = obj2.offsetWidth + obj2.offsetLeft;
             var b2 = obj2.offsetHeight + obj2.offsetTop;
             var l2 = obj2.offsetLeft;
 
             if (t1 > b2 || r1 < l2 || b1 < t2 || l1 > r2) {
                 return false;
             } else {
                 return true;
             }
         },
         // 鍕捐偂瀹氱悊姹傝窛绂�
         getDis: function(obj1, obj2) {
             var a = obj1.offsetLeft - obj2.offsetLeft;
             var b = obj1.offsetTop - obj2.offsetTop;
             return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
         }
     }
     // 鏂规硶鎿嶄綔
     var Methods = {
         // 鍒濆鍖�
         init: function(opts) {
             return this.each(function() {
                 let settings = $.extend(true, {}, Data.defaults, opts);
                 let $original = $(this);
                 // class 鍞竴鎬�
                 $original.addClass($original.data('class'))
                 if (Engine.controlTarget($original, ['isDrag'])) {
                     if (Engine.controlTarget($('.' + $original.data('class')), ['isSingle'])) {
                         if (Engine.controlTarget($('.' + $original.data('class')), ['drag_elemt'])) {
                             Engine.initialize($original, settings);
                         }
                     }
                 }
             });
         },
         // 璁剧疆
         set: function(values) {
             return this.each(function() {
                 var $original = $(this);
                 if (Engine.controlTarget($('.' + $original.data('class')), ['isSingle'])) {
                     if (Engine.controlValues(this, values)) {
                         Engine.set($original, values);
                     }
                 }
             });
         },
         // 閲嶇疆
         reset: function(values) {
             return this.each(function() {
                 var $original = $(this);
                 if (Engine.controlTarget($('.' + $original.data('class')), ['isSingle'])) {
                     Engine.reset($original);
                 }
             });
         },
         del: function(values) {
             return this.each(function() {
                 var $original = $(this);
                 if (Engine.controlTarget($('.' + $original.data('class')), ['isSingle'])) {
                     if (Engine.controlValues(this, values)) {
                         Engine.del($original, values);
                     }
                 }
             });
         }
     }
     // 浣跨敤鎻掍欢
     $.fn.Drag = function(options) {
         if (this.length < 1) { return; }
         // console.log(options)
         // 鍒ゆ柇鏄粈涔堟搷浣�
         if (Methods[options]) {
             // 浼犲叆杩涙潵鐨勫叿鏈塴ength灞炴€х殑绗竴涓弬鏁癮rguments杞崲涓烘暟缁勶紝鍐嶈皟鐢ㄥ畠鐨剆lice锛堟埅鍙栵級鏂规硶
             var slicedArguments = Array.prototype.slice.call(arguments, 1);
             return Methods[options].apply(this, slicedArguments);
         } else if (typeof options === 'object' || !options) {
             return Methods.init.apply(this, arguments);
         } else {
             console.error('Drag | Call error');
             console.log(this);
         }
     };
 
 })(jQuery, window, document);
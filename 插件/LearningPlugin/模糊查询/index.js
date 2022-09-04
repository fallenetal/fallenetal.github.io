(function(){
    $('head').append(`
    <style>
    .searchSelect_box {
      position: relative;
    }
    .searchSelect_box>.searchSelect {
      background-color: #fff;
      border-radius: 4px;
      border: 1px solid #dcdee2;
      transition: all .2s ease-in-out;
      position: relative;
      width: 100%;
      padding:5px;
    }
    .searchSelect_box>.searchSelect:focus {
      border-color: #57a3f3 !important;
      outline: 0;
      box-shadow: 0 0 0 2px rgb(45 140 240 / 20%) !important;
    }
    .searchSelect_box>.drawer {
      width: 100%;
        max-height: 200px;
        overflow-x: hidden;
        overflow-y: auto;
        margin: 5px 0;
        padding: 5px 0;
        background-color: #fff;
        box-sizing: border-box;
        border-radius: 4px;
        box-shadow: 0 1px 6px rgb(0 0 0 / 20%);
        position: absolute;
        z-index: 900;
        left: 0;
        top: 30px;
        display:none;
    }
    .searchSelect_box>.drawer>li {
      margin: 0;
        line-height: normal;
        padding: 7px 16px;
        clear: both;
        color: #515a6e;
        font-size: 14px!important;
        white-space: nowrap;
        list-style: none;
        cursor: pointer;
        transition: background .2s ease-in-out;
        overflow:hidden; 
        text-overflow:ellipsis; 
        white-space:nowrap; 
    }
    .searchSelect_box>.drawer>.none {
      padding: 0 16px;
      text-align: center;
      color: #ccc;
    }
    .searchSelect_box>.drawer>li:hover {
      background-color: rgba(0, 0, 0, .1);
    }
    .searchSelect_box>.drawer>.active {
      color: #57a3f3;
    }
    /*瀹氫箟婊氬姩鏉￠珮瀹藉強鑳屾櫙
   楂樺鍒嗗埆瀵瑰簲妯珫婊氬姩鏉＄殑灏哄*/
   .searchSelect_box>.drawer::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background-color: #fff;
  }
  /*瀹氫箟婊氬姩鏉¤建閬�
    鍐呴槾褰�+鍦嗚*/
  .searchSelect_box>.drawer::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
      border-radius: 2px;
      background-color: #fff;
  }
  /*瀹氫箟婊戝潡
    鍐呴槾褰�+鍦嗚*/
  .searchSelect_box>.drawer::-webkit-scrollbar-thumb {
      border-radius: 2px;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
      background-color: #ccc;
  }
    </style>
    `)
  })()
  class searchSelect {
    constructor(dom,list,fn) {
      this.list = []
      this.dom = dom
      this.params = {}
      this.loading = false
      this.fn = fn
      if(list instanceof Array) {
        this.list = list
      }
      $(this.dom).addClass('searchSelect_box')
      let name = $(this.dom).attr('name');
      let placeholder= $(this.dom).attr('placeholder')
      $(this.dom).append('<input placeholder="'+(placeholder||'')+'" type="text" name="'+(name||'')+'" class="searchSelect">')
      $(this.dom).append('<ul class="drawer"></ul>')
      this.getList()
      let that = this
      $(this.dom).children('.searchSelect').on('input',function(){
        let val = $(that.dom).children('.searchSelect').val().trim()
        $(that.dom).children('.searchSelect').val(val)
        if(!(val === $(that.dom).children('.drawer').find('.active').text())) {
          $(that.dom).children('.searchSelect').attr('data-id','')
          $(that.dom).children('.drawer').find('.active').removeClass('active')
          that.params = {}
          fn && fn($(this).val())
        }
        $(that.dom).children('.drawer').stop(true,true).fadeIn()
        if(!that.loading) {
          that.getList(val)
        }
        // that.list.filter((item)=>item.value.inc)
        
      })
      $(this.dom).children('.searchSelect').on('focus',function(){
        $(that.dom).children('.drawer').stop(true,true).fadeIn()
      })
      $(this.dom).children('.searchSelect').on('blur',function(){
        setTimeout(()=>{
          if(!($(that.dom).children('.searchSelect').attr('data-id'))) {
            $(that.dom).children('.searchSelect').val('')
          }
          $(that.dom).children('.drawer').stop(true,true).fadeOut()
        },100)
      })
    }
    // 妯＄硦鎼滅储鏂规硶
    getList(str) {
      // let list = arr || JSON.parse(JSON.stringify(this.list))
      if(this.list.length<1) {
        $(this.dom).children('.drawer').html('<li class="none">鏆傛棤鍏朵粬鏁版嵁</li>')
        return this
      }
      let domlist = str?this.list.filter(item => item.value.includes(str)):JSON.parse(JSON.stringify(this.list))
        if(domlist.length<1){
          $(this.dom).children('.drawer').html('<li class="none">鏆傛棤鍏朵粬鏁版嵁</li>')
          return this
        }
      let listDom = ''
      $(this.dom).children('.drawer').html('')
      domlist.forEach(item => {
        let isActive = $(this.dom).children('.searchSelect').attr('data-id')==item.id
        listDom+='<li class="item '+(isActive?'active':'')+' " data-id="'+item.id+'">'+item.value+'</li>'
        if(isActive) {
          $(this.dom).children('.searchSelect').val(item.value)
        }
      })
      $(this.dom).children('.drawer').append(listDom)
      let dom = this.dom
      let that = this
      $(this.dom).children('.drawer').children('.item').on('click',function(){
        if($(this).hasClass('active')) return
        $(dom).children('.searchSelect').attr('data-id',$(this).attr('data-id'))
        $(dom).children('.searchSelect').val($(this).text())
        that.params.id = $(this).attr('data-id')
        that.params.value = $(this).text()
        $(this).addClass('active').siblings().removeClass('active')
        setTimeout(()=>{
          $(dom).children('.drawer').stop(true,true).fadeOut()
          that.getList($(this).text())
        },300)
      })
      return this
    }
    // 鏇存柊鏁版嵁 浼犲叆涓€涓暟缁勶紝鏇存柊涓嬫媺妗嗗唴瀹�
    update(list) {
      if(!(list instanceof Array)) {
        console.error('璇蜂紶鍏ヤ竴涓暟缁勶紒')
        return this
      }
      this.list = list
      this.getList($(this.dom).children('.searchSelect').val())
      this.loading=false
      return this
    }
    // 鎼滅储鏂规硶 锛屼紶鍏rue浼氭樉绀烘悳绱腑鐨刲oading锛屼竴鑸湪input鐨勯挬瀛愪腑瑙﹀彂ajax璇锋眰妯＄硦鎼滅储鏁版嵁鍙敤
    search(bol) {
      bol && $(this.dom).children('.drawer').html('<li class="none">姝ｅ湪鎼滅储....</li>')
      bol && (this.loading=true)
      !bol && this.getList()
      !bol && (this.loading=false)
      return this
    }
    // 娓呯┖鎵€鏈夊唴瀹圭殑鏂规硶
    empty() {
      $(this.dom).children('.drawer').html('<li class="none">鏆傛棤鍏朵粬鏁版嵁</li>')
      $(this.dom).children('.searchSelect').val('')
      return this
    }
    isFunction(fn) {
      return Object.prototype.toString.call(fn)=== '[object Function]';
   }
  //  disabled閫夐」
   disabled(bol) {
     bol && $(this.dom).children('.searchSelect').prop('disabled',true)
     !bol && $(this.dom).children('.searchSelect').prop('disabled',false)
     return this
   }
   // 浣犱篃璁搁渶瑕佸己琛岃祴鍊硷紝鐢ㄥ畠
   assignment(obj) {
     if(obj instanceof Object && obj.id) {
       for(let i=0;i<this.list.length;i++) {
         if(this.list[i].id == obj.id) {
          $(this.dom).children('.drawer').html('<li class="item active" data-id="'+obj.id+'">'+obj.value+'</li>')
           $(this.dom).children('.searchSelect').val(obj.value)
           $(this.dom).children('.searchSelect').attr('data-id',obj).id
           this.fn()
           return this
         }
       }
       this.list.push(obj)
       $(this.dom).children('.drawer').html('<li class="item active" data-id="'+obj.id+'">'+obj.value+'</li>')
       $(this.dom).children('.searchSelect').val(obj.value)
       $(this.dom).children('.searchSelect').attr('data-id',obj.id)
       this.params.id = obj.id
       this.params.value = obj.value
     } else if(typeof obj==='string'||typeof obj==='number'){
      this.list.forEach(item => {
        if(item.id == obj) {
          $(this.dom+' .item[data-id="'+obj+'"]').addClass('active')
          $(this.dom).children('.searchSelect').val($(this.dom+' .item[data-id="'+obj+'"]').text())
          $(this.dom).children('.searchSelect').attr('data-id',obj)
          this.params.id = item.id
          this.params.value = $(this.dom+' .item[data-id="'+obj+'"]').text()
        }
      })
     }
     this.fn()
     return this
   }
  }
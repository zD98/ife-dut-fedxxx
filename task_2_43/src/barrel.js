(function(window) {
  'use strict';
  function ZdAlbum(config) {
    config = config||{};
    this.LAYOUT = {
      PUZZLE: 1,    // 拼图布局
      WATERFALL: 2, // 瀑布布局
      BARREL: 3     // 木桶布局
    };
    this.el = null;
    this.width = config.width || 500;
    this.children = null;
    this.NUM = 0;
    this.boot();
  }

  ZdAlbum.prototype.boot = function () {
    this.layout = this.LAYOUT.BARREL;
    //如果传入了ele 就用传入的ele 当容器
    this.el = document.createElement('div');
    this.el.classList.add('barrel');
    this.el.style.width = this.width + 'px';
    this.children = [];
    this.margin = 0;
    this.left = 10;
    this.top = 10;
    this.targetRowHeight = 300;
    this.targetRowHeightTolerance = 0.25;
  };
  ZdAlbum.prototype.setImages = function (images, options) {
    //1.获得container width
    //2.random 一个整数  
    //3.读取整数个图片
    //4.按比例计算出行高(对行高有个判断 如若行太高或太低就增减相应的图片数 &&图片数不够的话 占位一行 此时通过minHeight计算)
    //5.生成每个元素
    //6.appendChild
    let top=this.top;
    while(images.length){
      //TODO:
      //1.改进选取图片个数的算法
      //2.当最后一行个数不够时 可以不填满整行
      //let rowNum = Math.floor(Math.random()*6+1);  
      let result = generateRow.call(this,images);
      let imgs = images.splice(0,result.rowNum);
        
      top+=(this.top+this.setRowImages(imgs,result.rh,top)); 
     
    }
    function generateRow(imgs){
        let rw = 0,w = this.width-2*this.left;
        let rh = this.targetRowHeight;
        let minh = rh*(1-this.targetRowHeightTolerance);
        let maxh = rh*(1+this.targetRowHeightTolerance);
        let rowNum = -1;     
        for(let i=0;i<imgs.length;i++){
            
            let nw = rw +imgs[i].ratio;
            let nh = w/nw;
            if(nh<minh){  
                rowNum = i;
                break;
            }
           rw = nw;
            rh = nh; 
            w -=this.left;
        }
        if(rowNum == -1){
            rowNum = imgs.length;
            rh = this.targetRowHeight;
        }
        return {
            rh,
            rowNum
        }; 
    }
    function getRatio(imgs,tag){
        //0 IS A BUG;
        let len = imgs.length;
        let rw = 0;
        while(--len!=-1){
            rw+=imgs[len].ratio;
        }
        return rw;
    }
    document.body.appendChild(this.el);
  };
  ZdAlbum.prototype.addImage = function (image, rowHeight, left,top) {
    //image.radio rowHeight
    let w = rowHeight*image.ratio,
        h = rowHeight;
    let el = document.createElement('div');
    el.classList.add('barrel-item');
    el.style.width = w+'px';
    el.style.height = h+'px';
    el.style.left = left +'px';
    el.style.top = top+'px';
    let img = document.createElement('div');
    img.classList.add('img-container');
    img.style.backgroundImage = `url(${image.url})`;
    el.appendChild(img);
    this.el.appendChild(el);
    return w;
  };

  ZdAlbum.prototype.setRowImages =function(images, rh,top){
      let left = this.left; 
      images.forEach(function(img){
           left += (this.left+this.addImage(img,rh,left,top));
       }.bind(this)) 
      return rh;
  }
  window.ZdAlbum = ZdAlbum;
  //默认是cover 若用户输入了设置就按照用户设置的比例
  function setImageSize(){

  }
})(window);

let images = [
      {
    "url":"http://cued.xunlei.com/demos/publ/img/P_000.jpg",
    "ratio":0,
    "width":192,
    "height":288
  },
  {
    "url":"http://cued.xunlei.com/demos/publ/img/P_001.jpg",
    "ratio":0,
    "width":192,
    "height":288
  },
  {
    "url":"http://cued.xunlei.com/demos/publ/img/P_002.jpg",
    "ratio":0,
    "width":192,
    "height":288
  },
  {
    "url":"http://cued.xunlei.com/demos/publ/img/P_003.jpg",
    "ratio":0,
    "width":192,
    "height":129
  },
  {
    "url":"http://cued.xunlei.com/demos/publ/img/P_004.jpg",
    "ratio":0,
    "width":192,
    "height":284
  },
  {
    "url":"http://cued.xunlei.com/demos/publ/img/P_005.jpg",
    "ratio":0,
    "width":192,
    "height":253
  },
  {
    "url":"http://cued.xunlei.com/demos/publ/img/P_006.jpg",
    "ratio":0,
    "width":192,
    "height":245
  },
  {
    "url":"http://cued.xunlei.com/demos/publ/img/P_007.jpg",
    "ratio":0,
    "width":192,
    "height":343
  },
  {
    "url":"http://cued.xunlei.com/demos/publ/img/P_008.jpg",
    "ratio":0,
    "width":192,
    "height":238
  }
];
images.forEach(function(img){
    img.ratio = img.width/img.height;
});
let album = new ZdAlbum();
album.setImages(images);

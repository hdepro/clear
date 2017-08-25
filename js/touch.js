/**
 * Created by heben.hb on 2017/8/11.
 */

Clear.Touch = (function(){
    return {
        toArray(obj){
            return Array.prototype.slice.call(obj,0);
        },
        getTranslate(ele){
            let reg1 = /translate3d\((.*)\)/;
            let match1 = ele.style.transform.match(reg1)[1];
            let reg2 = /(\d+(\.\d+)?)/g;
            let match2 = match1.match(reg2);
            console.log("translate3d = ",match2);
            let x = match2[1];
            let y = match2[1];
            let z = match2[2];
        },
        moveX(ele,d,delay){
            this._move(ele,{x:d},delay);
        },
        moveY(ele,d,delay){
            this._move(ele,{y:d},delay);
        },
        moveZ(ele,d,delay){
            this._move(ele,{z:d},delay);
        },
        _move(ele,position,delay){
            let x = 0,y = 0,z = 0;
            x = position.x || x;
            y = position.y || y;
            z = position.z || z;
            if(ele.length){
                let arr = this.toArray(ele);
                console.log(arr);
                arr.forEach((e,index) => {
                    delay = delay || 0;
                    e.style.transition = `linear all ${delay}ms`;
                    e.style.transform = `translate3d(${x*index}px,${y*index}px,${z*index}px)`;
                });
            }else{
                delay = delay || 0;
                ele.style.transition = `linear all ${delay}ms`;    //此处注意transition会被记忆
                ele.style.transform = `translate3d(${x}px,${y}px,${z}px)`;
                //if(delay) ele.style.transition = `linear all ${delay}ms`;   //不设置还会记住上次的值
                //console.log("_move transition");
            }
        }
    }
})();

// window.getComputedStyle(ele,null);
// document.defaultView.getComputedStyle(ele,null);

// let regY = /translate3d\(([\s]*([\d]+)[^\d]+)+\)/;
// let regY2 = /translate3d\((.*)\)/;
// let str = "translate3d(10px,100px,1000px)";
// console.log(str.match(regY));
// console.log(str.match(regY2));
// console.log(str.match(/[\d]+/g));
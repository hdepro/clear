/**
 * Created by heben.hb on 2017/8/11.
 */

Clear.Touch = (function(){
    return {
        toArray(obj){
            return Array.prototype.slice.call(obj,0);
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
                arr.forEach((e,index) => {
                    if(delay) e.style.transition = `linear all ${delay}ms`;
                    e.style.transform = `translate3D(${x*index}px,${y*index}px,${z*index}px)`;
                });
            }else{
                if(delay) ele.style.transition = `linear all ${delay}ms`;
                ele.style.transform = `translate3D(${x}px,${y}px,${z}px)`;
                //console.log("_move transition");
            }
        }
    }
})();


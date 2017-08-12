/**
 * Created by heben.hb on 2017/8/11.
 */

Clear.Touch = (function(){
    return {
        toArray(obj){
            return Array.prototype.slice.call(obj,0);
        },
        moveX(ele,d,delay){
            this._move(ele,d,"X",delay);
        },
        moveY(ele,d,delay){
            this._move(ele,d,"Y",delay);
        },
        moveZ(ele,d,delay){
            this._move(ele,d,"Z",delay);
        },
        _move(ele,d,axis,delay){
            if(ele.length){
                let arr = this.toArray(ele);
                arr.forEach((e,index) => {
                    if(delay) e.style.transition = `linear all ${delay}ms`;
                    e.style.transform = `translate${axis}(${d*index}px)`;
                });
            }else{
                if(delay) ele.style.transition = `linear all ${delay}ms`;
                ele.style.transform = `translate${axis}(${d}px)`;
                //console.log("_move transition");
            }
        }
    }
})();


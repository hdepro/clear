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
                arr.forEach(e => {
                    e.style.transform = `translate${axis}(${d}px)`;
                });
            }else{
                ele.style.transform = `translate${axis}(${d}px)`;
                if(delay) ele.style.transition = `all linear ${delay}ms`;
            }
        }
    }
})();


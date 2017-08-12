/**
 * Created by heben.hb on 2017/8/12.
 */

Clear.Config = (function(){
    return {
        TASK_CLEAR_DELAY:500,    //任务操作的动画延迟
        SLIDING_VELOCITY:0.5,    //手指的滑动速度
        init(options){
            if(options){
                this.TASK_CLEAR_DELAY = options.TASK_CLEAR_DELAY || this.TASK_CLEAR_DELAY;
            }
        }
    }
})();
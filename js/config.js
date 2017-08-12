/**
 * Created by heben.hb on 2017/8/12.
 */

Clear.Config = (function(){
    return {
        TASK_CLEAR_DELAY:500,
        init(options){
            if(options){
                this.TASK_CLEAR_DELAY = options.TASK_CLEAR_DELAY || this.TASK_CLEAR_DELAY;
            }
        }
    }
})();
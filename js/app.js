/**
 * Created by heben.hb on 2017/8/5.
 */

let Clear = {
    init(){
        let rootSize = document.body.getBoundingClientRect().width;
        document.documentElement.style.fontSize = rootSize/10 + "px";
        document.body.style.fontSize = rootSize/30 + "px";
        Clear.Model.init();
        Clear.TaskList.init();
        Clear.rem = rootSize/10;
    }
};

window.addEventListener("load",function(){
    Clear.init();
});
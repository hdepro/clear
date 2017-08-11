/**
 * Created by heben.hb on 2017/7/29.
 */


Clear.Task = function(task){
    this.task = task;
    this.ele = null;
};

Clear.Task.prototype = {
    init(){
        let task = this.task;
        let ele = document.createElement("div");
        ele.innerHTML = `<li class="task">
                 <span class="task-name">${task.name}</span>
                  <span class="task-num">${task.items.length}</span>
            </li>`;
        console.log(ele,ele.offsetHeight);
        ele.style.transform = `translate3d(0,${(task.index)*1.5}rem,0)`;
        this.ele = ele;
        return ele;
    },
    finish(){

    },
    create(){

    },
    del(){
        Clear.Model.del(this.task.id);
        Clear.Touch.moveX(this.ele,-10*Clear.rem,1000);
    }
};

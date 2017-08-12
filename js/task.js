/**
 * Created by heben.hb on 2017/7/29.
 */

let finishClass = "finish";
Clear.Task = function(task){
    this.task = task;
    this.ele = null;
};

Clear.Task.prototype = {
    init(){
        let task = this.task;
        let ele = document.createElement("div");
        ele.innerHTML = `<li class="task ${task.state?finishClass:''}" data-id="${task.id}">
                  <span class="task-name">${task.name}</span>
                  <span class="task-num">${task.items.length}</span>
            </li>
            <div class="info">
               <img src="img/del.png" class="task-del"/>
               <img src="img/finish.png" class="task-finish"/>
            </div>`;
        console.log(ele,ele.offsetHeight);
        ele.style.transform = `translate3d(0,${(task.index)*1.5}rem,0)`;
        this.ele = ele;
        return ele;
    },
    finish(){
        console.log("finish task name = ",this.task.name);
        Clear.Model.finishTask(this.task.id);
        Clear.Touch.moveX(this.ele,10*Clear.rem,Clear.Config.TASK_CLEAR_DELAY);
        console.log(this.ele.firstChild);
        this.ele.firstChild.classList.add(finishClass);
    },
    create(){

    },
    del(){
        Clear.Model.delTask(this.task.id);
        Clear.Touch.moveX(this.ele,-10*Clear.rem,Clear.Config.TASK_CLEAR_DELAY);
    }
};

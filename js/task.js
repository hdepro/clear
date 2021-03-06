/**
 * Created by heben.hb on 2017/7/29.
 */

let finishClass = "finish";
Clear.Task = function(task){
    this.task = task;
    this.ele = null;
    this.inner = null;
};

Clear.Task.prototype = {
    init(){
        let task = this.task;
        let ele = document.createElement("div");
        //此处再套一层div是为了在删除的时候移动该div
        console.log(task);
        ele.innerHTML = `<div class="inner">     
            <li class="task ${task.state?finishClass:''}" data-id="${task.id}">
                  <span class="task-name">${task.name}</span>
                  <input class="task-name hide" name="task-name" value="${task.name}"/>
                  <span class="task-num">${task.items.length}</span>
            </li>
            <div class="info">
               <img src="img/del.png" class="task-del"/>
               <img src="img/finish.png" class="task-finish"/>
            </div></div>`;
        //console.log(ele,ele.offsetHeight);
        ele.style.transform = `translate3d(0,${task.index*1.5*Clear.rem}px,0)`;
        this.inner = ele.firstElementChild;
        this.ele = ele;
        return ele;
    },
    finish(){
        console.log("finish task name = ",this.task.name);
        Clear.Model.finishTask(this.task.id);
        //console.log(this.inner.firstChild);
        this.inner.firstChild.classList.add(finishClass);
    },
    create(){

    },
    edit(name){
        Clear.Model.editTask(this.task.id,name);
    },
    del(){
        //console.log("del : ",this.ele);
        Clear.Model.delTask(this.task.id);
        Clear.Touch.moveX(this.inner,-10*Clear.rem,Clear.Config.TASK_CLEAR_DELAY);
    },
    onDragStart(){

    },
    onDragMove(){

    },
    onDrageEnd(){

    }
};

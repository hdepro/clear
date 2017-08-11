/**
 * Created by heben.hb on 2017/7/26.
 */

Clear.TaskList = (function(){
    let taskListNode = document.querySelector(".content .task-list");
    let taskCreateNode = document.querySelector(".content .task-create");
    return {
        init(){
            this.TASK_HEIGHT = Number;
            this.Task = Clear.Task;
            this.Model = Clear.Model;
            this.Touch = Clear.Touch;
            let Task = this.Task;
            let TaskInstance;
            let domStr = "";
            this.Model.data().forEach((task,index) => {
                TaskInstance = new Task(Object.assign({},task,{index}));
                let dom = TaskInstance.init();
                domStr += dom.outerHTML;
            });
            taskListNode.innerHTML = domStr;
            this.create();
            this.touch();
        },
        update(newTask){
            let Task = this.Task;
            let TaskInstance = new Task(newTask);
            let dom = TaskInstance.init();
            taskListNode.insertBefore(dom,taskListNode.firstElementChild);
            return TaskInstance;
        },
        create(){
            this.TASK_HEIGHT = document.querySelector(".task").offsetHeight;
            this.Touch.moveY(taskCreateNode,-this.TASK_HEIGHT);
            taskCreateNode.innerHTML = `<li class="task">
                 <input class="task-name" name="task-name" placeholder="create new task"/>
                  <span class="task-num">0</span>
            </li>`;
        },
        touch(){
            console.log("touch",this.TASK_HEIGHT);
            taskListNode.addEventListener("touchstart",this.onTouchStart.bind(this));
            taskListNode.addEventListener("touchmove",this.onTouchMove.bind(this));
            taskListNode.addEventListener("touchend",this.onTouchEnd.bind(this));
            taskListNode.addEventListener("click",this.handleClick.bind(this));
        },
        onTouchStart(e){
            let touch = e.touches[0];
            this.startY = touch.clientY;
        },
        onTouchMove(e){
            let touch = e.touches[0];
            this.moveY = touch.clientY;
            let ds = this.moveY - this.startY;
            console.log(this.startY,this.moveY);
            taskCreateNode.classList.remove("hide");
            this.Touch.moveY(taskListNode,ds);
            this.Touch.moveY(taskCreateNode,ds-this.TASK_HEIGHT);
            let childNode = taskCreateNode.querySelector(".task");
            let deg = Math.acos(ds/this.TASK_HEIGHT)/Math.PI*180+10;
            childNode.style.transform = `rotateX(${deg}deg)`;
        },
        onTouchEnd(e){
            let ds = this.moveY - this.startY;
            if(ds >= this.TASK_HEIGHT){
                this.Touch.moveY(taskListNode,this.TASK_HEIGHT);
                taskListNode.classList.add("mask");
                this.Touch.moveY(taskCreateNode,0);
            }else{
                this.Touch.moveY(taskListNode,0);
                this.Touch.moveY(taskCreateNode,-this.TASK_HEIGHT);
            }
        },
        handleClick(e){
            if(taskListNode.classList.contains("mask")){
                let value = document.querySelector("[name=task-name]").value;
                taskListNode.classList.remove("mask");
                let newTask = this.Model.create(value);
                let taskInstance = this.update(newTask);
                if(!value){
                    taskInstance.del();
                }
            }
        }
    }
})();

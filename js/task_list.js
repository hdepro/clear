/**
 * Created by heben.hb on 2017/7/26.
 */

Clear.TaskList = (function(){
    let content = document.querySelector(".content");
    let taskListNode = content.querySelector(".task-list");
    let taskCreateNode = content.querySelector(".task-create");
    return {
        init(){
            this.TASK_HEIGHT = Number;
            this.Model = Clear.Model;
            this.Touch = Clear.Touch;
            this.TaskInstances = [];
            let Task = Clear.Task;
            let domStr = "";
            this.Model.data().forEach((task,index) => {
                let TaskInstance;
                TaskInstance = new Task(Object.assign({},task,{index}));
                this.TaskInstances.push(TaskInstance);
                let dom = TaskInstance.init();
                domStr += dom.outerHTML;
            });
            taskListNode.innerHTML = domStr;
            this.initTaskInput();
            this.bindTouch();
        },
        initTaskInput(){
            this.TASK_HEIGHT = Clear.rem*1.5;
            this.Touch.moveY(taskCreateNode,-this.TASK_HEIGHT);
            taskCreateNode.innerHTML = `<li class="task">
                 <input class="task-name" name="task-name" placeholder="create new task"/>
                  <span class="task-num">0</span>
            </li>`;
        },
        bindTouch(){
            console.log("touch",this.TASK_HEIGHT);
            taskListNode.addEventListener("touchstart",this.onTouchStart.bind(this));
            taskListNode.addEventListener("touchmove",this.onTouchMove.bind(this));
            taskListNode.addEventListener("touchend",this.onTouchEnd.bind(this));
            taskListNode.addEventListener("click",this.handleClick.bind(this));
        },
        createTask(newTask,index){
            newTask.index = index;
            let Task = Clear.Task;
            let TaskInstance = new Task(newTask);
            TaskInstance.init();
            return TaskInstance;
        },
        update(){
            this.Touch.moveY(taskListNode,0);
            this.Touch.moveY(taskListNode.children,this.TASK_HEIGHT);
        },
        onTouchStart(e){
            let touch = e.touches[0];
            this.startX = touch.clientX;
            this.startY = touch.clientY;
            this.moveX = touch.clientX;
            this.moveY = touch.clientY;
            this.direction = undefined;
            if(e.target.classList.contains("task") && e.target.nodeName === "LI"){
                this.touchEle = e.target;
            }else{
                this.touchEle = e.target.parentNode;
            }
            let id = +this.touchEle.dataset.id;   //此处注意转为数字
            console.log(this.TaskInstances,id);
            this.touchInstance = this.TaskInstances.find(t => t.task.id === id);
        },
        onTouchMove(e){
            let touch = e.touches[0];
            this.moveX = touch.clientX;
            this.moveY = touch.clientY;
            let ds_x = this.moveX - this.startX;
            let ds_y = this.moveY - this.startY;
            if(!this.direction){
                if(Math.abs(ds_y) > Math.abs(ds_x)){
                    this.direction = "top-bottom";
                }else{
                    this.direction = "left-right";
                }
            }
            console.log(this.startX,this.moveX,this.startY,this.moveY);
            if(this.direction === "top-bottom"){
                taskCreateNode.classList.remove("hide");
                this.Touch.moveY(taskListNode,ds_y);
                this.Touch.moveY(taskCreateNode,ds_y-this.TASK_HEIGHT);
                let childNode = taskCreateNode.querySelector(".task");
                let deg = Math.acos(ds_y/this.TASK_HEIGHT)/Math.PI*180+10;
                childNode.style.transform = `rotateX(${deg}deg)`;
            }else{
                this.Touch.moveX(this.touchEle,ds_x);
                if(ds_x >= this.TASK_HEIGHT){
                    this.touchInstance.finish();
                }else if(ds_x <= -this.TASK_HEIGHT){
                    console.log(this.TaskInstances,this.touchInstance);
                    this.touchInstance.del();
                    taskListNode.removeChild(this.touchEle.parentNode);
                    this.update();
                }
            }
        },
        onTouchEnd(e){
            let ds_x = this.moveX - this.startX;
            let ds_y = this.moveY - this.startY;
            console.log(this.startX,this.moveX,this.startY,this.moveY,ds_x,ds_y);
            if(this.direction === "top-bottom"){
                if(!Number.isNaN(ds_y) && ds_y){
                    if(ds_y >= this.TASK_HEIGHT){
                        this.Touch.moveY(taskListNode,this.TASK_HEIGHT);
                        taskListNode.classList.add("mask");
                        this.Touch.moveY(taskCreateNode,0);
                    }else{
                        this.Touch.moveY(taskListNode,0);
                        this.Touch.moveY(taskCreateNode,-this.TASK_HEIGHT);
                    }
                }
            }else{
                this.Touch.moveX(this.touchEle,0);
            }
        },
        handleClick(e){       //点击也会触发touchend
            //console.log("handleclick");
            if(taskListNode.classList.contains("mask")){
                let value = document.querySelector("[name=task-name]").value;
                taskListNode.classList.remove("mask");
                let newTask = this.Model.createTask(value);
                let taskInstance = this.createTask(newTask,0);
                this.Touch.moveY(taskCreateNode,-this.TASK_HEIGHT);
                if(value){
                    taskListNode.insertBefore(taskInstance.ele,taskListNode.firstElementChild);
                    this.update();
                }else{
                    content.insertBefore(taskInstance.ele,content.firstElementChild);
                    setTimeout(() => {
                        taskInstance.del();
                        setTimeout(() => {
                            this.Touch.moveY(taskListNode,0,Clear.Config.TASK_CLEAR_DELAY);
                        },Clear.Config.TASK_CLEAR_DELAY);
                    },0);
                }
            }
        }
    }
})();

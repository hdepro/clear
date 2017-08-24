/**
 * Created by heben.hb on 2017/7/26.
 */

Clear.TaskList = (function(){
    let content = document.querySelector(".content");
    let taskListNode = content.querySelector(".task-list");
    let taskCreateNode = content.querySelector(".task-create");
    let maskNode = document.querySelector(".mask");
    return {
        init(){
            this.TASK_HEIGHT = Number;
            this.Model = Clear.Model;
            this.Touch = Clear.Touch;
            this.TaskInstances = [];
            let Task = Clear.Task;
            //let domStr = "";
            let domFrag = document.createDocumentFragment();   //使用这种方式好处是真实节点与创建的节点是同一个
            this.Model.data().forEach((task,index) => {
                let TaskInstance;
                TaskInstance = new Task(Object.assign({},task,{index}));
                this.TaskInstances.push(TaskInstance);
                let dom = TaskInstance.init();
                //domStr += dom.outerHTML;
                domFrag.appendChild(dom);
            });
            taskListNode.appendChild(domFrag);      //使用innerHTML方式就只是拷贝html
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
            console.log("bind touch",this.TASK_HEIGHT);
            taskListNode.addEventListener("touchstart",this.onTouchStart.bind(this));
            taskListNode.addEventListener("touchmove",this.onTouchMove.bind(this));
            taskListNode.addEventListener("touchend",this.onTouchEnd.bind(this));
            taskListNode.addEventListener("click",this.handleClick.bind(this));
        },
        createTask(newTask,index){
            newTask.index = index;
            let Task = Clear.Task;
            let TaskInstance = new Task(newTask);
            this.TaskInstances.push(TaskInstance);
            TaskInstance.init();
            return TaskInstance;
        },
        update(delay){
            this.Touch.moveY(taskListNode.children,this.TASK_HEIGHT,delay);
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
            this.disabledTouch = false;
        },
        onTouchMove(e){
            if(this.disabledTouch){return ;}
            let touch = e.touches[0];
            this.moveX = touch.clientX;
            this.moveY = touch.clientY;
            let ds_x = (this.moveX - this.startX)*Clear.Config.SLIDING_VELOCITY;
            let ds_y = (this.moveY - this.startY)*Clear.Config.SLIDING_VELOCITY;
            if(!this.direction){
                if(Math.abs(ds_y) > Math.abs(ds_x)){
                    this.direction = "top-bottom";
                }else{
                    this.direction = "left-right";
                }
            }
            //console.log(this.startX,this.moveX,this.startY,this.moveY);
            if(this.direction === "top-bottom"){
                this.Touch.moveY(content,ds_y);
                let childNode = taskCreateNode.querySelector(".task");
                let deg = Math.acos(ds_y/this.TASK_HEIGHT)/Math.PI*180+10;
                childNode.style.transform = `rotateX(${deg}deg)`;
            }else{
                this.Touch.moveX(this.touchEle,ds_x);
            }
        },
        onTouchEnd(e){
            if(this.disabledTouch){return ;}
            let ds_x = (this.moveX - this.startX)*Clear.Config.SLIDING_VELOCITY;
            let ds_y = (this.moveY - this.startY)*Clear.Config.SLIDING_VELOCITY;
            console.log(this.startX,this.moveX,this.startY,this.moveY,ds_x,ds_y,this.direction);
            if(this.direction === "top-bottom"){
                if(!Number.isNaN(ds_y) && ds_y){
                    if(ds_y >= this.TASK_HEIGHT){
                        this.Touch.moveY(content,this.TASK_HEIGHT);
                        taskListNode.classList.add("mask");
                        //maskNode.classList.remove("hide");
                    }else{
                        this.Touch.moveY(content,0);
                    }
                }
            }else{
                if(ds_x >= this.TASK_HEIGHT){
                    this.disabledTouch = true;
                    this.touchInstance.finish();
                }else if(ds_x <= -this.TASK_HEIGHT){
                    this.disabledTouch = true;
                    //console.log(this.TaskInstances,this.touchInstance);
                    this.touchInstance.del();
                    let temp = this.touchEle.parentNode.parentNode;  //缓存下需要删除的节点
                    //console.log("temp : ",temp);
                    setTimeout(() => {
                        //console.log("setTimeout temp : ",temp);
                        taskListNode.removeChild(temp);
                        this.update(Clear.Config.TASK_CLEAR_DELAY);
                    },Clear.Config.TASK_CLEAR_DELAY);
                }
                this.Touch.moveX(this.touchEle,0);
            }
        },
        handleClick(e){       //点击也会触发touchend,handleClick最后被触发
            //console.log("handleclick");
            if(taskListNode.classList.contains("mask")){
                let value = document.querySelector("[name=task-name]").value;
                taskListNode.classList.remove("mask");
                //maskNode.classList.add("hide");
                let newTask = this.Model.createTask(value);
                let taskInstance = this.createTask(newTask,0);
                taskListNode.insertBefore(taskInstance.ele,taskListNode.firstElementChild);
                //console.log("taskListNode.children.length = "+taskListNode.children.length);
                this.update();
                this.Touch.moveY(content,0);
                  //复原位置
                if(!value){
                    requestAnimationFrame(() => {
                        taskInstance.del();
                        setTimeout(() => {
                            taskListNode.removeChild(taskInstance.ele);
                            this.update(Clear.Config.TASK_CLEAR_DELAY);
                        },Clear.Config.TASK_CLEAR_DELAY);
                    });
                    //等插入后立即执行不会有transition的效果，因为浏览器还没有渲染，必须加一个时钟周期的延迟
                }
            }
        }
    }
})();

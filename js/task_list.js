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
            taskListNode.addEventListener("click",this.handleTaskClick.bind(this));
            maskNode.addEventListener("click",this.handleMaskClick.bind(this));
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
            this.index = this.TaskInstances.findIndex(t => t.task.id === id);
            this.touchInstance = this.TaskInstances[this.index];
            this.disabledTouch = false;
            this.drag = false;
            this.timer = setTimeout(() => {
                this.drag = true;
                this.touchInstance.ele.classList.add("high-index");
            },1000);
        },
        onTouchMove(e){
            e.preventDefault();   //阻止滚动的发生
            if(this.disabledTouch){return ;}
            clearTimeout(this.timer);
            let touch = e.touches[0];
            this.moveY = touch.clientY;
            let ds_y = this.moveY - this.startY;
            if(this.drag){
                console.log("drag index = ",this.index);
                this.Touch.moveY(this.touchInstance.inner,ds_y);
                let plus_minus = Math.abs(ds_y)/ds_y;
                let newIndex = parseInt(ds_y/this.TASK_HEIGHT)+this.index+plus_minus;
                let judge = Math.abs(ds_y)%this.TASK_HEIGHT - this.TASK_HEIGHT/2;
                if(judge > 0){
                    let start = this.index+1,end = newIndex;
                    if(plus_minus === -1){
                        start = newIndex;
                        end = this.index-1;
                    }
                    console.log("drag newIndex = ",newIndex,plus_minus,start,end);
                    for(let i=0;i<this.TaskInstances.length;i++){
                        if(i>=start && i<=end){
                            this.Touch.moveY(this.TaskInstances[i].inner,-plus_minus*this.TASK_HEIGHT);
                        }else if(i!==this.index){
                            this.Touch.moveY(this.TaskInstances[i].inner,0);
                        }
                    }
                }
                return;
            }
            this.moveX = touch.clientX;
            let ds_x = (this.moveX - this.startX)*Clear.Config.SLIDING_VELOCITY;
            ds_y *= Clear.Config.SLIDING_VELOCITY;
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
                if(ds_y < 0){return;}
                let deg = Math.acos(ds_y/this.TASK_HEIGHT)*2/Math.PI*105;
                childNode.style.transform = `rotateX(${deg}deg)`;
            }else{
                this.Touch.moveX(this.touchEle,ds_x);
            }
        },
        onTouchEnd(e){
            if(this.disabledTouch){return ;}
            clearTimeout(this.timer);    //放置点击事件触发drag
            if(this.drag){
                this.touchInstance.ele.classList.remove("high-index");
            }
            let ds_x = (this.moveX - this.startX)*Clear.Config.SLIDING_VELOCITY;
            let ds_y = (this.moveY - this.startY)*Clear.Config.SLIDING_VELOCITY;
            console.log(this.startX,this.moveX,this.startY,this.moveY,ds_x,ds_y,this.direction);
            if(this.direction === "top-bottom"){
                if(!Number.isNaN(ds_y) && ds_y){
                    if(ds_y >= this.TASK_HEIGHT){
                        this.Touch.moveY(content,this.TASK_HEIGHT);
                        //taskListNode.classList.add("mask");
                        maskNode.classList.remove("hide");
                        maskNode.style.height = window.innerHeight - this.TASK_HEIGHT+"px";
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
        handleTaskClick(e){
            console.log("handleTaskClick",e.clientY,e.pageY,e.screenY);
            maskNode.classList.remove("hide");
            maskNode.style.height = window.innerHeight+"px";
            this.touchInstance.ele.classList.add("high-index");
        },
        handleMaskClick(e){       //点击也会触发touchend,handleClick最后被触发
            console.log("handleMaskClick",e.clientY,e.pageY,e.screenY);
            //taskListNode.classList.remove("mask");
            maskNode.classList.add("hide");
            if(this.touchInstance.ele.classList.contains("high-index")){
                this.touchInstance.ele.classList.remove("high-index");
                let value = this.touchInstance.ele.querySelector("input").value;
                if(value){
                    this.touchInstance.edit(value);
                }else{
                    this.touchInstance.del();
                    setTimeout(() => {
                        taskListNode.removeChild(this.touchInstance.ele);
                        this.update(Clear.Config.TASK_CLEAR_DELAY);
                    },Clear.Config.TASK_CLEAR_DELAY);
                }
            }else{
                let inputNode = taskCreateNode.querySelector("[name=task-name]");
                let value = inputNode.value;
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
                inputNode.value = "";
            }
        }
    }
})();

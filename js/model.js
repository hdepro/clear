/**
 * Created by heben.hb on 2017/8/5.
 */

Clear.Model = (function(){
    return {
        init(){
            let default_task_list = [
                {
                    id:1,
                    name:"heben1",
                    state:0,
                    items:[
                        {id:1,name:"heben item 1",state:0},
                        {id:2,name:"heben item 2",state:0},
                        {id:3,name:"heben item 3",state:0},
                        {id:4,name:"heben item 4",state:0},
                        {id:5,name:"heben item 5",state:1}
                    ]
                },
                {
                    id:2,
                    name:"heben2",
                    state:0,
                    items:[
                        {id:1,name:"heben item 1",state:0},
                        {id:2,name:"heben item 1",state:1},
                        {id:3,name:"heben item 1",state:0}
                    ]
                },
                {id:3,name:"heben3",state:1,items:[{id:1,name:"heben3 item 1",state:0}]},
                {id:4,name:"heben4",state:1,items:[{id:1,name:"heben4 item 1",state:0}]},
                {id:5,name:"heben5",state:1,items:[{id:1,name:"heben5 item 1",state:0}]},
            ];

            this.task_list = localStorage.getItem("task_list");
            if(this.task_list){
                this.task_list = JSON.parse(this.task_list);
            }else{
                this.task_list = default_task_list;
            }
            this.taskId = Math.max.apply(this,this.task_list.map(t => t.id));
        },
        data(){
            let temp = [...this.task_list];
            return temp;
        },
        updateLocalStorage(){
            localStorage.setItem("task_list",JSON.stringify(this.task_list));
        },
        generateTaskId(){
            return ++this.taskId;
        },
        createTask(name){
            let data = {id:this.generateTaskId(),name,state:0,items:[]};
            this.task_list.unshift(data);
            this.updateLocalStorage();
            return Object.assign({},data);
        },
        delTask(id){
            let index = this.task_list.findIndex(t => t.id === id);
            this.task_list.splice(index,1);
            this.updateLocalStorage();
        },
        finishTask(id){
            let task = this.task_list.find(t => t.id === id);
            task.items.forEach(item => {
                this.finishItem(id,item.id);
            });
            task.state = 1;
            this.updateLocalStorage();
        },
        editTask(id,name){
            let task = this.task_list.find(t => t.id === id);
            task.name = name;
            this.updateLocalStorage();
        },
        changeTaskSort(index,newIndex){
            console.log("changeTaskSort",index,newIndex);
            let tmp = this.task_list[index];
            this.task_list.splice(index,1);
            this.task_list.splice(newIndex,0,tmp);
            this.updateLocalStorage();
        },
        getTaskItems(taskId){
            let task = this.task_list.find(t => t.id === taskId);
            return task.items;
        },
        generateItemId(taskId){
            //需要修改
            let items = this.getTaskItems(taskId);
            let lastIndex = items.length - 1;
            return items[lastIndex].id+1;
        },
        createItem(taskId,name){
            let data = {id:this.generateItemId(taskId),name,state:0};
            let items = this.getTaskItems(taskId);
            items.unshift(data);
            this.updateLocalStorage();
            return Object.assign({},data);
        },
        delItem(taskId,itemId){
            let items = this.getTaskItems(taskId);
            let index = items.findIndex(i => i.id === itemId);
            items.splice(index,1);
            this.updateLocalStorage();
        },
        finishItem(taskId,itemId){
            let items = this.getTaskItems(taskId);
            let item = items.find(i => i.id === itemId);
            item.state = 1;
            this.updateLocalStorage();
        }
    }
})();

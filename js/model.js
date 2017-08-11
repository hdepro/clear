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
                    items:[
                        {id:1,name:"heben item 1",state:0},
                        {id:2,name:"heben item 1",state:1},
                        {id:3,name:"heben item 1",state:0}
                    ]
                },
                {id:3,name:"heben3",items:[{id:1,name:"heben3 item 1",state:0}]},
                {id:4,name:"heben4",items:[{id:1,name:"heben4 item 1",state:0}]},
                {id:5,name:"heben5",items:[{id:1,name:"heben5 item 1",state:0}]},
            ];

            this.task_list = localStorage.getItem("task_list");
            if(this.task_list){
                this.task_list = JSON.parse(this.task_list);
            }else{
                this.task_list = default_task_list;
            }
        },
        data(){
            let temp = [...this.task_list];
            return temp.reverse();
        },
        updateLocalStorage(){
            localStorage.setItem("task_list",JSON.stringify(this.task_list));
        },
        generateId(){
            let lastIndex = this.task_list.length - 1;
            console.log(lastIndex,this.task_list[lastIndex]);
            return this.task_list[lastIndex].id+1;
        },
        create(name){
            let data = {id:this.generateId(),name,items:[]};
            this.task_list.push(data);
            this.updateLocalStorage();
            return Object.assign({},data);
        },
        del(id){
            let index = this.task_list.findIndex(t => t.id === id);
            this.task_list.splice(index,1);
            this.updateLocalStorage();
        }
    }
})();

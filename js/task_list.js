/**
 * Created by heben.hb on 2017/7/26.
 */

let default_task_list = [
    {
        name:"heben1",
        items:[
            {name:"heben item 1",state:0},
            {name:"heben item 2",state:0},
            {name:"heben item 3",state:0},
            {name:"heben item 4",state:0},
            {name:"heben item 5",state:1}
        ]
    },
    {
        name:"heben2",
        items:[
            {name:"heben item 1",state:0},
            {name:"heben item 1",state:1},
            {name:"heben item 1",state:0}
        ]
    },
    {name:"heben3",items:[{name:"heben3 item 1",state:0}]},
    {name:"heben4",items:[{name:"heben4 item 1",state:0}]},
    {name:"heben5",items:[{name:"heben5 item 1",state:0}]},
];

let task_list = localStorage.getItem("task_list");
if(task_list){
    task_list = JSON.parse(task_list);
}else{
    task_list = default_task_list;
}

let content = document.querySelector(".content");
const initDom = () => {
    let domStr = "";
    task_list.forEach(task => {
        domStr += `<li class="task">${task.name}<span class="task-num">${task.items.length}
                  </span></li>`;
    });
    content.innerHTML = domStr;
};

const init = () => {
    initDom();
};

init();
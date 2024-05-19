// ELementleri Seçme
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners();

function eventListeners(){   // Tüm event listenerlar
    form.addEventListener("submit",addTodo);
    document.addEventListener("DOMContentLoaded",loadAllTodosToUI);
    secondCardBody.addEventListener("click", deleteTodo);
    filter.addEventListener("keyup",filterTodos); //keyup önemli yoksa buga giriyo deneyerek buldum
    clearButton.addEventListener("click",clearAllTodos)

}

function clearAllTodos(){
    if(confirm("Hepsini silmek istediğinize emin misiniz?")){
        //ui dan kaldırma
        while(todoList.firstElementChild !== null){
            todoList.removeChild(todoList.firstElementChild);
        }
        //local storageden silmek içinse key'i silmek yeterli
        localStorage.removeItem("todos");
    }
    

}

function filterTodos(e){
    const filterValue = e.target.value.toLowerCase(); //küçük harfe çevirdik ki algılama daha precise çalışsın
    const listItems = document.querySelectorAll(".list-group-item");

    listItems.forEach(function(listItem){
        const text = listItem.textContent.toLowerCase();//precise için lowercase
        if(text.indexOf(filterValue) === -1){ //bulamazsa
            listItem.setAttribute("style","display : none!important "); //bootstrap class özelliğini ezmek için important 
                                                                                                    
        }
        else{ //bulursa
            listItem.setAttribute("style","display : block ");
        }
        
    })
    
}

function loadAllTodosToUI(){//sayfa yüklendiğinde local storagedan todoları ekleme
   let todos = getTodosFromStorage();
   todos.forEach(function(todo){
        addTodoToUI(todo);
   })
}

function deleteTodo(e){ // list item silme (2defa parent kullanmamızın sebebi i => a => li)
    if(e.target.className === "fa fa-remove"){
        e.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
        showAlert("success","To-do Silindi.")
    }
}

function deleteTodoFromStorage(deletetodo){
    let todos = getTodosFromStorage();
    todos.forEach(function(todo,index){
        if (todo === deletetodo ){
            todos.splice(index,1); //arrayden değeri silme
        }
    })

    localStorage.setItem("todos",JSON.stringify(todos)); //storagedan silme (yeni arrayle güncelleme)
}

function addTodo(e){    //todo ekleme 
    const newTodo = todoInput.value.trim();
        if(newTodo ==""){
        showAlert("danger","Lütfen bir to-do girin");
        }

        else{
        addTodoToUI(newTodo);
        addTodoToStorage(newTodo);
        showAlert("success","To-do eklendi.")
        }
    

    e.preventDefault();
}

function getTodosFromStorage(){//storagedan todoları getirme (array olarak)
    let todos;

    if(localStorage.getItem("todos")=== null){
        todos = [];
    }
    else{
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}

function addTodoToStorage(newTodo){
    let todos = getTodosFromStorage();
    todos.push(newTodo);
    localStorage.setItem("todos",JSON.stringify(todos)); // arrayi tekrar stringe çevirerek storagea yükleme
}

function showAlert(type,message){
    const alert = document.createElement("div");
    alert.className =`alert alert-${type}`
    alert.textContent = message;
    firstCardBody.appendChild(alert);

    //alerti 1 saniye sonra silme
    setTimeout(function (){
        alert.remove();
    },1000);
}

function addTodoToUI(newTodo){
    // <li class="list-group-item d-flex justify-content-between">
    //           Todo 1
    //              <a href = "#" class ="delete-item">
    //                  <i class = "fa fa-remove"></i>
    //              </a>
    //              </li>
    // Buradan bakarak element oluşturma işlemini gerçekleştireceğiz.

    //listitem oluşturma
    const listItem = document.createElement("li");
    listItem.className = "list-group-item d-flex justify-content-between";

    //link oluşturma
    const link = document.createElement("a");
    link.href ="#";
    link.className = "delete-item";
    link.innerHTML = "<i class = 'fa fa-remove'></i>";

    //text node ekleme (todonun kendisi)
    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);

    //todo liste list item ekleme
    todoList.appendChild(listItem);
    todoInput.value ="";//ekleme sonrasi input içini temizleme
}
import { auth, db } from "../utils/firebase";
import { v4 as uuidv4 } from "uuid";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteField,
  arrayUnion,
  arrayRemove,
  deleteDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { userAgent } from "next/server";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import useFetchUserData from "../hooks/fetchUserData";
import TodoCard from "./TodoCard";
import { useRouter } from "next/router";
import SignUp from "../pages/SignUp";
import useFetchTodos from "../hooks/fetchTodos";

export default function Main() {
  const router = useRouter();
  const { userInfo, currentUser, logout } = useAuth();
  const [edit, setEdit] = useState(null);
  const [todo, setTodo] = useState("");
  const [edittedValue, setEdittedValue] = useState("");
  const { userData, loading, error } = useFetchUserData();
  const { todos, setTodos } = useFetchTodos();

  useEffect(() => {
    saveUser();
    console.log("TODOS", todos);
  }, [todos]);

  async function saveUser() {
    await setDoc(doc(db, "User", currentUser?.uid), {
      userId: currentUser?.uid,
    });
  }

  const logOut = async () => {
    await logout(auth);
  };

  async function handleAddTodo() {
    const temp = [];
    todos.map((task) => {
      temp.push(task);
    });
    const id = uuidv4();
    temp.push({ todo: todo, completed: false, subtasks: [], taskId: id });
    setTodos(temp);
    const todoRef = doc(db, "tasks", id);
    await setDoc(todoRef, {
      userId: currentUser.uid,
      taskId: id,
      todo: todo,
      completed: false,
      subtasks: [],
    });
  }

  async function handleDelete(userId, taskId) {
    const temp = [];
    todos.map((task) => {
      if (task.taskId != taskId) {
        temp.push(task);
      }
    });
    setTodos(temp);
    const docRef = doc(db, "tasks", taskId);
    await deleteDoc(docRef);
  }

  function handleAddEdit(taskId) {
    return () => {
      setEdit(taskId);
      let temp = null;
      todos.map((task) => {
        if (task.taskId == taskId) {
          temp = task;
        }
      });
      setEdittedValue(temp.todo);
    };
  }

  async function handleEditTodo() {
    if (!edittedValue) {
      return;
    }
    const id = edit;
    let data = null;
    todos.map((task) => {
      if (task.taskId == id) {
        task.todo = edittedValue;
        data = task;
      }
    });
    const docRef = doc(db, "tasks", id);
    await setDoc(docRef, data);
    setEdit(null);
    setEdittedValue("");
  }

  async function handleAddSubTask(userId, taskId, subTask) {
    const temp = [];
    const id = uuidv4();
    let data = null;
    todos.map((task) => {
      if (task.userId == userId && task.taskId == taskId) {
        data = task;
        data["subtasks"]?.push({
          subTaskId: id,
          subTask: subTask,
          completed: false,
        });
        data.userId = currentUser.uid;
        temp.push(data);
      } else {
        temp.push(task);
      }
    });
    // console.log(todos);
    console.log("TEMP", temp);
    setTodos(temp);
    const docRef = doc(db, "tasks", taskId);
    await setDoc(docRef, data);
  }

  async function handleDeleteSubTask(taskId, subTaskId, subTask, completed) {
    const temp = [];
    let data = null;
    todos.map((task) => {
      if (task.taskId == taskId) {
        const index = task["subtasks"].findIndex((x) => x.subTask == subTask);
        console.log("INDEX", index);
        data = task;
        data["subtasks"].splice(index, 1);
        temp.push(data);
      } else {
        temp.push(task);
      }
    });
    setTodos(temp);
    const docRef = doc(db, "tasks", taskId);
    await setDoc(docRef, data);
  }

  async function mainTaskChecked(taskId, currentState) {
    const temp = [];
    let data = null;
    todos.map((task) => {
      if (task.taskId == taskId) {
        data = task;
        data.completed = !currentState;
        data["subtasks"]?.map((sub) => {
          sub.completed = !currentState;
        });
        temp.push(data);
      } else {
        temp.push(task);
      }
    });
    setTodos(temp);
    const docRef = doc(db, "tasks", taskId);
    await setDoc(docRef, data);
  }

  async function checkAll(taskId, subTaskId, currentState) {
    const temp = [];
    let data = null;
    todos.map((task) => {
      if (task.taskId == taskId) {
        data = task;
        let flag = false;
        data["subtasks"].map((sub) => {
          if (sub.subTaskId == subTaskId) {
            sub.completed = !currentState;
            data.completed = false;
          }
        });
        for (let i = 0; i < data["subtasks"].length; i++) {
          if (data["subtasks"][i].completed == true) {
            flag = true;
          } else {
            flag = false;
            break;
          }
        }
        console.log(flag);
        data.completed = flag;
        temp.push(data);
      } else {
        temp.push(task);
      }
    });
    setTodos(temp);
    const docRef = doc(db, "tasks", taskId);
    await setDoc(docRef, data);
  }

  return (
    <div>
      <div className="container">
        <div className="heading">
          <h1>{currentUser.email}</h1>
        </div>
        <div className="input">
          <input
            type={"text"}
            placeholder={"Enter a Task"}
            onChange={(e) => {
              setTodo(e.target.value);
            }}
          />
          <button onClick={handleAddTodo}>Create Task</button>
        </div>
        <div className="tasks">
          <h3>Pending Tasks</h3>
          {!loading && (
            <>
              {todos?.map((task, i) => {
                return (
                  <TodoCard
                    key={i}
                    index={i}
                    userId={task.userId}
                    taskId={task.taskId}
                    handleDelete={handleDelete}
                    edit={edit}
                    setEdit={setEdit}
                    handleAddEdit={handleAddEdit}
                    edittedValue={edittedValue}
                    setEdittedValue={setEdittedValue}
                    handleEditTodo={handleEditTodo}
                    subTasks={task.subtasks}
                    handleAddSubTask={handleAddSubTask}
                    handleDeleteSubTask={handleDeleteSubTask}
                    mainTaskChecked={mainTaskChecked}
                    todos={todos}
                    checkAll={checkAll}
                  >
                    {task.todo}
                  </TodoCard>
                );
              })}
            </>
          )}
        </div>
        <div className="tasks">{""}</div>
      </div>
      <div className="logout">
        <button onClick={logOut}>
          <Link className="link" href={"/"}>
            Logout
          </Link>
        </button>
      </div>
    </div>
  );
}

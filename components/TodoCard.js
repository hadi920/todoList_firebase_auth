import { checkIsManualRevalidate } from "next/dist/server/api-utils";
import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { auth, db } from "../utils/firebase";

export default function TodoCard(props) {
  const { currentUser } = useAuth();
  const [addSubTask, setAddSubTask] = useState(false);
  const [subTask, setSubTask] = useState("");
  const [mainChecked, setMainChecked] = useState(false);
  const [subTaskChecked, setSubTaskChecked] = useState(false);
  const {
    index,
    children,
    userId,
    taskId,
    handleDelete,
    edit,
    setEdit,
    handleAddEdit,
    edittedValue,
    setEdittedValue,
    handleEditTodo,
    subTasks,
    handleAddSubTask,
    handleDeleteSubTask,
    mainTaskChecked,
    todos,
    checkAll,
  } = props;

  useEffect(() => {}, []);

  function toggle() {
    setAddSubTask(!addSubTask);
    //console.log(subTasks);
  }

  function change() {
    setMainChecked(!mainChecked);
  }

  return (
    <>
      <div className={todos[index]["completed"] ? "completed" : "check"}>
        <div className="input-box">
          <div className="editInput">
            {!(edit === taskId) ? (
              <>{children}</>
            ) : (
              <input
                value={edittedValue}
                onChange={(e) => setEdittedValue(e.target.value)}
              />
            )}
            {/* {children} */}
          </div>
          <div className="buttons">
            <div>
              <input
                type={"checkbox"}
                checked={todos[index]["completed"]}
                onChange={() => {
                  setMainChecked(!mainChecked);
                }}
                onClick={() => {
                  //console.log("FROM TODO CARD BEFORE", mainChecked);
                  // mainTaskChecked(taskId, mainChecked);
                  mainTaskChecked(taskId, todos[index]["completed"]);
                  //change();
                }}
              />
              {console.log("FROM TODO CARD", todos)}
            </div>
            {edit === taskId ? (
              <button className="done" onClick={handleEditTodo}>
                Done
              </button>
            ) : (
              <button className="update" onClick={handleAddEdit(taskId)}>
                Update
              </button>
            )}
            <button
              className="del"
              onClick={() => {
                handleDelete(userId, taskId);
              }}
            >
              Delete
            </button>
            <button className="sub" onClick={toggle}>
              Subtask
            </button>
          </div>
        </div>
        <div className="subtasks">
          {!addSubTask ? (
            <>
              <ol>
                {subTasks?.map((tasks, i) => {
                  return (
                    <div className="subtask-item" key={i}>
                      <li key={i}>{tasks["subTask"]}</li>
                      <div>
                        <input
                          type={"checkbox"}
                          checked={tasks["completed"]}
                          onChange={(e) => {
                            setSubTaskChecked(!subTaskChecked);
                          }}
                          onClick={() => {
                            checkAll(taskId, tasks.subTaskId, tasks.completed);
                          }}
                        />
                        <MdDelete
                          className="del-icon"
                          onClick={() =>
                            handleDeleteSubTask(
                              taskId,
                              tasks["subTasksId"],
                              tasks["subTask"],
                              tasks["completed"]
                            )
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </ol>
            </>
          ) : (
            <>
              <input
                type={"text"}
                placeholder={"Enter a Sub Task"}
                onChange={(e) => setSubTask(e.target.value)}
              />
              <button
                onClick={() => {
                  handleAddSubTask(userId, taskId, subTask);
                  setAddSubTask(!addSubTask);
                }}
              >
                Add Subtask
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

{
  /* <i onClick={handleEditTodo} className="fa-solid fa-check px-2 duration-300 hover:scale-125 cursor-pointer"></i>
<i onClick={handleAddEdit(todoKey)} className="fa-solid fa-pencil px-2 duration-300 hover:rotate-45 cursor-pointer"></i> */
}
{
  /* <i onClick={handleDelete(todoKey)} className="fa-solid fa-trash-can px-2 duration-300 hover:scale-125 cursor-pointer"></i> */
}

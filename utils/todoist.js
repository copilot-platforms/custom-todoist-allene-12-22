import { TodoistApi } from "@doist/todoist-api-typescript"
import { projectName } from "./constants"

const api = new TodoistApi(process.env.TODO_API_KEY)
let projectId = 'empty'
let projectList = 'empty'

export const listProjects = async function () {
    projectList= await api.getProjects()
    return projectList
}

export const findProject = async function (clientName) {
    let selectedProject =  projectList.filter(project => project.name === clientName)[0]
    projectId = selectedProject.id
    console.log(selectedProject)
    return selectedProject
}

export const getProjectTasks = async function (proj) {
    let allTasks = await api.getTasks()
    // let projectTasks = allTasks.filter(task => task.projectId === proj)
    return allTasks
}

export const completeTask = async function(task) {
    await api.closeTask(task)
}

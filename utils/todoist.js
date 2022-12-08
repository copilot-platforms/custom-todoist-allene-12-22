import { TodoistApi } from "@doist/todoist-api-typescript"
import { projectName } from "./constants"

const api = new TodoistApi(process.env.TODO_API_KEY)
let projectId = 'empty'

export const findProject = async function () {
    let allProjects = await api.getProjects()
    let selectedProject =  allProjects.filter(project => project.name === projectName)[0]
    projectId = selectedProject.id
    return selectedProject
}

export const getProjectTasks = async function () {
    let allTasks = await api.getTasks()
    let projectTasks = allTasks.filter(task => task.projectId === projectId)
    return projectTasks
}

export const completeTask = async function(task) {
    await api.closeTask(task)
}

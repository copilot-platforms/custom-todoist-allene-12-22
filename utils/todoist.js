import { TodoistApi } from "@doist/todoist-api-typescript"

const api = new TodoistApi(process.env.TODO_API_KEY)

const getProjects = async function (){
    api.getProjects()
    .then((projects) => console.log(projects))
    .catch((error) => console.log(error))
}

export {getProjects}
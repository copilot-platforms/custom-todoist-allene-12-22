import Head from 'next/head'
import Container from '../Components/container'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import { listProjects, findProject, getProjectTasks, completeTask, createTask } from '../utils/todoist'

/* 
-------------GLOBALS-------------------
*/

// VARIABLES
let clientId;
let companyId;
let searchId;


// HEADERS
const portalGetReq = {
    method: 'GET',
    headers: {
        "X-API-KEY": process.env.PORTAL_API_KEY,
        "Content-Type": "application/json"
    }
}




/* 
-------------APP------------------- 
*/

function HomePage(props) {
    const router = useRouter()
    const refreshData = () => { router.replace(router.asPath, '', { scroll: false }) } // REFRESH PROPS WITHOUT SCROLLING

    const [tasks, setTasks] = useState([]) // SELECTED TASK STATE
    const [newTask, setNewTask] = useState('') // NEW TASK STATE
    const project = props.project // PROJECT MATCHED ON PAGE ID

    useEffect(() => {
        let projectTasks = props.tasks.filter(task => task.projectId === project.id) // GET PROJECT TASKS BY ID
        setTasks(projectTasks)
        refreshData()
    }, []);


    const removeTask = (e) => {
        let completedId = e.target.value  // ID OF CLICKED TASK
        completeTask(completedId)
        let newTasks = tasks.filter(task => task.id !== completedId)
        setTasks(newTasks)
    }

    const handleChange = (e) => {
        setNewTask(e.target.value)
    }

    const addTask = async function (e) {
        e.preventDefault(e)
        // CREATE TASK OBJECT TO PASS TO API POST
        let newTaskObj = {
            content: newTask,
            projectId: project.id
        }
        // POST TASK OBJECT AND RETRIEVE UPDATED TASKS
        await createTask(newTaskObj).then((res) => setTasks((prev) => ([
            ...prev,
            res
        ])))
        setNewTask('')
        refreshData()
    }

    // CONDITIONALLY DISPLAY TASKS
    const displayTasks = () => {
        if (tasks.length > 0) {
            return tasks.map(task =>
                <li key={task.id}>
                    <button key={task.id} value={task.id} onClick={(e) => removeTask(e)}>{task.content}</button>
                </li>)
        }
    }


    return (
        <>
            <Container>
                <Head>
                    <title>Custom ToDoist</title>
                </Head>
                <div className='header'><h1>Tasks to Complete</h1></div>
                <div className='header'><h2>{project.name}</h2></div>
                <div className='flex-container'>
                    {tasks.length > 0 ? <h2>Click to complete</h2> : <h2>No tasks here!</h2>}
                    <ul>
                        {displayTasks()}
                    </ul>
                </div>
                <div className='flex-container'>
                    <form onSubmit={e => addTask(e)}>
                        <label>Task:</label>
                        <input type="text" id="newTask" name="newTask" value={newTask} onChange={handleChange} />
                        <input type="submit" value="Add Task" placeholder='Add Task' />
                    </form>
                </div>
            </Container>
        </>
    )
}


export default HomePage






/* 
-------------SERVER-------------------
*/

export async function getServerSideProps(context) {

    // -------------PORTAL API-------------------

    // TEMP CLIENT ID FOR TESTING
    // clientId = '7f999f5e-0b43-4598-97fc-0ccaac0136fe'

    // SET PORTAL CLIENT OR COMPANY ID FROM PARAMS

    clientId = context.query.clientId
    console.log(`clientId: ${clientId}`)

    companyId = context.query.companyId
    console.log(`companyId: ${companyId}`)

    if (clientId !== undefined) {
        const clientRes = await fetch(`https://api-beta.joinportal.com/v1/client/${clientId}`, portalGetReq)
        const clientData = await clientRes.json()
        searchId = `${clientData.givenName} ${clientData.familyName}`
    } else if (companyId !== undefined) {
        const companyRes = await fetch(`https://api-beta.joinportal.com/v1/company/${companyId}`, portalGetReq)
        const companyData = await companyRes.json()
        searchId = companyData.name
    } else {
        console.log('No ID Found')
    }

    console.log(`searchId: ${searchId}`)

    //------    TODOIST ----------------------
    const projects = await listProjects()
    const project = await findProject(searchId)
    const projectTasks = await getProjectTasks()



    // -----------PROPS-----------------------------
    return {
        props: {
            projects: projects,
            project: project,
            tasks: projectTasks
        }
    }
}


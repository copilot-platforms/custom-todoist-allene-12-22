import Head from 'next/head'
import Container from '../Components/container'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import { listProjects, findProject, getProjectTasks, completeTask } from '../utils/todoist'

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
    const refreshData = () => { router.replace(router.asPath) }

    // RESET STATES FUNCTION
    const reset = () => {
        setTasks('')
        setProject('')
    }

    const [selected, setSelected] = useState('')
    const [project, setProject] = useState('')
    console.log(`selected: ${selected}`)
    const [tasks, setTasks] = useState([]) // SELECTED STUDENT STATE
    console.log(`CLIENT PROJECT: ${props.project}`)


    useEffect(() => {
            let projectTasks = props.tasks.filter(task => task.projectId === props.project.id)
            setTasks(projectTasks)
        refreshData()
    }, [selected]);


    const handleClick = (e) => {
        let completedId = e.target.value
        completeTask(completedId)
        let newTasks = tasks.filter(task => task.id !== completedId)
        // console.log(`newtskss!!! ${newTasks}`)
        setTasks(newTasks)
    }

    // CONDITIONALLY DISPLAY 
    const displayTasks = () => {
        if (tasks.length > 0) {
            return tasks.map(task => <li><button key={task.id} value={task.id} onClick={(e) => handleClick(e)}>{task.content}</button></li>)
        }
    }


    return (
        <>
            <Container>
                <Head>
                    <title>Custom ToDoist</title>
                </Head>
                <div className='header'>{project.name ? <h1>{project.name}</h1> : <h1>Select Project</h1>}</div>
                <div className='row'>
                    <div>
                        <select onChange={e => { setSelected(e.target.value) }}>
                            <option value="select project">Select Project</option>
                            {props.projects.map((project) =>
                                <option key={project.id} value={project.id}>{project.name}</option>)}
                        </select>
                    </div>
                </div>
                <div className='flex-container'>
                    {tasks.length > 0 ? <h2>Click to complete</h2> : <h2>No tasks here!</h2>}
                    <ul>
                        {displayTasks()}
                    </ul>
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
    // console.log(`hiiii ${projectTasks}`)



    // -----------PROPS-----------------------------
    return {
        props: {
            projects: projects,
            project: project,
            tasks: projectTasks
        }
    }
}


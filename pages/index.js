import Head from 'next/head'
import Container from '../Components/container'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import { getStudents, updateBeltRank, updateStatus } from '../utils/airtable'


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
        setRank('')
        setStatus('')
        setIsVerified('')
    }


    const [selected, setSelected] = useState('') // SELECTED STUDENT STATE
    console.log('Selected: ' + selected)

    const [rank, setRank] = useState('') // SELECTED STUDENT RANK STATE
    console.log('Rank: ' + rank)

    const [isVerified, setIsVerified] = useState('') // SELECTED STUDENT VERIFIED STATE

    const [status, setStatus] = useState('') // SELECTED STUDENT STATUS (ACTIVE/SUSPENDED) STATE

    const [location, setLocation] = useState('') // SELECTED LOCATION STATE
    console.log('Location: ' + location)


    useEffect(() => {
        // CHECK IF STUDENT IS SELECTED AND SET STATE
        if (selected !== '' && selected !== 'select student') {
            let studentRecord = props.allStudents.filter(student => student.recordId === selected)
            // console.log(studentRecord[0])
            setRank(studentRecord[0].rank)
            setIsVerified(studentRecord[0].isVerified)
            setStatus(studentRecord[0].status)
        } else if (selected === 'select student' || '') {
            reset()
        }
    }, [selected]);





    // UPDATE RANK AND REFRESH DATA
    const handleUpdateRank = async function (id, verified) {
        updateBeltRank(id, verified).then(res => setIsVerified(res))
        refreshData()
    }

    // UPDATE STATUS AND REFRESH DATA
    const handleUpdateStatus = async function (id, status) {
        updateStatus(id, status).then(res => setStatus(res))
        refreshData()
    }

    // CONDITIONALLY DISPLAY ACTIVATE/SUSPEND BUTTON
    const displayStatus = () => {
        if (status === 'Active') {
            return <button value="Suspended" onClick={e => handleUpdateStatus(selected, e.target.value)}>Suspend</button>
        } else if (status === 'Suspended') {
            return <button value="Active" onClick={e => handleUpdateStatus(selected, e.target.value)}>Activate</button>
        } else { return null }
    }


    return (
        <>
            <Container>
                <Head>
                    <title>GB Actions Panel</title>
                </Head>
                <div className='header'><h1>{props.clientName}</h1></div>
                <div className='flex-container'>
                    <div className='row'>Select Student:
                        <div className='custom-select'>
                            <select className="select-selected" onChange={e => { setSelected(e.target.value) }}>
                                <option value="select student">Select Student</option>
                                {props.allStudents.map((student) =>
                                    <option key={student.recordId} value={student.recordId}>{student.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className='row'>Current rank: <span className='input'>{rank}</span></div>
                    <div className='row'>Verified: <span className='input'>{isVerified}</span></div>
                    {isVerified === 'No' ?
                        <div className='row'>
                            <div className='btn'>
                                <button onClick={e => handleUpdateRank(selected, "Yes")}>Verify</button>
                            </div>
                        </div>
                        : null}
                    <div className='row'>Status: <span className='input'>{status}</span></div>
                    <div className='row'>
                        <div className='btn'>
                            {displayStatus()}
                        </div>
                    </div>
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


    // -------------AIRTABLE API -------------------


    const allStudents = await getStudents(searchId) // Calls Airtable API to get all students matched on client name
    const sortStudents = allStudents.sort(function (a, b) {
        let textA = a.name.toUpperCase()
        let textB = b.name.toUpperCase()
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    })


    // -----------PROPS-----------------------------
    return {
        props: {
            clientName: searchId,
            allStudents: sortStudents,
        }
    }
}


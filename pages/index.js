import Head from 'next/head'
import Container from '../Components/container'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import { getStudents, updateBeltRank, getLocation } from '../utils/airtable'


/* 
-------------GLOBALS-------------------
*/

// VARIABLES
let clientId;


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


    const [selected, setSelected] = useState('') // SELECTED STUDENT STATE
    console.log('Selected: ' + selected)
    const [rank, setRank] = useState('') // SELECTED STUDENT RANK STATE
    console.log('Rank: ' + rank)
    const [isVerified, setIsVerified] = useState('') // SELECTED STUDENT VERIFIED STATE


    useEffect(() => {
        // CHECK IF STUDENT IS SELECTED AND SET STATE
        if (selected !== '' && selected !== 'select student') {
            let studentRecord = props.allStudents.filter(student => student.recordId === selected)
            console.log(studentRecord[0])
            setRank(studentRecord[0].rank)
            setIsVerified(studentRecord[0].isVerified)
        } else if (selected === 'select student') { setRank('') }
    }, [selected]);



    // UPDATE RANK AND REFRESH DATA
    const handleUpdateRank = async function (id, verified) {
        updateBeltRank(id, verified).then(res => setIsVerified(res))
        router.replace(router.asPath);
    }


    return (
        <>
            <Container>
                <Head>
                    <title>Example App</title>
                </Head>
                <div className='header'><h1>{props.clientName}</h1></div>
                <div className='row'>Select Student:
                    <select className="input" onChange={e => { setSelected(e.target.value) }}>
                        <option value="select student">Select Student</option>
                        {props.allStudents.map((student) =>
                            <option key={student.recordId} value={student.recordId}>{student.name}</option>)}
                    </select>
                </div>
                <div className='row'>Current rank: <span className='input'>{rank}</span></div>
                <div className='row'>Verified: <span className='input'>{isVerified}</span></div>
                {isVerified === 'No' ?
                    <div className='row'>
                        <button onClick={e => handleUpdateRank(selected, "Yes")}>Verify</button>
                    </div>
                    : null}

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

    // CHECK PORTAL CLIENT ID FROM PARAMS

    // SET PORTAL CLIENT ID FROM PARAMS
    clientId = context.query.clientId

    // GET CLIENT OBJECT FROM clientId -> PORTAL API
    const clientRes = await fetch(`https://api-beta.joinportal.com/v1/client/${clientId}`, portalGetReq)
    const clientData = await clientRes.json()

    // CONSTRUCT FULL NAME
    const fullName = `${clientData.givenName} ${clientData.familyName}`



    // -------------AIRTABLE API -------------------


    const allStudents = await getStudents(fullName)
    const location = await getLocation(fullName)



    // -----------PROPS-----------------------------
    return {
        props: {
            clientName: fullName,
            allStudents: allStudents
        }
    }
}


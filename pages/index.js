import Head from 'next/head'
import Container from '../Components/container'
import { useState, useEffect } from 'react'

import { getStudents, updateBeltRank } from '../utils/airtable'


let clientId;


// HEADERS
const portalGetReq = {
    method: 'GET',
    headers: {
        "X-API-KEY": process.env.PORTAL_API_KEY,
        "Content-Type": "application/json"
    }
}


// -------------Server: Get Props-------------------

export async function getServerSideProps(context) {
    // -------------PORTAL API-------------------
    // CHECK PORTAL CLIENT ID FROM PARAMS
    console.log(`Query: ${context.query.clientId}`)

    // SET PORTAL CLIENT ID FROM PARAMS
    clientId = context.query.clientId
    // SET TEMP ID
    // clientId = 'b7db1342-2158-476f-b967-55b6f5aec60d'

    // GET CLIENT OBJECT FROM clientId -> PORTAL API
    const clientRes = await fetch(`https://api-beta.joinportal.com/v1/client/${clientId}`, portalGetReq)
    const clientData = await clientRes.json()
    const fullName = `${clientData.givenName} ${clientData.familyName}`


    // -------------AIRTABLE API TEST-------------------

    // var Airtable = require('airtable');

    /* DETERMINE BASE 
    
        figure this out!
    
    */

    // INIT BASE + schoolOwnerRecordId
    // var base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(gbBase.naBaseId);

    // Find School Owner Record by Name from Portal Client Object to return list of Students.
    // let studentsArr = []

    // const records = await base(gbTable.students.tableName).select({
    //    // Selecting the record with matching full name
    //     maxRecords: 150,
    //     view: "Grid view",
    //     filterByFormula: `{School Owner (from Gracie Barra Location)} = "${fullName}"`
    // }).firstPage()

    // console.log(records)
    // records.forEach(record => studentsArr.push({
    //     name: record.fields.Student,
    //     recordId: record.id
    // }))
    // console.log(studentsArr)

    const allStudents = await getStudents(fullName)

    // TEMP PROPS
    return {
        props: {
            clientName: fullName,
            allStudents: allStudents
        }
    }
}


// -------------APP-------------------

function HomePage(props) {
    // log clientId on FE
    // const { query } = useRouter();
    // clientId = query.clientId
    // console.log(`Current clientId: ${clientId}`)

    // log all students
    //   console.log(props.allStudents)


    const [selected, setSelected] = useState('')
    console.log('Selected: ' + selected)
    const [rank, setRank] = useState('None')
    console.log('Rank: ' + rank)
    const [isVerified, setIsVerified] = useState('')


    useEffect(() => {
        if (selected !== '' && selected !== 'select student') {
            let studentRecord = props.allStudents.filter(student => student.recordId === selected)
            console.log(studentRecord[0])
            setRank(studentRecord[0].rank)
            setIsVerified(studentRecord[0].isVerified)
        } else if (selected === 'select student') { setRank('None') }
    }, [selected]);


    

    const handleUpdateRank = async function (id, verified) {
        updateBeltRank(id, verified).then(res => setIsVerified(res))
    }


    return (
        <>
            <Container>
                <Head>
                    <title>Example App</title>
                </Head>
                <div>Gracie Barra Location</div>
                <div>School Owner: {props.clientName} </div>
                <div>Select Student:
                    <select onChange={e => { setSelected(e.target.value) }}>
                        <option value="select student">Select Student</option>
                        {props.allStudents.map((student) =>
                            <option key={student.recordId} value={student.recordId}>{student.name}</option>)}
                    </select>
                </div>
                <div>Selected student current rank: {rank}</div>
                <div>Selected student is verified? {isVerified}</div>
                {isVerified === 'No' ?
                    <div>
                        <button onClick={e => handleUpdateRank(selected, "Yes")}>Verify</button>
                    </div>
                    : null}

            </Container>
        </>
    )
}





export default HomePage

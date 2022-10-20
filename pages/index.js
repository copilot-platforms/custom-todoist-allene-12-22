import Head from 'next/head'
import Container from '../Components/container'
import { useRouter } from "next/router";
import {useState} from 'react'
let clientId;



// -------------Constants-------------------


// PORTAL API

// HEADERS
const portalGetReq = {
    method: 'GET',
    headers: {
        "X-API-KEY": process.env.PORTAL_API_KEY,
        "Content-Type": "application/json"
    }
}

// AIRTABLE API -uses airtable npm

// Regional Base Ids
const airtableGB_NA_BaseId = 'appVOKLbql3ITyvNZ'
// const airtableGB_BZ_BaseId = ''
// const airtableGB_EU_BaseId = ''
// const airtableGB_W_BaseId = ''
// const airtableGB_C_BaseId = ''

// Global Table Names - table names shared by all bases - called by using base(table_name)
const global_airtableGB_StudentsTableName = 'Students'
// const global_airtableGB_LWPurchasesName = 'LW Purchases'


//Tables
    
  //// LOCATIONS TABLES
    // const airtableGB_NA_Locs_TableName = ''
    // const airtableGB_NA_Locs_TableId = ''

    // const airtableGB_BZ_Locs_TableName = ''
    // const airtableGB_BZ_Locs_TableId = ''

    // const airtableGB_EU_Locs_TableName = ''
    // const airtableGB_EU_Locs_TableId = ''

    // const airtableGB_W_Locs_TableName = ''
    // const airtableGB_W_Locs_TableId = ''

    // const airtableGB_C_Locs_TableName = ''
    // const airtableGB_C_Locs_TableId = ''


  //// SCHOOL OWNERS TABLES
    const airtableGB_NA_SchOwner_TableName = 'GB Na School Owners'
    // const airtableGB_NA_SchOwner_TableId = ''
    const airtableGB_NA_SchOwner_portalClientIdField = 'fld4yDXdQIs4ehiOZ'

    // const airtableGB_BZ_SchOwner_TableName = ''
    // const airtableGB_BZ_SchOwner_TableId = ''

    // const airtableGB_EU_SchOwner_TableName = ''
    // const airtableGB_EU_SchOwner_TableId = ''

    // const airtableGB_W_SchOwner_TableName = ''
    // const airtableGB_W_SchOwner_TableId = ''

    // const airtableGB_C_SchOwner_TableName = ''
    // const airtableGB_C_SchOwner_TableId = ''


  //// STUDENTS TABLES IDs (use Global Name)
    const airtableGB_NA_Students_TableId = 'tbl3GeXNPhJ1qfBgR'
    // const airtableGB_BZ_Students_TableId = ''
    // const airtableGB_EU_Students_TableId = ''
    // const airtableGB_W_Students_TableId = ''
    // const airtableGB_C_Students_TableId = ''





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


    // PROPS
    // return {
    //     props: { clientData }
    // }

// -------------AIRTABLE API TEST-------------------

    var Airtable = require('airtable');

    /* DETERMINE BASE 
    
        figure this out!
    
    */

    // INIT BASE + schoolOwnerRecordId
    var base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(airtableGB_NA_BaseId);
 
    // Find School Owner Record by Name from Portal Client Object to return list of Students.
    // console.log(fullName)
    let studentsArr = []

    const records = await base(global_airtableGB_StudentsTableName).select({
        // Selecting the record with matching full name
        maxRecords: 150,
        view: "Grid view",
        filterByFormula: `{School Owner (from Gracie Barra Location)} = "${fullName}"`
    }).firstPage()
    
    // console.log(records)
    records.forEach(record => studentsArr.push({
        name: record.fields.Student,
        recordId: record.id
    }))
    // console.log(studentsArr)

    // TEMP PROPS
    return {
        props: { 
            clientName: fullName,
            allStudents: studentsArr
         }
    }
}


// -------------APP-------------------

function HomePage(props) {
    // console.log('hello from web app')
    const { query } = useRouter();
    clientId = query.clientId
    // console.log(`Current clientId: ${clientId}`)
    console.log(props.allStudents)


    const [selected, setSelected] = useState('')
    console.log('Selected: ' + selected)

    return (
        <>
            <Container>
                <Head>
                    <title>Example App</title>
                </Head>
                <div>Gracie Barra Location</div>
                <div>School Owner: {props.clientName} </div>
                <div>Select Student:
                    <select onChange={e =>{ 
                        setSelected(e.target.value) }}>
                        <option value="select student">Select Student</option>
                        {props.allStudents.map((student) => <option key={student.recordId} value={student.recordId}>{student.name}</option>)}
                    </select>
                </div>
            </Container>
        </>
    )
}





export default HomePage

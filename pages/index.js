import Head from 'next/head'
import Container from '../Components/container'
import { useRouter } from "next/router";

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
    // const airtableGB_NA_SchOwner_TableName = ''
    // const airtableGB_NA_SchOwner_TableId = ''

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





// -------------Get Props-------------------

export async function getServerSideProps(context) {
// -------------PORTAL API-------------------
    // CHECK PORTAL CLIENT ID FROM PARAMS
    console.log(`Query: ${context.query.clientId}`)
   
    // SET PORTAL CLIENT ID FROM PARAMS
    // clientId = context.query.clientId

    // GET CLIENT OBJECT FROM clientId -> PORTAL API
    // const clientRes = await fetch(`https://api-beta.joinportal.com/v1/client/${clientId}`, portalGetReq)
    // const clientData = await clientRes.json()

    // PROPS
    // return {
    //     props: { clientData }
    // }

// -------------AIRTABLE API TEST-------------------

    var Airtable = require('airtable');

    /* DETERMINE BASE 
    
        figure this out!
    
    */

    // INIT BASE
    var base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(airtableGB_NA_BaseId);

    // List Records
    base(global_airtableGB_StudentsTableName).select({
        // Selecting the first 3 records in Grid view:
        maxRecords: 3,
        view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.

        records.forEach(function (record) {
            console.log('Retrieved', record.get('Student'));
        });

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();

    }, function done(err) {
        if (err) { console.error(err); return; }
    });

    // TEMP PROPS
    return {
        props: { hi: 'hello' }
    }
}


// -------------APP-------------------

function HomePage(props) {
    console.log('hello from web app')
    const { query } = useRouter();
    clientId = query.clientId
    console.log(`Current clientId: ${clientId}`)

    return (
        <>
            <Container>
                <Head>
                    <title>Example App</title>
                </Head>
                <div>Gracie Barra Location</div>
                {/* {'temp-prop-disp'} */}
                <div>Prop: {props.hi} </div>

                 {/* {'real-prop-disp'} */}
                {/* <div>School Owner: {props.clientData.givenName} {props.clientData.familyName} </div> */}
            </Container>
        </>
    )
}





export default HomePage
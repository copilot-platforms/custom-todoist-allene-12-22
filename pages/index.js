import Head from 'next/head'
import Container from '../Components/container'
import { useRouter } from "next/router";

let clientId;

//Constants
    //Portal
const portalHeaders = {
    method: 'GET',
    headers: {
        "X-API-KEY": process.env.PORTAL_API_KEY,
        "Content-Type": "application/json"
    }
}

    //Airtable
const airtableGetHeaders = {}
const airtablePostHeaders = {}


      //Regional Base Ids
const airtableGB_NA_BaseId = 'appVOKLbql3ITyvNZ'
// const airtableGB_BZ_BaseId = ''
// const airtableGB_EU_BaseId = ''
// const airtableGB_W_BaseId = ''
// const airtableGB_C_BaseId = ''



      //Table Ids
const airtableGB_NA_students_TableId = 'tbl3GeXNPhJ1qfBgR'
// const airtableGB_BZ_students_TableId = ''
// const airtableGB_EU_students_TableId = ''
// const airtableGB_W_students_TableId = ''
// const airtableGB_C_students_TableId = ''





/////Get props////


export async function getServerSideProps(context) {
    /////    PORTAL  API   //////////// 
    //check clientId param
    console.log(`Query: ${context.query.clientId}`)
    //set clientId
    clientId = context.query.clientId
    //fetch portal client id from params
    const clientRes = await fetch(`https://api-beta.joinportal.com/v1/client/${clientId}`, portalHeaders)
    const clientData = await clientRes.json()


    return {
        props: { clientData }
    }
}


////   App   /////
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
                <div>School Owner: {props.clientData.givenName} {props.clientData.familyName} </div>
            </Container>
        </>
    )
}





export default HomePage
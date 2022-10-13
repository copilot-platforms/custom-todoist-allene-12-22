import Head from 'next/head'
import Container from '../Components/container'
import { useRouter } from "next/router";

let clientId;

////Headers////
const portalHeaders = {
    method: 'GET',
    headers: {
        "X-API-KEY": process.env.API_KEY,
        "Content-Type": "application/json"
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


/////Get props////

export async function getServerSideProps(context) {
/////    PORTAL  API   //////////// 
    //check clientId param
    console.log(`Query: ${context.query.clientId}`)
    //set clientId
    clientId= context.query.clientId
    //fetch portal client id from params
    const clientRes = await fetch(`https://api-beta.joinportal.com/v1/client/${clientId}`, portalHeaders)
    const clientData = await clientRes.json()


    return {
        props: { clientData }
    }
}

export default HomePage
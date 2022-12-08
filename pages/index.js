import Head from 'next/head'
import Container from '../Components/container'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'



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
        
    }


    const [selected, setSelected] = useState('') // SELECTED STUDENT STATE
    console.log('Selected: ' + selected)


    useEffect(() => {
        
    }, [selected]);

    
    // CONDITIONALLY DISPLAY 
    const displayStatus = () => {
        
    }


    return (
        <>
            <Container>
                <Head>
                    <title>Custom ToDoist</title>
                </Head>
                <div className='header'><h1>placeholder</h1></div>
                <div className='flex-container'>
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

    // -----------PROPS-----------------------------
    return {
        props: {
            placeholder: 'placeholder'
        }
    }
}


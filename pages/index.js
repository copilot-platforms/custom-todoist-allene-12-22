import Link from 'next/link'
import Head from 'next/head'
import Container from '../Components/container'
import { useRouter } from "next/router";


function HomePage(props) {
    console.log('hello from web app')
    const { query } = useRouter();
    console.log(query.clientId)
    return (
        <>
            <Container>
                <Head>
                    <title>Example App</title>
                </Head>
                <div>Welcome to a test.</div>
                <Link href="/spaces/first"><a>First Space</a></Link>
                <div>Name: {props.json.givenName}</div>
            </Container>
        </>
    )
}

export async function getServerSideProps(context) {
    const tempId = 'b7db1342-2158-476f-b967-55b6f5aec60d'
    const headers = {
        method: 'GET',
        headers: {
            "X-API-KEY": process.env.API_KEY,
            "Content-Type": "application/json"
        }
    }
    const res = await fetch(`https://api-beta.joinportal.com/v1/client/${tempId}`, headers)
    const json = await res.json()
    console.log(json)
    return {
       props: { json }
    }
 }

export default HomePage
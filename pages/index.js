import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Nav from '../components/nav'
import fetch from 'isomorphic-unfetch'

const url = 'http://localhost:8983/solr/objects/select/?q=type:metadata&wt=json'
const solr_content_example = JSON.stringify([
  {
    "id": "M1",
    "type": "metadata",
    "name": "My cool dataset"
  },
  {
    "id": "P1",
    "type": "package",
    "members": [
      "M1"
    ]
  }
], null, 4)

const query_example = '?q={!join from=members to=id}id:{package_id}'

const Home = ({docs}) => (
  <div>
    <Head>
      <title>Home</title>
      <link rel="stylesheet" href="/static/styles.css" />
    </Head>

    <Nav />

    <h1>dataone-solr-refactor-demo</h1>
    <p>
      This is a simple demo of a pretty major change to the DataONE search
      index. Instead of the Solr documents in a Data Package having a
      resourceMap field linking the package member to its package:
    </p>
    <pre>
      {solr_content_example}
    </pre>
    <p>
      we use a Solr <code>join</code> to query for the package members directly:
    </p>
    <pre>
      {query_example}
    </pre>
    <p>
      Click on a dataset in the list below to view the associated package.
    </p>

    <hr />

    <p>Showing {docs.length} dataset(s):</p>

    <ul>
      {docs.map((doc) => (
        <li key={doc.id}>
          <Link href="/metadata/[doc.id]" as={`/metadata/${doc.id}`}>
            <a>{doc.id}: {doc.name}</a>
          </Link>
        </li>
      ))}
    </ul>
  </div>
)

Home.getInitialProps = async ( {req} ) => {
  const res = await fetch(url)
  const json = await res.json()

  return {
    docs: json.response.docs
  }
}

export default Home

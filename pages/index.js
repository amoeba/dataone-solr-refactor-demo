import React from 'react'
import fetch from 'isomorphic-unfetch'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Nav from '../components/nav'
import PageControls from "../components/page_controls"
import { fetch_options } from "../constants.js"
const find_packages_url = function (start) {
  return `http://localhost:8983/solr/objects/select/?q=type:METADATA&start=${start}&wt=json`
}

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

const Home = ({ n, docs }) => {
  const router = useRouter()
  const { page } = router.query;

  return <div>
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
    <PageControls n={n} page={page} param_name="page" base={router.asPath} />
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
}

export default Home

export async function getServerSideProps(context) {
  const start = ((context.query.page ? context.query.page : 1) - 1) * 10
  const res = await fetch(find_packages_url(start), fetch_options)
  let json = await res.json()

  return {
    props: {
      n: json.response.numFound,
      docs: typeof json.response === "undefined" ? [] : json.response.docs,
    }
  }
}

import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'

import Nav from "../../components/nav"
import PageControls from "../../components/page_controls"

const find_package_url = (pid) => {
  return `http://localhost:8983/solr/objects/select/?q=type:package+AND+members:${pid}&wt=json`
}

const find_package_members_url = (pid, start) => {
  return `http://localhost:8983/solr/objects/select/?q={!join%20from=members%20to=id}id:${pid}&start=${start}&sort=id+asc&wt=json`
}

const find_relationships = (pid, start) => {
  return `http://localhost:8983/solr/relationships/select/?q=package_id:${pid}&start=${start}&sort=id+asc&wt=json`
}

const Metadata = ({ n, members, relationships }) => {
  const router = useRouter()
  const { pid, page, rpage } = router.query
  return <div>
    <Head>
      <title>Dataset {pid}</title>
      <link rel="stylesheet" href="/static/styles.css" />
    </Head>
    <Nav />
    <h2>Dataset: {pid}</h2>

    <Link href="/metadata/[doc.id]">
      <a href="" />
    </Link>

    <h3>Files ({n} total)</h3>
    <PageControls n={n} page={page} param_name="page" />
    <table>
      <thead>
        <tr>
          <th>PID</th>
          <th>Name</th>
          <th>Type</th>
          <th>Format</th>
        </tr>
      </thead>
      <tbody>
        {members.map((doc) => (
          <tr key={doc.id}>
            <td>{doc.id}</td>
            <td>{doc.name}</td>
            <td>{doc.type}</td>
            <td>{doc.format}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <h3>Relationships</h3>
    <PageControls n={n} page={rpage} param_name={"rpage"} />
    <table>
      <thead>
        <tr>
          <th>Type</th>
          <th>Subject</th>
          <th>Predicate</th>
          <th>Object</th>
        </tr>
      </thead>
      <tbody>
        {
          relationships
            .filter((doc) => { return doc.type !== "PROVENANCE" })
            .map((doc) => (
              <tr key={doc.id}>
                <td>{doc.type}</td>
                <td>{doc.subject}</td>
                <td>{doc.predicate}</td>
                <td>{doc.object}</td>
              </tr>
            )
            )
        }
      </tbody>
    </table>
  </div>
}

Metadata.getInitialProps = async (req) => {
  // Find package
  const metadata_pid = req.query.pid
  const res = await fetch(find_package_url(metadata_pid), { "mode": "no-cors" })
  const json = await res.json()

  // Find package members
  const start = ((req.query.page ? req.query.page : 1) - 1) * 10
  const relationship_start = ((req.query.rpage ? req.query.rpage : 1) - 1) * 10
  const package_pid = json.response.docs[0].id
  const pkgres = await fetch(find_package_members_url(package_pid, start), { "mode": "no-cors" })
  const pkgjson = await pkgres.json()

  // Find relationships
  const relationshipres = await fetch(find_relationships(package_pid, relationship_start), { "mode": "no-cors" })
  const relationshipjson = await relationshipres.json()

  return {
    n: pkgjson.response.numFound,
    members: pkgjson.response.docs,
    relationships: typeof relationshipjson.response === "undefined" ? [] : relationshipjson.response.docs
  }
}

export default Metadata

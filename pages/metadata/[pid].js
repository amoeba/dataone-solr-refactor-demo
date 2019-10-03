import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import Nav from "../../components/nav"
import PageControls from "../../components/page_controls"

const find_package_url = (pid) => {
  return 'http://localhost:8983/solr/objects/select/?q=type:package+AND+members:' + pid + '&wt=json'
}

const find_package_members_url = ( pid, start ) => {
  return 'http://localhost:8983/solr/objects/select/?q={!join%20from=members%20to=id}id:'+pid+'&wt=json&start=' + start + '&sort=type+desc,id+asc'
}

const Metadata = ({ query, qtime, n, members }) => {
  const router = useRouter()
  const { pid, page } = router.query

  return <div>
    <Head>
      <title>Dataset {pid}</title>
      <link rel="stylesheet" href="/static/styles.css" />
    </Head>
    <Nav />
    <h2>Dataset: {pid}</h2>
    <h3>Package Members ({n} Total)</h3>

    <p>Query: <code>{query}</code></p>
    <p>QTime: <code>{qtime}</code></p>

    <PageControls n={n} page={page}/>

    <Link href="/metadata/[doc.id]">
      <a href="" />
    </Link>

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
  </div>
}

Metadata.getInitialProps = async ( req ) => {
  // Find package
  const metadata_pid = req.query.pid
  const res = await fetch(find_package_url(metadata_pid))
  const json = await res.json()

  // Find package members
  const start = ((req.query.page ? req.query.page : 1) - 1) * 10
  const package_pid = json.response.docs[0].id
  const pkgres = await(fetch(find_package_members_url(package_pid, start)))
  const pkgjson = await pkgres.json()

  return {
    query: find_package_members_url(package_pid, start),
    qtime: pkgjson.responseHeader.QTime,
    n: pkgjson.response.numFound,
    members: pkgjson.response.docs
  }
}

export default Metadata

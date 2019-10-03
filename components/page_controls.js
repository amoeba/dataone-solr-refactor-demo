import Link from 'next/link'

const PageControls = ({ n, page }) => {
  page = Number(page)

  if (!page) {
    page = 1
  }

  const prev = Number(page) - 1
  const next = Number(page) + 1

  let prevControl = null;

  if (page > 1) {
    prevControl = <div>
      <Link href={`?page=[${prev}]`} as={`?page=${prev}`}>
        <a>Page {prev}</a>
      </Link>
    </div>
  } else {
    prevControl = <div></div>
  }

  let nextControl = null;

  if (page * 10 < n ) {
    nextControl = <div>
      <Link href={`?page=[${next}]`} as={`?page=${next}`}>
        <a>Page {next}</a>
      </Link>
    </div>
  } else {
    nextControl = <div></div>
  }

  return <div className="controls">
    {prevControl}
    <div>
      Page {page}
    </div>
    {nextControl}
  </div>
}

export default PageControls

import React from 'react'
import Link from 'next/link'

const Nav = () => (
  <nav>
    <ul>
      <li>
        <Link href='/'>
          <a>Home</a>
        </Link>
      </li>
    </ul>

    <style jsx>{`
      ul {
        display: flex;
        justify-content: space-between;
      }
      nav > ul {
        padding: 0;
        padding: 0;
      }
      li {
        display: flex;
      }
      a {
        color: blue;
        text-decoration: none;
      }
    `}</style>
  </nav>
)

export default Nav

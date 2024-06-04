import React from 'react'
import { pepe } from '../assets'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className='fixed w-full z-50'>
        <div className="flex w-[80%] mx-auto justify-between py-3 px-4">

        <div className="w-[5rem] h-[4rem]">
            <img src={pepe} alt="" className='w-full h-full object-cover' />
        </div>
        <ul className='flex items-center gap-4'>
            <li><Link to="/">Home</Link></li>
            {/* <li>Upload Image</li> */}
        </ul>
        </div>
    </nav>
  )
}

export default Navbar

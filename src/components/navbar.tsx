import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link } from 'react-router'

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const navbarItems = [
    { title: 'Dashboard', path: '/' },
    { title: 'Categories', path: '/categories' },
    { title: 'Author', path: '/author' },
  ]
  return (
    <nav className="w-full bg-white px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-xl font-bold text-purple-600">Spell CMS</div>
        <ul className="hidden space-x-6 md:flex">
          {navbarItems.map((item) => (
            <li key={item.title}>
              <Link
                to={item.path}
                className="text-gray-700 transition-colors hover:text-purple-600"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {isOpen && (
        <ul className="mt-3 space-y-2 md:hidden">
          {navbarItems.map((item) => (
            <li key={item.title}>
              <Link
                to={item.path}
                className="block px-2 py-1 text-gray-700 hover:text-purple-600"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}

import type { CollectionEntry } from 'astro:content'
import Fuse from 'fuse.js'
import type { JSX } from 'preact'
import { useMemo, useState } from 'preact/hooks'
import { ListItem } from './ListItem'

type BlogPost = CollectionEntry<'blog'>

interface Props {
  posts: BlogPost[]
}

const BlogSearch = ({ posts }: Props): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState('')

  const fuse = useMemo(() => {
    const options = {
      keys: ['data.title', 'data.description', 'data.category', 'data.tags'],
      threshold: 0.3,
      includeScore: true,
      useExtendedSearch: true,
    }
    return new Fuse(posts, options)
  }, [posts])

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts

    const results = fuse.search(searchQuery.trim())
    return results.map((result) => result.item)
  }, [fuse, searchQuery])

  return (
    <>
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onInput={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
          placeholder="Search by title, category, or tag ..."
          className="focus:border-primary w-full border-b border-gray-300 bg-white py-3 pl-2 text-base focus:outline-hidden sm:py-2"
        />
        {searchQuery.trim() && (
          <button
            onClick={() => setSearchQuery('')}
            className="hover:text-primary/50 absolute top-1/2 right-4 -mr-2 -translate-y-1/2 p-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="transform"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        )}
      </div>

      <ul className="mt-14 space-y-4 sm:space-y-6">
        {filteredPosts.map((post) => (
          <li key={post.id}>
            <ListItem
              href={`/blog/${post.id}`}
              title={post.data.title}
              description={post.data.description}
            >
              <div className="mt-3">
                <ul className="flex flex-wrap items-center gap-1">
                  <li>
                    <a
                      href={`/blog/category/${post.data.category.toLowerCase()}`}
                      className="bg-primary hover:bg-primary/80 rounded-full px-2 text-sm text-white"
                    >
                      {post.data.category}
                    </a>
                  </li>
                  {post.data.tags.map((tag) => (
                    <li key={tag}>
                      <a
                        href={`/blog/tag/${tag.toLowerCase()}`}
                        className="bg-secondary rounded-full px-2 text-sm text-black transition-colors hover:text-blue-600"
                      >
                        {`# ${tag}`}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </ListItem>
          </li>
        ))}
      </ul>
    </>
  )
}

export default BlogSearch

import { promises as fs } from 'fs'
import path from 'path'

//const postsDirectory = path.join(process.cwd(), 'posts')

/* export async function getStaticPaths() {
  const postsDirectory = path.join(process.cwd(), 'posts')
  const fileNames = await fs.readdir(postsDirectory)
  fileNames.map(fileName => {
    return {
      params: {
        id: fileName.replace(/\.md$/, '')
      }
    }
  }) 

  const paths = fileNames;
  return {
    paths,
    fallback: false
  }
}
*/

// posts will be populated at build time by getStaticProps()
function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li>
          <h3>{post.name}</h3>
          <p>{post.content}</p>
        </li>
      ))}
    </ul>
  )
}


export async function getStaticPaths() {
  
  const postsDirectory = path.join(process.cwd(), 'posts')
  const fileNames = await fs.readdir(postsDirectory)
  const posts = fileNames.map(fileName => {
    return {
      params: {
        id: fileName.replace(/\.md$/, '')
      }
    }
  }) 

  return {
    paths: posts,
    fallback: false
  }

/*   return {
    paths: [
      { params: { id: 'test' } },
      { params: { id: 'pre-rendering' } }
    ],
    fallback: false // See the "fallback" section below
  }; */
}

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries. See the "Technical details" section.
export async function getStaticProps() {
  //const postsDirectory = path.join(process.cwd(), 'posts')
  const postsDirectory = "posts/"
  const filenames = await fs.readdir(postsDirectory)

  const posts = filenames.map(async (fileName) => {
    const filePath = path.join(postsDirectory, fileName)
    const fileContents = await fs.readFile(filePath, 'utf8')

    // Generally you would parse/transform the contents
    // For example you can transform markdown to HTML here
    return {
      // Set the current element of posts to a post with post.name and post.content
      name: fileName.replace(/\.md$/, ''), 
      content: fileContents,
    }
  }) // End posts Map
  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      posts: await Promise.all(posts),
    },
  }
}

export default Blog
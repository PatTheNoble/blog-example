import { promises as fs } from 'fs'
import fs2 from 'fs'
import path from 'path'
import matter from 'gray-matter'
import html from 'remark-html'
import remark from 'remark'

// post will be populated at build time by getStaticProps()
function Blog({ post }) {
  return (
    <div>
      <h3>{post.name}</h3>
      <div dangerouslySetInnerHTML={{ __html: post.content}} />
    </div>
  )
}


export async function getStaticPaths() {
  const fileNames = await fs.readdir("posts/")
  const postNames = fileNames.map(fileName => {
    return {
      params: {
        id: fileName.replace(/\.md$/, '')
      }
    }
  }) 

  return {
    paths: postNames,
    fallback: false
  }
}

// params is an optional parameter that gets passed in under the hood.
export async function getStaticProps({params}) {

  const fullPath = path.join("posts/", `${params.id}.md`)
  const fileContents = fs2.readFileSync(fullPath, 'utf8')

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

  return {
    props: {
      post:{
        id: params.id,
        name: params.id,
        content: contentHtml,
      }
    },
  }
}

export default Blog
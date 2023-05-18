import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postView";
import { generateSsgHelper } from "~/server/helpers/ssgHelper";

 
const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {

  const { data } = api.posts.getById.useQuery({ id, })

  if (!data) return <div>Something went wrong!</div>


  return (
    <>
      <Head>
        <title>{`${data.post.content ?? ''} - ${data.author.username ?? ''}`}</title>
      </Head>
      <PageLayout>
         <PostView {...data}/>
      </PageLayout>
    </> 
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSsgHelper()

  const id = context.params?.id

  if (typeof id !== 'string') throw new Error('slug must be a string')

  await ssg.posts.getById.prefetch({ id })

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id
    }
  }
}

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" }
}

export default SinglePostPage;

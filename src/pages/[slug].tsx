import { GetStaticProps, InferGetStaticPropsType, type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import Image from "next/image";
// type PageProps = InferGetStaticPropsType<typeof getStaticProps>


const ProfilePage: NextPage<{ username: string }> = ({ username }) => {

  const { data } = api.profile.getUserByUsername.useQuery({ username, })

  if (!data) return <div>Something went wrong!</div>
  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <PageLayout>
        <div className='relative h-48 border-b border-slate-400 bg-slate-600'>
          <Image className="-mb-[64px] bg-black absolute bottom-0 left-0 ml-4 rounded-full border-4 border-black" width={128} height={128} src={data.profileImageUrl} alt={`${data.username ?? ""}'s profile picture`} />
        </div>

        <div className="h-[64px]">

        </div>
        <div className="p-4 text-2xl font-bold">{`@${data.username ?? ""}`}</div>
        <div className="border-b border-slate-400"> </div>
      </PageLayout>
    </>
  );
};
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from '~/server/api/root';
import { prisma } from "~/server/db";
import superjson from 'superjson';
import { TRPCContext } from "@trpc/react-query/shared";
import { TRPCError } from "@trpc/server";
import { TypeOf } from "zod";
import { PageLayout } from "~/components/layout";

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson, // optional - adds superjson serialization
  });

  const slug = context.params?.slug

  if (typeof slug !== 'string') throw new Error('slug must be a string')

  const username = slug.replace('@', '')

  await ssg.profile.getUserByUsername.prefetch({ username })

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username
    }
  }
}

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" }
}

export default ProfilePage;

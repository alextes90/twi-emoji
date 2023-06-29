import { type GetStaticPaths, type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { Layout } from "~/components/Layout";
import { PostView } from "~/components/PostView";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const postId = context.params?.id as string;

  if (typeof postId !== "string") throw new Error("no slug");

  await ssg.posts.getPostById.prefetch({ postId });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      postId,
    },
  };
};

const SinglePostPage: NextPage<{ postId: string }> = ({ postId }) => {
  const { data } = api.posts.getPostById.useQuery({ postId });

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{`${data.post.content} - @${data.author.username || ""}`}</title>
      </Head>
      <Layout>
        <PostView post={data.post} author={data.author} />
      </Layout>
    </>
  );
};

export default SinglePostPage;

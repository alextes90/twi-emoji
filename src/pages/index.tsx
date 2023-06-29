import { type NextPage } from "next";
import { api } from "~/utils/api";
import Image from "next/image";
import { LoadingPage, LoadingSpinner } from "~/components/Loading";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Layout } from "~/components/Layout";
import { PostView } from "~/components/PostView";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

const Home: NextPage = () => {
  // Start fetching data asap and will put it in cache
  api.posts.getAll.useQuery();

  return (
    <Layout>
      <div className="flex border-b border-slate-400 p-4">
        <AuthShowcase />
      </div>
      <Feed />
    </Layout>
  );
};

export default Home;

const Feed = () => {
  const { data, isLoading } = api.posts.getAll.useQuery();

  if (isLoading) return <LoadingPage />;

  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col">
      {data?.map(({ post, author }) => {
        return <PostView key={post.id} post={post} author={author} />;
      })}
    </div>
  );
};

const PostWizard = () => {
  const { isLoaded, isSignedIn} = useUser();
  const [inputVal, setInputVal] = useState("");
  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInputVal("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to post! Please try again latter");
      }
    },
  });


  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <>
      <input
        placeholder="Type some emojis!"
        className="grow bg-transparent outline-none focus:border-b-2 focus:border-slate-400"
        value={inputVal}
        type="text"
        onChange={(e) => setInputVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (inputVal !== "") {
              mutate({ content: inputVal });
            }
          }
        }}
        disabled={isPosting}
      />
      {inputVal !== "" && !isPosting && (
        <button onClick={() => mutate({ content: inputVal })}>Post</button>
      )}
      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={20} />
        </div>
      )}
    </>
  );
};

const AuthShowcase: React.FC = () => {
  const { isSignedIn, user } = useUser();

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <div className="flex w-full justify-between">
        <p className="text-center text-2xl text-white">
          {user && <span>Logged in as {user?.firstName}</span>}
        </p>
        <div className="flex gap-3">
          {user ? (
            <Image
              className="rounded-full"
              src={user?.imageUrl || ""}
              alt="Profile Image"
              height={56}
              width={56}
            />
          ) : (
            ""
          )}
          <div className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
            {!isSignedIn && <SignInButton mode="modal" />}
            {isSignedIn && <SignOutButton />}
          </div>
        </div>
      </div>
      <div className="flex w-full">
        <PostWizard />
      </div>
    </div>
  );
};

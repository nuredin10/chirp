import { type NextPage } from "next";
import Image from "next/image";
import { api } from "~/utils/api";
import { SignInButton, useUser } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postView";

const CreatePostWizard = () => {
  const { user } = useUser();

  const [input, setInput] = useState<string>('')

  const ctx = api.useContext()

  const {mutate, isLoading: isPosting} = api.posts.create.useMutation({
    onSuccess: ()=>{
      setInput('');
      void ctx.posts.getAll.invalidate()
    },

    onError: (e)=>{
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if(errorMessage && errorMessage[0]){
        toast.error(errorMessage[0])
      } else{
        toast.error('Failed to post! Please try again later.')
      }
    }
  })

  console.log(user)
  if (!user) return null

  return (
    <div className='flex w-full gap-3'>
      <Image width={56} height={56} src={user.profileImageUrl} alt='profile image' className='w-14 h-14 rounded-full' />
      <input disabled={isPosting} type="text"  value={input}
      onKeyDown={(e) =>{
        if(e.key === 'Enter'){
          e.preventDefault();
          if(input !== ''){
          mutate({content: input})
          }
        }  
      }}
      onChange={(e) => setInput(e.target.value)} placeholder='Type some emojis!' className='outline-none bg-transparent grow' />
     { input !== ''&& !isPosting && (

      <button onClick={()=>mutate({content: input})}>Post</button>
     )} 

     {
      isPosting && <div className="flex items-center justify-center "><LoadingSpinner size={20}/></div>
     }

    </div>
  )
}


const Feed = ()=>{

  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if(postsLoading) return <LoadingPage/>

  if(!data) return <div>Something went wrong!</div>

  return (
    <div className='flex flex-col'>
            {
              data?.map((fullPost) => (
                <PostView {...fullPost} key={fullPost.post.id}/>
              ))
            }
          </div>
  )

}

const Home: NextPage = () => {
  const {isLoaded: userLoaded, isSignedIn} = useUser();

  api.posts.getAll.useQuery();

  if(!userLoaded) return <div/>

  // if (isLoading) return <LoadingPage/>
  // if (!data) return <div>Something went wrong</div>;


  return (
    <>
      <PageLayout>
      <div className="border-b border-slate-400 p-4">
            {!isSignedIn && (
              <div className="flex justify-center">
                <SignInButton />
              </div>
            )}
            {isSignedIn && <CreatePostWizard />}
          </div>
          
          <Feed/>
          </PageLayout>
    </>
  );
};

export default Home;

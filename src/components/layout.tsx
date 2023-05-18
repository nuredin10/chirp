import type { PropsWithChildren } from "react";


export const PageLayout = (props: PropsWithChildren) =>{
    return (
        <main className="flex h-screen justify-center">
        <div className="h-full w-full md:max-w-2xl border-x border-slate-400 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-black-300 overflow-y-scroll">
            {props.children}
        </div>
        </main> 
    )
}
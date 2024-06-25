"use client"

import { api } from "@/convex/_generated/api";
import { useSearch } from "@/hooks/use-search";
import { useUser } from "@clerk/clerk-react"
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { File } from "lucide-react";

export const SearchCommand=()=>{

    const { user } =useUser();
    const router=useRouter();

    const documents=useQuery(api.documents.getSearch);
    const [isMounted,setIsMounted]=useState(false);

    const toggle=useSearch((store)=>store.toggle);
    const isOpen=useSearch((store)=>store.isOpen);
    const onClose=useSearch((store)=>store.onClose);

    useEffect(()=>{
        setIsMounted(true);
    },[]);

    useEffect(()=>{
        const down=(e:KeyboardEvent)=>{
            if(e.key==="k" && (e.ctrlKey || e.metaKey)){
                e.preventDefault();
                toggle();
            }
        }
        document.addEventListener("keydown",down);
        return ()=> document.removeEventListener("keydown",down);
    },[toggle]);

    if(!isMounted){
        return null;
    }

   

    const onSelect=(id:string)=>{
        router.push(`/documents/${id}`);
        onClose();
    }

    return (
        <CommandDialog open={isOpen} onOpenChange={onClose}>
            <CommandInput
             placeholder={`Search ${user?.fullName}'s Jotion...`}
             />
             <CommandList>
            <CommandEmpty>
                No results found.
            </CommandEmpty>
            <CommandGroup heading="Documents">
                {documents?.map((doc)=>(
                    <CommandItem
                     key={doc._id}
                     value={`${doc._id}-${doc.title}`}
                     title={doc.title}
                     onSelect={onSelect}

                    >
                     {doc.icon ? (
                        <p className=" mr-2 text-[18px]">
                           {doc.icon}     
                        </p>
                     ):(
                        <File className=" mr-2 h-4 w-4 "/>
                     )}   
                       <span>{doc.title}</span> 
                    </CommandItem>
                ))}
            </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}
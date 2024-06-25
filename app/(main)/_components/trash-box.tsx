"use client"

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Search, Trash, Undo } from "lucide-react";
import { useParams, useRouter } from "next/navigation"
import { useState } from "react";
import { toast } from "sonner";

export const TrashBox=()=>{

    const router =useRouter();
    const params=useParams();

    const documents=useQuery(api.documents.getTrash);
    const restore=useMutation(api.documents.restore);
    const remvoe=useMutation(api.documents.remove);

    const [search,setSearch]=useState("");
    
    const filterDocuments=documents?.filter((document)=>{
        return document.title.toLowerCase().includes(search.toLowerCase());
    });

    const onClick=(doucmentId:string)=>{
        router.push(`/doucments/${doucmentId}`);
    };

    const onRestore=(
        event:React.MouseEvent<HTMLDivElement,MouseEvent>,
        documentId:Id<"documents">,
    )=>{
        event.stopPropagation();
        const promise=restore({id:documentId});
        toast.promise(promise,{
            loading:"Restoring note...",
            success:"Note restored successfully",
            error:"Failed to restore note."
        });
    };

    const onRemvoe=(
       
        documentId:Id<"documents">,
    )=>{
      
        const promise=remvoe({id:documentId});
        toast.promise(promise,{
            loading:"Deleting note...",
            success:"Note deleted successfully",
            error:"Failed to delete note."
        });
        if(params.documentId=== documentId){
            router.push("/documents");
        }
    };

    if(documents === undefined){
        return (
            <div className=" h-full flex items-center justify-center p-4">
                <Spinner size="lg"/>
            </div>
        )
    }
    return (
        <div className=" text-sm">
            <div className=" flex items-center gap-x-1 p-2">
               <Search className="w-4 h-4"/>
               <Input
                value={search}
                onChange={(e)=> setSearch(e.target.value)}
                className=" h-7 px-2 focus-visible:ring-transparent bg-secondary "
                placeholder="Filter by page title..."
               /> 
            </div>
            <div className="mt-2 px-1 pb-1">
               <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
                No documents found.
                </p> 
                {filterDocuments?.map((document)=>(
                    <div 
                    key={document._id}
                    role="button"
                    onClick={()=>onClick(document._id)}    
                    className=" text-sm rounded-sm w-full hover:bg-primary/5
                     items-center flex text-primary justify-between" 
                      >
                      <span className=" truncate pl-2">
                        {document.title}
                        </span>  
                       <div className=" flex items-center ">
                        <div
                         onClick={(e)=>onRestore(e,document._id)}
                         role="button"
                         className=" rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                         >
                          <Undo className=" h-4 w-4 text-muted-foreground"/>  
                        </div>
                        <ConfirmModal onConfirm={()=>onRemvoe(document._id)}>
                        <div
                          role="button"
                          className=" rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600 ">
                            <Trash className="w-4 h-4 text-muted-foreground"/>
                          </div> 
                          </ConfirmModal> 
                        </div> 
                    </div>
                ))}
            </div>    
        </div>
    )
}
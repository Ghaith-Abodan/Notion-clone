"use client"

import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useCoverImage } from "@/hooks/use-cover-image"
import { useEdgeStore } from "@/lib/edgestore"
import { cn } from "@/lib/utils"
import { useMutation } from "convex/react"
import { ImageIcon, X } from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Skeleton } from '@/components/ui/skeleton';

interface CoverProps{
    imageUrl?:string,
    preview?:boolean,
}
export const Cover=({
    imageUrl,
    preview
}:CoverProps)=>{

    const { edgestore }=useEdgeStore();
    const params=useParams();
    const coverImage=useCoverImage();
    const removeCoverImage=useMutation(api.documents.remvoeCoverImage);

    const onRemvoe=async()=>{

        if(imageUrl){
            await edgestore.publicFiles.delete({
                url: imageUrl,
              });
        }
       
        
        removeCoverImage({
            id:params.documentId as Id<"documents">
        })
    }
    return (
        <div className={cn(" relative w-full h-[35vh] group",
        !imageUrl && "h-[12vh]",
        imageUrl && "bg-muted"
        )}>
            {!!imageUrl && (
                <Image
                alt="coverImage"
                src={imageUrl}
                fill
                className=" object-cover"
                
                />
            )}
            {imageUrl && !preview && (
                <div className=" opacity-0 group-hover:opacity-100
                  absolute bottom-5 right-5 flex items-center gap-x-2">
                   <Button
                    onClick={()=>coverImage.onReplace(imageUrl)}
                    className=" text-muted-foreground text-xs"
                    variant="outline"
                    size="sm"
                   >
                    <ImageIcon className=" h-4 w-4 mr-2"/>
                    Change cover
                    </Button> 

                    <Button
                    onClick={onRemvoe}
                    className=" text-muted-foreground text-xs"
                    variant="outline"
                    size="sm"
                   >
                    <X className=" h-4 w-4 mr-2"/>
                     Remove
                    </Button> 
                </div>
            )}
        </div>
    )

}

Cover.Skeleton=function CoverSkeleton(){
    return (
        <Skeleton className=" w-full h-[12vh]" />
    )
}
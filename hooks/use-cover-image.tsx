import { create } from "zustand";

type CoverImageStore={
    imageUrl?: string;
    isOpen:boolean;
    onOpen:() => void;
    onClose:() => void;
    onReplace:(imageUrl:string) => void;
  
};

export const useCoverImage=create<CoverImageStore>((set)=>({
 imageUrl:undefined,   
 isOpen:false,
 onOpen:()=>set({isOpen:true}),
 onClose:()=>set({isOpen:false,imageUrl:undefined}),
 onReplace:(imageUrl:string)=>set({isOpen:true,imageUrl:imageUrl}),

}))
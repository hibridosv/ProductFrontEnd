"use client";
import { Image as Imagen } from "@/services/products";
import Image from "next/image";
import { URL } from "@/constants";


export interface ListImagesProps {
  images?: Imagen[] | any;
}

export function ListImages(props: ListImagesProps) {
  const { images } = props;
  

const imageLoader = ({ src, width, quality }: any) => {
  return `${URL}storage/images/${src}?w=${width}&q=${quality || 75}`
}
 
  const listItems = images?.map((image: Imagen) => (
    <div key={image.id} className="m-2">
    <Image loader={imageLoader} src={image.image} alt={image.description} width={100} height={100} style={{ maxWidth: "100px", display: "block", maxHeight:"100px", objectFit: "cover"}} />
    </div>
  ));




  return (
        <div className="flex justify-center mt-8 border-blue-600">
          { listItems }
        </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Image as Imagen } from "@/services/products";
import { getData } from "@/services/resources";
import { Loading } from "../loading/loading";
import { getTenant, getUrlFromCookie } from "@/services/oauth";


export interface ListImagesOfProductsProps {
  productId?: string;
  state?: any;
  visible?: boolean;
}

export function ListImagesOfProducts(props: ListImagesOfProductsProps) {
  const { productId, state, visible } = props;
  const [ images, setImages ] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const remoteUrl = getUrlFromCookie();
  const tenant = getTenant();
  
  const loadImages = async () => {
    setIsLoading(true);
    try {
      const response = await getData(`images/${productId}`);
      setImages(response.data);
    } catch (error) {
      console.error("mierda");
    } finally {
      setIsLoading(false);
    }
};

useEffect(() => {
    if (!state && productId && visible) {
        (async () => await loadImages())();
    }
  // eslint-disable-next-line
}, [state, productId, visible]);

if(!images) return <div></div>

const imageLoader = ({ src, width, quality }: any) => {
  return `${remoteUrl}/storage/public/${tenant}/products/${src}?w=${width}&q=${quality || 75}`
}
 
  const listItems = images?.map((image: Imagen) => (
    <div key={image.id} className="mx-2">
    <Image loader={imageLoader} src={image.image} alt={image.description} width={100} height={100} style={{ maxWidth: "100px", display: "block", maxHeight:"100px", objectFit: "cover"}} />
    </div>
  ));

  return (<div className="flex justify-center mt-3 border-blue-600">
                { isLoading ? <Loading /> : listItems }
            </div>);
}

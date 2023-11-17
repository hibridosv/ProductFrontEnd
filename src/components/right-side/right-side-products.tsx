import { Products as ProductsInterface } from "../../services/products";
import { TextInput, Label } from "flowbite-react";
import { HiSearch } from "react-icons/hi";
import { Loading } from "../loading/loading";
import { CreditsShowTotal } from "../credits-components/credits-show-total";

export interface RightSideProductsProps {
    products?: ProductsInterface | any;
    handleSearchTerm: (term: string) => void;
    statics?: any;
}

export function RightSideProducts(props: RightSideProductsProps){
const { products, handleSearchTerm, statics } = props;

const loadingSmall = (value: any)=>{
    if (value || value != null) {
        return value;
    }
    return <Loading size="sm" text="" />
}

return (<div>
    <div className="p-3">
    <div className="mb-2 block">
        <Label
        htmlFor="username"
        value="Buscar producto"
        />
    </div>
    <TextInput
        id="username3"
        placeholder="Buscar Producto"
        required={true}
        addon={<HiSearch />}
        onChange={(e) => handleSearchTerm(e.target.value)}
    />
    </div>
    { !products.data ? <Loading text="" /> : 
        <CreditsShowTotal quantity={products?.meta?.total} text="PRODUCTOS" number />
    }
    { statics && 
        <div className="m-5 border-2 shadow-xl rounded-md">
            <div className="m-2 grid grid-cols-6">
                <span className="col-span-4 px-2 xl:text-xl">Total Productos: </span>
                <span className="col-span-2 px-2 xl:text-xl text-right">{ loadingSmall(statics.totalProducts)}</span>
            </div>
            <div className="m-2 grid grid-cols-6">
                <span className="col-span-4 px-2 xl:text-xl">Productos: </span>
                <span className="col-span-2 px-2 xl:text-xl text-right">{loadingSmall(statics.products)}</span>
            </div>
            <div className="m-2 grid grid-cols-6">
                <span className="col-span-4 px-2 xl:text-xl">Servicios: </span>
                <span className="col-span-2 px-2 xl:text-xl text-right">{loadingSmall(statics.services)}</span>
            </div>
            <div className="m-2 grid grid-cols-6">
                <span className="col-span-4 px-2 xl:text-xl">Compuestos: </span>
                <span className="col-span-2 px-2 xl:text-xl text-right">{loadingSmall(statics.compound)}</span>
            </div>
        </div>
    }



</div>)

}
import { TextInput, Label } from "flowbite-react";
import { HiSearch } from "react-icons/hi";


export interface RightSideSearchProps {
    handleSearchTerm: (term: string) => void;
}

export function RightSideSearch(props: RightSideSearchProps){
const { handleSearchTerm } = props;



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
        className="w-full"
        onChange={(e) => handleSearchTerm(e.target.value)}
    />
    </div>

</div>)

}
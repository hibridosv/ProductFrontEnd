import { TextInput, Label } from "flowbite-react";
import { HiSearch } from "react-icons/hi";
import { Loading } from "../loading/loading";
import { CreditsShowTotal } from "../credits-components/credits-show-total";

export interface MinimalSearchProps {
    records?: any;
    handleSearchTerm: (term: string) => void;
    statics?: any;
    placeholder?: string;
}

export function MinimalSearch(props: MinimalSearchProps){
const { records, handleSearchTerm, placeholder = "Buscar" } = props;


return (<div>
    <div className="p-3">
    <div className="mb-2 block">
        <Label htmlFor="search" value={placeholder} />
    </div>
    <TextInput id="search" placeholder={placeholder} required={true} addon={<HiSearch />} onChange={(e) => handleSearchTerm(e.target.value)} />
    </div>
    { !records.data ? <Loading text="" /> : 
        <CreditsShowTotal quantity={records?.meta?.total} text="REGISTROS" number />
    }
</div>)

}
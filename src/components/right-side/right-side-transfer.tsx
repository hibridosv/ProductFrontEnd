
import { Loading } from "../loading/loading";
import { CreditsShowTotal } from "../credits-components/credits-show-total";

export interface RightSideTransferProps {
    records?: any;
}

export function RightSideTransfer(props: RightSideTransferProps){
const { records } = props;

const loadingSmall = (value: any)=>{
    if (value || value != null) {
        return value;
    }
    return <Loading size="sm" text="" />
}


function countElements(data: any, status: number) {
    if (!data) return 0;
    let count = 0;
    data?.forEach((item: any) => {
        if (item?.status === status) {
            count++;
        }
    });
    return count;
}
// 0: Eliminado, 1: En Progreso, 2: Activo, 3: Parcialmente Aceptado, 4: Aceptado, 5: Rechazado, 6: Solicitando, 7: Solicitado

return (<div>
    { !records.data ? <Loading text="" /> : 
    <div>
        <CreditsShowTotal quantity={records?.data?.length} text="TRANSFERENCIAS" number />

        <div className="m-5 border-2 shadow-xl rounded-md">
        <div className="m-2 grid grid-cols-6">
                <span className="col-span-4 px-2 xl:text-xl">Activos: </span>
                <span className="col-span-2 px-2 xl:text-xl text-right">{loadingSmall(countElements(records.data, 2))}</span>
            </div>
            <div className="m-2 grid grid-cols-6">
                <span className="col-span-4 px-2 xl:text-xl">Aceptados: </span>
                <span className="col-span-2 px-2 xl:text-xl text-right">{ loadingSmall(countElements(records.data, 4))}</span>
            </div>
            <div className="m-2 grid grid-cols-6">
                <span className="col-span-4 px-2 xl:text-xl">Parciales: </span>
                <span className="col-span-2 px-2 xl:text-xl text-right">{loadingSmall(countElements(records.data, 3))}</span>
            </div>
            <div className="m-2 grid grid-cols-6">
                <span className="col-span-4 px-2 xl:text-xl">Rechazados: </span>
                <span className="col-span-2 px-2 xl:text-xl text-right">{loadingSmall(countElements(records.data, 5))}</span>
            </div>
            <div className="m-2 grid grid-cols-6">
                <span className="col-span-4 px-2 xl:text-xl">En Progreso: </span>
                <span className="col-span-2 px-2 xl:text-xl text-right">{loadingSmall(countElements(records.data, 1))}</span>
            </div>
            <div className="m-2 grid grid-cols-6">
                <span className="col-span-4 px-2 xl:text-xl">Solicitados: </span>
                <span className="col-span-2 px-2 xl:text-xl text-right">{loadingSmall(countElements(records.data, 1))}</span>
            </div>
            <div className="m-2 grid grid-cols-6">
                <span className="col-span-4 px-2 xl:text-xl">Eliminados: </span>
                <span className="col-span-2 px-2 xl:text-xl text-right">{loadingSmall(countElements(records.data, 0))}</span>
            </div>
        </div>
    </div>
    }  

</div>)

}
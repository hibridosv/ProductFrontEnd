import { Loading } from "../loading/loading";

export interface RightExpiredProps {
    statics?: any;
}

export function RightExpired(props: RightExpiredProps){
const { statics } = props;

const loadingSmall = (value: any)=>{
    if (value || value != null) {
        return value;
    }
    return <Loading size="sm" text="" />
}

return (<div>
    { statics && 
        <div className="mx-5 border border-sky-600 rounded-lg">
            <div className="m-2 grid grid-cols-6">
                <span className="col-span-4 px-2 xl:text-xl">Total Mostrados: </span>
                <span className="col-span-2 px-2 xl:text-xl text-right">{ loadingSmall(statics.total)}</span>
            </div>
            <div className="m-2 grid grid-cols-6">
                <span className="col-span-4 px-2 xl:text-xl">Expirados: </span>
                <span className="col-span-2 px-2 xl:text-xl text-right">{loadingSmall(statics.expired)}</span>
            </div>
            <div className="m-2 grid grid-cols-6">
                <span className="col-span-4 px-2 xl:text-xl">Por Expirar: </span>
                <span className="col-span-2 px-2 xl:text-xl text-right">{loadingSmall(statics.toexpired)}</span>
            </div>
        </div>
    }

</div>)

}
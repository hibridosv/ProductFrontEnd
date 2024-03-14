export interface LinkUrls {
  name: string;
  link: string;
  isUrl?: boolean;
}

export interface LinksListProps {
  links?: LinkUrls[];
}

export function LinksList(props: LinksListProps) {
  const {  links } = props;

  if (links?.length === 0) return <></>

  return (
    <div className='mt-4 border-t border-teal-700'>
        <div className="uppercase flex justify-center font-bold">DESCARGAS EXCEL</div>
            {links && links.map((item: LinkUrls, index: any) => {
              if (item.name && item.link) {
                return (<a key={index} target="_blank" href={item.link}>
                    <li className="flex justify-between p-3 hover:bg-blue-200 hover:text-blue-800 cursor-pointer">
                        {item.name}
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </li>
                </a>)
              }
            })}
    </div>
  );
}

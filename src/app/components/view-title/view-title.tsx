import { Dropdown } from "flowbite-react";
import { IoMdOptions } from "react-icons/io";
import Link from 'next/link';


export interface ViewTitleProps {
  text: string;
  links?: {} | any;
}

export function ViewTitle(props: ViewTitleProps) {
  const { text, links } = props;
  return (
    <div className="w-full grid grid-cols-12 content-between">
      <div className="col-span-11 m-4 text-2xl text-sky-900 font-bold">
        {text}
      </div>
      <div className="col-span-1 m-4 text-2xl text-sky-900 font-bold">
        {links && (
          <Dropdown
            label={<IoMdOptions size="1em" />}
            inline={true}
            arrowIcon={false}
          >
            {links.map((item: any, index: any) => (
              <Dropdown.Item key={index}>
                <Link href={item.link}>{item.name}</Link>
              </Dropdown.Item>
            ))}
          </Dropdown>
        )}
      </div>
    </div>
  );
}

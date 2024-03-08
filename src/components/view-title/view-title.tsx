import { Dropdown } from "flowbite-react";
import { IoMdOptions } from "react-icons/io";
import Link from 'next/link';
import { ReactElement } from "react";

export interface LinkUrls {
  name: string;
  link: string;
  isUrl?: boolean;
}

export interface ViewTitleProps {
  text: string;
  links?: LinkUrls[];
  content?: ReactElement;
}

export function ViewTitle(props: ViewTitleProps) {
  const { text, links, content } = props;
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
            dismissOnClick={true}
          >
            {links.map((item: LinkUrls, index: any) => {
              if (item.name && item.link) {
                return (
                  <Dropdown.Item key={index}>
                    {
                    item.isUrl ? 
                      <a href={item.link}>{item.name}</a> :
                      <Link href={item.link}>{item.name}</Link>
                    }
                  </Dropdown.Item>
                )
              }
            })}
          </Dropdown>
        )}
        { content }
      </div>
    </div>
  );
}

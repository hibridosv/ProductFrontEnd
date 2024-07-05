import { getUrlFromCookie } from '@/services/oauth';
import { style } from '@/theme';
import { dateToNumberValidate } from '@/utils/functions';
import { md5 } from 'js-md5';


export interface ButtonDownloadProps {
  href?: string;
  children: any;
  titleText?: string;
  autoclass?: boolean;
  divider?: string;
}

export function ButtonDownload({ href, children, titleText = "Descargar", autoclass= true, divider = "?" }: ButtonDownloadProps) {
  const remoteUrl = getUrlFromCookie();

  
  if (!href || !remoteUrl) return null;

  return (
    <a target="_blank" href={encodeURI(`${remoteUrl}${href}${divider}code=${md5(dateToNumberValidate())}`)} className={autoclass ? style.hrefDownload : "clickeable"} title={titleText}>
      {children}
    </a>
  );
}

import { getUrlFromCookie } from '@/services/oauth';
import { style } from '@/theme';
import { dateToNumberValidate } from '@/utils/functions';
import { md5 } from 'js-md5';


export interface ButtonDownloadProps {
  href?: string;
  children: any;
  titleText?: string;
  autoclass?: boolean;
}

export function ButtonDownload({ href, children, titleText = "Descargar", autoclass= true }: ButtonDownloadProps) {
  const remoteUrl = getUrlFromCookie();

  
  if (!href || !remoteUrl) return null;

  return (
    <a target="_blank" href={encodeURI(`${remoteUrl}${href}?code=${md5(dateToNumberValidate())}`)} className={autoclass ? style.hrefDownload : "clickeable"} title={titleText}>
      {children}
    </a>
  );
}

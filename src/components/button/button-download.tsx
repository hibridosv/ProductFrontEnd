import { getUrlFromCookie } from '@/services/oauth';
import { style } from '@/theme';

export interface ButtonDownloadProps {
  href?: string;
  children: any
  titleText?: string
}

export function ButtonDownload({ href, children, titleText = "Descargar" }: ButtonDownloadProps) {
  const remoteUrl = getUrlFromCookie();

  if (!href || !remoteUrl) return null;

  return (
    <a target="_blank" href={encodeURI(remoteUrl + href)} className={style.hrefDownload} title={titleText}>
      {children}
    </a>
  );
}

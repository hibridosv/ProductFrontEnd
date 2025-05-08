"use client";

import { useRelativeTime } from "@/hooks/useRelativeTimeHMS";

interface OrderTimeProps {
  record: any;
  isShow?: boolean;
  rowSearch?: string;
}

export function OrderTime(props: OrderTimeProps) {
  const { record, isShow, rowSearch = "updated_at" } = props;
  const relativeTime = useRelativeTime(record[rowSearch]);
  
  if (!isShow) return <></>;
// corrige el div y ubica el texto en el centro 
  return (
    <div className="flex w-full h-full text-sm text-center">
      {relativeTime}
    </div>
  );
}

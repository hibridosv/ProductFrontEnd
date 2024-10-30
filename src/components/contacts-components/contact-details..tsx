import { ConfigContext } from "@/contexts/config-context";
import { useContext } from "react";
import { ContactDetailsSV } from "./contact-details-sv";
import { ContactDetailsGT } from "./contact-details-gt";


export interface ContactDetailsProps {
  record?: any;
}

export function ContactDetails(props: ContactDetailsProps) {
  const { record } = props;
  const { systemInformation } = useContext(ConfigContext);

  return (
        <div>
          {
            systemInformation?.system?.country == 1 && <ContactDetailsSV record={record} /> 
          }
          {
            systemInformation?.system?.country == 2 && <ContactDetailsGT record={record} /> 
          }
          {
            systemInformation?.system?.country == 3 && <ContactDetailsGT record={record} /> 
          }
        </div>
  );
}

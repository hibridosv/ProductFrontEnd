"use client";

import { useContext } from "react";
import { ContactAddGTModal } from "./contact-add-gt-modal";
import { ContactAddSVModal } from "./contact-add-sv-modal";
import { ConfigContext } from "@/contexts/config-context";

export interface ContactAddModalProps {
  onClose: () => void;
  isShow: boolean;
  record?: any;
  random?: (value: number) => void;
}

export function ContactAddModal(props: ContactAddModalProps) {
  const { onClose, isShow, record, random } = props;
  const { systemInformation } = useContext(ConfigContext);

  return (<div>
          {
            systemInformation?.system?.country == 1 && <ContactAddSVModal isShow={isShow} onClose={onClose} record={record} random={random} />
          }
          {
            systemInformation?.system?.country == 2 && <ContactAddGTModal isShow={isShow} onClose={onClose} record={record} random={random} />
          }
          {
            systemInformation?.system?.country == 3 && <ContactAddGTModal isShow={isShow} onClose={onClose} record={record} random={random} />
          }
        </div>);
}

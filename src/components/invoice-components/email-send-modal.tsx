"use client";

import { Modal, Tabs, TabsComponent } from "flowbite-react";
import { Button, Preset } from "../button/button";

import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
// Props del componente
interface EmailSendModalProps {
  record: any;
  onClose: () => void;
  isShow: boolean;
}


export function EmailSendModal(props: EmailSendModalProps) {
  const { onClose, record, isShow } = props;

  return (
    <Modal size="xl" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>REENVIAR EMAIL</Modal.Header>
      <Modal.Body>
            {
                JSON.stringify(record)
            }
                <div className="overflow-x-auto">
                <TabsComponent aria-label="Full width tabs">
                    <Tabs.Item active title="Profile" icon={HiUserCircle}>
                    This is <span className="font-medium text-gray-800 dark:text-white">Profile tab's associated content</span>.
                    Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to
                    control the content visibility and styling.
                    </Tabs.Item>
                    <Tabs.Item title="Dashboard" icon={MdDashboard}>
                    This is <span className="font-medium text-gray-800 dark:text-white">Dashboard tab's associated content</span>.
                    Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to
                    control the content visibility and styling.
                    </Tabs.Item>
                    <Tabs.Item title="Settings" icon={HiAdjustments}>
                    This is <span className="font-medium text-gray-800 dark:text-white">Settings tab's associated content</span>.
                    Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to
                    control the content visibility and styling.
                    </Tabs.Item>
                    <Tabs.Item title="Contacts" icon={HiClipboardList}>
                    This is <span className="font-medium text-gray-800 dark:text-white">Contacts tab's associated content</span>.
                    Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to
                    control the content visibility and styling.
                    </Tabs.Item>
                    <Tabs.Item disabled title="Disabled">
                    Disabled content
                    </Tabs.Item>
                </TabsComponent>
                </div>

      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );
}

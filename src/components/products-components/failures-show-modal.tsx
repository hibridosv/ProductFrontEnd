"use client";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";

export interface FailuresShowModalProps {
    onClose: () => void;
    isShow: boolean;
    record?: any;
}

export function FailuresShowModal(props: FailuresShowModalProps) {
    const { onClose, isShow, record } = props;


    const listItems = record?.failures?.map((record: any) => (
        <tr title={ record?.status === 2 ? `Eliminado por ${record?.deleted_by?.name}` : ``} key={record.id} className={record.status === 2 ? `bg-white border-b dark:bg-gray-800 dark:border-gray-700 text-red-600` : `bg-white border-b dark:bg-gray-800 dark:border-gray-700`} >
            <td className="py-2 px-2 truncate">{ record?.product?.description }</td>
            <td className="py-2 px-2">{ record.quantity }</td>
            <td className="py-2 px-2 truncate uppercase">{ record.reason }</td>
            <td className="py-2 px-2">{ record?.employee?.name }</td>

        </tr>
      ));


  return (
    <Modal size="2xl" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>PRODUCTOS DESCONTADOS</Modal.Header>
      <Modal.Body>
                <div className="w-full overflow-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="py-2 px-2 border">Producto</th>
                        <th scope="col" className="py-2 px-2 border">Cant</th>
                        <th scope="col" className="py-2 px-2 border">Razón</th>
                        <th scope="col" className="py-2 px-2 border">Usuario</th>
                    </tr>
                    </thead>
                    <tbody>{listItems}</tbody>
                    </table>
                </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );
}

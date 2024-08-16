import { Modal } from "flowbite-react";
import { Button, Preset } from "@/components/button/button";
import { ArrowIcon} from "@/theme/svg"


export interface SelectPayTypeModalProps {
  onClose: () => void;
  payments: any;
  isShow: boolean;
  setPayment: (payment: number)=>void
}

export function SelectPayTypeModal(props: SelectPayTypeModalProps) {
  const { onClose, payments, isShow, setPayment } = props;


      if (!payments && !isShow) {
        return <div></div>
      }

      const paySelect = (payment: number) =>{
        setPayment(payment);
        onClose();
      }

      const listItems = payments?.map((payment: any):any => (
        <div key={payment.id} onClick={()=>paySelect(payment.iden)}>
            <li className="flex justify-between p-3 hover:bg-blue-200 hover:text-blue-800 cursor-pointer">
                  {payment.name}  { ArrowIcon }
            </li>
        </div>
    ))

  return (
    <Modal size="sm" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>Seleccionar Metodo de pago</Modal.Header>
      <Modal.Body>
        <div className="mx-4 uppercase">
            { listItems }
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );
}

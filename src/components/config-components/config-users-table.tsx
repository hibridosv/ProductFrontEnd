'use client'
import { useState } from "react";
import { NothingHere } from "../nothing-here/nothing-here";
import { Button, Preset } from "../button/button";
import { DeleteModal } from "../modals/delete-modal";
import { ConfigRoleUserModal } from "./config-role-user-modal";
import { ConfigPasswordUserModal } from "./config-password-user-modal";


interface ConfigUsersTableProps {
  records?:  any;
  onDelete: (id: string) => void;
  random: (value: number) => void;
  showAll?: boolean;
}

export function ConfigUsersTable(props: ConfigUsersTableProps) {
  const { records, onDelete, random, showAll } = props;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRoleUserModal, setShowRoleUserModal] = useState(false);
  const [showPasswordUserModal, setShowPasswordUserModal] = useState(false);
  const [selectUser, setSelectUser] = useState<any>({});

 
  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;

  const isUserSelected = (user: any, typeSelect: number) => {
    if (user.status == 0) return
    setSelectUser(user);
    switch (typeSelect) {
      case 1: setShowDeleteModal(true); break;
      case 2: setShowRoleUserModal(true); break;
      case 3: setShowPasswordUserModal(true); break;
    }

  }

  const handleDelete = () => {
    onDelete(selectUser.id);
    setShowDeleteModal(false);
    setSelectUser({} as any);
  }


console.log("showAll", showAll)

  const listItems = records.data.map((record: any) => {
    if (showAll == false && record.status == 0) return null
    return (
      <tr key={record.id} className={`border-b  ${record.status == 1 ? 'bg-white' : 'bg-red-200'}`} >
        <th className="py-2 px-6 text-gray-900 whitespace-nowrap dark:text-white clickeable" onClick={()=>isUserSelected(record, 3)}>{ record.name }</th>
        <td className="py-2 px-6">{ record.email }</td>
        <td className="py-2 px-6 uppercase clickeable" onClick={()=>isUserSelected(record, 2)}>{ record.roles[0].name }</td>
        <td className="py-2 px-6 truncate"><Button preset={record.status == 1 ? Preset.smallClose : Preset.smallCloseDisable} disabled={record.status == 0} noText onClick={()=>isUserSelected(record, 1)} /> </td>
      </tr>
    )
  });


  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Nombre</th>
          <th scope="col" className="py-3 px-4 border">Email</th>
          <th scope="col" className="py-3 px-4 border">Tipo</th>
          <th scope="col" className="py-3 px-4 border">Del</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>
    <DeleteModal isShow={showDeleteModal} text="¿Estas seguro de eliminar este usuario?" onDelete={handleDelete}  onClose={()=>setShowDeleteModal(false)} /> 
    <ConfigRoleUserModal user={selectUser} isShow={showRoleUserModal} onClose={()=>setShowRoleUserModal(false)} random={random} />
    <ConfigPasswordUserModal user={selectUser} isShow={showPasswordUserModal} onClose={()=>setShowPasswordUserModal(false)} />
 </div>
 </div>);
}

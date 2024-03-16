export const requiredFieldsCCF = [
    'document',
    'register',
    'name',
    'roar',
    'taxpayer',
    'departament_doc',
    'town_doc',
    'address_doc',
    'phone',
    'email',
];

export const requiredFieldsFactura = [
    'id_number',
    'name',
    'departament_doc',
    'town_doc',
    'address',
    'phone',
    'email',
];

const nameOfField: any = {
    id_number : "Documento",
    document : "NIT",
    register : "Registro",
    name : "Nombre",
    roar : "Giro",
    taxpayer : "Nombre Contribuyente",
    departament_doc : "Departamento",
    town_doc : "Municipio",
    address_doc : "Dirreción",
    phone : "Telefono",
    email : "Email",
  }

export const validateInvoiceFields = (receptor: any, requiredFields: string[])=> {
    const missingFields: any = [];

    requiredFields.forEach(field => {
        if (!receptor.hasOwnProperty(field) || receptor[field] === null || receptor[field] === '') {
            missingFields.push(nameOfField[field]);
        }
    });

    return missingFields.length > 0 && <div>Faltan los siguientes campos del cliente para facturar: <div className="text-red-500">{`${missingFields.join(', ')}.`}</div></div>;
}
import { IGenericRow, ITableHeader } from "@/components/AdminTable/Table";


// export const headerKYCData: string[] = [
//   "S/N", "Nom", "Pays", 
//   "Numero", "Email", "Statut", 
//   "Date de création", ""
// ]

export const headerKYCData: ITableHeader = {
  "serial": "S/N",
  // "id": "ID",
  "name": "Nom",
  "country": "Pays",
  "phone": "Numero",
  "email": "Email",
  "status": "Statut",
  "date": "Date de création",
  "edit": "",
};

export const headerKYCDataV2: ITableHeader = {
  "serial": "S/N",
  // "id": "ID",
  "name": "Nom",
  "country": "Pays",
  "phone": "Numero",
  "email": "Email",
  "oldNew": "A/N",
  "status": "Statut",
  "date": "Date de création",
  "edit": "",
};


export const headerRegularisationDataV2: ITableHeader = {
  "serial": "S/N",
  // "id": "ID",
  "name": "Nom",
  "country": "Pays",
  "phone": "Numero",
  "email": "Email",
  "oldNew": "A/N",
  "status": "Statut",
  "method": "Methode",
  "amount": "Montant",
  "date": "Date de création",
  "edit": "",
};


export const tableKYCData: IGenericRow[] = [
  {
    id:1,
    name: 'John Doe',
    country: 'Cameroun',
    phone: '+237 688 777 999',
    email: 'abc123@xyz.com',    
    status: 'accepted',
    date: '12/03/2024',
    edit: '#',
  },
  {
    id:2,
    name: 'John Doe',
    country: 'Cameroun',
    phone: '+237 688 777 999',
    email: 'abc123@xyz.com',    
    status: 'accepted',
    date: '12/03/2024',
    edit: '#',
  },
  {
    id:3,
    name: 'John Doe',
    country: 'Cameroun',
    phone: '+237 688 777 999',
    email: 'abc123@xyz.com',    
    status: 'accepted',
    date: '12/03/2024',
    edit: '#',
  },
  {
    id:4,
    name: 'John Doe',
    country: 'Cameroun',
    phone: '+237 688 777 999',
    email: 'abc123@xyz.com',    
    status: 'accepted',
    date: '12/03/2024',
    edit: '#',
  },
  {
    id:5,
    name: 'John Doe',
    country: 'Cameroun',
    phone: '+237 688 777 999',
    email: 'abc123@xyz.com',    
    status: 'pending',
    date: '12/03/2024',
    edit: '#',
  },
  {
    id:6,
    name: 'John Doe',
    country: 'Cameroun',
    phone: '+237 688 777 999',
    email: 'abc123@xyz.com',    
    status: 'rejected',
    date: '12/03/2024',
    edit: '#',
  },
  {
    id:7,
    name: 'John Doe',
    country: 'Cameroun',
    phone: '+237 688 777 999',
    email: 'abc123@xyz.com',    
    status: 'pending',
    date: '12/03/2024',
    edit: '#',
  },
  {
    id:8,
    name: 'John Doe',
    country: 'Cameroun',
    phone: '+237 688 777 999',
    email: 'abc123@xyz.com',    
    status: 'rejected',
    date: '12/03/2024',
    edit: '#',
  },
  ];
  
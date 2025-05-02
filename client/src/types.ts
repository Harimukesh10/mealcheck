export interface Patient {
    _id?:string;
    patientId:string;
    bedId:string;
    bookingDate:string,
    dischargeDate:string,
    status:string
    notes: string,
    bedNumber?:string,
    username?:string,
    createdAt:string
  }
 
 export  interface Bed {
    _id: string;
    bedNumber: string;
    ward: 'ICU' | 'General' | 'Emergency';
    status: 'Available' | 'Occupied';
    assignedTo: string | null;
    createdAt: Date;
}

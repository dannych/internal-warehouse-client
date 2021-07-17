export interface CreateOfficer {
    officerCode: string;
    officerName: string;
}

export interface ReadManyOfficers {
    _id: string;
    code: string;
    name: string;
}

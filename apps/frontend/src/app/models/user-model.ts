export interface User {
    id: number;
    login: string | null;
    password: string | null;
    firstName: string | null;
    lastName: string | null;
    patronymic: string | null;
    role: string | null;
    isActive: boolean | null;
    token?: string;
}
// User.ts

export interface User {
    id: string;
    rol: string; // 'rol' es obligatoria (como vimos en el error original)
    // ... aquí puedes añadir otras propiedades de usuario que necesites ...
    // ejemplo:
    // nombre?: string; // Nombre opcional
    // email: string;  // Email obligatorio
}
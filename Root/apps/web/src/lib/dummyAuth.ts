// apps/web/src/lib/dummyAuth.ts
export interface User {
  id: string;
  email: string;
  roles: ('validator' | 'verifier')[];
}

interface RegisterData {
  instanceName: string;
  npwp: string;
  email: string;
  role: 'validator' | 'verifier';
}

interface LoginCredentials {
  instanceId: string;
  apiKey: string;
}

const registeredInstances: { [key: string]: { email: string; apiKey: string; roles: ('validator' | 'verifier')[]; } } = {
  // Data dummy yang sudah terdaftar
  'inst-val-123': { 
    email: 'validator@demo.com', 
    apiKey: 'key-val-abc', 
    roles: ['validator'] 
  },
  'inst-ver-456': { 
    email: 'verifier@demo.com', 
    apiKey: 'key-ver-xyz', 
    roles: ['verifier'] 
  },
};

export const dummyRegister = async (data: RegisterData): Promise<{ id: string; apiKey: string }> => {
  // ...existing code...
  return new Promise((resolve) => {
    setTimeout(() => {
      const newId = `inst-${data.role}-${Math.random().toString(36).substring(2, 6)}`;
      const newKey = `key-${data.role}-${Math.random().toString(36).substring(2, 8)}`;
      // Simpan di data dummy lokal
      registeredInstances[newId] = { email: data.email, apiKey: newKey, roles: [data.role] };
      resolve({ id: newId, apiKey: newKey });
    }, 1500);
  });
};

export const dummyLogin = async (credentials: LoginCredentials): Promise<User | null> => {
  // ...existing code...
  return new Promise((resolve) => {
    setTimeout(() => {
      const instance = registeredInstances[credentials.instanceId];
      if (instance && instance.apiKey === credentials.apiKey) {
        resolve({
          id: credentials.instanceId,
          email: instance.email,
          roles: instance.roles,
        });
      } else {
        resolve(null); // Login gagal
      }
    }, 1500);
  });
};
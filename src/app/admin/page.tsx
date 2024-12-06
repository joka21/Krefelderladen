'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface UserData {
  uid: string;
  email: string;
  role: 'user' | 'business' | 'admin';
  approved: boolean;
  createdAt: Date;
}

export default function AdminDashboard() {
 
  const [users, setUsers] = useState<UserData[]>([]);
  const { user } = useAuth();
  useEffect(() => {
    console.log('Auth state:', {
      isAuthenticated: !!user,
      userRole: user?.role,
      userId: user?.uid
    });
  }, [user]);
  console.log('Current user:', user);
  const router = useRouter();

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/');
      return;
    }

    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            createdAt: data.createdAt?.toDate() || new Date()
          };
        }) as UserData[];
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [user, router]);

  const updateUserRole = async (uid: string, newRole: 'user' | 'business' | 'admin') => {
    await updateDoc(doc(db, 'users', uid), { role: newRole });
    setUsers(users.map(u => u.uid === uid ? { ...u, role: newRole } : u));
  };

  const toggleApproval = async (uid: string, approved: boolean) => {
    await updateDoc(doc(db, 'users', uid), { approved });
    setUsers(users.map(u => u.uid === uid ? { ...u, approved } : u));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Rolle</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.uid}>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    onChange={(e) => updateUserRole(user.uid, e.target.value as 'user' | 'business' | 'admin')}
                    className="border rounded px-2 py-1"
                  >
                    <option value="user">User</option>
                    <option value="business">Business</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleApproval(user.uid, !user.approved)}
                    className={`px-3 py-1 rounded ${
                      user.approved 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {user.approved ? 'Aktiv' : 'Inaktiv'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
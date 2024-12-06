import { collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface Task {
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'review' | 'done';
  priority: 'high' | 'medium' | 'low';
  createdAt: Date;
  category: string;
  subtasks: Subtask[];
}

// Bestehende createInitialTasks Funktion
export const createInitialTasks = async () => {
  const tasksRef = collection(db, 'tasks');
  
  const initialTasks: Task[] = [
    {
      title: "Next.js Basis-Setup",
      description: "Next.js Projekt einrichten und konfigurieren",
      status: "done",
      priority: "high",
      createdAt: new Date(),
      category: "setup",
      subtasks: [
        {
          id: "next-1",
          title: "Next.js Projekt erstellen",
          completed: true
        },
        {
          id: "next-2",
          title: "TypeScript konfigurieren",
          completed: true
        }
      ]
    },
    {
      title: "Firebase Integration",
      description: "Firebase in Next.js einbinden",
      status: "done",
      priority: "high",
      createdAt: new Date(),
      category: "setup",
      subtasks: [
        {
          id: "firebase-1",
          title: "Firebase installieren",
          completed: true
        },
        {
          id: "firebase-2",
          title: "Firebase Config einrichten",
          completed: true
        }
      ]
    },
    {
      title: "Basis-Komponenten erstellen",
      description: "React-Komponenten für die Grundstruktur erstellen",
      status: "open",
      priority: "high",
      createdAt: new Date(),
      category: "development",
      subtasks: [
        {
          id: "components-1",
          title: "Layout-Komponente erstellen",
          completed: false
        },
        {
          id: "components-2",
          title: "Navigation-Komponente erstellen",
          completed: false
        }
      ]
    }
  ];

  try {
    for (const task of initialTasks) {
      await addDoc(tasksRef, task);
    }
    console.log("Initial tasks created successfully");
  } catch (error) {
    console.error("Error creating initial tasks:", error);
  }
};

// Neue clearAllTasks Funktion
export const clearAllTasks = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'tasks'));
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    console.log("All tasks deleted successfully");
  } catch (error) {
    console.error("Error deleting tasks:", error);
  }
};
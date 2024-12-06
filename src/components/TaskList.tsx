'use client';

import { collection, query, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  subtasks: {
    id: string;
    title: string;
    completed: boolean;
  }[];
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'tasks'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const taskList: Task[] = [];
      querySnapshot.forEach((doc) => {
        taskList.push({ id: doc.id, ...doc.data() } as Task);
      });
      setTasks(taskList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div role="status" aria-live="polite">Lade Tasks...</div>;
  }

  return (
    <div 
      className="space-y-4"
      role="region" 
      aria-label="Task Liste"
    >
      {tasks.map((task) => (
        <article 
          key={task.id} 
          className="border p-4 rounded-lg shadow"
          aria-labelledby={`task-${task.id}-title`}
        >
          <h3 
            id={`task-${task.id}-title`}
            className="font-bold text-lg"
          >
            {task.title}
          </h3>
          <p className="text-gray-600">{task.description}</p>
          <div className="flex gap-2 mt-2" aria-label="Task Status und Priorität">
            <span 
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
              role="status"
            >
              Status: {task.status}
            </span>
            <span 
              className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm"
              role="status"
            >
              Priorität: {task.priority}
            </span>
          </div>
          <div className="mt-3">
            <h4 className="font-semibold">Subtasks:</h4>
            <ul className="list-disc list-inside" aria-label="Subtasks">
              {task.subtasks.map((subtask) => (
                <li 
                  key={subtask.id} 
                  className={subtask.completed ? "text-gray-400" : ""}
                  aria-checked={subtask.completed}
                  role="checkbox"
                >
                  {subtask.title}
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </div>
  );
}
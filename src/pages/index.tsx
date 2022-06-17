import React from "react";

import { trpc } from "../lib/trpc";

const Home: React.FC = () => {
   const { isLoading, data, refetch } = trpc.useQuery(["todos"]);
   const createMutation = trpc.useMutation(["create"]);
   const deleteMutation = trpc.useMutation(["delete"]);

   if (isLoading || !data) return <div>Loading...</div>;

   if (data.todos.length === 0) return <div>No todos...</div>;

   return (
      <div className="h-screen p-3">
         <div>
            <form
               onSubmit={async (e) => {
                  e.preventDefault();
                  const val = (e.target as any).input.value;
                  if (val === "") return;
                  await createMutation.mutateAsync({ name: val });
                  (e.target as any).input.value = "";
                  refetch();
               }}
               className="flex gap-2 mb-4"
            >
               <input
                  name="input"
                  placeholder="todo"
                  className="bg-gray-100 border-2 rounded-md p-2"
               />
               <button>submit</button>
            </form>
         </div>
         <ul>
            {data.todos.map((todo, index) => (
               <li
                  key={index}
                  className="hover:line-through cursor-pointer w-fit"
                  onClick={async () => {
                     await deleteMutation.mutateAsync({ id: todo.id });
                     refetch();
                  }}
               >
                  {todo.name}
               </li>
            ))}
         </ul>
      </div>
   );
};

export default Home;

import React from "react";

import { trpc } from "../lib/trpc";

const Home: React.FC = () => {
   const { isLoading, data, refetch } = trpc.useQuery(["todos"]);
   const createMutation = trpc.useMutation(["create"]);
   const updateStateMutation = trpc.useMutation(["update-state"]);
   const deleteMutation = trpc.useMutation(["delete"]);

   if (isLoading || !data) return <div>Loading...</div>;

   return (
      <div className="h-screen p-3">
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
         <ul className="container max-w-xs">
            {data.todos.map((todo, index) => (
               <div key={index} className="flex justify-between items-center">
                  <li
                     className={`${
                        todo.complete && "line-through"
                     } cursor-pointer w-fit`}
                     onClick={async () => {
                        await updateStateMutation.mutateAsync({
                           id: todo.id,
                           state: !todo.complete,
                        });
                        refetch();
                     }}
                     title="Toggle complete status"
                  >
                     {todo.name}
                  </li>
                  <button
                     onClick={async () => {
                        await deleteMutation.mutateAsync({ id: todo.id });
                        refetch();
                     }}
                  >
                     delete
                  </button>
               </div>
            ))}
         </ul>
      </div>
   );
};

export default Home;

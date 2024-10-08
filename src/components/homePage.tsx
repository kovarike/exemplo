"use client";
import { Trash } from "lucide-react";
import * as Dialog from '@radix-ui/react-dialog';
import { Modal } from '@/components/modal';
import { Delete } from '@/components/delete';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getItems } from '@/lib/http/get-items';
import { putItems } from '@/lib/http/put-items';
import { Header } from './header';


export function HomePage() {
  const useClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['items'], queryFn: getItems, staleTime: 1000 * 60,
  });

  if (!data) { return }

  const toggleCompleted = async (id: string) => {
    await putItems([{
      name: data.find((item) => item.id === id)?.name,
      id: data.find((item) => item.id === id)?.id,
      completed: !data.find((item) => item.id === id)?.completed
    }], id);

    useClient.invalidateQueries({ queryKey: ["items"] });
  };

  return (
    <div className='flex flex-col items-center mx-auto h-screen px-3 sm:p-14 space-y-6' style={{ width: '100vw', maxWidth: '1440px', height: '100vh' }}>
      <Header />

      <Dialog.Root>
        <main className="flex flex-col items-center w-full">
          <div className="w-full max-w-[450px] sm:max-w-[480px] px-3 mx-auto border-2 border-gray-500/50 bg-white rounded-xl space-y-3 flex flex-col justify-center items-center" style={{ height: 'calc(100vh - 250px)' }}>
            <h1 className='text-center text-slate-900 font-medium text-2xl sm:text-lg'>Suas tarefas de hoje</h1>
            <ul className='space-y-3 w-full overflow-y-scroll max-h-[450px] h-[450px]  mx-auto'>
              {data.map((item) => (
                <div key={item.id} className='w-full'>
                  {!item.completed && (
                    <li className="flex justify-between items-center p-4 rounded-lg bg-white border-2 border-gray-400 border-dashed">
                      <div className="flex items-center space-x-3 w-full">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => toggleCompleted(item.id)}
                          className="form-checkbox w-6 h-6 rounded-md cursor-pointer"
                        />
                        <span className="text-base text-slate-950 font-medium">
                          {item.name}
                        </span>
                      </div>
                      <Dialog.Root>
                        <Dialog.Trigger asChild>
                          <button className="text-red-500 hover:text-red-700">
                            <Trash />
                          </button>
                        </Dialog.Trigger>
                        <Delete id={item.id} />
                      </Dialog.Root>
                    </li>
                  )}
                </div>
              ))}
              {!data.find((item) => item.completed === true)?.completed  ? " ": (<h1 className='text-center mb-3 text-slate-900 font-medium text-lg sm:text-base'>Tarefas finalizadas</h1>) }
              

              {data.map((item) => (
                <div key={item.id} className='w-full'>
                  {item.completed && (
                    <li className="flex justify-between items-center p-4 rounded-lg bg-gray-100 line-through border-2 border-gray-400 border-dashed">
                      <div className="flex items-center space-x-3 w-full">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => toggleCompleted(item.id)}
                          className="form-checkbox w-6 h-6 rounded-md cursor-pointer"
                        />
                        <span className="text-sm text-gray-400">{item.name}</span>
                      </div>
                      <Dialog.Root>
                        <Dialog.Trigger asChild>
                          <button className="text-red-500 hover:text-red-700">
                            <Trash />
                          </button>
                        </Dialog.Trigger>
                        <Delete id={item.id} />
                      </Dialog.Root>
                    </li>
                  )}
                </div>
              ))}
            </ul>
          </div>
          <div className="w-full max-w-[450px] sm:max-w-[480px]  p-1 mx-auto bg-transparent flex flex-col justify-center items-center" >
            <Dialog.Trigger asChild>
              <button className="bg-button border-none text-white py-3 px-5 rounded-md cursor-pointer text-center mx-auto w-full mt-5">
                Adicionar nova tarefa
              </button>
            </Dialog.Trigger>
            
          </div>
        </main>
        <Modal />
      </Dialog.Root>
    </div>
  );
}

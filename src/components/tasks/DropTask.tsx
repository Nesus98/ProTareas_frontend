import { useDroppable } from "@dnd-kit/core";

// Define las propiedades esperadas por el componente DropTask
type DropTaskProps = {
    status: string
}

export default function DropTask({status}: DropTaskProps) {

    // Configura la funcionalidad de droppable utilizando el hook useDroppable de @dnd-kit/core
    const { isOver, setNodeRef } = useDroppable({
        id:status
    })

     // Define el estilo condicional basado en si el área está sobre la que se está arrastrando un elemento
    const style = {
        opacity: isOver ? 0.3 : undefined
    }

  return (
    <div 
    style={style}
    ref={setNodeRef}
    className="text-xs font-semibold uppercase p-2 border border-dashed border-slate-500 mt-5 grid place-content-center text-slate-500">
      Soltar tarea aqui 
    </div>
  );
}

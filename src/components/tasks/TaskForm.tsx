import { FieldErrors, UseFormRegister } from "react-hook-form";
import { TaskFormData } from "@/types/index";
import ErrorMessage from "../ErrorMessage";

// Definir los tipos de propiedades que el componente TaskForm acepta
type TaskFormProps = {
  errors: FieldErrors<TaskFormData>; // Errores del formulario
  register: UseFormRegister<TaskFormData>; // Función para registrar los campos del formulario
};

export default function TaskForm({ errors, register }: TaskFormProps) {
  return (
    <>
      <div className="flex flex-col gap-5">
        <label className="font-normal text-2xl" htmlFor="name">
          Nombre de la tarea
        </label>
        <input
          id="name"
          type="text"
          placeholder="Nombre de la tarea"
          className="w-full p-3 border-gray-300 border"
          // Registrar el campo de nombre con validaciones
          {...register("name", {
            required: "El nombre de la tarea es obligatorio",
          })}
        />
        {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
      </div>

      <div className="flex flex-col gap-5">
        <label className="font-normal text-2xl" htmlFor="description">
          Descripción de la tarea
        </label>
        <textarea
          id="description"
          placeholder="Descripción de la tarea"
          className="w-full p-3 border-gray-300 border"
          // Registrar el campo de descripción con validaciones
          {...register("description", {
            required: "La descripción de la tarea es obligatoria",
          })}
        />
        {errors.description && (
          <ErrorMessage>{errors.description.message}</ErrorMessage>
        )}
      </div>
    </>
  );
}

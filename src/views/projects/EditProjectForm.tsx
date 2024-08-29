import ProjectForm from "@/components/projects/ProjectForm";
import { Project, ProjectFormData } from "@/types/index";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProject } from "@/api/ProjectAPI";
import { toast } from "react-toastify";

type EditProjectFormProps = {
  data: ProjectFormData; // Datos iniciales del proyecto para el formulario
  projectId: Project["_id"]; // ID del proyecto que se está editando
};

export default function EditProjectForm({
  data,
  projectId,
}: EditProjectFormProps) {
  const navigate = useNavigate(); // Hook para la navegación programática

  // Configuración del hook useForm para manejar el estado del formulario
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      projectName: data.projectName,
      clientName: data.clientName,
      description: data.description,
    },
  });

  const queryClient = useQueryClient(); // Hook para acceder al cliente de consultas

  // Configuración del hook useMutation para manejar la actualización del proyecto
  const { mutate } = useMutation({
    mutationFn: updateProject, // Función que se llama para actualizar un proyecto
    onError: (error) => {
      // Muestra un mensaje de error si la actualización falla
      toast.error(error.message);
    },
    onSuccess: (data) => {
      // Invalida las consultas relacionadas para obtener datos actualizados
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["editProject", projectId] });
      // Muestra un mensaje de éxito y navega a la página principal si la actualización es exitosa
      toast.success(data);
      navigate("/");
    },
  });

  // Función que maneja el envío del formulario
  const handleForm = (formData: ProjectFormData) => {
    const data = {
      formData,
      projectId,
    };
    mutate(data); // Llama a mutate para actualizar el proyecto
  };

  return (
    <>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-black">Editar Proyecto</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">
          Llena el siguiente formulario para editar el proyecto
        </p>

        <nav className="my-5">
          <Link
            className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
            to="/"
          >
            Volver a Proyectos
          </Link>
        </nav>

        <form
          className="mt-10 bg-white shadow-lg p-10 rounded-lg"
          onSubmit={handleSubmit(handleForm)}
          noValidate
        >
          <ProjectForm register={register} errors={errors} />
          <input
            type="submit"
            value="Guardar Cambios"
            className=" bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors"
          />
        </form>
      </div>
    </>
  );
}

import ProjectForm from "@/components/projects/ProjectForm";
import { createProject } from "@/api/ProjectAPI";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { ProjectFormData } from "@/types/index";
import { toast } from "react-toastify";

export default function CreateProjectView() {
  const navigate = useNavigate(); // Hook para la navegación programática

  // Valores iniciales para el formulario
  const initialValues: ProjectFormData = {
    projectName: "",
    clientName: "",
    description: "",
  };

  // Configuración del hook useForm para manejar el estado del formulario
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  // Configuración del hook useMutation para manejar la creación del proyecto
  const { mutate } = useMutation({
    mutationFn: createProject, // Función que se llama para crear un proyecto
    onError: (error) => {
      // Muestra un mensaje de error si la creación falla
      toast.error(error.message);
    },
    onSuccess: (data) => {
      // Muestra un mensaje de éxito y navega a la página principal si la creación es exitosa
      toast.success(data);
      navigate("/");
    },
  });

  // Función que maneja el envío del formulario
  const handleForm = (formData: ProjectFormData) => mutate(formData);

  return (
    <>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-black">Crear Proyecto</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">
          Llena el siguiente formulario para crear un proyecto
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
            value="Crear Proyecto"
            className=" bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors"
          />
        </form>
      </div>
    </>
  );
}

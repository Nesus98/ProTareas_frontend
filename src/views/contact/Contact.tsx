import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import ErrorMessage from "../../components/ErrorMessage"; // Asegúrate de que este componente exista

type ContactFormProps = {
  nombre: string;
  apellido: string;
  email: string;
  mensaje: string;
};

export default function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormProps>();

  const navigate = useNavigate();

  const handleContactFormSubmit = () => {
    // Simula un envío exitoso
    toast.success("Mensaje enviado con éxito", {
      autoClose: 2500,
    });

    // Limpia los campos del formulario
    reset();

    // Redirige a la página de inicio después de 3 segundos
    setTimeout(() => {
      navigate("/");
    }, 3000); // 3000 milisegundos = 3 segundos
  };

  return (
    <>
      <nav className="my-5">
        <Link
          className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
          to="/"
        >
          Inicio
        </Link>
      </nav>
      <div className="mx-auto max-w-3xl">
        <h1 className="text-5xl font-black text-center">Contáctanos</h1>
        <p className="text-2xl font-light text-gray-500 mt-5 text-center">
          Completa el formulario y nos pondremos en contacto contigo
        </p>

        <form
          onSubmit={handleSubmit(handleContactFormSubmit)}
          className="mt-14 space-y-5 bg-white shadow-lg p-10 rounded-l"
          noValidate
        >
          <div className="mb-5 space-y-3">
            <label className="text-sm uppercase font-bold" htmlFor="nombre">
              Nombre <span className="text-red-600">*</span>
            </label>
            <input
              id="nombre"
              type="text"
              placeholder="Coloca tu nombre"
              className="w-full p-3 border border-gray-200"
              {...register("nombre", {
                required: "El nombre es obligatorio",
              })}
            />
            {errors.nombre && (
              <ErrorMessage>{errors.nombre.message}</ErrorMessage>
            )}
          </div>

          <div className="mb-5 space-y-3">
            <label className="text-sm uppercase font-bold" htmlFor="apellido">
              Apellido <span className="text-red-600">*</span>
            </label>
            <input
              id="apellido"
              type="text"
              placeholder="Coloca tu apellido"
              className="w-full p-3 border border-gray-200"
              {...register("apellido", {
                required: "El apellido es obligatorio",
              })}
            />
            {errors.apellido && (
              <ErrorMessage>{errors.apellido.message}</ErrorMessage>
            )}
          </div>

          <div className="mb-5 space-y-3">
            <label className="text-sm uppercase font-bold" htmlFor="email">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email de Registro"
              className="w-full p-3 border border-gray-200"
              {...register("email", {
                required: "El email es obligatorio",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "E-mail no válido",
                },
              })}
            />
            {errors.email && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}
          </div>

          <div className="mb-5 space-y-3">
            <label className="text-sm uppercase font-bold" htmlFor="mensaje">
              Mensaje <span className="text-red-600">*</span>
            </label>
            <textarea
              id="mensaje"
              placeholder="Escribe aquí tu mensaje"
              className="w-full p-3 border border-gray-200 h-64"
              {...register("mensaje", {
                required: "El mensaje es obligatorio",
              })}
            ></textarea>
            {errors.mensaje && (
              <ErrorMessage>{errors.mensaje.message}</ErrorMessage>
            )}
          </div>

          <input
            type="submit"
            value="Enviar"
            className="bg-fuchsia-600 w-full p-3 text-white uppercase font-bold hover:bg-fuchsia-700 cursor-pointer transition-colors"
          />
        </form>
        <nav className="mt-10 flex flex-col space-y-4">
          <Link
            to={"/"}
            className="text-center text-fuchsia-600 text-m hover:text-fuchsia-300"
          >
            Ir a la página de inicio
          </Link>
        </nav>
      </div>
    </>
  );
}

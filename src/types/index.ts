import { z } from "zod"; // Importa la biblioteca zod para la validación de esquemas

/** Auth y Users */
const authSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  current_password: z.string(),
  password: z.string(),
  password_confirmation: z.string(),
  token: z.string(),
});

type Auth = z.infer<typeof authSchema>;
export type UserLoginForm = Pick<Auth, "email" | "password">;
export type UserRegistrationForm = Pick<
  Auth,
  "name" | "email" | "password" | "password_confirmation"
>;
export type RequestConfirmationCodeForm = Pick<Auth, "email">;
export type ForgotPasswordForm = Pick<Auth, "email">;
export type NewPasswordForm = Pick<Auth, "password" | "password_confirmation">;
export type UpdateCurrentUserPasswordForm = Pick<
  Auth,
  "current_password" | "password" | "password_confirmation"
>;

export type ConfirmToken = Pick<Auth, "token">;
export type CheckPasswordForm = Pick<Auth, "password">;

/** Users */
export const userSchema = authSchema
  .pick({
    name: true,
    email: true,
  })
  .extend({
    _id: z.string(),
  });

export type User = z.infer<typeof userSchema>;

export type UserProfileForm = Pick<User, "name" | "email">;

/** Tasks */
// Define un esquema para los estados de las tareas usando una enumeración
export const taskStatusSchema = z.enum([
  "pending", // Estado pendiente
  "onHold", // Estado en espera
  "inProgress", // Estado en progreso
  "underReview", // Estado en revisión
  "completed", // Estado completado
]);

export type TaskStatus = z.infer<typeof taskStatusSchema>;

// Define un esquema para una tarea utilizando el esquema de estados de tarea
export const taskSchema = z.object({
  _id: z.string(), // Identificador único de la tarea
  name: z.string(), // Nombre de la tarea
  description: z.string(), // Descripción de la tarea
  project: z.string(), // Identificador del proyecto al que pertenece la tarea
  status: taskStatusSchema, // Estado de la tarea (usando el esquema de estado de tarea)
  completedBy: z.array(
    z.object({
      _id: z.string(),
      user: userSchema,
      status: taskStatusSchema,
    })
  ),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const TaskProjectSchema = taskSchema.pick({
  _id: true,
  name: true,
  description: true,
  status: true
})

// Infer el tipo TypeScript a partir del esquema de tarea
export type Task = z.infer<typeof taskSchema>;

// Define el tipo de datos para el formulario de tarea (solo los campos necesarios)
export type TaskFormData = Pick<Task, "name" | "description">;

export type TaskProject = z.infer<typeof TaskProjectSchema>

/** Projects */
// Define un esquema para un proyecto
export const projectSchema = z.object({
  _id: z.string(), // Identificador único del proyecto
  projectName: z.string(), // Nombre del proyecto
  clientName: z.string(), // Nombre del cliente
  description: z.string(), // Descripción del proyecto
  manager: z.string(userSchema.pick({ _id: true })),
  tasks: z.array(TaskProjectSchema),
  team: z.array(z.string(userSchema.pick({_id: true})))
});

// Define un esquema para el conjunto de proyectos que se muestra en el tablero de control
export const dashboardProjectSchema = z.array(
  projectSchema.pick({
    _id: true, // Incluye solo los campos necesarios
    projectName: true,
    clientName: true,
    description: true,
    manager: true,
  })
);

export const editProjectSchema = projectSchema.pick({
  projectName: true,
  clientName: true,
  description: true,
});

// Infer el tipo TypeScript a partir del esquema de proyecto
export type Project = z.infer<typeof projectSchema>;

// Define el tipo de datos para el formulario de proyecto (solo los campos necesarios)
export type ProjectFormData = Pick<
  Project,
  "clientName" | "projectName" | "description"
>;

/** Team  */
const teamMemberSchema = userSchema.pick({
  name: true,
  email: true,
  _id: true,
});

export const teamMembersSchema = z.array(teamMemberSchema);

export type TeamMember = z.infer<typeof teamMemberSchema>;
export type TeamMemberForm = Pick<TeamMember, "email">;

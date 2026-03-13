export default function AdminHomePage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">
        Bienvenido al panel de administración
      </h2>
      <p className="text-sm text-muted-foreground">
        Desde aquí podrás gestionar usuarios, servicios y otras funciones
        administrativas. De momento, este panel incluye la creación de nuevos
        administradores.
      </p>
    </div>
  );
}


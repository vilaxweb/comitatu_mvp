import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { error: queryError } = await searchParams;

  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("user_type, status")
      .eq("id", user.id)
      .single();
    if (profile?.user_type === "admin" && profile.status === "active") {
      redirect("/admin");
    }
    if (profile?.user_type === "provider") {
      redirect("/provider");
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="Inicio de Comitatu">
            <Image
              src="/comitatu-logo.png"
              alt="Comitatu"
              width={126}
              height={29}
              className="h-7 w-auto"
              priority
            />
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <Link href="#features" className="hover:text-foreground">
              Funcionalidades
            </Link>
            <Link href="#how-it-works" className="hover:text-foreground">
              Como funciona
            </Link>
            <Link href="#contact" className="hover:text-foreground">
              Contacto
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="hidden max-w-40 truncate text-xs text-muted-foreground sm:block">
                  {user.email}
                </span>
                <form action={signOut}>
                  <Button type="submit" variant="outline" size="sm">
                    Cerrar sesion
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/login">Iniciar sesion</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/register">Comenzar</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-4 py-16 sm:px-6 lg:px-8">
        <section className="py-6">
          <div className="mx-auto flex max-w-3xl flex-col items-center space-y-6 text-center">
            <p className="inline-flex w-fit self-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Plataforma digital de operaciones
            </p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Tecnologia para operaciones estructuradas, eficientes y escalables
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground">
              Ayudamos a las organizaciones a centralizar flujos de trabajo, conectar equipos y
              transformar datos operativos en decisiones claras. La plataforma esta diseniada para
              brindar confiabilidad, visibilidad y crecimiento sostenible.
            </p>
            {!user && (
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Button asChild size="lg" className="h-12 px-8 text-base sm:w-auto">
                  <Link href="/auth/register">Crear cuenta</Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  size="lg"
                  className="h-12 px-8 text-base sm:w-auto"
                >
                  <Link href="/auth/login">Iniciar sesion</Link>
                </Button>
              </div>
            )}
            {queryError === "provider_only" && (
              <p className="mx-auto max-w-xl text-sm text-destructive" role="alert">
                No tienes acceso al panel de proveedores.
              </p>
            )}
          </div>
        </section>

        <section id="features" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Visibilidad operativa",
              description:
                "Supervisa metricas clave y actividad de los equipos desde un espacio centralizado.",
            },
            {
              title: "Estandarizacion de procesos",
              description:
                "Reduce la fragmentacion con flujos repetibles y practicas de ejecucion consistentes.",
            },
            {
              title: "Planificacion basada en datos",
              description:
                "Usa datos confiables para priorizar iniciativas, asignar recursos y mejorar resultados.",
            },
            {
              title: "Colaboracion escalable",
              description:
                "Coordina actores internos y externos con responsabilidades y seguimiento claros.",
            },
          ].map((item) => (
            <article key={item.title} className="rounded-xl border bg-card p-5 shadow-sm">
              <h2 className="text-base font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium text-foreground">Resumen rapido</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              { value: "Plataforma unificada", label: "Para flujos, equipos y seguimiento operativo" },
              { value: "Claridad en tiempo real", label: "Monitorea avances e identifica bloqueos temprano" },
              { value: "Enfoque de negocio", label: "Alinea la ejecucion operativa con objetivos estrategicos" },
            ].map((item) => (
              <div key={item.value} className="rounded-lg border bg-background px-4 py-3">
                <p className="text-sm font-semibold text-foreground">{item.value}</p>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Como funciona</h2>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              Un proceso de adopcion simple, pensado para equipos de negocio y tecnologia.
            </p>
          </div>
          <div className="grid gap-6 rounded-2xl border bg-card p-8 shadow-sm lg:grid-cols-3 lg:gap-8">
          {[
            {
              step: "01",
              title: "Crea el perfil de tu organizacion",
              description:
                "Configura la estructura de tu cuenta y define equipos, roles y permisos.",
            },
            {
              step: "02",
              title: "Configura tus flujos de trabajo",
              description:
                "Adapta los procesos clave a tu operacion y empieza a registrar actividad estructurada.",
            },
            {
              step: "03",
              title: "Mide y optimiza",
              description:
                "Revisa indicadores de desempeno y mejora la ejecucion con informacion accionable.",
            },
          ].map((item) => (
            <div key={item.step} className="space-y-3">
              <p className="text-xs font-semibold tracking-wider text-primary">{item.step}</p>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </div>
          ))}
          </div>
        </section>

        <section id="faqs" className="mx-auto w-full max-w-4xl space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Preguntas frecuentes</h2>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              Respuestas a las preguntas mas comunes sobre implementacion, seguridad y escalabilidad.
            </p>
          </div>
          <div className="space-y-3">
            {[
              {
                question: "Que tipo de organizaciones pueden usar la plataforma?",
                answer:
                  "Comitatu esta pensada para equipos que gestionan operaciones, servicios y coordinacion entre multiples areas.",
              },
              {
                question: "Cuanto tiempo toma comenzar?",
                answer:
                  "La puesta en marcha inicial puede realizarse en poco tiempo, comenzando con estructura, roles y flujos principales.",
              },
              {
                question: "Se puede adaptar a procesos existentes?",
                answer:
                  "Si. La plataforma permite configurar flujos de trabajo para alinearse con la operacion actual de cada organizacion.",
              },
              {
                question: "Como se gestiona la seguridad de acceso?",
                answer:
                  "El sistema utiliza autenticacion segura y control por roles para asegurar que cada usuario vea solo lo que necesita.",
              },
              {
                question: "La solucion escala con el crecimiento del negocio?",
                answer:
                  "Si. Comitatu esta diseniada para crecer junto con tu organizacion, manteniendo visibilidad y control operativo.",
              },
            ].map((item) => (
              <details key={item.question} className="group rounded-xl border bg-card px-5 py-4 shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-base font-semibold marker:content-none">
                  <span>{item.question}</span>
                  <ChevronDown
                    className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                    aria-hidden
                  />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {!user && (
          <section className="flex flex-col gap-4 rounded-2xl border bg-card p-8 text-center shadow-sm sm:items-center">
            <h2 className="text-2xl font-semibold">Listo para explorar la plataforma?</h2>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              Crea una cuenta para comenzar o inicia sesion si ya tienes acceso a tu espacio de
              trabajo.
            </p>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button asChild className="w-full sm:w-auto">
                <Link href="/auth/register">Crear cuenta</Link>
              </Button>
              <Button variant="outline" asChild className="w-full sm:w-auto">
                <Link href="/auth/login">Iniciar sesion</Link>
              </Button>
            </div>
          </section>
        )}
      </main>

      <footer id="contact" className="border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="space-y-2">
            <Link href="/" aria-label="Inicio de Comitatu">
              <Image
                src="/comitatu-logo.png"
                alt="Comitatu"
                width={126}
                height={29}
                className="h-7 w-auto"
              />
            </Link>
            <p className="text-sm text-muted-foreground">
              Plataforma de tecnologia y operaciones para organizaciones modernas.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Comitatu. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

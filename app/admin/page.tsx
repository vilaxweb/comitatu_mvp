import { getAdminDashboardStats } from "./actions";
import { AdminGrowthCards } from "./AdminGrowthCards";
import { AdminSummaryCards } from "./AdminSummaryCards";

export default async function AdminHomePage() {
  const {
    totalActiveUsers,
    totalAvailableProviders,
    totalActiveCustomers,
    totalActiveAdmins,
    newUsersLast7Days,
    newProvidersLast7Days,
    newServicesLast7Days,
    newUsersSeriesLast7Days,
    newProvidersSeriesLast7Days,
    newServicesSeriesLast7Days,
  } = await getAdminDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Resumen general
        </h2>
        <p className="text-sm text-muted-foreground">
          Visión rápida del estado actual de la plataforma.
        </p>
      </div>

      <AdminSummaryCards
        totalActiveUsers={totalActiveUsers}
        totalAvailableProviders={totalAvailableProviders}
        totalActiveCustomers={totalActiveCustomers}
        totalActiveAdmins={totalActiveAdmins}
      />

      <AdminGrowthCards
        newUsersLast7Days={newUsersLast7Days}
        newProvidersLast7Days={newProvidersLast7Days}
        newServicesLast7Days={newServicesLast7Days}
        newUsersSeriesLast7Days={newUsersSeriesLast7Days}
        newProvidersSeriesLast7Days={newProvidersSeriesLast7Days}
        newServicesSeriesLast7Days={newServicesSeriesLast7Days}
      />
    </div>
  );
}


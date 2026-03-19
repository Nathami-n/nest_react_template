import { useState } from "react";
import { format } from "date-fns";
import {
  PageHeader,
  Badge,
  Button,
  DataTable,
  DataTableColumnHeader,
  Card,
  CardContent,
} from "@repo/ui/components";
import { userContext } from "@/context/auth-context";
import { authMiddleware } from "@/middleware";
import { useUsers, useUpdateUserStatus, type User } from "@/features/users";
import {
  CheckmarkCircle02Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import type { Route } from "./+types/users";

export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  const user = context.get(userContext);
  return { user };
}

export default function AdminUsersRoute({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const { data, isLoading } = useUsers(
    pagination.pageIndex + 1,
    pagination.pageSize,
  );

  const updateStatusMutation = useUpdateUserStatus();

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "PLATFORM_ADMIN":
        return "destructive";
      case "ADMIN":
        return "default";
      default:
        return "secondary";
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        const userItem = row.original;
        return (
          <div className="flex items-center gap-3">
            {userItem.image ? (
              <img
                src={userItem.image}
                alt={userItem.name || "User"}
                className="size-8 rounded-full"
              />
            ) : (
              <div className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {userItem.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
            <div>
              <div className="font-medium">{userItem.name || "—"}</div>
              <div className="text-sm text-muted-foreground">
                {userItem.email}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <Badge variant={getRoleBadgeVariant(row.getValue("role") as string)}>
          {row.getValue("role")}
        </Badge>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) =>
        row.getValue("isActive") ? (
          <Badge variant="default" className="bg-green-500">
            Active
          </Badge>
        ) : (
          <Badge variant="secondary">Inactive</Badge>
        ),
    },
    {
      accessorKey: "emailVerified",
      header: "Verified",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.getValue("emailVerified") ? (
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              className="size-4 text-green-500"
            />
          ) : (
            <HugeiconsIcon
              icon={Cancel01Icon}
              className="size-4 text-muted-foreground"
            />
          )}
          <span className="text-sm text-muted-foreground">
            {row.getValue("emailVerified") ? "Yes" : "No"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "provider",
      header: "Provider",
      cell: ({ row }) => (
        <span className="text-sm capitalize">
          {row.getValue("provider") || "—"}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Joined" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return <div className="text-sm">{format(date, "MMM dd, yyyy")}</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const userItem = row.original;
        if (user?.id === userItem.id) return null;
        return (
          <Button
            size="sm"
            variant={userItem.isActive ? "destructive" : "default"}
            onClick={() =>
              updateStatusMutation.mutate({
                id: userItem.id,
                isActive: !userItem.isActive,
              })
            }
            disabled={updateStatusMutation.isPending}
          >
            {userItem.isActive ? "Deactivate" : "Activate"}
          </Button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users Management"
        description="Manage all users on the platform"
      />

      <Card>
        <CardContent className="pt-6">
          <DataTable
            columns={columns}
            data={data?.data || []}
            searchKey="email"
            searchPlaceholder="Search by email..."
            enablePagination={true}
            pageCount={data?.meta?.totalPages}
            pagination={pagination}
            onPaginationChange={setPagination}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export const clientMiddleware = [authMiddleware];

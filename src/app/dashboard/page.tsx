import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const items = await prisma.item.findMany({
    where: {
      status: "ACTIVE",
    },
    orderBy: {
      date: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        }
      }
    }
  });

  return <DashboardClient initialItems={items} />;
}

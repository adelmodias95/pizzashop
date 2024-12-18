import { useSearchParams } from "react-router-dom";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Helmet } from "react-helmet-async";
import { OrderTableRow } from "./order-table-row";
import { OrderTablefilters } from "./order-table-filters";
import { Pagination } from "@/components/pagination";
import { getOrders } from "@/api/get-orders";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

export function Orders() {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageIndex = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get("page") || "0");

  const { data: ordersResult } = useQuery({
    queryKey: ["orders", pageIndex],
    queryFn: () => getOrders({ pageIndex }),
  });

  function handlePaginate(pageIndex: number) {
    setSearchParams((prev) => {
      prev.set("page", String(pageIndex + 1));
      return prev;
    });
  }

  return (
    <>
      <Helmet title="Pedidos" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>

        <div className="space-y-2.5">
          <OrderTablefilters />

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead className="w-[140px]">Identificador</TableHead>
                  <TableHead className="w-[180px]">Realizado há</TableHead>
                  <TableHead className="w-[140px]">Status</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="w-[140px]">Total do pedido</TableHead>
                  <TableHead className="w-[164px]"></TableHead>
                  <TableHead className="w-[132px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* {Array.from({ length: 10 }).map((_, index) => {
                  return <OrderTableRow key={index} />;
                })} */}
                {ordersResult &&
                  ordersResult.orders.map((order) => {
                    return <OrderTableRow key={order.orderId} order={order} />;
                  })}
              </TableBody>
            </Table>
          </div>

          {ordersResult && (
            <Pagination
              pageIndex={ordersResult.meta.pageIndex}
              totalCount={ordersResult.meta.totalCount}
              perPage={ordersResult.meta.perPage}
              onPageChange={handlePaginate}
            />
          )}
        </div>
      </div>
    </>
  );
}

import type { Metadata } from "next"
import { connection } from "next/server"

import { deleteCategoryAction } from "@/app/admin/(panel)/categories/actions"
import { CategoryForm } from "@/components/category-form"
import { DeleteButton } from "@/components/delete-button"
import { RenameCategoryButton } from "@/components/rename-category-button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { db } from "@/lib/db"

export const metadata: Metadata = {
  title: "Kategoriler",
  robots: { index: false, follow: false },
}

export default async function CategoriesPage() {
  await connection()
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  })

  return (
    <>
      <h1 className="text-2xl font-semibold">Kategoriler</h1>
      <CategoryForm />
      {categories.length === 0 ? (
        <p className="text-muted-foreground">Henüz kategori yok.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ad</TableHead>
              <TableHead>Yazı sayısı</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category._count.posts}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                  <RenameCategoryButton id={category.id} name={category.name} />
                  <DeleteButton
                    label="Sil"
                    description={`"${category.name}" kategorisi silinecek. Yazısı olan kategori silinemez.`}
                    onDelete={deleteCategoryAction.bind(null, category.id)}
                  />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}

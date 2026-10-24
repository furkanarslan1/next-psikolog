import { PlusIcon, PencilIcon } from "lucide-react"
import type { Metadata } from "next"
import { connection } from "next/server"
import { Suspense } from "react"
import Link from "next/link"

import { deletePostAction } from "@/app/admin/(panel)/posts/actions"
import { TableSkeleton } from "@/components/admin/skeletons"
import { DeleteButton } from "@/components/delete-button"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
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
  title: "Blog yazıları",
  robots: { index: false, follow: false },
}

const dateFormat = new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" })

export default function PostsPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Blog yazıları</h1>
        <Link href="/admin/posts/new" className={buttonVariants()}>
          <PlusIcon />
          Yeni yazı
        </Link>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <PostsTable />
      </Suspense>
    </>
  )
}

async function PostsTable() {
  await connection()
  const posts = await db.post.findMany({
    orderBy: { updatedAt: "desc" },
    include: { category: true },
  })

  return (
    <>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">Henüz yazı yok.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Başlık</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Güncelleme</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="max-w-72 truncate font-medium">{post.title}</TableCell>
                <TableCell>
                  <Badge variant={post.status === "PUBLISHED" ? "default" : "secondary"}>
                    {post.status === "PUBLISHED" ? "Yayında" : "Taslak"}
                  </Badge>
                </TableCell>
                <TableCell>{post.category?.name ?? "—"}</TableCell>
                <TableCell>{dateFormat.format(post.updatedAt)}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      aria-label="Düzenle"
                      title="Düzenle"
                      className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
                    >
                      <PencilIcon />
                    </Link>
                    <DeleteButton
                      label="Sil"
                      description={`"${post.title}" yazısı kalıcı olarak silinecek.`}
                      onDelete={deletePostAction.bind(null, post.id)}
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

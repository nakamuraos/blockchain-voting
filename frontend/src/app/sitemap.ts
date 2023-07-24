/**
 * @since 2023/07/16
 * @author ThinhHV <thinh@thinhhv.com>
 * @description description
 * @copyright (c) 2023 Company Platform
 */

import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const users = await prisma.user.findMany({
    select: {
      id: true,
    },
    take: 1,
  })

  return [
    {
      url: process.env.NEXT_PUBLIC_URL || '',
      lastModified: new Date(),
    },
    ...users.map((user) => ({
      url: `${process.env.NEXT_PUBLIC_URL}/${user.id}`,
      lastModified: new Date(),
    })),
  ]
}

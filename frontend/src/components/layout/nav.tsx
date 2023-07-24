/**
 * @since 2023/07/16
 * @author ThinhHV <thinh@thinhhv.com>
 * @description description
 * @copyright (c) 2023 Company Platform
 */

import Navbar from './navbar'

export default async function Nav({ session }: { session: any }) {
  return <Navbar session={session} />
}

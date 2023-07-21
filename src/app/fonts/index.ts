/**
 * @since 2023/07/16
 * @author ThinhHV <thinh@thinhhv.com>
 * @description description
 * @copyright (c) 2023 Company Platform
 */

import localFont from 'next/font/local'
import { Inter } from 'next/font/google'

export const sfPro = localFont({
  src: './SF-Pro-Display-Medium.otf',
  variable: '--font-sf',
})

export const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

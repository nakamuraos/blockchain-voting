/**
 * @since 2023/07/20
 * @author ThinhHV <thinh@thinhhv.com>
 * @description description
 * @copyright (c) 2023 Company Platform
 */

export const CONFIGS = {
  CHAIN_ID: +(process.env.NEXT_PUBLIC_CHAIN_ID || 5),
  RPC: process.env.NEXT_PUBLIC_RPC || '',
  TOKEN_VOTING: (process.env.NEXT_PUBLIC_TOKEN_VOTING || '0x') as `0x${string}`,
  CONTRACT_VOTING: (process.env.NEXT_PUBLIC_CONTRACT_VOTING || '0x') as `0x${string}`,
}

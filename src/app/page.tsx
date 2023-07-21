/**
 * @since 2023/07/16
 * @author ThinhHV <thinh@thinhhv.com>
 * @description description
 * @copyright (c) 2023 Company Platform
 */

'use client'

import Card from '@/components/home/card'
import Balancer from 'react-wrap-balancer'
import { useEffect, useState } from 'react'
import { useContractRead, useContractReads } from 'wagmi'
import ABI from 'src/configs/contracts/abi.json'
import { CONFIGS } from 'src/configs'
import { LoadingCircle } from '@/components/shared/icons'
import NoImage from '@/assets/no-image.svg'
import ImageWithFallback from '@/components/shared/image'
import { BigNumber, utils } from 'ethers'

const TOTAL_ITEM = 5
const contract: any = {
  address: CONFIGS.CONTRACT_VOTING,
  abi: ABI,
  chainId: CONFIGS.CHAIN_ID,
}

export default async function Home() {
  const [data, setData] = useState<any[]>([])
  const [dataTotalVote, setDataTotalVote] = useState<number>(0)
  const {
    data: dataFetch,
    isError,
    error,
    isSuccess,
    isLoading,
    refetch,
  } = useContractReads({
    enabled: false,
    contracts: Array.from(Array(TOTAL_ITEM).keys()).map((_, index) => ({
      ...contract,
      functionName: 'imageId',
      args: [index + 1],
    })),
  })
  const {
    data: dataFetchTotalVote,
    refetch: refetchTotalVote,
    isSuccess: isSuccessTotalVote,
  } = useContractRead({
    enabled: false,
    ...contract,
    functionName: 'totalVote',
  })

  useEffect(() => {
    refetch()
    refetchTotalVote()
  }, [])

  useEffect(() => {
    if (isSuccessTotalVote && dataFetchTotalVote) {
      setDataTotalVote(
        !dataFetchTotalVote ? 0 : Number(utils.formatUnits(dataFetchTotalVote as BigNumber)),
      )
      console.log('dataFetchTotalVote', dataFetchTotalVote)
    }
  }, [dataFetchTotalVote, isSuccessTotalVote])

  useEffect(() => {
    if (isSuccess && dataFetch) {
      console.log('dataFetch', dataFetch)
      setData(
        (dataFetch as any[])?.map((e) => ({
          name: e.result[0],
          avatar: e.result[1],
          description: e.result[2],
          amountVote: e.result[3],
        })),
      )
    }
  }, [dataFetch, isSuccess])

  return (
    <>
      <div className="z-10 w-full max-w-xl px-5 xl:px-0">
        <h1
          className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm md:text-7xl md:leading-[5rem]"
          style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}
        >
          <Balancer>Voting for the picture you like.</Balancer>
        </h1>
        <p
          className="mt-6 animate-fade-up text-center text-gray-500 opacity-0 md:text-xl"
          style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
        >
          <Balancer>A electoral system based blockchain.</Balancer>
        </p>
      </div>
      <div className="z-10 w-full max-w-xl px-5 xl:px-0">
        {(!data || data.length === 0) && (
          <p className="mt-6 flex justify-center text-center md:text-xl">
            <LoadingCircle height={16} width={16} />
          </p>
        )}
        {isError && !isLoading && (
          <>
            <p className="mt-6 text-center text-gray-500 md:text-xl">
              Cannot fetch data from blockchain. {error?.message}
            </p>
            <p className="mt-6 text-center text-gray-500 md:text-xl">
              <button
                className="rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
                onClick={() => refetch()}
              >
                Refetch
              </button>
            </p>
          </>
        )}
      </div>
      <div className="my-10 grid w-full max-w-screen-xl grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
        {data &&
          data.length > 0 &&
          data
            .map((e) => ({
              title: e.name,
              description: e.description,
              amountVote: e.amountVote,
              demo: (
                <div className="flex flex-1 items-center justify-center space-x-20">
                  <ImageWithFallback
                    style={{ flex: 1 }}
                    alt={`${e.name}: ${e.description}`}
                    src={e.avatar}
                    fallbackSrc={NoImage.src}
                    width={300}
                    height={400}
                  />
                </div>
              ),
              large: false,
            }))
            .map(({ title, description, amountVote, demo, large }, index) => (
              <Card
                key={title + index}
                title={title}
                description={description}
                demo={demo}
                large={large}
                actions={
                  <>
                    <p>
                      {utils.formatUnits(amountVote || BigNumber.from(0))}/{dataTotalVote} (
                      {/* {Math.round(
                        (parseFloat(amountVote + '') / parseFloat(dataTotalVote + '')) * 100,
                      )} */}
                      %)
                    </p>
                    <button
                      className="rounded-md border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
                      onClick={() => refetch()}
                    >
                      Vote
                    </button>
                  </>
                }
              />
            ))}
      </div>
    </>
  )
}

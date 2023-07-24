/**
 * @since 2023/07/16
 * @author ThinhHV <thinh@thinhhv.com>
 * @description description
 * @copyright (c) 2023 Company Platform
 */

'use client'

import Card from '@/components/home/card'
import Balancer from 'react-wrap-balancer'
import { useCallback, useEffect, useState } from 'react'
import {
  useAccount,
  useConnect,
  useContractRead,
  useContractReads,
  useContractWrite,
  useNetwork,
  useSwitchNetwork,
  useWaitForTransaction,
} from 'wagmi'
import votingABI from 'src/configs/contracts/voting.abi.json'
import tokenABI from 'src/configs/contracts/token.abi.json'
import { CONFIGS } from 'src/configs'
import { LoadingCircle } from '@/components/shared/icons'
import NoImage from '@/assets/no-image.svg'
import ImageWithFallback from '@/components/shared/image'
import { BigNumber, utils } from 'ethers'
import { useSignInModal } from '@/components/layout/sign-in-modal'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import { config } from '../../app/providers'
import { formatTime } from '@/lib/utils'
// import { useVotingModal } from '@/components/layout/voting-modal'

const TOTAL_ITEM = 5
const MIN_APPROVE_AMOUNT = 100
const contract = {
  voting: {
    address: CONFIGS.CONTRACT_VOTING,
    abi: votingABI as any,
    chainId: CONFIGS.CHAIN_ID,
  },
  token: {
    address: CONFIGS.TOKEN_VOTING,
    abi: tokenABI,
    chainId: CONFIGS.CHAIN_ID,
  },
}

const Home = () => {
  const [data, setData] = useState<any[]>([])
  const [dataTotalVote, setDataTotalVote] = useState<number>(0)
  const [dataTime, setDataTime] = useState<number[]>([0, 0])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [hash, setHash] = useState<string>('')
  const [hashApprove, setHashApprove] = useState<string>('')
  const [imageId, setImageId] = useState<number>(0)
  const { data: session } = useSession()
  const { address: walletAddress } = useAccount()
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork({
    chainId: CONFIGS.CHAIN_ID,
    onError: (error) => {
      console.log(error)
      // setError(error.message)
    },
  })
  const { SignInModal, setShowSignInModal } = useSignInModal()
  // const { VotingModal, setShowModal: setShowVotingModal } = useVotingModal()
  const { connect, error: errorConnect } = useConnect({ connector: config.connectors[1] })

  ////////////////////////////////////////////////
  ///////////// CONTRACT FUNCTIONS ///////////////
  ////////////////////////////////////////////////

  // Get list artist
  const {
    data: dataFetch,
    isError,
    error: errorFetchList,
    isSuccess: isSuccessFetchList,
    isLoading: isLoadingFetchList,
    refetch: refetchList,
  } = useContractReads({
    enabled: true,
    watch: true,
    contracts: Array.from(Array(TOTAL_ITEM).keys()).map((_, index) => ({
      ...contract.voting,
      functionName: 'imageId',
      args: [index + 1],
    })),
  })
  // Get total voted
  const {
    data: dataFetchTotalVote,
    refetch: refetchTotalVote,
    isSuccess: isSuccessTotalVote,
  } = useContractRead({
    enabled: true,
    watch: true,
    ...contract.voting,
    functionName: 'totalVote',
  })
  // Get start/end time
  const {
    data: dataFetchTime,
    isSuccess: isSuccessFetchTime,
    refetch: refetchTime,
  } = useContractReads({
    enabled: false,
    contracts: [
      {
        ...contract.voting,
        functionName: 'votingStartTime',
      },
      {
        ...contract.voting,
        functionName: 'votingEndTime',
      },
    ],
  })
  // Process approve
  const {
    data: dataApprove,
    isLoading: isLoadingApprove,
    isSuccess: isSuccessApprove,
    write: writeApprove,
  } = useContractWrite({
    ...contract.token,
    functionName: 'approve',
    args: [CONFIGS.CONTRACT_VOTING, 1000000 * Math.pow(10, 18)],
  })
  // approve
  const {
    isFetching: isFetchingTransactionApprove,
    isLoading: isLoadingTransactionApprove,
    isSuccess: isSuccessTransactionApprove,
    refetch: refetchTransactionApprove,
  } = useWaitForTransaction({
    enabled: false,
    hash: hashApprove as any,
  })
  // Check allowance
  const { data: dataAllowance, refetch: refetchDataAllowance } = useContractRead({
    enabled: false,
    ...contract.token,
    functionName: 'allowance',
    args: [(session as any)?.address, CONFIGS.CONTRACT_VOTING],
  })
  // Voting
  const {
    data: dataVoting,
    isLoading: isLoadingVoting,
    isSuccess: isSuccessVoting,
    write: writeVoting,
  } = useContractWrite({
    ...contract.voting,
    functionName: 'vote',
  })
  const {
    isFetching: isFetchingTransaction,
    isLoading: isLoadingTransactionVoting,
    isSuccess: isSuccessTransactionVoting,
    refetch: refetchVotingTransaction,
  } = useWaitForTransaction({
    enabled: false,
    hash: hash as any,
  })

  ////////////////////////////////////////////////
  /////////// END CONTRACT FUNCTIONS /////////////
  ////////////////////////////////////////////////

  useEffect(() => {
    refetchList()
    refetchTotalVote()
    refetchTime()
  }, [])

  useEffect(() => {
    console.log('errorConnect', errorConnect)
  }, [errorConnect])

  useEffect(() => {
    const { address } = (session as any) || {}
    if (address) {
      connect()
      refetchDataAllowance()
    }
  }, [session])

  useEffect(() => {
    if (dataVoting?.hash) {
      setHash(dataVoting.hash)
    }
  }, [dataVoting])

  useEffect(() => {
    if (dataApprove?.hash) {
      setHashApprove(dataApprove.hash)
    }
  }, [dataApprove])

  useEffect(() => {
    if (isSuccessTransactionApprove) {
      toast.success('Successfully approve!')
      refetchDataAllowance()
    }
  }, [isSuccessTransactionApprove])

  useEffect(() => {
    setIsLoading(
      isLoadingVoting ||
        isFetchingTransaction ||
        isLoadingTransactionVoting ||
        isFetchingTransactionApprove ||
        isLoadingTransactionApprove ||
        isLoadingApprove,
    )
  }, [
    isLoadingVoting,
    isFetchingTransaction,
    isLoadingTransactionVoting,
    isFetchingTransactionApprove,
    isLoadingTransactionApprove,
    isLoadingApprove,
  ])

  useEffect(() => {
    if (hash) {
      // toast.promise(new Promise((rs, rj) => {
      //   if (isSuccessTransactionVoting) {
      //     rs(true)
      //   }
      //   setTimeout(() => rs(true), 5000)
      // }), {
      //   loading: 'Confirming transaction...',
      //   success: <b>Transaction confirmed!</b>,
      //   error: <b>Could not confirm.</b>,
      // })
      if (isSuccessVoting) {
        refetchVotingTransaction?.()
      }
    }
  }, [isSuccessVoting, hash])

  useEffect(() => {
    if (hashApprove && isSuccessApprove) {
      refetchTransactionApprove()
    }
  }, [isSuccessApprove, hashApprove])

  useEffect(() => {
    if (isSuccessTransactionVoting) {
      toast.success('Successfully voting!')
      refetchList()
      refetchTotalVote()
      refetchDataAllowance()
    }
  }, [isSuccessTransactionVoting])

  useEffect(() => {
    if (isSuccessTotalVote && dataFetchTotalVote) {
      setDataTotalVote(
        !dataFetchTotalVote
          ? 0
          : Number(utils.formatUnits(dataFetchTotalVote as unknown as BigNumber)),
      )
    }
  }, [dataFetchTotalVote, isSuccessTotalVote])

  useEffect(() => {
    if (isSuccessFetchList && dataFetch) {
      setData(
        (dataFetch as any[])?.map((e) => ({
          name: e.result[0],
          avatar: e.result[1],
          description: e.result[2],
          amountVote: e.result[3],
        })),
      )
      console.log('Received data', dataFetch)
    }
  }, [dataFetch, isSuccessFetchList])

  useEffect(() => {
    if (isSuccessFetchTime && dataFetchTime) {
      setDataTime([
        Number(dataFetchTime?.[0]?.result?.toString() || 0) * 1000,
        Number(dataFetchTime?.[1]?.result?.toString() || 0) * 1000,
      ])
      console.log('Received dataTime', dataFetchTime)
    }
  }, [dataFetchTime, isSuccessFetchTime])

  const onClickVote = useCallback(
    async (index: number) => {
      console.log('Voting for ' + index)
      setImageId(index)
      const { address } = (session as any) || {}
      if (!address) {
        setShowSignInModal(true)
        return
      }
      if (!walletAddress) {
        connect()
      }
      console.log('Current chain ID', chain?.id)
      if (chain?.id !== CONFIGS.CHAIN_ID) {
        switchNetwork?.()
      }
      console.log('dataAllowance', dataAllowance)
      if (
        Number(utils.formatUnits((dataAllowance as BigNumber) || BigNumber.from(0), 0)) <
        Number(MIN_APPROVE_AMOUNT * Math.pow(10, 18))
      ) {
        writeApprove?.()
      }
      // handle voting
      console.log('Writing contract vote')
      writeVoting?.({
        args: [100 * Math.pow(10, 18), index],
      })
    },
    [session, chain, writeApprove, writeVoting, dataAllowance, walletAddress],
  )

  return (
    <>
      <SignInModal />
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
        {isError && !isLoadingFetchList && (
          <>
            <p className="mt-6 text-center text-gray-500 md:text-xl">
              Cannot fetch data from blockchain. {errorFetchList?.message}
            </p>
            <p className="mt-6 text-center text-gray-500 md:text-xl">
              <button
                className="rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
                onClick={() => refetchList()}
              >
                Refetch
              </button>
            </p>
          </>
        )}
      </div>
      {!isLoadingFetchList && (
        <div className="z-10 mt-5 text-center text-lg font-bold text-red-400">
          <div>VOTING DURATION:</div>
          <div>{formatTime(dataTime[0]) + ' UTC ~ ' + formatTime(dataTime[1]) + ' UTC'}</div>
        </div>
      )}
      {!isLoadingFetchList && data && data.length > 0 && (
        <div className="z-10 mt-5 font-bold text-green-700">
          TOTAL DEPOSITED TOKEN: {dataTotalVote} TBP
        </div>
      )}
      <div className="my-5 grid w-full max-w-screen-xl grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
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
                  <div className="grid grid-cols-1 items-center gap-1">
                    <div className="text-center">
                      <div>
                        Total deposited for this:{' '}
                        {Math.round(
                          Number(utils.formatUnits(amountVote || BigNumber.from(0))) * 100,
                        ) / 100}{' '}
                        TBP
                      </div>
                      <div>
                        Win ratio:{' '}
                        {Math.round(
                          (Number(utils.formatUnits(amountVote || BigNumber.from(0))) /
                            Number(dataTotalVote)) *
                            100,
                        )}
                        %
                      </div>
                    </div>
                    <div className="text-center">
                      <button
                        type="button"
                        disabled={isLoading && imageId === index + 1}
                        className="inline-flex items-center rounded-md border border-black bg-black p-1.5 px-4 text-center text-sm text-white transition-all hover:bg-white hover:text-black"
                        onClick={(e) => {
                          e.preventDefault()
                          onClickVote(index + 1)
                        }}
                      >
                        {isLoading && imageId === index + 1 && <LoadingCircle className="mr-2" />}
                        {imageId !== index + 1
                          ? 'Vote'
                          : isFetchingTransaction || isLoadingTransactionVoting
                          ? 'Confirming'
                          : isLoadingApprove ||
                            isFetchingTransactionApprove ||
                            isLoadingTransactionApprove
                          ? 'Approving'
                          : 'Vote'}
                      </button>
                    </div>
                  </div>
                }
              />
            ))}
      </div>
    </>
  )
}

export default Home

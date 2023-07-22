/**
 * @since 2023/07/16
 * @author ThinhHV <thinh@thinhhv.com>
 * @description description
 * @copyright (c) 2023 Company Platform
 */

import Modal from '@/components/shared/modal'
import { useState, Dispatch, SetStateAction, useCallback, useMemo, useEffect } from 'react'
import { LoadingDots } from '@/components/shared/icons'
import Image from 'next/image'
import MetaMaskLogo from '@/assets/metamask.svg'
import { signIn } from 'next-auth/react'
import { useConnect, useAccount, useNetwork, useSwitchNetwork } from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { CONFIGS } from 'src/configs'
import Stepper from '../shared/stepper'

const VotingModal = ({
  showModal,
  setShowModal,
}: {
  showModal: boolean
  setShowModal: Dispatch<SetStateAction<boolean>>
}) => {
  const [signInClicked, setSignInClicked] = useState<boolean>(false)
  const [error, setError] = useState<any>()
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork({
    chainId: CONFIGS.CHAIN_ID,
    onError: (error) => {
      setSignInClicked(false)
      setError(error.message)
    },
  })
  const {
    connect,
    isError,
    error: errorConnect,
  } = useConnect({
    connector: new MetaMaskConnector(),
  })

  useEffect(() => {
    setError('')
  }, [showModal])

  useEffect(() => {
    if (isError && errorConnect) {
      setSignInClicked(false)
      setError(errorConnect.message)
    }
  }, [isError, errorConnect])

  useEffect(() => {
    console.log(address, chain, signInClicked)
    if (address && chain && signInClicked) {
      if (chain.id === CONFIGS.CHAIN_ID) {
        console.log('success')
        setError('')
        signIn('credentials', { address, callbackUrl: '/' })
      } else {
        switchNetwork?.()
      }
    }
  }, [address, chain, signInClicked])

  return (
    <Modal showModal={showModal} setShowModal={setShowModal}>
      <div className="w-full overflow-hidden shadow-xl md:max-w-md md:rounded-2xl md:border md:border-gray-200">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center md:px-16">
          <a href="/">
            <Image
              src="/logo.png"
              alt="Logo"
              className="h-10 w-10 rounded-full"
              width={20}
              height={20}
            />
          </a>
          <h3 className="font-display text-2xl font-bold">Approve Token</h3>
          <p className="text-sm text-gray-500">
            This is strictly for demo purposes - only approve token on testnet chains.
          </p>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 md:px-16">
          <Stepper />
        </div>
      </div>
    </Modal>
  )
}

export function useVotingModal() {
  const [showModal, setShowModal] = useState(false)

  const ModalCallback = useCallback(() => {
    return <VotingModal showModal={showModal} setShowModal={setShowModal} />
  }, [showModal, setShowModal])

  return useMemo(() => ({ setShowModal, VotingModal: ModalCallback }), [setShowModal, ModalCallback])
}

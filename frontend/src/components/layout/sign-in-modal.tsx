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
import { config } from '@/app/providers'

const SignInModal = ({
  showSignInModal,
  setShowSignInModal,
}: {
  showSignInModal: boolean
  setShowSignInModal: Dispatch<SetStateAction<boolean>>
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
    connector: config.connectors[1],
  })

  useEffect(() => {
    setError('')
  }, [showSignInModal])

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
    <Modal showModal={showSignInModal} setShowModal={setShowSignInModal}>
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
          <h3 className="font-display text-2xl font-bold">Sign In</h3>
          <p className="text-sm text-gray-500">
            This is strictly for demo purposes - only your wallet address will be stored.
          </p>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {isConnected && chain?.id === CONFIGS.CHAIN_ID && (
            <>
              <p className="text-sm text-green-700">Connect wallet successfully.</p>
              <p className="text-sm text-green-700">Processing login...</p>
            </>
          )}
        </div>

        <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 md:px-16">
          <button
            disabled={signInClicked}
            className={`${
              signInClicked
                ? 'cursor-not-allowed border-gray-200 bg-gray-100'
                : 'border border-gray-200 bg-white text-black hover:bg-gray-50'
            } flex h-10 w-full items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none`}
            onClick={() => {
              setSignInClicked(true)
              setError('')
              connect()
            }}
          >
            {signInClicked ? (
              <LoadingDots color="#808080" />
            ) : (
              <>
                <Image
                  src={MetaMaskLogo.src}
                  alt="metamask"
                  width={50}
                  height={50}
                  className="h-5 w-5"
                />
                <p>Sign In with MetaMask</p>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export function useSignInModal() {
  const [showSignInModal, setShowSignInModal] = useState(false)

  const SignInModalCallback = useCallback(() => {
    return <SignInModal showSignInModal={showSignInModal} setShowSignInModal={setShowSignInModal} />
  }, [showSignInModal, setShowSignInModal])

  return useMemo(
    () => ({ setShowSignInModal, SignInModal: SignInModalCallback }),
    [setShowSignInModal, SignInModalCallback],
  )
}

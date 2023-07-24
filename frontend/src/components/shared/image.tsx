/**
 * @since 2023/07/21
 * @author ThinhHV <thinh@thinhhv.com>
 * @description description
 * @copyright (c) 2023 Company Platform
 */

import React, { useState } from 'react'
import Image, { ImageProps } from 'next/image'

const ImageWithFallback = (props: ImageProps & { fallbackSrc?: string }) => {
  const { src, fallbackSrc, ...rest } = props
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <Image
      {...rest}
      src={imgSrc}
      onError={() => {
        setImgSrc(fallbackSrc || src)
      }}
    />
  )
}

export default ImageWithFallback

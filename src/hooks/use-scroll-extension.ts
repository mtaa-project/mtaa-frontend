import { useCallback, useRef, useState } from "react"
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native"

export function useScrollExtension(threshold = 10) {
  const [isExtended, setIsExtended] = useState(true)
  const scrollOffset = useRef(0)

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentOffset = e.nativeEvent.contentOffset.y
      const direction = currentOffset > scrollOffset.current ? "down" : "up"
      const shouldExtend = direction === "up" || currentOffset < threshold

      setIsExtended(shouldExtend)
      scrollOffset.current = currentOffset
    },
    [threshold]
  )

  return { isExtended, onScroll }
}

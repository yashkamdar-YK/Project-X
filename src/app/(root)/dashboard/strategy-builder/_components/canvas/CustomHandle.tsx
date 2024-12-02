// import { Handle, HandleProps } from '@xyflow/react'
// import React from 'react'

// const CustomHandle = (props: HandleProps) => {
//     return (
//         <Handle {...props}
//             style={{
//                 background: 'blue',
//                 width: '10px',
//                 height: '10px',
//                 borderRadius: '50%',
//                 border: '1px solid white'
//             }}
//         />
//     )
// }

// export default CustomHandle

import { Handle, HandleProps } from '@xyflow/react'
import React from 'react'
import { cn } from '@/lib/utils'

const CustomHandle = (props: HandleProps) => {
  const handleBaseStyles = 'transition-all duration-200'
  const handleSizeStyles = props.className ? props.className : '!w-3 !h-3 md:!w-[10px] md:!h-[10px] sm:!w-4 sm:!h-4'

  return (
    <Handle 
      {...props}
      className={cn(
        handleBaseStyles,
        handleSizeStyles,
        props.className
      )}
      style={{
        background: props.style?.background || 'blue',
        borderRadius: '50%',
        border: '1px solid white',
        ...props.style,
      }}
    />
  )
}

export default CustomHandle
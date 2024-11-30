import { Handle, HandleProps } from '@xyflow/react'
import React from 'react'

const CustomHandle = (props: HandleProps) => {
    return (
        <Handle {...props}
            style={{
                background: 'blue',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                border: '1px solid white'
            }}
        />
    )
}

export default CustomHandle
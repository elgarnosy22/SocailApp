import { Alert } from '@heroui/react'
import React from 'react'

export default function ErrorMessage({ error }) {
    return (
        <>
            {error && <Alert className='bg-red-50 rounded-2xl mt-1' status="danger">
                <Alert.Indicator />
                <Alert.Content>
                    <Alert.Title>{error.message}</Alert.Title>
                </Alert.Content>
            </Alert>}
        </>
    )
}

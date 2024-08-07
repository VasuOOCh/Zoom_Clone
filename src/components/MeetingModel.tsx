import { cn } from '@/lib/utils'
import React, { ReactNode } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import Image from 'next/image'

interface MeetingModelProps {
    isOpen: boolean,
    onClose: () => void,
    title: string,
    btnText?: string,
    handleClick?: () => void,
    img?: string,
    buttonIcon?: string,
    className?: string
    children?: ReactNode
}

const MeetingModel = ({ isOpen, onClose, title, btnText, handleClick, img, buttonIcon, className, children }: MeetingModelProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='frlex w-full max-w-[520px] flex-col gap-6 border-none bg-dark-1 px-6 py-9 text-white'>
                <div className='flex flex-col gap-6'>
                    {img && (
                        <div className='flex justify-center'>
                            <Image src={img} alt='image' width={72} height={72} />
                        </div>
                    )}
                    <h1 className={cn('text-3xl font-bold leading-[42px]', className)}>{title}</h1>
                    {children}
                    <Button className='bg-blue-1 focus-visible:ring-0 focus-visible:ring-offset-0' onClick={handleClick}>
                        {buttonIcon && (
                            <Image src={buttonIcon} alt='btn' width={13} height={13} />
                        )}
                        &nbsp;
                        {btnText || 'Schedule Meeting'}
                    </Button>

                </div>
            </DialogContent>
        </Dialog>
    )
}

export default MeetingModel
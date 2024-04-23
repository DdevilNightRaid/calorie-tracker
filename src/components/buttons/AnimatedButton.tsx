import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils';
const AnimatedButton = ({
    children,
    className,
}: {
    children: React.ReactNode,
    className?: string;
}) => {
    return (
        <motion.button
            className={cn("px-4 py-2 rounded-md relative radial-gradient", className)}
            initial={{
                "--x": "100%",
                scale: 1,
            }}
            animate={{ "--x": "-100%" }}
            whileTap={{
                scale: 0.97,
            }}
            transition={{
                repeat: Infinity,
                repeatType: "loop",
                repeatDelay: 1,
                type: "spring",
                stiffness: 20,
                damping: 15,
                mass: 2,
                scale: {
                    type: "spring",
                    stiffness: 10,
                    damping: 5,
                    mass: 0.1,
                }

            }}
        >
            <span className='text-neutral-900 tracking-wide font-light h-full w-full block relative linear-mask'>
                {children}
                {/* add */}
            </span>
            <span className='block absolute inset-0 rounded-md p-px linear-overlay' />
        </motion.button>
    )
}

export default AnimatedButton
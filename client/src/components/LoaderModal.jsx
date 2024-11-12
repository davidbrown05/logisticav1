import React, { createContext, useContext, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { LoaderContext } from '../context/LoaderContext'

export const LoaderModal = () => {

   const {loaderContext}=  useContext(LoaderContext)
    return (
        <AnimatePresence>
          {loaderContext && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-lg p-6 shadow-xl"
              >
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )
}

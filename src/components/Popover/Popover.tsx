
import { AnimatePresence,motion } from 'framer-motion'
import { useFloating, FloatingPortal, arrow, shift, offset, type Placement} from '@floating-ui/react-dom-interactions'
import { useRef, useState, useId, type ElementType } from 'react';


interface Props {
    children: React.ReactNode
    renderPopover: React.ReactNode
    className?: string
    as?: ElementType
    initialOpen?: boolean
    placement?: Placement
    changeSize?: string
}
export default function Popover({children, renderPopover, className, as: Element = 'div',initialOpen, placement, changeSize}: Props) {
    const arrowRef = useRef<HTMLElement>(null)
    const [open, setOpen] = useState( initialOpen || false)
    const { x, y, reference, floating, strategy, middlewareData } = useFloating({
        middleware: [offset(9), shift(), arrow({ element: arrowRef })],
        placement: placement
    })
    const showPopover = () => {
      setOpen(true)
    }
    const hidePopover = () => {
      setOpen(false)
    }
    const id = useId()
  return (
    <Element className={className} ref={reference} onMouseEnter={showPopover} onMouseLeave={hidePopover}>
        {children}
      <FloatingPortal id={id}>
        <AnimatePresence>
          {open && (
            <motion.div
              ref={floating}
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                width: 'max-content',
                transformOrigin: `${middlewareData.arrow?.x}px top`
              }}
              initial={{ opacity: 0, transform: 'scale(0)' }}
              animate={{ opacity: 1, transform: 'scale(1)' }}
              exit={{ opacity: 0, transform: 'scale(0)' }}
              transition={{ duration: 0.2 }}
            >
              <span
                ref={arrowRef}
                className='absolute z-[99] -translate-y-[90%] border-[11px] border-x-transparent border-t-transparent border-b-[white]'
                style={{
                  left: middlewareData.arrow?.x,
                  top: middlewareData.arrow?.y
                }}
              />
              <span className={changeSize}></span>
              {renderPopover}
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </Element>
  )
}
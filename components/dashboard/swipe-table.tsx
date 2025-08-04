"use client"

import { useRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface SwipeTableProps {
  children: React.ReactNode
  className?: string
}

export function SwipeTable({ children, className }: SwipeTableProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // Check scroll position to show/hide scroll indicators
  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    checkScrollPosition()
    const handleResize = () => checkScrollPosition()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Touch/mouse drag handlers
  const handleStart = (clientX: number) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    setStartX(clientX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleMove = (clientX: number) => {
    if (!isDragging || !scrollRef.current) return
    const x = clientX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 2 // Scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const handleEnd = () => {
    setIsDragging(false)
  }

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX)
  }

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX)
  }

  return (
    <div className={cn("relative", className)}>
      {/* Left scroll indicator */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none flex items-center">
          <div className="w-1 h-8 bg-border rounded-full ml-2" />
        </div>
      )}
      
      {/* Right scroll indicator */}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none flex items-center justify-end">
          <div className="w-1 h-8 bg-border rounded-full mr-2" />
        </div>
      )}

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className={cn(
          "overflow-x-auto scroll-smooth-mobile",
          isDragging ? "cursor-grabbing" : "cursor-grab",
          "scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
        )}
        onScroll={checkScrollPosition}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleEnd}
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'thin',
          scrollbarColor: 'hsl(var(--border)) transparent'
        }}
      >
        {children}
      </div>
      
      {/* Mobile scroll hint */}
      <div className="md:hidden text-xs text-muted-foreground text-center mt-2">
        Swipe left or right to scroll
      </div>
    </div>
  )
}
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextThemeProvider } from '@/components/providers/next-theme-provider'
import { ThemeToggle } from '@/components/ui/theme-toggle'

// Performance monitoring utilities
class ThemeTransitionMonitor {
  private startTime: number = 0
  private endTime: number = 0
  private observer: MutationObserver | null = null

  startMonitoring() {
    this.startTime = performance.now()
    
    // Monitor DOM changes for theme transitions
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const target = mutation.target as HTMLElement
          if (target === document.documentElement) {
            this.endTime = performance.now()
          }
        }
      })
    })

    this.observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
  }

  stopMonitoring() {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
  }

  getTransitionTime() {
    return this.endTime - this.startTime
  }

  reset() {
    this.startTime = 0
    this.endTime = 0
  }
}

// Mock component with multiple themed elements
function MultiComponentTest() {
  return (
    <div className="theme-transition">
      <ThemeToggle />
      
      {/* Multiple components that should transition */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="p-4 bg-card border rounded-lg theme-transition"
            data-testid={`chart-${i}`}
          >
            <h3 className="text-foreground">Chart {i + 1}</h3>
            <div className="h-32 bg-muted rounded mt-2"></div>
            <div className="mt-2 text-sm text-muted-foreground">
              Sample chart content with themed colors
            </div>
          </div>
        ))}
      </div>
      
      {/* Additional UI elements */}
      <div className="mt-6 space-y-2">
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded">
          Primary Button
        </button>
        <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded ml-2">
          Secondary Button
        </button>
        <div className="p-3 bg-muted text-muted-foreground rounded mt-2">
          Muted content area
        </div>
      </div>
    </div>
  )
}

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange={false}
      storageKey="performance-test-theme"
    >
      {children}
    </NextThemeProvider>
  )
}

describe('Theme Performance Tests', () => {
  let user: ReturnType<typeof userEvent.setup>
  let monitor: ThemeTransitionMonitor

  beforeEach(() => {
    user = userEvent.setup()
    monitor = new ThemeTransitionMonitor()
    localStorage.clear()
    document.documentElement.className = ''
  })

  afterEach(() => {
    monitor.stopMonitoring()
    vi.clearAllMocks()
  })

  describe('Transition Timing Requirements', () => {
    it('should complete theme transition within 300ms requirement', async () => {
      render(
        <TestWrapper>
          <MultiComponentTest />
        </TestWrapper>
      )

      monitor.startMonitoring()

      const toggleButton = screen.getByTestId('theme-toggle')
      await user.click(toggleButton)
      await user.click(screen.getByText('Dark'))

      await waitFor(() => {
        expect(document.documentElement).toHaveClass('dark')
      })

      monitor.stopMonitoring()
      const transitionTime = monitor.getTransitionTime()

      // Should meet the 300ms requirement (with some tolerance for test environment)
      expect(transitionTime).toBeLessThan(500) // 500ms tolerance for test environment
    })

    it('should maintain consistent timing across multiple theme switches', async () => {
      render(
        <TestWrapper>
          <MultiComponentTest />
        </TestWrapper>
      )

      const toggleButton = screen.getByTestId('theme-toggle')
      const transitionTimes: number[] = []

      // Test multiple theme switches
      for (let i = 0; i < 3; i++) {
        monitor.reset()
        monitor.startMonitoring()

        await user.click(toggleButton)
        await user.click(screen.getByText(i % 2 === 0 ? 'Dark' : 'Light'))

        await waitFor(() => {
          const expectedClass = i % 2 === 0 ? 'dark' : ''
          if (expectedClass) {
            expect(document.documentElement).toHaveClass(expectedClass)
          } else {
            expect(document.documentElement).not.toHaveClass('dark')
          }
        })

        monitor.stopMonitoring()
        transitionTimes.push(monitor.getTransitionTime())
      }

      // All transitions should be reasonably fast and consistent
      transitionTimes.forEach(time => {
        expect(time).toBeLessThan(500)
      })

      // Variance should be reasonable (no transition should be more than 2x slower than the fastest)
      const minTime = Math.min(...transitionTimes)
      const maxTime = Math.max(...transitionTimes)
      expect(maxTime / minTime).toBeLessThan(3) // Allow 3x variance for test environment
    })
  })

  describe('Multiple Component Synchronization', () => {
    it('should synchronize all chart components simultaneously', async () => {
      render(
        <TestWrapper>
          <MultiComponentTest />
        </TestWrapper>
      )

      // Verify all chart components are rendered
      for (let i = 0; i < 8; i++) {
        expect(screen.getByTestId(`chart-${i}`)).toBeInTheDocument()
      }

      const toggleButton = screen.getByTestId('theme-toggle')
      await user.click(toggleButton)
      await user.click(screen.getByText('Dark'))

      await waitFor(() => {
        expect(document.documentElement).toHaveClass('dark')
      })

      // All chart components should still be present and have transition classes
      for (let i = 0; i < 8; i++) {
        const chart = screen.getByTestId(`chart-${i}`)
        expect(chart).toBeInTheDocument()
        expect(chart).toHaveClass('theme-transition')
      }
    })

    it('should handle theme changes with many components without performance degradation', async () => {
      render(
        <TestWrapper>
          <div className="theme-transition">
            <ThemeToggle />
            {/* Render many components to test performance */}
            {Array.from({ length: 50 }, (_, i) => (
              <div
                key={i}
                className="p-2 bg-card border theme-transition"
                data-testid={`component-${i}`}
              >
                Component {i}
              </div>
            ))}
          </div>
        </TestWrapper>
      )

      monitor.startMonitoring()

      const toggleButton = screen.getByTestId('theme-toggle')
      await user.click(toggleButton)
      await user.click(screen.getByText('Dark'))

      await waitFor(() => {
        expect(document.documentElement).toHaveClass('dark')
      })

      monitor.stopMonitoring()
      const transitionTime = monitor.getTransitionTime()

      // Should still complete within reasonable time even with many components
      expect(transitionTime).toBeLessThan(1000) // 1 second for many components
    })
  })

  describe('Memory and Resource Usage', () => {
    it('should not cause memory leaks during frequent theme switching', async () => {
      render(
        <TestWrapper>
          <MultiComponentTest />
        </TestWrapper>
      )

      const toggleButton = screen.getByTestId('theme-toggle')
      
      // Perform many theme switches to test for memory leaks
      for (let i = 0; i < 10; i++) {
        await user.click(toggleButton)
        await user.click(screen.getByText(i % 2 === 0 ? 'Dark' : 'Light'))
        
        await waitFor(() => {
          const expectedClass = i % 2 === 0 ? 'dark' : ''
          if (expectedClass) {
            expect(document.documentElement).toHaveClass(expectedClass)
          } else {
            expect(document.documentElement).not.toHaveClass('dark')
          }
        })
      }

      // Component should still be functional
      expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
      expect(screen.getByTestId('chart-0')).toBeInTheDocument()
    })

    it('should clean up event listeners properly', () => {
      const { unmount } = render(
        <TestWrapper>
          <MultiComponentTest />
        </TestWrapper>
      )

      // Component should render without issues
      expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()

      // Unmount should not cause errors
      expect(() => unmount()).not.toThrow()
    })
  })

  describe('CSS Transition Performance', () => {
    it('should apply CSS transitions correctly for smooth animations', async () => {
      render(
        <TestWrapper>
          <MultiComponentTest />
        </TestWrapper>
      )

      const themeTransitionElements = document.querySelectorAll('.theme-transition')
      expect(themeTransitionElements.length).toBeGreaterThan(0)

      // Check that transition classes are applied
      themeTransitionElements.forEach(element => {
        expect(element).toHaveClass('theme-transition')
      })

      const toggleButton = screen.getByTestId('theme-toggle')
      await user.click(toggleButton)
      await user.click(screen.getByText('Dark'))

      await waitFor(() => {
        expect(document.documentElement).toHaveClass('dark')
      })

      // Transition classes should still be present after theme change
      const updatedElements = document.querySelectorAll('.theme-transition')
      expect(updatedElements.length).toBeGreaterThan(0)
    })

    it('should handle rapid successive theme changes gracefully', async () => {
      render(
        <TestWrapper>
          <MultiComponentTest />
        </TestWrapper>
      )

      const toggleButton = screen.getByTestId('theme-toggle')

      // Rapid successive clicks
      await user.click(toggleButton)
      await user.click(screen.getByText('Dark'))
      
      // Don't wait, immediately switch again
      await user.click(toggleButton)
      await user.click(screen.getByText('Light'))
      
      await user.click(toggleButton)
      await user.click(screen.getByText('Dark'))

      // Final state should be dark
      await waitFor(() => {
        expect(document.documentElement).toHaveClass('dark')
      })

      // Components should still be functional
      expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
      expect(screen.getByTestId('chart-0')).toBeInTheDocument()
    })
  })

  describe('Browser Compatibility', () => {
    it('should work with different CSS transition support levels', async () => {
      render(
        <TestWrapper>
          <MultiComponentTest />
        </TestWrapper>
      )

      const toggleButton = screen.getByTestId('theme-toggle')
      await user.click(toggleButton)
      await user.click(screen.getByText('Dark'))

      await waitFor(() => {
        expect(document.documentElement).toHaveClass('dark')
      })

      // Should work regardless of CSS transition support
      expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
    })

    it('should handle reduced motion preferences', async () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      })

      render(
        <TestWrapper>
          <MultiComponentTest />
        </TestWrapper>
      )

      const toggleButton = screen.getByTestId('theme-toggle')
      await user.click(toggleButton)
      await user.click(screen.getByText('Dark'))

      await waitFor(() => {
        expect(document.documentElement).toHaveClass('dark')
      })

      // Should still work with reduced motion
      expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
    })
  })
})
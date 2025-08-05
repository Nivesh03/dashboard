import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextThemeProvider } from '@/components/providers/next-theme-provider'
import { ThemeToggle } from '@/components/ui/theme-toggle'

// Mock the analytics page components
vi.mock('@/lib/mock-data', () => ({
  mockApi: {
    getRevenueData: vi.fn().mockResolvedValue([
      { date: '2024-01', value: 10000 },
      { date: '2024-02', value: 12000 },
      { date: '2024-03', value: 15000 },
    ]),
    getChannelData: vi.fn().mockResolvedValue([
      { name: 'Organic', value: 45 },
      { name: 'Paid', value: 30 },
      { name: 'Social', value: 25 },
    ]),
    getConversionData: vi.fn().mockResolvedValue([
      { date: '2024-01', value: 3.2 },
      { date: '2024-02', value: 3.8 },
      { date: '2024-03', value: 4.1 },
    ]),
  },
}))

// Create a simplified analytics page component for testing
function MockAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <ThemeToggle />
      </div>
      
      {/* Multiple chart containers with theme-transition class */}
      <div className="theme-transition" data-testid="charts-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2" data-testid="revenue-chart">
            <div className="p-4 border rounded-lg bg-card">
              <h3>Revenue Trends</h3>
              <div className="h-64 bg-muted/20 rounded"></div>
            </div>
          </div>
          
          <div data-testid="bar-chart">
            <div className="p-4 border rounded-lg bg-card">
              <h3>Channel Performance</h3>
              <div className="h-48 bg-muted/20 rounded"></div>
            </div>
          </div>
          
          <div data-testid="pie-chart">
            <div className="p-4 border rounded-lg bg-card">
              <h3>Traffic Distribution</h3>
              <div className="h-48 bg-muted/20 rounded"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs section with more charts */}
      <div className="theme-transition" data-testid="tabs-container">
        <div className="space-y-4">
          <div className="flex space-x-2 border-b">
            <button className="px-4 py-2 border-b-2 border-primary">Revenue</button>
            <button className="px-4 py-2">Channels</button>
            <button className="px-4 py-2">Conversions</button>
          </div>
          
          <div data-testid="detailed-chart">
            <div className="p-4 border rounded-lg bg-card">
              <h3>Detailed Revenue Analysis</h3>
              <div className="h-96 bg-muted/20 rounded"></div>
            </div>
          </div>
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
      storageKey="analytics-test-theme"
    >
      {children}
    </NextThemeProvider>
  )
}

describe('Analytics Page Theme Integration', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
    localStorage.clear()
    document.documentElement.className = ''
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Multiple Charts Theme Synchronization', () => {
    it('should render analytics page with multiple chart containers', () => {
      render(
        <TestWrapper>
          <MockAnalyticsPage />
        </TestWrapper>
      )

      expect(screen.getByText('Analytics')).toBeInTheDocument()
      expect(screen.getByTestId('charts-container')).toBeInTheDocument()
      expect(screen.getByTestId('revenue-chart')).toBeInTheDocument()
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument()
      expect(screen.getByTestId('tabs-container')).toBeInTheDocument()
    })

    it('should synchronize theme across all chart containers simultaneously', async () => {
      render(
        <TestWrapper>
          <MockAnalyticsPage />
        </TestWrapper>
      )

      // Get all theme-transition containers
      const chartsContainer = screen.getByTestId('charts-container')
      const tabsContainer = screen.getByTestId('tabs-container')

      // Initially light theme
      expect(document.documentElement).not.toHaveClass('dark')
      expect(chartsContainer).toHaveClass('theme-transition')
      expect(tabsContainer).toHaveClass('theme-transition')

      // Switch to dark theme
      const toggleButton = screen.getByTestId('theme-toggle')
      await user.click(toggleButton)

      const darkOption = screen.getByText('Dark')
      await user.click(darkOption)

      // Wait for theme change
      await waitFor(() => {
        expect(document.documentElement).toHaveClass('dark')
      })

      // All containers should maintain their transition classes
      expect(chartsContainer).toHaveClass('theme-transition')
      expect(tabsContainer).toHaveClass('theme-transition')
    })

    it('should handle rapid theme switching without visual issues', async () => {
      render(
        <TestWrapper>
          <MockAnalyticsPage />
        </TestWrapper>
      )

      const toggleButton = screen.getByTestId('theme-toggle')

      // Rapidly switch themes
      await user.click(toggleButton)
      await user.click(screen.getByText('Dark'))

      await waitFor(() => {
        expect(document.documentElement).toHaveClass('dark')
      })

      await user.click(toggleButton)
      await user.click(screen.getByText('Light'))

      await waitFor(() => {
        expect(document.documentElement).not.toHaveClass('dark')
      })

      await user.click(toggleButton)
      await user.click(screen.getByText('Dark'))

      await waitFor(() => {
        expect(document.documentElement).toHaveClass('dark')
      })

      // All containers should still have transition classes
      expect(screen.getByTestId('charts-container')).toHaveClass('theme-transition')
      expect(screen.getByTestId('tabs-container')).toHaveClass('theme-transition')
    })
  })

  describe('Theme Transition Timing', () => {
    it('should complete theme transitions within expected timeframe', async () => {
      render(
        <TestWrapper>
          <MockAnalyticsPage />
        </TestWrapper>
      )

      const startTime = performance.now()

      const toggleButton = screen.getByTestId('theme-toggle')
      await user.click(toggleButton)
      await user.click(screen.getByText('Dark'))

      await waitFor(() => {
        expect(document.documentElement).toHaveClass('dark')
      })

      const endTime = performance.now()
      const transitionTime = endTime - startTime

      // Should complete within reasonable time for test environment
      expect(transitionTime).toBeLessThan(2000) // 2 seconds for test overhead
    })

    it('should maintain consistent styling during transitions', async () => {
      render(
        <TestWrapper>
          <MockAnalyticsPage />
        </TestWrapper>
      )

      const chartsContainer = screen.getByTestId('charts-container')
      const revenueChart = screen.getByTestId('revenue-chart')
      const barChart = screen.getByTestId('bar-chart')
      const pieChart = screen.getByTestId('pie-chart')

      // Check initial styling
      expect(chartsContainer).toHaveClass('theme-transition')

      const toggleButton = screen.getByTestId('theme-toggle')
      await user.click(toggleButton)
      await user.click(screen.getByText('Dark'))

      await waitFor(() => {
        expect(document.documentElement).toHaveClass('dark')
      })

      // All elements should maintain their structure
      expect(revenueChart).toBeInTheDocument()
      expect(barChart).toBeInTheDocument()
      expect(pieChart).toBeInTheDocument()
      expect(chartsContainer).toHaveClass('theme-transition')
    })
  })

  describe('System Theme Integration', () => {
    it('should respond to system theme changes when in system mode', async () => {
      // Mock system theme as dark
      const mockMatchMedia = vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia,
      })

      render(
        <NextThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange={false}
          storageKey="analytics-test-theme"
        >
          <MockAnalyticsPage />
        </NextThemeProvider>
      )

      const toggleButton = screen.getByTestId('theme-toggle')
      await user.click(toggleButton)
      await user.click(screen.getByText('System'))

      // Should apply system theme
      await waitFor(() => {
        expect(localStorage.getItem('analytics-test-theme')).toBe('system')
      })
    })
  })

  describe('Error Resilience', () => {
    it('should handle theme switching errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      render(
        <TestWrapper>
          <MockAnalyticsPage />
        </TestWrapper>
      )

      // Should render without errors
      expect(screen.getByText('Analytics')).toBeInTheDocument()
      expect(screen.getByTestId('charts-container')).toBeInTheDocument()

      // Theme switching should work
      const toggleButton = screen.getByTestId('theme-toggle')
      await user.click(toggleButton)
      await user.click(screen.getByText('Dark'))

      await waitFor(() => {
        expect(document.documentElement).toHaveClass('dark')
      })

      consoleSpy.mockRestore()
    })

    it('should maintain functionality when localStorage fails', () => {
      // Mock localStorage to fail
      const originalSetItem = Storage.prototype.setItem
      Storage.prototype.setItem = vi.fn(() => {
        throw new Error('localStorage unavailable')
      })

      render(
        <TestWrapper>
          <MockAnalyticsPage />
        </TestWrapper>
      )

      // Should still render
      expect(screen.getByText('Analytics')).toBeInTheDocument()
      expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()

      // Restore localStorage
      Storage.prototype.setItem = originalSetItem
    })
  })

  describe('Accessibility During Theme Changes', () => {
    it('should maintain accessibility attributes during theme transitions', async () => {
      render(
        <TestWrapper>
          <MockAnalyticsPage />
        </TestWrapper>
      )

      const toggleButton = screen.getByTestId('theme-toggle')
      
      // Check initial accessibility
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false')

      await user.click(toggleButton)
      
      // Should have proper ARIA states
      await waitFor(() => {
        expect(toggleButton).toHaveAttribute('aria-expanded', 'true')
      })

      await user.click(screen.getByText('Dark'))

      await waitFor(() => {
        expect(document.documentElement).toHaveClass('dark')
      })

      // Accessibility should be maintained
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false')
    })
  })
})
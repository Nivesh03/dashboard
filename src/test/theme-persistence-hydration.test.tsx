import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider } from 'next-themes'
import { useTheme } from 'next-themes'
import React from 'react'

// Ensure DOM environment
import { JSDOM } from 'jsdom'

if (typeof window === 'undefined') {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>')
  global.window = dom.window as any
  global.document = dom.window.document
}

// Test component to verify theme state
const ThemeTestComponent = () => {
  const { theme, resolvedTheme, systemTheme } = useTheme()
  
  return (
    <div data-testid="theme-info">
      <span data-testid="current-theme">{theme}</span>
      <span data-testid="resolved-theme">{resolvedTheme}</span>
      <span data-testid="system-theme">{systemTheme}</span>
    </div>
  )
}

// Mock component that simulates SSR/hydration
const SSRTestComponent = ({ initialTheme }: { initialTheme?: string }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
      storageKey="dashboard-theme"
      forcedTheme={initialTheme}
    >
      <ThemeTestComponent />
    </ThemeProvider>
  )
}

describe('Theme Persistence and Hydration', () => {
  let mockLocalStorage: { [key: string]: string }
  let mockMatchMedia: any

  beforeEach(() => {
    // Mock localStorage
    mockLocalStorage = {}
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn((key: string) => mockLocalStorage[key] || null),
        setItem: vi.fn((key: string, value: string) => {
          mockLocalStorage[key] = value
        }),
        removeItem: vi.fn((key: string) => {
          delete mockLocalStorage[key]
        }),
        clear: vi.fn(() => {
          mockLocalStorage = {}
        }),
      },
      writable: true,
    })

    // Mock matchMedia for system theme detection
    mockMatchMedia = vi.fn().mockImplementation(query => ({
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
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Theme Persistence Across Browser Sessions', () => {
    it('should persist light theme selection in localStorage', async () => {
      // Simulate setting light theme
      mockLocalStorage['dashboard-theme'] = 'light'
      
      render(<SSRTestComponent />)
      
      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light')
      })
      
      // Verify localStorage was accessed
      expect(window.localStorage.getItem).toHaveBeenCalledWith('dashboard-theme')
    })

    it('should persist dark theme selection in localStorage', async () => {
      // Simulate setting dark theme
      mockLocalStorage['dashboard-theme'] = 'dark'
      
      render(<SSRTestComponent />)
      
      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark')
      })
      
      expect(window.localStorage.getItem).toHaveBeenCalledWith('dashboard-theme')
    })

    it('should persist system theme selection and detect system preference', async () => {
      // Simulate system theme preference
      mockLocalStorage['dashboard-theme'] = 'system'
      mockMatchMedia.mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
      
      render(<SSRTestComponent />)
      
      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('system')
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark')
        expect(screen.getByTestId('system-theme')).toHaveTextContent('dark')
      })
    })

    it('should handle missing localStorage gracefully', async () => {
      // Simulate localStorage access error
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: vi.fn(() => { throw new Error('localStorage not available') }),
          setItem: vi.fn(),
          removeItem: vi.fn(),
          clear: vi.fn(),
        },
        writable: true,
      })
      
      render(<SSRTestComponent />)
      
      // Should fallback to default theme without crashing
      await waitFor(() => {
        const themeElement = screen.getByTestId('current-theme')
        expect(themeElement).toBeInTheDocument()
      })
    })
  })

  describe('Hydration Mismatch Prevention', () => {
    it('should not cause hydration mismatch with server-rendered content', async () => {
      // Simulate server-side rendering with no theme
      const { rerender } = render(<SSRTestComponent />)
      
      // Simulate client-side hydration with stored theme
      mockLocalStorage['dashboard-theme'] = 'dark'
      rerender(<SSRTestComponent />)
      
      await waitFor(() => {
        // Should resolve to stored theme without hydration errors
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark')
      })
    })

    it('should handle system theme changes during hydration', async () => {
      mockLocalStorage['dashboard-theme'] = 'system'
      
      // Start with light system theme
      mockMatchMedia.mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: light)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
      
      const { rerender } = render(<SSRTestComponent />)
      
      // Change to dark system theme
      mockMatchMedia.mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
      
      rerender(<SSRTestComponent />)
      
      await waitFor(() => {
        expect(screen.getByTestId('system-theme')).toHaveTextContent('dark')
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark')
      })
    })
  })

  describe('Page Refresh Behavior', () => {
    it('should maintain theme state after simulated page refresh', async () => {
      // Set initial theme
      mockLocalStorage['dashboard-theme'] = 'light'
      
      const { unmount } = render(<SSRTestComponent />)
      
      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
      })
      
      // Simulate page refresh by unmounting and remounting
      unmount()
      render(<SSRTestComponent />)
      
      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light')
      })
    })

    it('should handle theme changes between page refreshes', async () => {
      // Start with dark theme
      mockLocalStorage['dashboard-theme'] = 'dark'
      
      const { unmount } = render(<SSRTestComponent />)
      
      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
      })
      
      // Change theme in localStorage (simulating change in another tab)
      mockLocalStorage['dashboard-theme'] = 'light'
      
      // Simulate page refresh
      unmount()
      render(<SSRTestComponent />)
      
      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light')
      })
    })
  })

  describe('SSR Handling', () => {
    it('should handle server-side rendering without theme flash', async () => {
      // Simulate SSR with forced theme
      render(<SSRTestComponent initialTheme="light" />)
      
      await waitFor(() => {
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light')
      })
      
      // Should not show undefined or flash different themes
      const themeElement = screen.getByTestId('resolved-theme')
      expect(themeElement.textContent).not.toBe('')
      expect(themeElement.textContent).not.toBe('undefined')
    })

    it('should properly resolve system theme on server', async () => {
      // Mock server environment (no window.matchMedia)
      const originalMatchMedia = window.matchMedia
      delete (window as any).matchMedia
      
      render(<SSRTestComponent />)
      
      await waitFor(() => {
        // Should handle missing matchMedia gracefully
        const themeElement = screen.getByTestId('current-theme')
        expect(themeElement).toBeInTheDocument()
      })
      
      // Restore matchMedia
      window.matchMedia = originalMatchMedia
    })

    it('should handle theme attribute application correctly', async () => {
      mockLocalStorage['dashboard-theme'] = 'dark'
      
      render(
        <div data-testid="root">
          <SSRTestComponent />
        </div>
      )
      
      await waitFor(() => {
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark')
      })
      
      // Verify that the theme system would apply the correct class
      // (next-themes handles this automatically)
      expect(document.documentElement.classList.contains('dark') || 
             document.documentElement.getAttribute('class')?.includes('dark')).toBeTruthy()
    })
  })

  describe('Error Recovery', () => {
    it('should recover from corrupted localStorage theme data', async () => {
      // Set invalid theme data
      mockLocalStorage['dashboard-theme'] = 'invalid-theme'
      
      render(<SSRTestComponent />)
      
      await waitFor(() => {
        // Should fallback to default theme
        const themeElement = screen.getByTestId('current-theme')
        expect(themeElement.textContent).toMatch(/^(system|light|dark)$/)
      })
    })

    it('should handle storage quota exceeded errors', async () => {
      // Mock localStorage setItem to throw quota exceeded error
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: vi.fn(() => 'light'),
          setItem: vi.fn(() => { throw new Error('QuotaExceededError') }),
          removeItem: vi.fn(),
          clear: vi.fn(),
        },
        writable: true,
      })
      
      render(<SSRTestComponent />)
      
      // Should not crash and should still function
      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toBeInTheDocument()
      })
    })
  })
})
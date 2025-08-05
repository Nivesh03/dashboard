import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { NextThemeProvider, useTheme } from '@/components/providers/next-theme-provider'
import React from 'react'

// Test component that uses the actual theme provider
const AppThemeTestComponent = () => {
  const { theme, resolvedTheme, systemTheme, setTheme } = useTheme()
  
  return (
    <div data-testid="app-theme-info">
      <span data-testid="app-current-theme">{theme}</span>
      <span data-testid="app-resolved-theme">{resolvedTheme}</span>
      <span data-testid="app-system-theme">{systemTheme}</span>
      <button 
        data-testid="set-light-theme" 
        onClick={() => setTheme('light')}
      >
        Set Light
      </button>
      <button 
        data-testid="set-dark-theme" 
        onClick={() => setTheme('dark')}
      >
        Set Dark
      </button>
      <button 
        data-testid="set-system-theme" 
        onClick={() => setTheme('system')}
      >
        Set System
      </button>
    </div>
  )
}

// Simulate the actual app layout structure
const AppLayoutSimulation = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <NextThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange={false}
          storageKey="dashboard-theme"
        >
          {children}
        </NextThemeProvider>
      </body>
    </html>
  )
}

describe('Theme App Integration Tests', () => {
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
    // Clean up document classes
    document.documentElement.className = ''
  })

  describe('App Layout Theme Integration', () => {
    it('should initialize with correct default theme configuration', async () => {
      render(
        <AppLayoutSimulation>
          <AppThemeTestComponent />
        </AppLayoutSimulation>
      )
      
      await waitFor(() => {
        expect(screen.getByTestId('app-current-theme')).toHaveTextContent('system')
      })
      
      // Verify localStorage key is correct
      expect(window.localStorage.getItem).toHaveBeenCalledWith('dashboard-theme')
    })

    it('should persist theme changes across app remounts', async () => {
      const { unmount } = render(
        <AppLayoutSimulation>
          <AppThemeTestComponent />
        </AppLayoutSimulation>
      )
      
      await waitFor(() => {
        expect(screen.getByTestId('app-current-theme')).toBeInTheDocument()
      })
      
      // Simulate theme change by setting localStorage
      mockLocalStorage['dashboard-theme'] = 'dark'
      
      unmount()
      
      render(
        <AppLayoutSimulation>
          <AppThemeTestComponent />
        </AppLayoutSimulation>
      )
      
      await waitFor(() => {
        expect(screen.getByTestId('app-current-theme')).toHaveTextContent('dark')
        expect(screen.getByTestId('app-resolved-theme')).toHaveTextContent('dark')
      })
    })

    it('should handle system theme detection correctly', async () => {
      // Set system theme preference to dark
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
      
      mockLocalStorage['dashboard-theme'] = 'system'
      
      render(
        <AppLayoutSimulation>
          <AppThemeTestComponent />
        </AppLayoutSimulation>
      )
      
      await waitFor(() => {
        expect(screen.getByTestId('app-current-theme')).toHaveTextContent('system')
        expect(screen.getByTestId('app-resolved-theme')).toHaveTextContent('dark')
        expect(screen.getByTestId('app-system-theme')).toHaveTextContent('dark')
      })
    })

    it('should apply theme classes to document element', async () => {
      mockLocalStorage['dashboard-theme'] = 'dark'
      
      render(
        <AppLayoutSimulation>
          <AppThemeTestComponent />
        </AppLayoutSimulation>
      )
      
      await waitFor(() => {
        expect(screen.getByTestId('app-resolved-theme')).toHaveTextContent('dark')
      })
      
      // Check that the dark class is applied to the document
      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true)
      })
    })

    it('should handle suppressHydrationWarning correctly', async () => {
      // This test ensures no hydration warnings are thrown
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      render(
        <AppLayoutSimulation>
          <AppThemeTestComponent />
        </AppLayoutSimulation>
      )
      
      await waitFor(() => {
        expect(screen.getByTestId('app-current-theme')).toBeInTheDocument()
      })
      
      // Should not have hydration-related console errors
      expect(consoleSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('hydration')
      )
      
      consoleSpy.mockRestore()
    })
  })

  describe('Theme Persistence Edge Cases', () => {
    it('should handle localStorage being disabled', async () => {
      // Mock localStorage to throw errors
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: vi.fn(() => { throw new Error('localStorage disabled') }),
          setItem: vi.fn(() => { throw new Error('localStorage disabled') }),
          removeItem: vi.fn(() => { throw new Error('localStorage disabled') }),
          clear: vi.fn(() => { throw new Error('localStorage disabled') }),
        },
        writable: true,
      })
      
      render(
        <AppLayoutSimulation>
          <AppThemeTestComponent />
        </AppLayoutSimulation>
      )
      
      // Should still render without crashing
      await waitFor(() => {
        expect(screen.getByTestId('app-current-theme')).toBeInTheDocument()
      })
    })

    it('should handle invalid theme values in localStorage', async () => {
      mockLocalStorage['dashboard-theme'] = 'invalid-theme-value'
      
      render(
        <AppLayoutSimulation>
          <AppThemeTestComponent />
        </AppLayoutSimulation>
      )
      
      await waitFor(() => {
        // Should fallback to a valid theme
        const themeElement = screen.getByTestId('app-current-theme')
        expect(['light', 'dark', 'system']).toContain(themeElement.textContent)
      })
    })

    it('should handle rapid theme changes without errors', async () => {
      render(
        <AppLayoutSimulation>
          <AppThemeTestComponent />
        </AppLayoutSimulation>
      )
      
      await waitFor(() => {
        expect(screen.getByTestId('app-current-theme')).toBeInTheDocument()
      })
      
      // Simulate rapid theme changes
      const setLightButton = screen.getByTestId('set-light-theme')
      const setDarkButton = screen.getByTestId('set-dark-theme')
      const setSystemButton = screen.getByTestId('set-system-theme')
      
      // Rapid clicks should not cause errors
      setLightButton.click()
      setDarkButton.click()
      setSystemButton.click()
      setLightButton.click()
      
      await waitFor(() => {
        expect(screen.getByTestId('app-current-theme')).toHaveTextContent('light')
      })
    })
  })

  describe('SSR and Hydration Compatibility', () => {
    it('should handle server-client theme mismatch gracefully', async () => {
      // Simulate server rendering with no theme
      const { rerender } = render(
        <AppLayoutSimulation>
          <AppThemeTestComponent />
        </AppLayoutSimulation>
      )
      
      // Simulate client hydration with stored theme
      mockLocalStorage['dashboard-theme'] = 'light'
      
      rerender(
        <AppLayoutSimulation>
          <AppThemeTestComponent />
        </AppLayoutSimulation>
      )
      
      await waitFor(() => {
        expect(screen.getByTestId('app-resolved-theme')).toHaveTextContent('light')
      })
      
      // Should not cause hydration mismatch
      expect(document.documentElement.classList.contains('light')).toBe(true)
    })

    it('should maintain theme consistency during navigation', async () => {
      mockLocalStorage['dashboard-theme'] = 'dark'
      
      const { rerender } = render(
        <AppLayoutSimulation>
          <AppThemeTestComponent />
        </AppLayoutSimulation>
      )
      
      await waitFor(() => {
        expect(screen.getByTestId('app-resolved-theme')).toHaveTextContent('dark')
      })
      
      // Simulate navigation by rerendering
      rerender(
        <AppLayoutSimulation>
          <AppThemeTestComponent />
        </AppLayoutSimulation>
      )
      
      await waitFor(() => {
        expect(screen.getByTestId('app-resolved-theme')).toHaveTextContent('dark')
      })
      
      // Theme should remain consistent
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })
  })
})
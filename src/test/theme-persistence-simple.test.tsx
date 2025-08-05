import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { NextThemeProvider, useTheme } from '@/components/providers/next-theme-provider'
import React from 'react'

// Simple test component
const ThemeTestComponent = () => {
  const { theme, resolvedTheme, setTheme } = useTheme()
  
  return (
    <div>
      <span data-testid="current-theme">{theme || 'undefined'}</span>
      <span data-testid="resolved-theme">{resolvedTheme || 'undefined'}</span>
      <button data-testid="set-light" onClick={() => setTheme('light')}>Light</button>
      <button data-testid="set-dark" onClick={() => setTheme('dark')}>Dark</button>
      <button data-testid="set-system" onClick={() => setTheme('system')}>System</button>
    </div>
  )
}

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <NextThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem={true}
    storageKey="dashboard-theme"
  >
    {children}
  </NextThemeProvider>
)

describe('Theme Persistence and Hydration - Simple Tests', () => {
  let mockStorage: { [key: string]: string }

  beforeEach(() => {
    mockStorage = {}
    
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn((key: string) => mockStorage[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        mockStorage[key] = value
      }),
      removeItem: vi.fn((key: string) => {
        delete mockStorage[key]
      }),
      clear: vi.fn(() => {
        mockStorage = {}
      }),
    }
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    })

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    document.documentElement.className = ''
  })

  it('should render theme provider without errors', async () => {
    render(
      <TestWrapper>
        <ThemeTestComponent />
      </TestWrapper>
    )
    
    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toBeInTheDocument()
    })
  })

  it('should persist theme selection in localStorage', async () => {
    render(
      <TestWrapper>
        <ThemeTestComponent />
      </TestWrapper>
    )
    
    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toBeInTheDocument()
    })
    
    // Click light theme button
    fireEvent.click(screen.getByTestId('set-light'))
    
    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
    })
    
    // Verify localStorage was called
    expect(window.localStorage.setItem).toHaveBeenCalledWith('dashboard-theme', 'light')
  })

  it('should restore theme from localStorage on mount', async () => {
    // Pre-populate localStorage
    mockStorage['dashboard-theme'] = 'dark'
    
    render(
      <TestWrapper>
        <ThemeTestComponent />
      </TestWrapper>
    )
    
    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
    })
    
    expect(window.localStorage.getItem).toHaveBeenCalledWith('dashboard-theme')
  })

  it('should handle system theme detection', async () => {
    mockStorage['dashboard-theme'] = 'system'
    
    render(
      <TestWrapper>
        <ThemeTestComponent />
      </TestWrapper>
    )
    
    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('system')
    })
    
    // Should detect system preference
    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)')
  })

  it('should handle localStorage errors gracefully', async () => {
    // Mock localStorage to throw errors
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => { throw new Error('localStorage error') }),
        setItem: vi.fn(() => { throw new Error('localStorage error') }),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    })
    
    // Should not crash
    render(
      <TestWrapper>
        <ThemeTestComponent />
      </TestWrapper>
    )
    
    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toBeInTheDocument()
    })
  })

  it('should apply theme classes to document', async () => {
    mockStorage['dashboard-theme'] = 'dark'
    
    render(
      <TestWrapper>
        <ThemeTestComponent />
      </TestWrapper>
    )
    
    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
    })
    
    // Check document class application
    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })
  })

  it('should handle theme switching without errors', async () => {
    render(
      <TestWrapper>
        <ThemeTestComponent />
      </TestWrapper>
    )
    
    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toBeInTheDocument()
    })
    
    // Test rapid theme switching
    fireEvent.click(screen.getByTestId('set-light'))
    fireEvent.click(screen.getByTestId('set-dark'))
    fireEvent.click(screen.getByTestId('set-system'))
    
    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('system')
    })
  })

  it('should maintain theme consistency across remounts', async () => {
    mockStorage['dashboard-theme'] = 'light'
    
    const { unmount } = render(
      <TestWrapper>
        <ThemeTestComponent />
      </TestWrapper>
    )
    
    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
    })
    
    unmount()
    
    render(
      <TestWrapper>
        <ThemeTestComponent />
      </TestWrapper>
    )
    
    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
    })
  })
})
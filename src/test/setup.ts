import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers)

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock window.matchMedia for drawer component
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock Firebase modules before they're imported
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({
    name: '[DEFAULT]',
    options: {},
    automaticDataCollectionEnabled: false,
  })),
}))

vi.mock('firebase/auth', () => {
  const mockAuth = {
    currentUser: null,
    app: { name: '[DEFAULT]' },
  }
  
  return {
    getAuth: vi.fn(() => mockAuth),
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
    sendPasswordResetEmail: vi.fn(),
    onAuthStateChanged: vi.fn((auth, callback) => {
      callback(null)
      return vi.fn()
    }),
  }
})


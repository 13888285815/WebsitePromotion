import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// 安全的随机字符串生成函数
const secureRandomString = (length: number): string => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const array = new Uint8Array(length)
  window.crypto.getRandomValues(array)
  for (let i = 0; i < length; i++) {
    result += charset[array[i] % charset.length]
  }
  return result
}

// 增强的密码哈希函数
const hashPassword = (password: string): string => {
  // 在实际应用中，应该使用 bcrypt 等安全的哈希算法
  const salt = 'default_salt_for_development'
  const combined = password + salt
  let hash = 0
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return 'hashed_' + btoa(combined + hash.toString(16))
}

// 生成CSRF令牌
const generateCsrfToken = (): string => {
  return secureRandomString(32)
}

// 速率限制函数
const rateLimit = (key: string, limit: number, windowMs: number): boolean => {
  const now = Date.now()
  const keyName = `rate_limit_${key}`
  const data = JSON.parse(localStorage.getItem(keyName) || '{}')
  
  if (!data.timestamp || now - data.timestamp > windowMs) {
    localStorage.setItem(keyName, JSON.stringify({ timestamp: now, count: 1 }))
    return true
  }
  
  if (data.count >= limit) {
    return false
  }
  
  data.count++
  localStorage.setItem(keyName, JSON.stringify(data))
  return true
}

// 验证邮箱格式
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 验证密码强度
const validatePassword = (password: string): boolean => {
  return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)
}

export interface User {
  id: string
  name: string
  email: string
  passwordHash: string
  subscription: {
    plan: 'free' | 'basic' | 'pro' | 'enterprise'
    status: 'active' | 'inactive' | 'cancelled' | 'expired'
    expiresAt: string | null
    features: string[]
  }
  twoFactorEnabled: boolean
  apiTokens: ApiToken[]
  usage: {
    apiCalls: number
    apiCallsLimit: number
    storageUsed: number
    storageLimit: number
  }
  emailVerified: boolean
}

export interface ApiToken {
  id: string
  name: string
  token: string
  prefix: string
  createdAt: string
  lastUsedAt: string | null
  expiresAt: string | null
  usage: number
  limit: number
  status: 'active' | 'revoked' | 'expired'
  permissions: string[]
}

interface TwoFactorSetup {
  secret: string
  qrCode: string
  backupCodes: string[]
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ requiresTwoFactor: boolean; tempToken?: string }>
  verifyTwoFactor: (code: string, tempToken: string) => Promise<void>
  setupTwoFactor: () => Promise<TwoFactorSetup>
  enableTwoFactor: (code: string, secret: string) => Promise<void>
  disableTwoFactor: (code: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  createApiToken: (name: string, permissions: string[], limit?: number, expiresIn?: number) => Promise<ApiToken>
  revokeApiToken: (tokenId: string) => Promise<void>
  updateSubscription: (plan: User['subscription']['plan']) => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, newPassword: string) => Promise<void>
  verifyEmail: (token: string) => Promise<void>
  resendVerificationEmail: () => Promise<void>
  loginWithGoogle: () => Promise<void>
  loginWithGitHub: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

const generateMockToken = (): string => {
  return 'sk_' + secureRandomString(32)
}

const generateBackupCodes = (): string[] => {
  return Array.from({ length: 10 }, () => 
    secureRandomString(6).toUpperCase()
  )
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [tempAuth, setTempAuth] = useState<{ email: string; tempToken: string } | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Failed to parse stored user:', error)
        localStorage.removeItem('user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ requiresTwoFactor: boolean; tempToken?: string }> => {
    return new Promise((resolve, reject) => {
      // 速率限制
      if (!rateLimit(`login_${email}`, 5, 15 * 60 * 1000)) {
        reject(new Error('登录尝试过于频繁，请稍后再试'))
        return
      }

      // 输入验证
      if (!validateEmail(email)) {
        reject(new Error('邮箱格式不正确'))
        return
      }

      if (!password) {
        reject(new Error('密码不能为空'))
        return
      }

      if (password.length < 8) {
        reject(new Error('密码长度至少为8个字符'))
        return
      }

      setTimeout(() => {
        try {
          const storedUsers = JSON.parse(localStorage.getItem('users') || '[]')
          const existingUser = storedUsers.find((u: any) => u.email === email)
          
          if (!existingUser) {
            reject(new Error('用户不存在'))
            return
          }

          // 验证密码
          const passwordHash = hashPassword(password)
          if (existingUser.passwordHash !== passwordHash) {
            reject(new Error('密码错误'))
            return
          }

          // 生成新的CSRF令牌
          const csrfToken = generateCsrfToken()
          localStorage.setItem('csrfToken', csrfToken)

          // 移除密码哈希后再存储
          const userWithoutPassword = {
            ...existingUser,
            passwordHash: undefined
          }

          if (existingUser.twoFactorEnabled) {
            const tempToken = 'temp_' + secureRandomString(32)
            setTempAuth({ email, tempToken })
            resolve({ requiresTwoFactor: true, tempToken })
          } else {
            setUser(userWithoutPassword)
            localStorage.setItem('user', JSON.stringify(userWithoutPassword))
            resolve({ requiresTwoFactor: false })
          }
        } catch (error) {
          console.error('Login error:', error)
          reject(new Error('登录失败，请重试'))
        }
      }, 1000)
    })
  }

  const verifyTwoFactor = async (code: string, tempToken: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // 输入验证
      if (!code || code.length !== 6 || !/^\d+$/.test(code)) {
        reject(new Error('验证码格式不正确'))
        return
      }

      if (!tempToken) {
        reject(new Error('验证令牌不能为空'))
        return
      }

      setTimeout(() => {
        try {
          if (!tempAuth || tempAuth.tempToken !== tempToken) {
            reject(new Error('验证会话已过期'))
            return
          }

          const storedUsers = JSON.parse(localStorage.getItem('users') || '[]')
          const existingUser = storedUsers.find((u: any) => u.email === tempAuth.email)
          
          if (existingUser) {
            // 移除密码哈希后再存储
            const userWithoutPassword = {
              ...existingUser,
              passwordHash: undefined
            }
            setUser(userWithoutPassword)
            localStorage.setItem('user', JSON.stringify(userWithoutPassword))
            setTempAuth(null)
            resolve()
          } else {
            reject(new Error('用户不存在'))
          }
        } catch (error) {
          console.error('Two-factor verification error:', error)
          reject(new Error('验证失败，请重试'))
        }
      }, 1000)
    })
  }

  const setupTwoFactor = async (): Promise<TwoFactorSetup> => {
    return new Promise((resolve, reject) => {
      if (!user) {
        reject(new Error('用户未登录'))
        return
      }

      setTimeout(() => {
        try {
          const secret = secureRandomString(16).toUpperCase()
          const backupCodes = generateBackupCodes()
          resolve({
            secret,
            qrCode: `otpauth://totp/AutoPromotion:${user.email}?secret=${secret}&issuer=AutoPromotion`,
            backupCodes
          })
        } catch (error) {
          console.error('Setup two-factor error:', error)
          reject(new Error('设置失败，请重试'))
        }
      }, 500)
    })
  }

  const enableTwoFactor = async (code: string, _secret: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // 输入验证
      if (!code || code.length !== 6 || !/^\d+$/.test(code)) {
        reject(new Error('验证码格式不正确'))
        return
      }

      if (!user) {
        reject(new Error('用户未登录'))
        return
      }

      setTimeout(() => {
        try {
          const storedUsers = JSON.parse(localStorage.getItem('users') || '[]')
          const existingUser = storedUsers.find((u: any) => u.email === user.email)

          if (existingUser) {
            const updatedUser = { ...existingUser, twoFactorEnabled: true }
            const userWithoutPassword = {
              ...updatedUser,
              passwordHash: undefined
            }
            setUser(userWithoutPassword)
            localStorage.setItem('user', JSON.stringify(userWithoutPassword))
            
            const updatedUsers = storedUsers.map((u: any) => 
              u.email === user.email ? updatedUser : u
            )
            localStorage.setItem('users', JSON.stringify(updatedUsers))
            resolve()
          } else {
            reject(new Error('用户不存在'))
          }
        } catch (error) {
          console.error('Enable two-factor error:', error)
          reject(new Error('设置失败，请重试'))
        }
      }, 1000)
    })
  }

  const disableTwoFactor = async (code: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // 输入验证
      if (!code || code.length !== 6 || !/^\d+$/.test(code)) {
        reject(new Error('验证码格式不正确'))
        return
      }

      if (!user) {
        reject(new Error('用户未登录'))
        return
      }

      setTimeout(() => {
        try {
          const storedUsers = JSON.parse(localStorage.getItem('users') || '[]')
          const existingUser = storedUsers.find((u: any) => u.email === user.email)

          if (existingUser) {
            const updatedUser = { ...existingUser, twoFactorEnabled: false }
            const userWithoutPassword = {
              ...updatedUser,
              passwordHash: undefined
            }
            setUser(userWithoutPassword)
            localStorage.setItem('user', JSON.stringify(userWithoutPassword))
            
            const updatedUsers = storedUsers.map((u: any) => 
              u.email === user.email ? updatedUser : u
            )
            localStorage.setItem('users', JSON.stringify(updatedUsers))
            resolve()
          } else {
            reject(new Error('用户不存在'))
          }
        } catch (error) {
          console.error('Disable two-factor error:', error)
          reject(new Error('设置失败，请重试'))
        }
      }, 1000)
    })
  }

  const register = async (name: string, email: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // 速率限制
      if (!rateLimit(`register_${email}`, 3, 15 * 60 * 1000)) {
        reject(new Error('注册尝试过于频繁，请稍后再试'))
        return
      }

      // 输入验证
      if (!name || name.trim().length < 2) {
        reject(new Error('姓名至少需要2个字符'))
        return
      }

      if (!validateEmail(email)) {
        reject(new Error('邮箱格式不正确'))
        return
      }

      if (!validatePassword(password)) {
        reject(new Error('密码至少需要8个字符，包含大小写字母和数字'))
        return
      }

      setTimeout(() => {
        try {
          const storedUsers = JSON.parse(localStorage.getItem('users') || '[]')
          
          if (storedUsers.find((u: any) => u.email === email)) {
            reject(new Error('邮箱已被注册'))
            return
          }

          const newUser: User = {
            id: 'user_' + Date.now(),
            name: name.trim(),
            email: email.toLowerCase(),
            passwordHash: hashPassword(password),
            subscription: {
              plan: 'free',
              status: 'active',
              expiresAt: null,
              features: ['basic_promotion', 'limited_api_calls']
            },
            twoFactorEnabled: false,
            apiTokens: [],
            usage: {
              apiCalls: 0,
              apiCallsLimit: 100,
              storageUsed: 0,
              storageLimit: 100 * 1024 * 1024
            },
            emailVerified: false
          }

          storedUsers.push(newUser)
          localStorage.setItem('users', JSON.stringify(storedUsers))
          resolve()
        } catch (error) {
          console.error('Register error:', error)
          reject(new Error('注册失败，请重试'))
        }
      }, 1000)
    })
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    setTempAuth(null)
  }

  const createApiToken = async (
    name: string, 
    permissions: string[], 
    limit?: number, 
    expiresIn?: number
  ): Promise<ApiToken> => {
    return new Promise((resolve, reject) => {
      // 输入验证
      if (!name || name.trim().length < 1) {
        reject(new Error('令牌名称不能为空'))
        return
      }

      if (!Array.isArray(permissions) || permissions.length === 0) {
        reject(new Error('至少需要一个权限'))
        return
      }

      if (!user) {
        reject(new Error('用户未登录'))
        return
      }

      setTimeout(() => {
        try {
          const fullToken = generateMockToken()
          const prefix = fullToken.substring(0, 7)
          
          const newToken: ApiToken = {
            id: 'token_' + Date.now(),
            name: name.trim(),
            token: fullToken,
            prefix,
            createdAt: new Date().toISOString(),
            lastUsedAt: null,
            expiresAt: expiresIn ? new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000).toISOString() : null,
            usage: 0,
            limit: limit || 1000,
            status: 'active',
            permissions
          }

          const storedUsers = JSON.parse(localStorage.getItem('users') || '[]')
          const existingUser = storedUsers.find((u: any) => u.email === user.email)

          if (existingUser) {
            const updatedUser = {
              ...existingUser,
              apiTokens: [...existingUser.apiTokens, newToken]
            }
            const userWithoutPassword = {
              ...updatedUser,
              passwordHash: undefined
            }
            setUser(userWithoutPassword)
            localStorage.setItem('user', JSON.stringify(userWithoutPassword))

            const updatedUsers = storedUsers.map((u: any) => 
              u.email === user.email ? updatedUser : u
            )
            localStorage.setItem('users', JSON.stringify(updatedUsers))

            resolve(newToken)
          } else {
            reject(new Error('用户不存在'))
          }
        } catch (error) {
          console.error('Create API token error:', error)
          reject(new Error('创建令牌失败，请重试'))
        }
      }, 500)
    })
  }

  const revokeApiToken = async (tokenId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // 输入验证
      if (!tokenId) {
        reject(new Error('令牌ID不能为空'))
        return
      }

      if (!user) {
        reject(new Error('用户未登录'))
        return
      }

      setTimeout(() => {
        try {
          const storedUsers = JSON.parse(localStorage.getItem('users') || '[]')
          const existingUser = storedUsers.find((u: any) => u.email === user.email)

          if (existingUser) {
            const updatedTokens = existingUser.apiTokens.map((token: ApiToken) =>
              token.id === tokenId ? { ...token, status: 'revoked' as const } : token
            )

            const updatedUser = {
              ...existingUser,
              apiTokens: updatedTokens
            }
            const userWithoutPassword = {
              ...updatedUser,
              passwordHash: undefined
            }
            setUser(userWithoutPassword)
            localStorage.setItem('user', JSON.stringify(userWithoutPassword))

            const updatedUsers = storedUsers.map((u: any) => 
              u.email === user.email ? updatedUser : u
            )
            localStorage.setItem('users', JSON.stringify(updatedUsers))

            resolve()
          } else {
            reject(new Error('用户不存在'))
          }
        } catch (error) {
          console.error('Revoke API token error:', error)
          reject(new Error('撤销令牌失败，请重试'))
        }
      }, 500)
    })
  }

  const updateSubscription = async (plan: User['subscription']['plan']): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!user) {
        reject(new Error('用户未登录'))
        return
      }

      // 验证计划类型
      const validPlans: User['subscription']['plan'][] = ['free', 'basic', 'pro', 'enterprise']
      if (!validPlans.includes(plan)) {
        reject(new Error('无效的订阅计划'))
        return
      }

      setTimeout(() => {
        try {
          const storedUsers = JSON.parse(localStorage.getItem('users') || '[]')
          const existingUser = storedUsers.find((u: any) => u.email === user.email)

          if (existingUser) {
            const planFeatures: Record<string, string[]> = {
              free: ['basic_promotion', 'limited_api_calls'],
              basic: ['basic_promotion', 'scheduled_promotion', 'api_access', 'email_support'],
              pro: ['advanced_promotion', 'scheduled_promotion', 'priority_processing', 'analytics', 'api_access', 'priority_support'],
              enterprise: ['all_features', 'custom_solutions', 'dedicated_support', 'sla_guarantee', 'unlimited_api']
            }

            const planLimits: Record<string, { apiCalls: number; storage: number }> = {
              free: { apiCalls: 100, storage: 100 * 1024 * 1024 },
              basic: { apiCalls: 1000, storage: 500 * 1024 * 1024 },
              pro: { apiCalls: 10000, storage: 2 * 1024 * 1024 * 1024 },
              enterprise: { apiCalls: 100000, storage: 10 * 1024 * 1024 * 1024 }
            }

            const limits = planLimits[plan]
            const updatedUser = {
              ...existingUser,
              subscription: {
                plan,
                status: 'active' as const,
                expiresAt: plan === 'free' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                features: planFeatures[plan]
              },
              usage: {
                ...existingUser.usage,
                apiCallsLimit: limits.apiCalls,
                storageLimit: limits.storage
              }
            }
            const userWithoutPassword = {
              ...updatedUser,
              passwordHash: undefined
            }
            setUser(userWithoutPassword)
            localStorage.setItem('user', JSON.stringify(userWithoutPassword))

            const updatedUsers = storedUsers.map((u: any) => 
              u.email === user.email ? updatedUser : u
            )
            localStorage.setItem('users', JSON.stringify(updatedUsers))

            resolve()
          } else {
            reject(new Error('用户不存在'))
          }
        } catch (error) {
          console.error('Update subscription error:', error)
          reject(new Error('更新订阅失败，请重试'))
        }
      }, 1000)
    })
  }

  const forgotPassword = async (email: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // 输入验证
      if (!validateEmail(email)) {
        reject(new Error('邮箱格式不正确'))
        return
      }

      setTimeout(() => {
        try {
          const storedUsers = JSON.parse(localStorage.getItem('users') || '[]')
          const existingUser = storedUsers.find((u: any) => u.email === email)
          
          if (!existingUser) {
            reject(new Error('用户不存在'))
            return
          }

          // 模拟发送重置邮件
          console.log(`密码重置邮件已发送到: ${email}`)
          resolve()
        } catch (error) {
          console.error('Forgot password error:', error)
          reject(new Error('发送密码重置邮件失败，请重试'))
        }
      }, 1000)
    })
  }

  const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // 输入验证
      if (!token) {
        reject(new Error('重置令牌不能为空'))
        return
      }

      if (!validatePassword(newPassword)) {
        reject(new Error('密码至少需要8个字符，包含大小写字母和数字'))
        return
      }

      setTimeout(() => {
        try {
          // 模拟令牌验证
          if (token !== 'valid_token') {
            reject(new Error('无效的重置令牌'))
            return
          }

          const storedUsers = JSON.parse(localStorage.getItem('users') || '[]')
          const existingUser = storedUsers.find((u: any) => u.email === 'user@example.com')
          
          if (existingUser) {
            const updatedUser = {
              ...existingUser,
              passwordHash: hashPassword(newPassword)
            }
            
            const updatedUsers = storedUsers.map((u: any) => 
              u.email === 'user@example.com' ? updatedUser : u
            )
            localStorage.setItem('users', JSON.stringify(updatedUsers))
            resolve()
          } else {
            reject(new Error('用户不存在'))
          }
        } catch (error) {
          console.error('Reset password error:', error)
          reject(new Error('重置密码失败，请重试'))
        }
      }, 1000)
    })
  }

  const verifyEmail = async (token: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // 输入验证
      if (!token) {
        reject(new Error('验证令牌不能为空'))
        return
      }

      setTimeout(() => {
        try {
          // 模拟令牌验证
          if (token !== 'valid_email_token') {
            reject(new Error('无效的验证令牌'))
            return
          }

          const storedUsers = JSON.parse(localStorage.getItem('users') || '[]')
          const existingUser = storedUsers.find((u: any) => u.email === user?.email)
          
          if (existingUser) {
            const updatedUser = {
              ...existingUser,
              emailVerified: true
            }
            const userWithoutPassword = {
              ...updatedUser,
              passwordHash: undefined
            }
            setUser(userWithoutPassword)
            localStorage.setItem('user', JSON.stringify(userWithoutPassword))
            
            const updatedUsers = storedUsers.map((u: any) => 
              u.email === user?.email ? updatedUser : u
            )
            localStorage.setItem('users', JSON.stringify(updatedUsers))
            resolve()
          } else {
            reject(new Error('用户不存在'))
          }
        } catch (error) {
          console.error('Verify email error:', error)
          reject(new Error('验证邮箱失败，请重试'))
        }
      }, 1000)
    })
  }

  const resendVerificationEmail = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!user) {
        reject(new Error('用户未登录'))
        return
      }

      setTimeout(() => {
        try {
          // 模拟发送验证邮件
          console.log(`验证邮件已发送到: ${user.email}`)
          resolve()
        } catch (error) {
          console.error('Resend verification email error:', error)
          reject(new Error('发送验证邮件失败，请重试'))
        }
      }, 1000)
    })
  }

  const loginWithGoogle = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // 模拟Google登录流程
          console.log('Redirecting to Google login...')
          // 模拟用户授权
          const googleUser = {
            id: 'google_' + Date.now(),
            name: 'Google User',
            email: 'user' + Date.now() + '@gmail.com',
            emailVerified: true
          }

          // 检查用户是否已存在
          const storedUsers = JSON.parse(localStorage.getItem('users') || '[]')
          let existingUser = storedUsers.find((u: any) => u.email === googleUser.email)

          if (!existingUser) {
            // 创建新用户
            existingUser = {
              id: googleUser.id,
              name: googleUser.name,
              email: googleUser.email,
              passwordHash: hashPassword('google_auth_' + Date.now()),
              subscription: {
                plan: 'free',
                status: 'active',
                expiresAt: null,
                features: ['basic_promotion', 'limited_api_calls']
              },
              twoFactorEnabled: false,
              apiTokens: [],
              usage: {
                apiCalls: 0,
                apiCallsLimit: 100,
                storageUsed: 0,
                storageLimit: 100 * 1024 * 1024
              },
              emailVerified: googleUser.emailVerified
            }
            storedUsers.push(existingUser)
            localStorage.setItem('users', JSON.stringify(storedUsers))
          }

          // 生成新的CSRF令牌
          const csrfToken = generateCsrfToken()
          localStorage.setItem('csrfToken', csrfToken)

          // 移除密码哈希后再存储
          const userWithoutPassword = {
            ...existingUser,
            passwordHash: undefined
          }

          setUser(userWithoutPassword)
          localStorage.setItem('user', JSON.stringify(userWithoutPassword))
          resolve()
        } catch (error) {
          console.error('Google login error:', error)
          reject(new Error('Google登录失败，请重试'))
        }
      }, 1500)
    })
  }

  const loginWithGitHub = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // 模拟GitHub登录流程
          console.log('Redirecting to GitHub login...')
          // 模拟用户授权
          const githubUser = {
            id: 'github_' + Date.now(),
            name: 'GitHub User',
            email: 'user' + Date.now() + '@github.com',
            emailVerified: true
          }

          // 检查用户是否已存在
          const storedUsers = JSON.parse(localStorage.getItem('users') || '[]')
          let existingUser = storedUsers.find((u: any) => u.email === githubUser.email)

          if (!existingUser) {
            // 创建新用户
            existingUser = {
              id: githubUser.id,
              name: githubUser.name,
              email: githubUser.email,
              passwordHash: hashPassword('github_auth_' + Date.now()),
              subscription: {
                plan: 'free',
                status: 'active',
                expiresAt: null,
                features: ['basic_promotion', 'limited_api_calls']
              },
              twoFactorEnabled: false,
              apiTokens: [],
              usage: {
                apiCalls: 0,
                apiCallsLimit: 100,
                storageUsed: 0,
                storageLimit: 100 * 1024 * 1024
              },
              emailVerified: githubUser.emailVerified
            }
            storedUsers.push(existingUser)
            localStorage.setItem('users', JSON.stringify(storedUsers))
          }

          // 生成新的CSRF令牌
          const csrfToken = generateCsrfToken()
          localStorage.setItem('csrfToken', csrfToken)

          // 移除密码哈希后再存储
          const userWithoutPassword = {
            ...existingUser,
            passwordHash: undefined
          }

          setUser(userWithoutPassword)
          localStorage.setItem('user', JSON.stringify(userWithoutPassword))
          resolve()
        } catch (error) {
          console.error('GitHub login error:', error)
          reject(new Error('GitHub登录失败，请重试'))
        }
      }, 1500)
    })
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      verifyTwoFactor,
      setupTwoFactor,
      enableTwoFactor,
      disableTwoFactor,
      register, 
      logout, 
      isLoading,
      createApiToken,
      revokeApiToken,
      updateSubscription,
      forgotPassword,
      resetPassword,
      verifyEmail,
      resendVerificationEmail,
      loginWithGoogle,
      loginWithGitHub
    }}>
      {children}
    </AuthContext.Provider>
  )
}

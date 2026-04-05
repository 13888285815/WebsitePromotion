import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/auth'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [tempToken, setTempToken] = useState<string | null>(null)
  const [step, setStep] = useState<'credentials' | 'twoFactor'>('credentials')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { login, verifyTwoFactor, loginWithGoogle, loginWithGitHub } = useAuth()
  const navigate = useNavigate()

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      await loginWithGoogle()
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Google登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleGitHubLogin = async () => {
    setLoading(true)
    try {
      await loginWithGitHub()
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'GitHub登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const result = await login(email, password)
      
      if (result.requiresTwoFactor && result.tempToken) {
        setTempToken(result.tempToken)
        setStep('twoFactor')
      } else {
        navigate('/')
      }
    } catch (err: any) {
      setError(err.message || '登录失败，请检查邮箱和密码')
    } finally {
      setLoading(false)
    }
  }

  const handleTwoFactorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (tempToken) {
        await verifyTwoFactor(twoFactorCode, tempToken)
        navigate('/')
      }
    } catch (err: any) {
      setError(err.message || '验证码错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleBackToCredentials = () => {
    setStep('credentials')
    setTwoFactorCode('')
    setTempToken(null)
    setError(null)
  }

  if (step === 'twoFactor') {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>双重验证</h2>
            <p className="auth-subtitle">请输入您的身份验证器应用中的6位验证码</p>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleTwoFactorSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="twoFactorCode">验证码</label>
              <input
                type="text"
                id="twoFactorCode"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                required
                className="text-center text-lg tracking-widest"
                autoFocus
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary w-full" 
              disabled={loading || twoFactorCode.length !== 6}
            >
              {loading ? '验证中...' : '验证'}
            </button>
          </form>
          
          <div className="auth-footer">
            <button 
              onClick={handleBackToCredentials}
              className="btn btn-link"
            >
              ← 返回登录
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>欢迎回来</h2>
          <p className="auth-subtitle">登录您的自动推广账户</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleCredentialsSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">邮箱地址</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              autoFocus
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>
          
          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>记住我</span>
            </label>
            <Link to="/forgot-password" className="forgot-password">
              忘记密码？
            </Link>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-full" 
            disabled={loading}
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
        
        <div className="auth-divider">
          <span>或</span>
        </div>
        
        <div className="social-login">
          <button 
            className="btn btn-social btn-google" 
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg viewBox="0 0 24 24" className="social-icon">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? '登录中...' : 'Google'}
          </button>
          <button 
            className="btn btn-social btn-github" 
            onClick={handleGitHubLogin}
            disabled={loading}
          >
            <svg viewBox="0 0 24 24" className="social-icon">
              <path fill="currentColor" d="M12 1C5.92 1 1 5.92 1 12c0 4.87 3.15 8.99 7.53 10.44.55.1.75-.24.75-.53v-1.86c-3.06.66-3.7-1.48-3.7-1.48-.5-1.27-1.22-1.61-1.22-1.61-.99-.68.08-.66.08-.66 1.1.08 1.68 1.13 1.68 1.13.97 1.67 2.55 1.19 3.17.91.1-.71.38-1.19.69-1.46-2.44-.28-5.01-1.22-5.01-5.44 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.4.11-2.92 0 0 .92-.3 3.02 1.13.88-.24 1.82-.36 2.76-.36.93 0 1.88.12 2.76.36 2.1-1.43 3.02-1.13 3.02-1.13.6 1.52.22 2.64.11 2.92.7.77 1.13 1.75 1.13 2.95 0 4.23-2.57 5.16-5.01 5.44.39.34.74 1 .74 2.02v3c0 .29.2.63.75.53C19.85 20.99 23 16.87 23 12c0-6.08-4.92-11-11-11z"/>
            </svg>
            {loading ? '登录中...' : 'GitHub'}
          </button>
        </div>
        
        <div className="auth-footer">
          <p>还没有账号？ <Link to="/register">立即注册</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Login

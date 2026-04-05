import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/auth'

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    phone: ''
  })
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [acceptPrivacy, setAcceptPrivacy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak')
  const { register, loginWithGoogle, loginWithGitHub } = useAuth()
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

  const checkPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    if (strength <= 2) return 'weak'
    if (strength <= 4) return 'medium'
    return 'strong'
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value))
    }
  }

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致')
      return false
    }

    if (formData.password.length < 8) {
      setError('密码至少需要8个字符')
      return false
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      setError('密码必须包含大小写字母和数字')
      return false
    }

    if (!acceptTerms || !acceptPrivacy) {
      setError('请同意服务条款和隐私政策')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) return

    setLoading(true)

    try {
      await register(formData.name, formData.email, formData.password)
      navigate('/login')
    } catch (err: any) {
      setError(err.message || '注册失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card auth-card-large">
        <div className="auth-header">
          <h2>创建账户</h2>
          <p className="auth-subtitle">开始您的自动推广之旅</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">姓名 *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="请输入您的姓名"
                required
                autoFocus
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">邮箱地址 *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="company">公司名称</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="您的公司（可选）"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">手机号码</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="您的手机号（可选）"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">密码 *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              minLength={8}
            />
            <div className="password-strength">
              <div className={`strength-bar strength-${passwordStrength}`}>
                <div className="strength-fill"></div>
              </div>
              <span className="strength-text">
                {passwordStrength === 'weak' && '密码强度：弱'}
                {passwordStrength === 'medium' && '密码强度：中'}
                {passwordStrength === 'strong' && '密码强度：强'}
              </span>
            </div>
            <p className="form-hint">密码至少8位，包含大小写字母和数字</p>
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">确认密码 *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-checkboxes">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                required
              />
              <span>我同意 <Link to="/terms" target="_blank">服务条款</Link> *</span>
            </label>
            
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={acceptPrivacy}
                onChange={(e) => setAcceptPrivacy(e.target.checked)}
                required
              />
              <span>我同意 <Link to="/privacy" target="_blank">隐私政策</Link> *</span>
            </label>
            
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>订阅我们的新闻通讯，获取最新产品更新</span>
            </label>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-full" 
            disabled={loading}
          >
            {loading ? '注册中...' : '创建账户'}
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
          <p>已有账号？ <Link to="/login">立即登录</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Register

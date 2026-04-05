import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'
import { useState } from 'react'
import NewsList from './pages/NewsList'
import NewsDetail from './pages/NewsDetail'
import VideoList from './pages/VideoList'
import VideoDetail from './pages/VideoDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Subscription from './pages/Subscription'
import Promotion from './pages/Promotion'
import ApiTokens from './pages/ApiTokens'
import { AuthProvider, useAuth } from './utils/auth'
import './App.css'

function Navigation() {
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="app-logo">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            <span>自动推广工具</span>
          </Link>
          
          <nav className="main-nav">
            <Link to="/" className="nav-link">首页</Link>
            <Link to="/promotion" className="nav-link">推广</Link>
            <Link to="/subscription" className="nav-link">定价</Link>
            <Link to="/api-tokens" className="nav-link">API</Link>
          </nav>
        </div>

        <div className="header-right">
          <LanguageSelector />
          
          {user ? (
            <div className="user-menu-container">
              <button 
                className="user-menu-trigger"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="user-name">{user.name}</span>
                <svg className="dropdown-icon" viewBox="0 0 20 20">
                  <path fill="currentColor" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                </svg>
              </button>
              
              {showUserMenu && (
                <div className="user-menu-dropdown">
                  <div className="user-menu-header">
                    <span className="user-email">{user.email}</span>
                    <span className={`plan-badge plan-${user.subscription.plan}`}>
                      {user.subscription.plan === 'free' ? '免费版' :
                       user.subscription.plan === 'basic' ? '基础版' :
                       user.subscription.plan === 'pro' ? '专业版' : '企业版'}
                    </span>
                  </div>
                  <div className="user-menu-divider"></div>
                  <Link to="/dashboard" className="user-menu-item">
                    <svg viewBox="0 0 20 20"><path fill="currentColor" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/></svg>
                    控制台
                  </Link>
                  <Link to="/api-tokens" className="user-menu-item">
                    <svg viewBox="0 0 20 20"><path fill="currentColor" d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill="currentColor" d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm8-6a6 6 0 00-6 6c0 1.887.454 3.665 1.257 5.234L7.757 12.9A4 4 0 0110 6a4 4 0 012.243 6.9l1.5 2.334A5.963 5.963 0 0016 10a6 6 0 00-6-6z"/></svg>
                    API 令牌
                  </Link>
                  <Link to="/subscription" className="user-menu-item">
                    <svg viewBox="0 0 20 20"><path fill="currentColor" d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/><path fill="currentColor" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/></svg>
                    订阅管理
                  </Link>
                  <div className="user-menu-divider"></div>
                  <button className="user-menu-item logout" onClick={logout}>
                    <svg viewBox="0 0 20 20"><path fill="currentColor" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"/></svg>
                    退出登录
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-ghost">登录</Link>
              <Link to="/register" className="btn btn-primary">免费注册</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

function LanguageSelector() {
  const [currentLang, setCurrentLang] = useState('zh')
  const [showLangMenu, setShowLangMenu] = useState(false)

  const languages = [
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ]

  const currentLanguage = languages.find(l => l.code === currentLang)

  return (
    <div className="language-selector">
      <button 
        className="lang-trigger"
        onClick={() => setShowLangMenu(!showLangMenu)}
      >
        <span className="lang-flag">{currentLanguage?.flag}</span>
        <span className="lang-name">{currentLanguage?.name}</span>
        <svg className="dropdown-icon" viewBox="0 0 20 20">
          <path fill="currentColor" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
        </svg>
      </button>
      
      {showLangMenu && (
        <div className="lang-dropdown">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`lang-option ${currentLang === lang.code ? 'active' : ''}`}
              onClick={() => {
                setCurrentLang(lang.code)
                setShowLangMenu(false)
              }}
            >
              <span className="lang-flag">{lang.flag}</span>
              <span className="lang-name">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section">
            <h4>产品</h4>
            <ul>
              <li><Link to="/promotion">自动推广</Link></li>
              <li><Link to="/subscription">定价方案</Link></li>
              <li><Link to="/api-tokens">API 接口</Link></li>
              <li><a href="#">更新日志</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>资源</h4>
            <ul>
              <li><a href="#">文档中心</a></li>
              <li><a href="#">API 参考</a></li>
              <li><a href="#">代码示例</a></li>
              <li><a href="#">博客</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>支持</h4>
            <ul>
              <li><a href="#">帮助中心</a></li>
              <li><a href="#">联系我们</a></li>
              <li><a href="#">状态页面</a></li>
              <li><a href="#">反馈建议</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>公司</h4>
            <ul>
              <li><a href="#">关于我们</a></li>
              <li><a href="#">服务条款</a></li>
              <li><a href="#">隐私政策</a></li>
              <li><a href="#">安全说明</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-copyright">
            © 2026 自动推广工具. 保留所有权利.
          </div>
          <div className="footer-social">
            <a href="#" className="social-link" title="GitHub">
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 1C5.92 1 1 5.92 1 12c0 4.87 3.15 8.99 7.53 10.44.55.1.75-.24.75-.53v-1.86c-3.06.66-3.7-1.48-3.7-1.48-.5-1.27-1.22-1.61-1.22-1.61-.99-.68.08-.66.08-.66 1.1.08 1.68 1.13 1.68 1.13.97 1.67 2.55 1.19 3.17.91.1-.71.38-1.19.69-1.46-2.44-.28-5.01-1.22-5.01-5.44 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.4.11-2.92 0 0 .92-.3 3.02 1.13.88-.24 1.82-.36 2.76-.36.93 0 1.88.12 2.76.36 2.1-1.43 3.02-1.13 3.02-1.13.6 1.52.22 2.64.11 2.92.7.77 1.13 1.75 1.13 2.95 0 4.23-2.57 5.16-5.01 5.44.39.34.74 1 .74 2.02v3c0 .29.2.63.75.53C19.85 20.99 23 16.87 23 12c0-6.08-4.92-11-11-11z"/></svg>
            </a>
            <a href="#" className="social-link" title="Twitter">
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" className="social-link" title="Discord">
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function AppContent() {
  return (
    <div className="app-wrapper">
      <Navigation />
      
      <main className="app-main">
        <Routes>
          <Route path="/" element={<NewsList />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/videos" element={<VideoList />} />
          <Route path="/videos/:id" element={<VideoDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/promotion" element={<Promotion />} />
          <Route path="/api-tokens" element={<ApiTokens />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App

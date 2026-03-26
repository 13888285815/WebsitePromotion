import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import NewsList from './pages/NewsList'
import NewsDetail from './pages/NewsDetail'
import VideoList from './pages/VideoList'
import VideoDetail from './pages/VideoDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Subscription from './pages/Subscription'
import { AuthProvider } from './utils/auth'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="msn-app">
          {/* 顶部导航栏 */}
          <header className="msn-header">
            <div className="msn-header-top">
              <div className="msn-logo">
                <a href="/">MSN</a>
              </div>
              <div className="msn-search">
                <input type="text" placeholder="搜索网络和资讯" />
                <button>搜索</button>
              </div>
              <div className="msn-user">
                <a href="/login" className="msn-signin">登录</a>
              </div>
            </div>
            <nav className="msn-nav">
              <ul>
                <li><a href="/">首页</a></li>
                <li><a href="/news">新闻</a></li>
                <li><a href="/videos">视频</a></li>
                <li><a href="#">体育</a></li>
                <li><a href="#">财经</a></li>
                <li><a href="#">娱乐</a></li>
                <li><a href="#">科技</a></li>
                <li><a href="#">生活</a></li>
                <li><a href="#">健康</a></li>
                <li><a href="#">更多</a></li>
              </ul>
            </nav>
          </header>

          {/* 主内容区 */}
          <div className="msn-main">
            {/* 左侧内容 */}
            <main className="msn-content">
              <Routes>
                <Route path="/" element={<NewsList />} />
                <Route path="/news/:id" element={<NewsDetail />} />
                <Route path="/videos" element={<VideoList />} />
                <Route path="/videos/:id" element={<VideoDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/subscription" element={<Subscription />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* 右侧边栏 */}
            <aside className="msn-sidebar">
              {/* 天气模块 */}
              <div className="msn-weather">
                <h3>天气</h3>
                <div className="weather-content">
                  <div className="weather-city">北京</div>
                  <div className="weather-temp">22°C</div>
                  <div className="weather-desc">晴</div>
                </div>
              </div>

              {/* 快捷链接 */}
              <div className="msn-links">
                <h3>快捷链接</h3>
                <ul>
                  <li><a href="#">Outlook 邮箱</a></li>
                  <li><a href="#">Office 365</a></li>
                  <li><a href="#">OneDrive</a></li>
                  <li><a href="#">Skype</a></li>
                </ul>
              </div>

              {/* 热门话题 */}
              <div className="msn-trending">
                <h3>热门话题</h3>
                <ul>
                  <li><a href="#">1. 最新科技动态</a></li>
                  <li><a href="#">2. 体育赛事报道</a></li>
                  <li><a href="#">3. 财经市场分析</a></li>
                  <li><a href="#">4. 娱乐新闻资讯</a></li>
                </ul>
              </div>
            </aside>
          </div>

          {/* 页脚 */}
          <footer className="msn-footer">
            <div className="msn-footer-content">
              <div className="msn-footer-links">
                <a href="#">关于我们</a>
                <a href="#">隐私政策</a>
                <a href="#">使用条款</a>
                <a href="#">联系我们</a>
              </div>
              <div className="msn-footer-copyright">
                © 2026 Microsoft Corporation. 保留所有权利。
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
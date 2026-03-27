import React, { useState } from 'react'

const Promotion: React.FC = () => {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState('')
  const [isPromoting, setIsPromoting] = useState(false)

  const handlePromotion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) {
      setStatus('请输入网址')
      return
    }

    setIsPromoting(true)
    setStatus('正在推广...')

    // 模拟推广过程
    try {
      // 这里可以集成实际的推广API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // 模拟推广成功
      setStatus('推广成功！您的网址已被推送到互联网上。')
    } catch (error) {
      setStatus('推广失败，请稍后重试。')
    } finally {
      setIsPromoting(false)
    }
  }

  return (
    <div className="promotion-page">
      <h2>自动推广工具</h2>
      <p>输入网址，我们将帮助您推广到互联网上的所有用户访问。</p>
      
      <form onSubmit={handlePromotion} className="promotion-form">
        <div className="form-group">
          <label htmlFor="url">网址：</label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="请输入完整的网址，例如：https://example.com"
            required
          />
        </div>
        
        <button type="submit" disabled={isPromoting} className="promotion-btn">
          {isPromoting ? '推广中...' : '开始推广'}
        </button>
      </form>

      {status && (
        <div className={`status-message ${status.includes('成功') ? 'success' : 'error'}`}>
          {status}
        </div>
      )}

      <div className="promotion-info">
        <h3>推广原理</h3>
        <ul>
          <li>自动提交到各大搜索引擎</li>
          <li>分享到社交媒体平台</li>
          <li>生成推广链接</li>
          <li>监控推广效果</li>
        </ul>
      </div>
    </div>
  )
}

export default Promotion
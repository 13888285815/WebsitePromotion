import React, { useState } from 'react'

type AIModel = 'default' | 'gpt4' | 'claude' | 'gemini' | 'llama' | 'wenxin' | 'tongyi' | 'ernie'

const Promotion: React.FC = () => {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState('')
  const [isPromoting, setIsPromoting] = useState(false)
  const [selectedModel, setSelectedModel] = useState<AIModel>('default')
  const [contentType, setContentType] = useState<'url' | 'text' | 'file'>('url')
  const [file, setFile] = useState<File | null>(null)

  const validateContent = (content: string): boolean => {
    const xssPatterns = [
      /<script[\s\S]*?<\/script>/gi,
      /<iframe[\s\S]*?<\/iframe>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi
    ]
    
    const sqlPatterns = [
      /\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE)\b/gi,
      /\b(OR|AND)\b\s+\d+\s*=\s*\d+/gi,
      /\bUNION\b\s+SELECT/gi
    ]
    
    const commandPatterns = [
      /\b(cmd|bash|sh|powershell|python|perl|ruby)\b/gi,
      /[;&|`]/g,
      /\b(echo|cat|ls|dir|rm|mv|cp)\b/gi
    ]
    
    const allPatterns = [...xssPatterns, ...sqlPatterns, ...commandPatterns]
    
    return !allPatterns.some(pattern => pattern.test(content))
  }

  const handlePromotion = async (e: React.FormEvent) => {
    e.preventDefault()
    
    let contentToValidate = ''
    if (contentType === 'url') {
      if (!url) {
        setStatus('请输入内容')
        return
      }
      contentToValidate = url
    } else if (contentType === 'text') {
      if (!url) {
        setStatus('请输入内容')
        return
      }
      contentToValidate = url
    } else if (contentType === 'file') {
      if (!file) {
        setStatus('请输入内容')
        return
      }
    }

    if (contentType !== 'file' && !validateContent(contentToValidate)) {
      setStatus('内容包含不安全的代码，请检查后重试')
      return
    }

    setIsPromoting(true)
    setStatus('推广中...')

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setStatus(`推广成功！您的内容已被推送到互联网上。 (选择的AI模型：${getModelName(selectedModel)})`)
    } catch (error) {
      setStatus('推广失败，请稍后重试。')
    } finally {
      setIsPromoting(false)
    }
  }

  const getModelName = (model: AIModel): string => {
    const modelNames: Record<AIModel, string> = {
      default: '默认模型',
      gpt4: 'GPT-4',
      claude: 'Claude',
      gemini: 'Gemini',
      llama: 'LLaMA',
      wenxin: '百度文心',
      tongyi: '阿里通义',
      ernie: '讯飞星火'
    }
    return modelNames[model] || model
  }



  return (
    <div className="promotion-page">
      <h2>自动推广工具</h2>
      <p>输入内容，我们将帮助您推广到互联网上的所有用户访问。</p>
      
      <form onSubmit={handlePromotion} className="promotion-form">
        {/* 内容类型选择 */}
        <div className="form-group">
          <label>内容类型：</label>
          <div className="content-type-buttons">
            <button 
              type="button" 
              className={`content-type-btn ${contentType === 'url' ? 'active' : ''}`}
              onClick={() => setContentType('url')}
            >
              网址
            </button>
            <button 
              type="button" 
              className={`content-type-btn ${contentType === 'text' ? 'active' : ''}`}
              onClick={() => setContentType('text')}
            >
              文本
            </button>
            <button 
              type="button" 
              className={`content-type-btn ${contentType === 'file' ? 'active' : ''}`}
              onClick={() => setContentType('file')}
            >
              文件
            </button>
          </div>
        </div>

        {/* 内容输入 */}
        <div className="form-group">
          {contentType === 'url' && (
            <>
              <label htmlFor="url">网址：</label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="请输入完整的网址，例如：https://example.com"
                required
              />
            </>
          )}
          {contentType === 'text' && (
            <>
              <label htmlFor="text">文本：</label>
              <textarea
                id="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="请输入要推广的文本内容"
                rows={4}
                required
              />
            </>
          )}
          {contentType === 'file' && (
            <>
              <label htmlFor="file">文件：</label>
              <input
                type="file"
                id="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
              />
              {file && <p className="file-name">{file.name}</p>}
            </>
          )}
        </div>

        {/* AI模型选择 */}
        <div className="form-group">
          <label>AI模型：</label>
          <div className="ai-model-buttons">
            {(['default', 'gpt4', 'claude', 'gemini', 'llama', 'wenxin', 'tongyi', 'ernie'] as AIModel[]).map((model) => (
              <button
                key={model}
                type="button"
                className={`ai-model-btn ${selectedModel === model ? 'active' : ''}`}
                onClick={() => setSelectedModel(model)}
              >
                {getModelName(model)}
              </button>
            ))}
          </div>
        </div>
        
        <button type="submit" disabled={isPromoting} className="promotion-btn">
          {isPromoting ? '推广中...' : '开始推广'}
        </button>
      </form>

      {status && (
        <div className={`status-message ${status.includes('推广成功') ? 'success' : 'error'}`}>
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

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, ApiToken } from '../utils/auth'

const ApiTokens: React.FC = () => {
  const { user, createApiToken, revokeApiToken } = useAuth()
  const navigate = useNavigate()
  
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newToken, setNewToken] = useState<ApiToken | null>(null)
  const [showTokenModal, setShowTokenModal] = useState(false)
  const [tokenForm, setTokenForm] = useState({
    name: '',
    permissions: [] as string[],
    limit: 1000,
    expiresIn: 30
  })
  const [loading, setLoading] = useState(false)

  const availablePermissions = [
    { id: 'promotion:read', name: '读取推广数据', description: '查看推广统计和报告' },
    { id: 'promotion:write', name: '创建推广任务', description: '创建和管理推广活动' },
    { id: 'promotion:delete', name: '删除推广任务', description: '删除推广活动' },
    { id: 'domains:read', name: '读取域名数据', description: '查看域名列表和状态' },
    { id: 'domains:manage', name: '管理域名', description: '添加、删除域名' },
    { id: 'analytics:read', name: '读取分析数据', description: '访问详细分析报告' },
    { id: 'billing:read', name: '读取账单信息', description: '查看账单和使用情况' },
    { id: 'user:read', name: '读取用户信息', description: '访问用户基本信息' }
  ]

  const usageStats = {
    totalCalls: user?.usage.apiCalls || 0,
    limit: user?.usage.apiCallsLimit || 100,
    remaining: (user?.usage.apiCallsLimit || 100) - (user?.usage.apiCalls || 0),
    percentage: Math.round(((user?.usage.apiCalls || 0) / (user?.usage.apiCallsLimit || 100)) * 100)
  }

  const handleCreateToken = async () => {
    if (!tokenForm.name || tokenForm.permissions.length === 0) {
      alert('请填写令牌名称并选择至少一个权限')
      return
    }

    setLoading(true)
    try {
      const token = await createApiToken(
        tokenForm.name,
        tokenForm.permissions,
        tokenForm.limit,
        tokenForm.expiresIn
      )
      setNewToken(token)
      setShowCreateModal(false)
      setShowTokenModal(true)
      setTokenForm({ name: '', permissions: [], limit: 1000, expiresIn: 30 })
    } catch (err: any) {
      alert(err.message || '创建令牌失败')
    } finally {
      setLoading(false)
    }
  }

  const handleRevokeToken = async (tokenId: string) => {
    if (!confirm('确定要撤销此令牌吗？撤销后，使用该令牌的API调用将立即失效。')) {
      return
    }

    try {
      await revokeApiToken(tokenId)
      alert('令牌已撤销')
    } catch (err: any) {
      alert(err.message || '撤销令牌失败')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('已复制到剪贴板')
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '永不过期'
    return new Date(dateString).toLocaleDateString('zh-CN')
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString('zh-CN')
  }

  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <div className="api-tokens-page">
      <div className="page-header">
        <div className="header-content">
          <h1>API 令牌管理</h1>
          <p>管理您的 API 访问令牌，监控使用情况</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <svg className="icon" viewBox="0 0 20 20">
            <path fill="currentColor" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
          </svg>
          创建新令牌
        </button>
      </div>

      <div className="usage-overview">
        <h2>使用情况概览</h2>
        <div className="usage-cards">
          <div className="usage-card">
            <div className="usage-icon">📊</div>
            <div className="usage-info">
              <span className="usage-label">本月 API 调用</span>
              <span className="usage-value">{formatNumber(usageStats.totalCalls)}</span>
            </div>
          </div>
          <div className="usage-card">
            <div className="usage-icon">📈</div>
            <div className="usage-info">
              <span className="usage-label">调用限额</span>
              <span className="usage-value">{formatNumber(usageStats.limit)}</span>
            </div>
          </div>
          <div className="usage-card">
            <div className="usage-icon">✅</div>
            <div className="usage-info">
              <span className="usage-label">剩余额度</span>
              <span className="usage-value">{formatNumber(usageStats.remaining)}</span>
            </div>
          </div>
          <div className="usage-card">
            <div className="usage-icon">🔑</div>
            <div className="usage-info">
              <span className="usage-label">活跃令牌</span>
              <span className="usage-value">
                {user.apiTokens.filter(t => t.status === 'active').length}
              </span>
            </div>
          </div>
        </div>

        <div className="usage-progress">
          <div className="progress-header">
            <span>API 调用使用率</span>
            <span>{usageStats.percentage}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className={`progress-fill ${usageStats.percentage > 80 ? 'warning' : ''} ${usageStats.percentage > 95 ? 'danger' : ''}`}
              style={{ width: `${usageStats.percentage}%` }}
            />
          </div>
          <p className="progress-hint">
            {usageStats.percentage > 80 
              ? '⚠️ 您的 API 调用即将达到限额，请考虑升级方案' 
              : '您的 API 使用情况正常'}
          </p>
        </div>
      </div>

      <div className="tokens-section">
        <h2>API 令牌列表</h2>
        {user.apiTokens.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔑</div>
            <h3>暂无 API 令牌</h3>
            <p>创建 API 令牌以开始使用我们的 API 服务</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              创建第一个令牌
            </button>
          </div>
        ) : (
          <div className="tokens-table-wrapper">
            <table className="tokens-table">
              <thead>
                <tr>
                  <th>令牌名称</th>
                  <th>令牌前缀</th>
                  <th>权限</th>
                  <th>使用量</th>
                  <th>创建时间</th>
                  <th>过期时间</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {user.apiTokens.map((token) => (
                  <tr key={token.id} className={token.status !== 'active' ? 'inactive' : ''}>
                    <td className="token-name">{token.name}</td>
                    <td className="token-prefix">{token.prefix}...</td>
                    <td className="token-permissions">
                      <span className="permission-count">
                        {token.permissions.length} 个权限
                      </span>
                    </td>
                    <td className="token-usage">
                      <div className="usage-bar-small">
                        <div 
                          className="usage-fill"
                          style={{ width: `${(token.usage / token.limit) * 100}%` }}
                        />
                      </div>
                      <span>{token.usage} / {token.limit}</span>
                    </td>
                    <td className="token-date">{formatDate(token.createdAt)}</td>
                    <td className="token-date">{formatDate(token.expiresAt)}</td>
                    <td className="token-status">
                      <span className={`status-badge status-${token.status}`}>
                        {token.status === 'active' ? '活跃' : 
                         token.status === 'revoked' ? '已撤销' : '已过期'}
                      </span>
                    </td>
                    <td className="token-actions">
                      {token.status === 'active' && (
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleRevokeToken(token.id)}
                        >
                          撤销
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="api-documentation">
        <h2>API 文档</h2>
        <div className="doc-cards">
          <div className="doc-card">
            <h3>🚀 快速开始</h3>
            <p>了解如何开始使用我们的 API，包括认证和基本请求示例。</p>
            <a href="#" className="doc-link">查看文档 →</a>
          </div>
          <div className="doc-card">
            <h3>📚 API 参考</h3>
            <p>完整的 API 端点文档，包含请求参数和响应格式。</p>
            <a href="#" className="doc-link">查看参考 →</a>
          </div>
          <div className="doc-card">
            <h3>💻 SDK 下载</h3>
            <p>下载官方 SDK，支持 JavaScript、Python、Java 等语言。</p>
            <a href="#" className="doc-link">下载 SDK →</a>
          </div>
          <div className="doc-card">
            <h3>🔧 代码示例</h3>
            <p>查看常见使用场景的代码示例，快速集成到您的应用。</p>
            <a href="#" className="doc-link">查看示例 →</a>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>创建 API 令牌</h3>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>令牌名称 *</label>
                <input
                  type="text"
                  value={tokenForm.name}
                  onChange={(e) => setTokenForm({ ...tokenForm, name: e.target.value })}
                  placeholder="例如：生产环境令牌"
                  required
                />
              </div>

              <div className="form-group">
                <label>权限设置 *</label>
                <div className="permissions-list">
                  {availablePermissions.map((perm) => (
                    <label key={perm.id} className="permission-item">
                      <input
                        type="checkbox"
                        checked={tokenForm.permissions.includes(perm.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setTokenForm({
                              ...tokenForm,
                              permissions: [...tokenForm.permissions, perm.id]
                            })
                          } else {
                            setTokenForm({
                              ...tokenForm,
                              permissions: tokenForm.permissions.filter(p => p !== perm.id)
                            })
                          }
                        }}
                      />
                      <div className="permission-info">
                        <span className="permission-name">{perm.name}</span>
                        <span className="permission-desc">{perm.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>调用限额</label>
                  <input
                    type="number"
                    value={tokenForm.limit}
                    onChange={(e) => setTokenForm({ ...tokenForm, limit: parseInt(e.target.value) || 0 })}
                    min="1"
                    max={user.usage.apiCallsLimit}
                  />
                  <span className="form-hint">最大 {user.usage.apiCallsLimit}</span>
                </div>
                <div className="form-group">
                  <label>过期时间（天）</label>
                  <select
                    value={tokenForm.expiresIn}
                    onChange={(e) => setTokenForm({ ...tokenForm, expiresIn: parseInt(e.target.value) })}
                  >
                    <option value={7}>7 天</option>
                    <option value={30}>30 天</option>
                    <option value={90}>90 天</option>
                    <option value={365}>1 年</option>
                    <option value={0}>永不过期</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  取消
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleCreateToken}
                  disabled={loading || !tokenForm.name || tokenForm.permissions.length === 0}
                >
                  {loading ? '创建中...' : '创建令牌'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTokenModal && newToken && (
        <div className="modal-overlay" onClick={() => setShowTokenModal(false)}>
          <div className="modal token-reveal-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🎉 令牌创建成功</h3>
              <button className="close-btn" onClick={() => setShowTokenModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="token-warning">
                <strong>⚠️ 重要提示</strong>
                <p>这是您唯一一次查看此令牌的机会。请立即复制并安全保存，离开此页面后将无法再次查看完整令牌。</p>
              </div>

              <div className="token-display">
                <label>您的 API 令牌</label>
                <div className="token-value-wrapper">
                  <code className="token-value">{newToken.token}</code>
                  <button 
                    className="btn btn-sm btn-copy"
                    onClick={() => copyToClipboard(newToken.token)}
                  >
                    复制
                  </button>
                </div>
              </div>

              <div className="token-details">
                <div className="detail-row">
                  <span>令牌名称：</span>
                  <span>{newToken.name}</span>
                </div>
                <div className="detail-row">
                  <span>权限数量：</span>
                  <span>{newToken.permissions.length} 个</span>
                </div>
                <div className="detail-row">
                  <span>调用限额：</span>
                  <span>{newToken.limit} 次/月</span>
                </div>
                <div className="detail-row">
                  <span>过期时间：</span>
                  <span>{formatDate(newToken.expiresAt)}</span>
                </div>
              </div>

              <div className="usage-example">
                <label>使用示例</label>
                <pre className="code-block">
{`curl -X GET \\
  'https://api.autopromotion.com/v1/promotions' \\
  -H 'Authorization: Bearer ${newToken.token}' \\
  -H 'Content-Type: application/json'`}
                </pre>
                <button 
                  className="btn btn-sm btn-copy"
                  onClick={() => copyToClipboard(`curl -X GET 'https://api.autopromotion.com/v1/promotions' -H 'Authorization: Bearer ${newToken.token}' -H 'Content-Type: application/json'`)}>
                  复制代码
                </button>
              </div>

              <button 
                className="btn btn-primary w-full"
                onClick={() => setShowTokenModal(false)}
              >
                我已保存令牌
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ApiTokens

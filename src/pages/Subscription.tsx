import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/auth'

interface Plan {
  id: 'free' | 'basic' | 'pro' | 'enterprise'
  name: string
  nameEn: string
  price: number
  yearlyPrice: number
  description: string
  features: string[]
  notIncluded: string[]
  isPopular: boolean
  cta: string
  badge?: string
}

const Subscription: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [selectedPlan, setSelectedPlan] = useState<string>('pro')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentPlan, setPaymentPlan] = useState<Plan | null>(null)
  const { updateSubscription } = useAuth()
  const navigate = useNavigate()

  const plans: Plan[] = [
    {
      id: 'free',
      name: '免费版',
      nameEn: 'Free',
      price: 0,
      yearlyPrice: 0,
      description: '适合个人用户体验',
      features: [
        '每月100次API调用',
        '基础推广功能',
        '标准支持',
        '1个项目',
        '基础数据分析'
      ],
      notIncluded: [
        '定时推广',
        '高级分析',
        'API访问'
      ],
      isPopular: false,
      cta: '免费开始'
    },
    {
      id: 'basic',
      name: '基础版',
      nameEn: 'Starter',
      price: 29,
      yearlyPrice: 290,
      description: '适合小型团队和初创企业',
      features: [
        '每月1,000次API调用',
        '定时推广功能',
        '邮件支持',
        '5个项目',
        '基础API访问',
        '推广数据分析'
      ],
      notIncluded: [
        '高级分析',
        '优先处理',
        '专属客户经理'
      ],
      isPopular: false,
      cta: '选择基础版'
    },
    {
      id: 'pro',
      name: '专业版',
      nameEn: 'Pro',
      price: 99,
      yearlyPrice: 990,
      description: '适合成长型企业',
      features: [
        '每月10,000次API调用',
        '高级推广功能',
        '优先处理队列',
        '详细数据分析',
        '完整API访问',
        '优先技术支持',
        '20个项目',
        '自定义报告'
      ],
      notIncluded: [
        '专属客户经理',
        'SLA保障'
      ],
      isPopular: true,
      cta: '选择专业版',
      badge: '最受欢迎'
    },
    {
      id: 'enterprise',
      name: '企业版',
      nameEn: 'Enterprise',
      price: 299,
      yearlyPrice: 2990,
      description: '适合大型企业和机构',
      features: [
        '每月100,000次API调用',
        '所有高级功能',
        '专属解决方案',
        '专属客户经理',
        'SLA服务保障',
        '无限项目',
        '高级安全功能',
        '自定义集成',
        '7×24小时支持'
      ],
      notIncluded: [],
      isPopular: false,
      cta: '联系销售',
      badge: '定制方案'
    }
  ]

  const handleSubscribe = (plan: Plan) => {
    if (plan.id === 'enterprise') {
      window.location.href = 'mailto:sales@autopromotion.com?subject=企业版咨询'
      return
    }
    
    if (plan.id === 'free') {
      handleFreePlan()
      return
    }
    
    setPaymentPlan(plan)
    setShowPaymentModal(true)
  }

  const handleFreePlan = async () => {
    try {
      await updateSubscription('free')
      alert('您已成功切换到免费版！')
      navigate('/dashboard')
    } catch (err) {
      alert('操作失败，请重试')
    }
  }

  const handlePayment = async () => {
    if (!paymentPlan) return
    
    try {
      await updateSubscription(paymentPlan.id)
      setShowPaymentModal(false)
      alert(`恭喜！您已成功订阅${paymentPlan.name}！`)
      navigate('/dashboard')
    } catch (err) {
      alert('支付失败，请重试')
    }
  }

  const calculateSavings = (plan: Plan) => {
    if (plan.price === 0) return 0
    const monthlyCost = plan.price * 12
    const yearlyCost = plan.yearlyPrice
    return Math.round(((monthlyCost - yearlyCost) / monthlyCost) * 100)
  }

  return (
    <div className="subscription-page">
      <div className="subscription-hero">
        <h1>选择适合您的方案</h1>
        <p>灵活的定价方案，满足不同规模企业的需求</p>
        
        <div className="billing-toggle">
          <button 
            className={billingCycle === 'monthly' ? 'active' : ''}
            onClick={() => setBillingCycle('monthly')}
          >
            月付
          </button>
          <button 
            className={billingCycle === 'yearly' ? 'active' : ''}
            onClick={() => setBillingCycle('yearly')}
          >
            年付
            <span className="save-badge">最高省20%</span>
          </button>
        </div>
      </div>

      <div className="plans-container">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`plan-card ${plan.isPopular ? 'popular' : ''} ${selectedPlan === plan.id ? 'selected' : ''}`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            {plan.badge && (
              <div className="plan-badge">{plan.badge}</div>
            )}
            
            <div className="plan-header">
              <h3>{plan.name}</h3>
              <span className="plan-name-en">{plan.nameEn}</span>
              <p className="plan-description">{plan.description}</p>
            </div>

            <div className="plan-price">
              <span className="currency">¥</span>
              <span className="amount">
                {billingCycle === 'monthly' ? plan.price : Math.round(plan.yearlyPrice / 12)}
              </span>
              <span className="period">/月</span>
              
              {billingCycle === 'yearly' && plan.price > 0 && (
                <div className="yearly-info">
                  <span className="yearly-total">年付 ¥{plan.yearlyPrice}</span>
                  <span className="savings">省{calculateSavings(plan)}%</span>
                </div>
              )}
            </div>

            <div className="plan-features">
              <h4>包含功能：</h4>
              <ul>
                {plan.features.map((feature, index) => (
                  <li key={index} className="included">
                    <svg className="check-icon" viewBox="0 0 20 20">
                      <path fill="currentColor" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {plan.notIncluded.length > 0 && (
                <>
                  <h4 className="not-included-title">不包含：</h4>
                  <ul>
                    {plan.notIncluded.map((feature, index) => (
                      <li key={index} className="not-included">
                        <svg className="cross-icon" viewBox="0 0 20 20">
                          <path fill="currentColor" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <button 
              className={`btn btn-subscribe ${plan.isPopular ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => handleSubscribe(plan)}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      <div className="subscription-faq">
        <h2>常见问题</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h4>可以随时取消订阅吗？</h4>
            <p>是的，您可以随时取消订阅。取消后，您仍可使用服务直到当前计费周期结束。</p>
          </div>
          <div className="faq-item">
            <h4>如何升级或降级方案？</h4>
            <p>您可以随时在账户设置中更改方案。升级立即生效，降级在下一计费周期生效。</p>
          </div>
          <div className="faq-item">
            <h4>提供退款吗？</h4>
            <p>我们提供7天无理由退款保证。如果您不满意，可以申请全额退款。</p>
          </div>
          <div className="faq-item">
            <h4>企业版有什么特殊服务？</h4>
            <p>企业版包含专属客户经理、SLA保障、自定义集成和7×24小时优先支持。</p>
          </div>
        </div>
      </div>

      <div className="subscription-compare">
        <h2>方案对比</h2>
        <div className="compare-table-wrapper">
          <table className="compare-table">
            <thead>
              <tr>
                <th>功能</th>
                <th>免费版</th>
                <th>基础版</th>
                <th className="highlight">专业版</th>
                <th>企业版</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>API调用次数</td>
                <td>100/月</td>
                <td>1,000/月</td>
                <td className="highlight">10,000/月</td>
                <td>100,000/月</td>
              </tr>
              <tr>
                <td>项目数量</td>
                <td>1</td>
                <td>5</td>
                <td className="highlight">20</td>
                <td>无限</td>
              </tr>
              <tr>
                <td>定时推广</td>
                <td>—</td>
                <td>✓</td>
                <td className="highlight">✓</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>数据分析</td>
                <td>基础</td>
                <td>基础</td>
                <td className="highlight">高级</td>
                <td>高级</td>
              </tr>
              <tr>
                <td>API访问</td>
                <td>—</td>
                <td>基础</td>
                <td className="highlight">完整</td>
                <td>完整</td>
              </tr>
              <tr>
                <td>支持方式</td>
                <td>社区</td>
                <td>邮件</td>
                <td className="highlight">优先</td>
                <td>7×24小时</td>
              </tr>
              <tr>
                <td>专属客户经理</td>
                <td>—</td>
                <td>—</td>
                <td className="highlight">—</td>
                <td>✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {showPaymentModal && paymentPlan && (
        <div className="payment-modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="payment-modal-header">
              <h3>确认订阅</h3>
              <button className="close-btn" onClick={() => setShowPaymentModal(false)}>×</button>
            </div>
            
            <div className="payment-modal-content">
              <div className="plan-summary">
                <h4>{paymentPlan.name}</h4>
                <p className="plan-price-large">
                  ¥{billingCycle === 'monthly' ? paymentPlan.price : paymentPlan.yearlyPrice}
                  <span>/{billingCycle === 'monthly' ? '月' : '年'}</span>
                </p>
              </div>

              <div className="payment-form">
                <h4>支付方式</h4>
                <div className="payment-methods">
                  <label className="payment-method active">
                    <input type="radio" name="payment" defaultChecked />
                    <span className="method-icon">💳</span>
                    <span>信用卡/借记卡</span>
                  </label>
                  <label className="payment-method">
                    <input type="radio" name="payment" />
                    <span className="method-icon">📱</span>
                    <span>支付宝</span>
                  </label>
                  <label className="payment-method">
                    <input type="radio" name="payment" />
                    <span className="method-icon">💬</span>
                    <span>微信支付</span>
                  </label>
                </div>

                <div className="form-group">
                  <label>卡号</label>
                  <input type="text" placeholder="1234 5678 9012 3456" />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>有效期</label>
                    <input type="text" placeholder="MM/YY" />
                  </div>
                  <div className="form-group">
                    <label>CVC</label>
                    <input type="text" placeholder="123" />
                  </div>
                </div>

                <div className="form-group">
                  <label>持卡人姓名</label>
                  <input type="text" placeholder="张三" />
                </div>
              </div>

              <div className="payment-summary">
                <div className="summary-row">
                  <span>方案费用</span>
                  <span>¥{billingCycle === 'monthly' ? paymentPlan.price : paymentPlan.yearlyPrice}</span>
                </div>
                <div className="summary-row">
                  <span>税费</span>
                  <span>¥0</span>
                </div>
                <div className="summary-row total">
                  <span>总计</span>
                  <span>¥{billingCycle === 'monthly' ? paymentPlan.price : paymentPlan.yearlyPrice}</span>
                </div>
              </div>

              <button 
                className="btn btn-primary btn-large w-full"
                onClick={handlePayment}
              >
                确认支付
              </button>

              <p className="payment-security">
                🔒 安全支付保障 · 7天无理由退款
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Subscription

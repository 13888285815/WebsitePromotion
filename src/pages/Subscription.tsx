import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/auth'

interface Plan {
  id: string
  name: string
  price: number
  interval: string
  features: string[]
  isPopular: boolean
}

const Subscription: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('basic')
  const { user } = useAuth()
  const navigate = useNavigate()

  const plans: Plan[] = [
    {
      id: 'basic',
      name: '基础版',
      price: 0,
      interval: '月',
      features: [
        '浏览新闻和视频',
        '基本搜索功能',
        '有限的个性化推荐'
      ],
      isPopular: false
    },
    {
      id: 'premium',
      name: '高级版',
      price: 99,
      interval: '月',
      features: [
        '无广告体验',
        '完整的个性化推荐',
        '高清视频播放',
        '优先访问独家内容',
        '多设备同步'
      ],
      isPopular: true
    },
    {
      id: 'enterprise',
      name: '企业版',
      price: 299,
      interval: '月',
      features: [
        '所有高级版功能',
        '团队协作工具',
        '定制化内容',
        '优先客户支持',
        '数据分析报告'
      ],
      isPopular: false
    }
  ]

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId)
    // 这里可以添加订阅逻辑
    alert(`您已选择 ${plans.find(p => p.id === planId)?.name} 计划`)
  }

  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <div className="subscription-container">
      <div className="subscription-header">
        <h1>选择您的订阅计划</h1>
        <p>根据您的需求选择最适合的订阅计划</p>
      </div>
      <div className="plans-grid">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`plan-card ${selectedPlan === plan.id ? 'selected' : ''} ${plan.isPopular ? 'popular' : ''}`}
          >
            <div className="plan-header">
              <h2>{plan.name}</h2>
              <div className="plan-price">
                ¥{plan.price}<span className="interval">/{plan.interval}</span>
              </div>
            </div>
            <div className="plan-features">
              {plan.features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <button 
              className="btn btn-primary subscribe-btn"
              onClick={() => handleSubscribe(plan.id)}
            >
              {plan.price === 0 ? '免费使用' : '立即订阅'}
            </button>
          </div>
        ))}
      </div>
      <div className="subscription-info">
        <h3>订阅说明</h3>
        <ul>
          <li>您可以随时取消订阅</li>
          <li>订阅费用将自动续费，除非您手动取消</li>
          <li>高级版和企业版提供7天免费试用期</li>
          <li>如有任何问题，请联系客服</li>
        </ul>
      </div>
    </div>
  )
}

export default Subscription
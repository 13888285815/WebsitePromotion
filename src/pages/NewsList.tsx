import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface NewsItem {
  id: string
  title: string
  summary: string
  imageUrl: string
  source: string
  category: string
  time: string
  views: number
}

const NewsList: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 模拟获取新闻数据
    setTimeout(() => {
      const mockNews: NewsItem[] = [
        {
          id: '1',
          title: '微软发布全新Windows 11更新，带来多项新功能',
          summary: '微软今日发布了Windows 11的重大更新，包括全新的任务栏设计、增强的多任务处理能力以及改进的系统性能。',
          imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Windows%2011%20update%20new%20features%20screenshot&image_size=landscape_16_9',
          source: '微软新闻',
          category: '科技',
          time: '2026-03-25 09:00',
          views: 12345
        },
        {
          id: '2',
          title: '全球科技巨头财报季：AI业务成为增长新引擎',
          summary: '多家科技巨头发布财报，AI相关业务成为主要增长动力，股价普遍上涨。',
          imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Tech%20company%20financial%20report%20AI%20growth&image_size=landscape_16_9',
          source: '财经日报',
          category: '财经',
          time: '2026-03-25 08:30',
          views: 9876
        },
        {
          id: '3',
          title: '2026年巴黎奥运会筹备工作进入最后阶段',
          summary: '距离2026年巴黎奥运会开幕仅剩100天，各项筹备工作已进入最后阶段，场馆建设基本完成。',
          imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Paris%20Olympic%20Games%202026%20stadium&image_size=landscape_16_9',
          source: '体育新闻',
          category: '体育',
          time: '2026-03-25 07:45',
          views: 7654
        },
        {
          id: '4',
          title: '全新电动汽车续航里程突破1000公里',
          summary: '某知名汽车制造商发布了一款全新电动汽车，续航里程突破1000公里，充电时间大幅缩短。',
          imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Electric%20car%20with%20long%20range%201000km&image_size=landscape_16_9',
          source: '汽车之家',
          category: '科技',
          time: '2026-03-24 18:00',
          views: 5432
        },
        {
          id: '5',
          title: '全球气候变化会议在纽约召开',
          summary: '来自世界各国的领导人齐聚纽约，讨论应对气候变化的具体措施和目标。',
          imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Climate%20change%20conference%20world%20leaders&image_size=landscape_16_9',
          source: '国际新闻',
          category: '国际',
          time: '2026-03-24 15:30',
          views: 4321
        },
        {
          id: '6',
          title: '娱乐圈年度盛典：众星云集，精彩不断',
          summary: '2026年娱乐圈年度盛典昨晚举行，众多明星亮相，现场星光熠熠。',
          imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Entertainment%20awards%20ceremony%20celebrities&image_size=landscape_16_9',
          source: '娱乐周刊',
          category: '娱乐',
          time: '2026-03-24 12:00',
          views: 3210
        }
      ]
      setNews(mockNews)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return <div className="loading">加载中...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  return (
    <div className="news-list-container">
      <div className="news-header">
        <h1>今日要闻</h1>
      </div>
      <div className="news-list">
        {news.map((item) => (
          <div key={item.id} className="news-item">
            <Link to={`/news/${item.id}`} className="news-link">
              <div className="news-image">
                <img src={item.imageUrl} alt={item.title} />
              </div>
              <div className="news-content">
                <h2 className="news-title">{item.title}</h2>
                <p className="news-summary">{item.summary}</p>
                <div className="news-meta">
                  <span className="news-source">{item.source}</span>
                  <span className="news-category">{item.category}</span>
                  <span className="news-time">{item.time}</span>
                  <span className="news-views">{item.views} 阅读</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NewsList
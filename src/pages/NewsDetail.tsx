import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

interface NewsItem {
  id: string
  title: string
  summary: string
  content: string
  imageUrl: string
  source: string
  category: string
  time: string
  views: number
}

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [news, setNews] = useState<NewsItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 模拟获取新闻详情数据
    setTimeout(() => {
      const mockNews: NewsItem[] = [
        {
          id: '1',
          title: '微软发布全新Windows 11更新，带来多项新功能',
          summary: '微软今日发布了Windows 11的重大更新，包括全新的任务栏设计、增强的多任务处理能力以及改进的系统性能。',
          content: `微软今日正式发布了Windows 11的重大更新，版本号为24H2。此次更新带来了多项新功能和改进，旨在提升用户体验和系统性能。\n\n全新的任务栏设计是本次更新的亮点之一，用户现在可以根据自己的喜好自定义任务栏的位置和大小，支持更灵活的布局。\n\n增强的多任务处理能力包括改进的Snap布局功能，现在可以支持更多的窗口排列方式，提高工作效率。\n\n系统性能方面，微软优化了启动速度和应用加载时间，使系统运行更加流畅。此外，还改进了电池管理，延长了笔记本电脑的续航时间。\n\n安全方面，本次更新加强了系统的安全性，包括更强大的防火墙和防病毒功能，保护用户的设备和数据安全。\n\n微软表示，此次更新将逐步推送给所有Windows 11用户，用户可以通过Windows Update检查并安装更新。`,
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
          content: `随着全球科技巨头陆续发布2026财年第一季度财报，AI业务成为了最大的亮点。多家公司的AI相关业务收入实现了两位数甚至三位数的增长，成为推动整体业绩的主要动力。\n\n微软财报显示，其AI业务收入同比增长了85%，主要来自于Azure云服务中的AI功能和Copilot产品的订阅收入。亚马逊的AWS云服务中，AI相关服务收入也增长了72%。\n\n谷歌母公司Alphabet的AI业务收入增长了68%，主要来自于搜索和云服务中的AI功能。苹果公司虽然没有单独披露AI业务收入，但表示AI功能的引入使得iPhone和Mac的销量有所提升。\n\n分析师认为，AI技术的商业化正在加速，企业和消费者对AI工具的需求不断增长，这将继续推动科技公司的业绩增长。\n\n受财报利好影响，科技股普遍上涨，纳斯达克指数创下历史新高。`,
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
          content: `距离2026年巴黎奥运会开幕仅剩100天，各项筹备工作已进入最后阶段。巴黎奥组委今日召开新闻发布会，通报了筹备工作的最新进展。\n\n据介绍，所有比赛场馆的建设已经基本完成，正在进行最后的设备安装和调试。主体育场法兰西体育场已经完成了翻修工作，将作为开幕式和闭幕式的举办场地。\n\n交通方面，巴黎已经完成了公共交通系统的升级，增加了地铁和公交的运力，以应对奥运会期间的大客流。此外，还新建了多条奥运专线，连接各个比赛场馆。\n\n安保方面，法国政府已经制定了详细的安保计划，将投入大量警力和安保设备，确保奥运会的安全举办。\n\n巴黎奥组委表示，目前已经售出了超过80%的门票，预计最终门票销售额将达到12亿欧元。\n\n2026年巴黎奥运会将于7月26日至8月11日举行，预计将有来自206个国家和地区的约10500名运动员参加。`,
          imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Paris%20Olympic%20Games%202026%20stadium&image_size=landscape_16_9',
          source: '体育新闻',
          category: '体育',
          time: '2026-03-25 07:45',
          views: 7654
        }
      ]

      const foundNews = mockNews.find(item => item.id === id)
      if (foundNews) {
        setNews(foundNews)
      } else {
        setError('新闻不存在')
      }
      setLoading(false)
    }, 1000)
  }, [id])

  if (loading) {
    return <div className="loading">加载中...</div>
  }

  if (error || !news) {
    return <div className="error">{error || '新闻不存在'}</div>
  }

  return (
    <div className="news-detail-container">
      <Link to="/" className="back-link">← 返回首页</Link>
      <div className="news-article">
        <h1 className="news-title">{news.title}</h1>
        <div className="news-meta">
          <span className="news-source">{news.source}</span>
          <span className="news-category">{news.category}</span>
          <span className="news-time">{news.time}</span>
          <span className="news-views">{news.views} 阅读</span>
        </div>
        <div className="news-image">
          <img src={news.imageUrl} alt={news.title} />
        </div>
        <p className="news-summary">{news.summary}</p>
        <div className="news-content">
          {news.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        <div className="news-actions">
          <button className="btn btn-outline">分享</button>
          <button className="btn btn-outline">收藏</button>
          <button className="btn btn-outline">评论</button>
        </div>
      </div>
    </div>
  )
}

export default NewsDetail
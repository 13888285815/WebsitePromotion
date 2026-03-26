import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface VideoItem {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  url: string
  duration: number
  source: string
  sourceRank: number
  viewCount: number
  date: string
}

const VideoList: React.FC = () => {
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 模拟获取视频数据
    setTimeout(() => {
      const mockVideos: VideoItem[] = [
        {
          id: '1',
          title: 'Windows 11 2026 年最新功能详解',
          description: '详细介绍 Windows 11 2026 年最新更新的所有功能，包括新的任务栏设计、增强的多任务处理能力以及改进的系统性能。',
          thumbnailUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Windows%2011%20new%20features%20tutorial&image_size=landscape_16_9',
          url: '#',
          duration: 600,
          source: '微软官方',
          sourceRank: 1,
          viewCount: 123456,
          date: '2026-03-25'
        },
        {
          id: '2',
          title: 'AI 如何改变我们的生活',
          description: '探讨人工智能技术如何改变我们的日常生活，从工作、学习到娱乐的各个方面。',
          thumbnailUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20technology%20changing%20life&image_size=landscape_16_9',
          url: '#',
          duration: 900,
          source: '科技前沿',
          sourceRank: 2,
          viewCount: 98765,
          date: '2026-03-24'
        },
        {
          id: '3',
          title: '2026 巴黎奥运会场馆巡礼',
          description: '带你参观 2026 年巴黎奥运会的各个比赛场馆，了解其设计理念和建设过程。',
          thumbnailUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Paris%20Olympic%20Games%202026%20venues%20tour&image_size=landscape_16_9',
          url: '#',
          duration: 720,
          source: '体育频道',
          sourceRank: 3,
          viewCount: 76543,
          date: '2026-03-23'
        },
        {
          id: '4',
          title: '全新电动汽车技术解析',
          description: '解析最新的电动汽车技术，包括电池技术、充电技术以及自动驾驶技术的发展。',
          thumbnailUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Electric%20car%20technology%20explained&image_size=landscape_16_9',
          url: '#',
          duration: 840,
          source: '汽车科技',
          sourceRank: 4,
          viewCount: 54321,
          date: '2026-03-22'
        },
        {
          id: '5',
          title: '全球气候变化与我们的未来',
          description: '探讨全球气候变化的现状、原因以及我们可以采取的应对措施。',
          thumbnailUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Climate%20change%20global%20future&image_size=landscape_16_9',
          url: '#',
          duration: 1080,
          source: '环境频道',
          sourceRank: 5,
          viewCount: 43210,
          date: '2026-03-21'
        },
        {
          id: '6',
          title: '2026 娱乐圈年度盛典精彩回顾',
          description: '回顾 2026 年娱乐圈年度盛典的精彩瞬间，包括明星走红毯、颁奖典礼以及精彩表演。',
          thumbnailUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Entertainment%20awards%20ceremony%20highlights&image_size=landscape_16_9',
          url: '#',
          duration: 1200,
          source: '娱乐频道',
          sourceRank: 6,
          viewCount: 32109,
          date: '2026-03-20'
        }
      ]
      setVideos(mockVideos)
      setLoading(false)
    }, 1000)
  }, [])

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatViews = (views: number): string => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views.toString()
  }

  if (loading) {
    return <div className="loading">加载中...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  return (
    <div className="video-list-container">
      <div className="video-header">
        <h1>热门视频</h1>
        <p>精选来自全球最热门视频网站的顶级视频</p>
      </div>
      <div className="video-grid">
        {videos.map((video) => (
          <div key={video.id} className="video-card">
            <Link to={`/videos/${video.id}`} className="video-link">
              <div className="video-thumbnail">
                <img src={video.thumbnailUrl} alt={video.title} />
                <div className="video-duration">{formatDuration(video.duration)}</div>
                <div className="video-rank">#{video.sourceRank}</div>
              </div>
              <div className="video-info">
                <h2 className="video-title">{video.title}</h2>
                <p className="video-description">{video.description?.substring(0, 100)}...</p>
                <div className="video-meta">
                  <span className="video-source">{video.source}</span>
                  <span className="video-views">👁 {formatViews(video.viewCount)}</span>
                  <span className="video-date">{video.date}</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default VideoList
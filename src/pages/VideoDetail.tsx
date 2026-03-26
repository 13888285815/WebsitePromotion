import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

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
  content: string
}

const VideoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [video, setVideo] = useState<VideoItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    // 模拟获取视频详情数据
    setTimeout(() => {
      const mockVideos: VideoItem[] = [
        {
          id: '1',
          title: 'Windows 11 2026 年最新功能详解',
          description: '详细介绍 Windows 11 2026 年最新更新的所有功能，包括新的任务栏设计、增强的多任务处理能力以及改进的系统性能。',
          content: `本视频详细介绍了 Windows 11 2026 年最新更新的所有功能，包括：\n\n1. 全新的任务栏设计：用户现在可以根据自己的喜好自定义任务栏的位置和大小，支持更灵活的布局。\n\n2. 增强的多任务处理能力：改进的 Snap 布局功能，现在可以支持更多的窗口排列方式，提高工作效率。\n\n3. 改进的系统性能：优化了启动速度和应用加载时间，使系统运行更加流畅。此外，还改进了电池管理，延长了笔记本电脑的续航时间。\n\n4. 加强的安全性：更强大的防火墙和防病毒功能，保护用户的设备和数据安全。\n\n5. 新的应用和功能：包括改进的 Microsoft Edge 浏览器、新的照片应用以及增强的游戏模式。\n\n本视频将带你全面了解 Windows 11 的最新功能，帮助你充分利用这些新特性提高工作和生活效率。`,
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
          content: `本视频探讨了人工智能技术如何改变我们的日常生活，包括：\n\n1. 工作领域：AI 辅助办公软件、自动化流程、智能客服等，提高工作效率和质量。\n\n2. 学习领域：个性化学习平台、AI  tutor、智能教育内容推荐等，提供更高效的学习体验。\n\n3. 娱乐领域：AI 生成内容、个性化推荐、虚拟助手等，丰富娱乐体验。\n\n4. 医疗领域：AI 辅助诊断、个性化治疗方案、健康监测等，提高医疗服务质量。\n\n5. 交通领域：自动驾驶技术、智能交通管理、出行规划等，改善交通状况。\n\n本视频将带你了解 AI 技术的最新发展和应用，以及它们如何改变我们的生活方式。`,
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
          content: `本视频带你参观 2026 年巴黎奥运会的各个比赛场馆，包括：\n\n1. 法兰西体育场：作为开幕式和闭幕式的举办场地，经过翻修后可容纳 80,000 名观众。\n\n2. 巴黎贝尔西体育馆：将举办篮球、手球等室内项目的比赛。\n\n3. 罗兰·加洛斯球场：将举办网球比赛，是法网的举办场地。\n\n4. 塞纳河沿岸：将举办赛艇、皮划艇等水上项目的比赛。\n\n5. 巴黎大皇宫：将举办击剑、跆拳道等项目的比赛。\n\n本视频将介绍这些场馆的设计理念、建设过程以及它们在奥运会期间的使用情况。`,
          thumbnailUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Paris%20Olympic%20Games%202026%20venues%20tour&image_size=landscape_16_9',
          url: '#',
          duration: 720,
          source: '体育频道',
          sourceRank: 3,
          viewCount: 76543,
          date: '2026-03-23'
        }
      ]

      const foundVideo = mockVideos.find(item => item.id === id)
      if (foundVideo) {
        setVideo(foundVideo)
      } else {
        setError('视频不存在')
      }
      setLoading(false)
    }, 1000)
  }, [id])

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

  if (error || !video) {
    return <div className="error">{error || '视频不存在'}</div>
  }

  return (
    <div className="video-detail-container">
      <Link to="/videos" className="back-link">← 返回视频列表</Link>
      <div className="video-article">
        <h1 className="video-title">{video.title}</h1>
        <div className="video-meta">
          <span className="video-source">{video.source}</span>
          <span className="video-views">👁 {formatViews(video.viewCount)}</span>
          <span className="video-date">{video.date}</span>
          <span className="video-duration">{formatDuration(video.duration)}</span>
        </div>
        <div className="video-player-container">
          <video 
            className="video-player" 
            src={video.url} 
            controls 
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src={video.url} type="video/mp4" />
            您的浏览器不支持视频播放。
          </video>
          <div className="video-controls-overlay">
            <button className="control-btn">
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button className="control-btn">🔊</button>
            <button className="control-btn">⛶</button>
          </div>
        </div>
        <div className="video-description">
          <h3>视频简介</h3>
          <p>{video.content}</p>
        </div>
        <div className="video-actions">
          <a 
            href={video.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-outline"
          >
            在原网站观看
          </a>
          <div>
            <button className="btn btn-outline">分享</button>
            <button className="btn btn-outline">收藏</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoDetail
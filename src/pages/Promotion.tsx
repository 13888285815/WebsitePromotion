import React, { useState, useEffect } from 'react'
import { Language, Translations, translations, detectLanguage } from '../utils/i18n'

const Promotion: React.FC = () => {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState('')
  const [isPromoting, setIsPromoting] = useState(false)
  const [currentLang, setCurrentLang] = useState<Language>('zh')
  const [isLoading, setIsLoading] = useState(true)

  const t: Translations = translations[currentLang]

  useEffect(() => {
    const initLanguage = async () => {
      const detectedLang = await detectLanguage()
      setCurrentLang(detectedLang)
      setIsLoading(false)
    }
    initLanguage()
  }, [])

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang)
  }

  const handlePromotion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) {
      setStatus(t.emptyUrlMessage)
      return
    }

    setIsPromoting(true)
    setStatus(t.submittingButton)

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setStatus(t.successMessage)
    } catch (error) {
      setStatus(t.errorMessage)
    } finally {
      setIsPromoting(false)
    }
  }

  const getLanguageName = (lang: Language): string => {
    const names: Record<Language, string> = {
      zh: '中文',
      en: 'English',
      ja: '日本語',
      de: 'Deutsch',
      ar: 'العربية'
    }
    return names[lang]
  }

  if (isLoading) {
    return (
      <div className="promotion-page">
        <div className="loading">Loading...</div>
      </div>
    )
  }

  const isRTL = currentLang === 'ar'

  return (
    <div className={`promotion-page ${isRTL ? 'rtl' : ''}`}>
      {/* 语言选择器 */}
      <div className="language-selector">
        {(['zh', 'en', 'ja', 'de', 'ar'] as Language[]).map((lang) => (
          <button
            key={lang}
            className={`lang-btn ${currentLang === lang ? 'active' : ''}`}
            onClick={() => handleLanguageChange(lang)}
          >
            {getLanguageName(lang)}
          </button>
        ))}
      </div>

      <h2>{t.title}</h2>
      <p>{t.subtitle}</p>
      
      <form onSubmit={handlePromotion} className="promotion-form">
        <div className="form-group">
          <label htmlFor="url">{t.urlLabel}</label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t.urlPlaceholder}
            required
          />
        </div>
        
        <button type="submit" disabled={isPromoting} className="promotion-btn">
          {isPromoting ? t.submittingButton : t.submitButton}
        </button>
      </form>

      {status && (
        <div className={`status-message ${status.includes(t.successMessage) ? 'success' : 'error'}`}>
          {status}
        </div>
      )}

      <div className="promotion-info">
        <h3>{t.infoTitle}</h3>
        <ul>
          {t.infoItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Promotion

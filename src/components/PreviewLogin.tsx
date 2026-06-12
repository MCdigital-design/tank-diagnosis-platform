import { FormEvent, useState } from 'react'
import { usePreviewAuth } from '../context/PreviewAuthContext'
import { siteInfo } from '../data/mock'

export function PreviewLogin() {
  const { login } = usePreviewAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!login(username.trim(), password)) {
      setError('用户名或密码错误，请重试')
    }
  }

  return (
    <div className="preview-login">
      <div className="preview-login__grid-bg" aria-hidden />
      <div className="preview-login__card">
        <p className="preview-login__badge">内部演示</p>
        <h1 className="preview-login__title">{siteInfo.title}</h1>
        <p className="preview-login__subtitle">内部演示 · 请输入预览账号</p>

        <form className="preview-login__form" onSubmit={handleSubmit}>
          <label className="preview-login__field">
            <span className="preview-login__label">用户名</span>
            <input
              className="preview-login__input"
              type="text"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label className="preview-login__field">
            <span className="preview-login__label">密码</span>
            <input
              className="preview-login__input"
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error ? (
            <p className="preview-login__error" role="alert">
              {error}
            </p>
          ) : null}
          <button className="preview-login__submit" type="submit">
            进入演示
          </button>
        </form>

        <p className="preview-login__note">模拟数据 · 非生产环境 · 请勿外传链接与账号</p>
      </div>
    </div>
  )
}

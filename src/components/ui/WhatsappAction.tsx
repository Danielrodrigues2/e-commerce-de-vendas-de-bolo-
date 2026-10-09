import { useState } from 'react'
import { storeConfig } from '@/config/store'
import { buildWhatsappUrl, getWhatsappStatus } from '@/lib/whatsapp'
import { Button } from './Button'
import { buttonClasses } from './button-styles'
import { Icon } from './Icon'
import { Notice } from './Notice'

interface WhatsappActionProps {
  message: string
  /** Texto do botão principal. */
  label: string
  /** O que dizer depois que o WhatsApp for aberto (nunca afirmar que o pedido foi recebido). */
  afterOpenText: string
  whatsappNumber?: string
}

/**
 * Abre o WhatsApp somente por ação explícita do usuário. Se o número não estiver configurado,
 * explica o motivo e oferece a cópia da mensagem.
 */
export function WhatsappAction({ message, label, afterOpenText, whatsappNumber = storeConfig.whatsappNumber }: WhatsappActionProps) {
  const status = getWhatsappStatus(whatsappNumber)
  const url = buildWhatsappUrl(whatsappNumber, message)
  const [opened, setOpened] = useState(false)
  const [copyState, setCopyState] = useState<'idle' | 'copying' | 'copied' | 'failed'>('idle')

  const copy = async () => {
    setCopyState('copying')
    try {
      await navigator.clipboard.writeText(message)
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }
  }

  return (
    <div className="space-y-4">
      {status.ok && url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpened(true)}
          className={buttonClasses('primary', 'lg', 'w-full bg-[#1f7a4d] hover:bg-[#186540]')}
        >
          <Icon name="whatsapp" className="size-5" />
          {label}
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
      ) : (
        <Notice tone="warning" title="WhatsApp indisponível" role="alert">
          <p>{status.ok ? 'Não foi possível montar o link do WhatsApp.' : status.reason}</p>
          <p className="mt-1">
            Use o botão “Copiar mensagem” e envie o texto à confeitaria pelo canal de atendimento informado por ela.
          </p>
        </Notice>
      )}

      <Button variant="secondary" className="w-full" onClick={copy} loading={copyState === 'copying'} loadingText="Copiando…">
        <Icon name={copyState === 'copied' ? 'check' : 'copy'} className="size-4" />
        {copyState === 'copied' ? 'Mensagem copiada' : 'Copiar mensagem'}
      </Button>

      <div aria-live="polite" className="space-y-3">
        {copyState === 'failed' && (
          <Notice tone="error">Não foi possível copiar automaticamente. Selecione o texto da mensagem e copie manualmente.</Notice>
        )}
        {opened && (
          <Notice tone="info" title="Conversa aberta no WhatsApp">
            {afterOpenText}
          </Notice>
        )}
      </div>
    </div>
  )
}

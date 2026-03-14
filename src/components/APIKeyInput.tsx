import { Eye, EyeSlash, Lightning, CheckCircle, XCircle } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import type { APIValidationResult } from '@/lib/types'

interface APIKeyInputProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  isOwner: boolean
  showKey: boolean
  onToggleVisibility: () => void
  onTest?: () => void
  isTesting?: boolean
  validationResult?: APIValidationResult
  description?: string
  testButtonEnabled?: boolean
}

export function APIKeyInput({
  id,
  label,
  value,
  onChange,
  isOwner,
  showKey,
  onToggleVisibility,
  onTest,
  isTesting,
  validationResult,
  description,
  testButtonEnabled = true,
}: APIKeyInputProps) {
  const getValidationIcon = (result?: APIValidationResult) => {
    if (!result) return null
    if (result.isValid) {
      return <CheckCircle size={20} weight="fill" className="text-green-600" />
    }
    return <XCircle size={20} weight="fill" className="text-red-600" />
  }

  const getValidationBadge = (result?: APIValidationResult) => {
    if (!result) return null
    if (result.isValid) {
      return <Badge className="bg-green-100 text-green-800 border-green-300">Verified</Badge>
    }
    return <Badge variant="destructive">Failed</Badge>
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <Label htmlFor={id}>{label}</Label>
        {getValidationBadge(validationResult)}
      </div>
      <div className="flex gap-2">
        <Input
          id={id}
          type={showKey ? 'text' : 'password'}
          placeholder={isOwner ? `Enter your ${label}` : "Configured by owner"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={!isOwner}
          className={!isOwner && value ? "bg-muted" : ""}
        />
        {isOwner && (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={onToggleVisibility}
            >
              {showKey ? <EyeSlash size={20} /> : <Eye size={20} />}
            </Button>
            {onTest && (
              <Button
                variant="secondary"
                onClick={onTest}
                disabled={isTesting || !testButtonEnabled}
                className="gap-2"
              >
                {isTesting ? (
                  <>Testing...</>
                ) : (
                  <>
                    <Lightning size={18} weight="fill" />
                    Test
                  </>
                )}
              </Button>
            )}
          </>
        )}
      </div>
      {validationResult && (
        <div className={`flex items-start gap-2 p-3 rounded-lg text-sm ${
          validationResult.isValid 
            ? 'bg-green-50 dark:bg-green-950/20 text-green-900 dark:text-green-100' 
            : 'bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-100'
        }`}>
          {getValidationIcon(validationResult)}
          <div>
            <p className="font-medium">{validationResult.message}</p>
            {validationResult.details && (
              <p className="text-xs opacity-80 mt-1">{validationResult.details}</p>
            )}
          </div>
        </div>
      )}
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  )
}

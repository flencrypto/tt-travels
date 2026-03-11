import { Wrench, CheckCircle, Warning } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { INTEGRATIONS, isIntegrationConfigured } from '@/lib/api'

export function Setup() {
  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Wrench size={40} className="text-primary" weight="fill" />
          <h1 className="text-4xl font-bold">Setup & Integrations</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Configure external services and integrations
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {INTEGRATIONS.map((integration) => {
          const isConfigured = isIntegrationConfigured(integration)

          return (
            <Card key={integration.id} className="glass-surface">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle>{integration.name}</CardTitle>
                      <Badge
                        variant={isConfigured ? 'default' : 'secondary'}
                        className={isConfigured ? 'bg-green-500/10 text-green-700 border-green-500/20' : ''}
                      >
                        {isConfigured ? (
                          <div className="flex items-center gap-1">
                            <CheckCircle size={14} weight="fill" />
                            Configured
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Warning size={14} weight="fill" />
                            Not Configured
                          </div>
                        )}
                      </Badge>
                    </div>
                    <CardDescription>{integration.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {integration.envVars.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Required Environment Variables</h4>
                    <div className="bg-muted p-3 rounded-lg space-y-1">
                      {integration.envVars.map((envVar) => (
                        <code key={envVar} className="text-sm block font-mono">
                          {envVar}
                        </code>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-sm mb-2">Setup Steps</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                    {integration.setupSteps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2">Affected Features</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {integration.affectedActions.map((action, index) => (
                      <li key={index}>{action}</li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <a
                    href={integration.officialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Official Documentation →
                  </a>
                  {integration.notes && (
                    <p className="text-xs text-muted-foreground italic">
                      {integration.notes}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

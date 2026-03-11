import { Cloud, CloudCheck } from '@phosphor-icons/react'
import { useClerkSync } from '@/hooks/use-clerk-sync'
import { cn } from '@/lib/utils'

export function SyncStatusIndicator() {
  const { isSynced, isSignedIn } = useClerkSync()

  if (!isSignedIn) {
    return null
  }

  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
      isSynced 
        ? "bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-300" 
        : "bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-300"
    )}>
      {isSynced ? (
        <>
          <CloudCheck size={16} weight="fill" />
          <span>Synced</span>
        </>
      ) : (
        <>
          <Cloud size={16} weight="fill" className="animate-pulse" />
          <span>Syncing...</span>
        </>
      )}
    </div>
  )
}

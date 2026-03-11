import { useState } from 'react'
import { Camera, Upload } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function Journal() {
  const [photos, setPhotos] = useState<string[]>([])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newPhotos = Array.from(files).map((file) => URL.createObjectURL(file))
    setPhotos((prev) => [...prev, ...newPhotos])
  }

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Camera size={40} className="text-primary" weight="fill" />
          <h1 className="text-4xl font-bold">Travel Journal</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Document your adventures with photos
        </p>
      </div>

      <Card className="max-w-5xl mx-auto glass-surface">
        <CardHeader>
          <CardTitle>Upload Photos</CardTitle>
          <CardDescription>
            Select multiple photos from your travels to create your visual journal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-colors">
            <input
              type="file"
              id="photo-upload"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <label htmlFor="photo-upload">
              <Button asChild variant="outline" size="lg" className="gap-2 cursor-pointer">
                <span>
                  <Upload size={20} />
                  Choose Photos
                </span>
              </Button>
            </label>
            <p className="text-sm text-muted-foreground mt-4">
              Click to select multiple photos
            </p>
          </div>

          {photos.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-4">
                Your Photos ({photos.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {photos.map((photo, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow"
                  >
                    <img
                      src={photo}
                      alt={`Travel photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {photos.length === 0 && (
            <div className="text-center py-12">
              <Camera size={64} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No photos uploaded yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

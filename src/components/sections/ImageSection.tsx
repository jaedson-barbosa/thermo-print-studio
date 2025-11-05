import { ImageSection as ImageSectionType } from '@/types/document';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Upload } from 'lucide-react';
import { useRef } from 'react';

interface ImageSectionProps {
  section: ImageSectionType;
  onChange: (updates: Partial<ImageSectionType>) => void;
  onDelete: () => void;
}

const RASTERIZATION_METHODS = [
  { value: 'threshold', label: 'Limiar (Threshold)' },
  { value: 'floyd-steinberg', label: 'Floyd-Steinberg' },
  { value: 'atkinson', label: 'Atkinson' },
  { value: 'ordered', label: 'Ordenado (Ordered)' },
];

export function ImageSection({ section, onChange, onDelete }: ImageSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      onChange({ imageData });
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium">Seção de Imagem</span>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <Button
          variant="outline"
          className="w-full"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          {section.imageData ? 'Trocar Imagem' : 'Selecionar Imagem'}
        </Button>

        {section.imageData && (
          <div className="rounded-lg border overflow-hidden bg-muted/50">
            <img
              src={section.imageData}
              alt="Preview"
              className="w-full h-auto"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Largura (mm)</label>
            <Input
              type="number"
              value={section.width}
              onChange={(e) => onChange({ width: Number(e.target.value) })}
              min="10"
              max="80"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Rasterização</label>
            <Select
              value={section.rasterization}
              onValueChange={(value) => onChange({ rasterization: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RASTERIZATION_METHODS.map(method => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  );
}

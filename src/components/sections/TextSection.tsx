import { TextSection as TextSectionType } from '@/types/document';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Bold, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface TextSectionProps {
  section: TextSectionType;
  onChange: (updates: Partial<TextSectionType>) => void;
  onDelete: () => void;
}

const FONTS = [
  { value: 'monospace', label: 'Monospace' },
  { value: 'sans-serif', label: 'Sans Serif' },
  { value: 'serif', label: 'Serif' },
];

export function TextSection({ section, onChange, onDelete }: TextSectionProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium">Seção de Texto</span>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        <Textarea
          value={section.content}
          onChange={(e) => onChange({ content: e.target.value })}
          placeholder="Digite o texto..."
          className="min-h-[100px]"
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Fonte</label>
            <Select value={section.fontFamily} onValueChange={(value) => onChange({ fontFamily: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONTS.map(font => (
                  <SelectItem key={font.value} value={font.value}>
                    <span style={{ fontFamily: font.value }}>{font.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Tamanho</label>
            <Input
              type="number"
              value={section.fontSize}
              onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
              min="8"
              max="72"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant={section.bold ? "default" : "outline"}
            size="sm"
            onClick={() => onChange({ bold: !section.bold })}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant={section.align === 'left' ? "default" : "outline"}
            size="sm"
            onClick={() => onChange({ align: 'left' })}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant={section.align === 'center' ? "default" : "outline"}
            size="sm"
            onClick={() => onChange({ align: 'center' })}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant={section.align === 'right' ? "default" : "outline"}
            size="sm"
            onClick={() => onChange({ align: 'right' })}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

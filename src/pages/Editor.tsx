import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocuments } from '@/contexts/DocumentContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Plus, Save } from 'lucide-react';
import { TextSection } from '@/components/sections/TextSection';
import { ImageSection } from '@/components/sections/ImageSection';
import { Section, TextSection as TextSectionType, ImageSection as ImageSectionType } from '@/types/document';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDocument, updateDocument } = useDocuments();
  const { toast } = useToast();
  const [document, setDocument] = useState(() => getDocument(id || ''));

  useEffect(() => {
    if (!document) {
      navigate('/');
    }
  }, [document, navigate]);

  if (!document) return null;

  const handleNameChange = (name: string) => {
    const updated = { ...document, name };
    setDocument(updated);
    updateDocument(document.id, { name });
  };

  const handleAddSection = (type: 'text' | 'image') => {
    const newSection: Section = type === 'text' 
      ? {
          id: crypto.randomUUID(),
          type: 'text',
          content: '',
          fontFamily: 'monospace',
          fontSize: 14,
          bold: false,
          align: 'left',
        }
      : {
          id: crypto.randomUUID(),
          type: 'image',
          imageData: '',
          width: document.width,
          rasterization: 'floyd-steinberg',
        };

    const updated = { ...document, sections: [...document.sections, newSection] };
    setDocument(updated);
    updateDocument(document.id, { sections: updated.sections });
  };

  const handleUpdateSection = (index: number, updates: Partial<Section>) => {
    const sections = [...document.sections];
    sections[index] = { ...sections[index], ...updates } as Section;
    const updated = { ...document, sections };
    setDocument(updated);
    updateDocument(document.id, { sections });
  };

  const handleDeleteSection = (index: number) => {
    const sections = document.sections.filter((_, i) => i !== index);
    const updated = { ...document, sections };
    setDocument(updated);
    updateDocument(document.id, { sections });
    toast({
      title: "Seção removida",
      description: "A seção foi excluída do documento",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Input
              value={document.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="text-lg font-semibold max-w-md"
            />
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Largura: {document.width}mm
              </span>
              <Button variant="outline" onClick={() => toast({ title: "Salvo!", description: "Alterações salvas automaticamente" })}>
                <Save className="h-4 w-4 mr-2" />
                Auto-salvo
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2 mb-6">
            <Select onValueChange={(value) => handleAddSection(value as 'text' | 'image')}>
              <SelectTrigger className="w-[200px]">
                <Plus className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Adicionar seção" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Seção de Texto</SelectItem>
                <SelectItem value="image">Seção de Imagem</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {document.sections.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground mb-4">
                Nenhuma seção adicionada ainda
              </p>
              <p className="text-sm text-muted-foreground">
                Use o botão acima para adicionar texto ou imagens
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {document.sections.map((section, index) => (
                <div key={section.id}>
                  {section.type === 'text' ? (
                    <TextSection
                      section={section as TextSectionType}
                      onChange={(updates) => handleUpdateSection(index, updates)}
                      onDelete={() => handleDeleteSection(index)}
                    />
                  ) : (
                    <ImageSection
                      section={section as ImageSectionType}
                      onChange={(updates) => handleUpdateSection(index, updates)}
                      onDelete={() => handleDeleteSection(index)}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

import { Document } from '@/types/document';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DocumentCardProps {
  document: Document;
  onDelete: (id: string) => void;
}

export function DocumentCard({ document, onDelete }: DocumentCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="p-4 hover:bg-accent/50 transition-colors cursor-pointer group">
      <div onClick={() => navigate(`/editor/${document.id}`)} className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{document.name}</h3>
          <p className="text-sm text-muted-foreground">
            Largura: {document.width}mm • {document.sections.length} seções
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {new Date(document.updatedAt).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>
      <div className="mt-3 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(document.id);
          }}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}

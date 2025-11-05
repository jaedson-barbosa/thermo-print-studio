import { useState } from 'react';
import { useDocuments } from '@/contexts/DocumentContext';
import { useTheme } from '@/contexts/ThemeContext';
import { DocumentCard } from '@/components/DocumentCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Moon, Sun, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { documents, createDocument, deleteDocument } = useDocuments();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocWidth, setNewDocWidth] = useState('58');

  const handleCreateDocument = () => {
    if (!newDocName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Digite um nome para o documento",
        variant: "destructive",
      });
      return;
    }

    const width = Number(newDocWidth);
    if (width < 40 || width > 80) {
      toast({
        title: "Largura inválida",
        description: "A largura deve estar entre 40mm e 80mm",
        variant: "destructive",
      });
      return;
    }

    const doc = createDocument(newDocName, width);
    setIsDialogOpen(false);
    setNewDocName('');
    setNewDocWidth('58');
    navigate(`/editor/${doc.id}`);
  };

  const handleDeleteDocument = (id: string) => {
    deleteDocument(id);
    toast({
      title: "Documento excluído",
      description: "O documento foi removido com sucesso",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Impressora Térmica</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Meus Documentos</h2>
            <p className="text-muted-foreground">Gerenciados localmente neste navegador</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Novo Documento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Documento</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="name">Nome do Documento</Label>
                  <Input
                    id="name"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    placeholder="Ex: Recibo de Venda"
                  />
                </div>
                <div>
                  <Label htmlFor="width">Largura do Papel (mm)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={newDocWidth}
                    onChange={(e) => setNewDocWidth(e.target.value)}
                    min="40"
                    max="80"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Típico: 58mm (pequeno) ou 80mm (padrão)
                  </p>
                </div>
                <Button className="w-full" onClick={handleCreateDocument}>
                  Criar Documento
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Printer className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Nenhum documento criado</h3>
            <p className="text-muted-foreground mb-6">
              Crie seu primeiro documento para começar
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-5 w-5 mr-2" />
              Criar Primeiro Documento
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onDelete={handleDeleteDocument}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;

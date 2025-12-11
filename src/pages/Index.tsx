import { useState } from 'react';
import { useDocuments } from '@/contexts/DocumentContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { DocumentCard } from '@/components/DocumentCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Moon, Sun, Printer, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { documents, createDocument, deleteDocument } = useDocuments();
  const { theme, toggleTheme } = useTheme();
  const { user, loginWithGoogle, logout, isAuthenticated } = useAuth();
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
            <h1 className="text-xl font-bold">ThermalPrint</h1>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.image} alt={user?.displayName} />
                    <AvatarFallback>
                      {user?.displayName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium">{user?.displayName}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={logout} title="Sair">
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Button onClick={loginWithGoogle} variant="outline">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Entrar com Google
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
          </div>
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

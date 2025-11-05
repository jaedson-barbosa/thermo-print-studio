import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocuments } from '@/contexts/DocumentContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Print() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDocument } = useDocuments();
  const { toast } = useToast();
  const [document, setDocument] = useState(() => getDocument(id || ''));

  useEffect(() => {
    if (!document) {
      navigate('/');
    }
  }, [document, navigate]);

  if (!document) return null;

  const handlePrint = () => {
    window.print();
    toast({
      title: "Documento enviado",
      description: "O diálogo de impressão foi aberto",
    });
  };

  return (
    <>
      <div className="min-h-screen bg-background print:hidden">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold">Imprimir: {document.name}</h1>
              <Button className="ml-auto" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Preview de Impressão</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Clique no botão "Imprimir" para abrir o diálogo de impressão do navegador e selecionar sua impressora.
              </p>
              
              <div className="border-2 border-dashed rounded-lg p-8 bg-muted/50">
                <div 
                  className="bg-white mx-auto shadow-lg"
                  style={{ width: `${document.width * 3.78}px` }}
                >
                  <div className="p-4 space-y-4">
                    {document.sections.map((section) => (
                      <div key={section.id}>
                        {section.type === 'text' ? (
                          <div
                            style={{
                              fontFamily: section.fontFamily,
                              fontSize: `${section.fontSize}px`,
                              fontWeight: section.bold ? 'bold' : 'normal',
                              textAlign: section.align,
                              color: '#000',
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-word',
                            }}
                          >
                            {section.content}
                          </div>
                        ) : (
                          section.imageData && (
                            <div style={{ textAlign: 'center' }}>
                              <img
                                src={section.imageData}
                                alt="Imagem"
                                style={{
                                  maxWidth: `${section.width * 3.78}px`,
                                  height: 'auto',
                                  filter: 'grayscale(100%) contrast(2)',
                                }}
                              />
                            </div>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Print-only view */}
      <div className="hidden print:block">
        <div 
          className="bg-white"
          style={{ width: `${document.width}mm` }}
        >
          {document.sections.map((section) => (
            <div key={section.id} style={{ pageBreakInside: 'avoid' }}>
              {section.type === 'text' ? (
                <div
                  style={{
                    fontFamily: section.fontFamily,
                    fontSize: `${section.fontSize}px`,
                    fontWeight: section.bold ? 'bold' : 'normal',
                    textAlign: section.align,
                    color: '#000',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    margin: '8px 0',
                  }}
                >
                  {section.content}
                </div>
              ) : (
                section.imageData && (
                  <div style={{ textAlign: 'center', margin: '8px 0' }}>
                    <img
                      src={section.imageData}
                      alt="Imagem"
                      style={{
                        maxWidth: `${section.width}mm`,
                        height: 'auto',
                        filter: 'grayscale(100%) contrast(2)',
                      }}
                    />
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

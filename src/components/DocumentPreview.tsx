import { Document } from '@/types/document';
import { Card } from '@/components/ui/card';

interface DocumentPreviewProps {
  document: Document;
}

export function DocumentPreview({ document }: DocumentPreviewProps) {
  return (
    <div className="sticky top-24">
      <h3 className="text-sm font-medium mb-3">Preview de Impressão</h3>
      <Card className="p-4 bg-white dark:bg-white" style={{ width: `${document.width * 3.78}px` }}>
        <div className="space-y-4">
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
                  {section.content || 'Digite o texto...'}
                </div>
              ) : (
                section.imageData && (
                  <div style={{ textAlign: 'center' }}>
                    <img
                      src={section.imageData}
                      alt="Preview"
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
      </Card>
    </div>
  );
}

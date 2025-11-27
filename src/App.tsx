import { useState } from 'react'
import { Download, Link as LinkIcon } from 'lucide-react'
import { Toaster, toast } from 'sonner'
import './App.css'

function App() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    if (!url) {
      toast.error('Please enter a valid URL')
      return
    }
    
    setLoading(true)
    
    const performDownload = async () => {
      const response = await fetch('https://69289e2a00238ff8db03.sfo.appwrite.run', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url })
      });

      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      setUrl('')
    };

    const promise = performDownload();

    toast.promise(promise, {
      loading: 'Processing document...',
      success: 'Download started successfully!',
      error: 'Failed to download document. Please check the URL.',
    });

    try {
      await promise
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Toaster richColors position="top-center" theme="dark" />
      <div className="container">
        <div className="header">
          <h1>Scribd Downloader</h1>
          <p>Enter the document URL to start downloading</p>
        </div>
        
        <div className="input-group">
          <div className="input-wrapper">
            <LinkIcon className="input-icon" size={20} />
            <input 
              type="url" 
              placeholder="Paste your URL here..." 
              className="url-input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          
          <button 
            className="download-btn" 
            onClick={handleDownload}
            disabled={!url || loading}
          >
            {loading ? (
              'Processing...'
            ) : (
              <>
                <Download size={20} />
                Download Document
              </>
            )}
          </button>
        </div>
      </div>
    </>
  )
}

export default App
